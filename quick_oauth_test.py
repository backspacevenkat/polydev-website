#!/usr/bin/env python3
"""
Quick OAuth test - minimal implementation
"""

import urllib.parse
import secrets
import base64
import hashlib
from http.server import HTTPServer, BaseHTTPRequestHandler
import threading
import time

class QuickCallbackHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        print(f"\n🎯 CALLBACK: {self.path}")
        
        if 'code=' in self.path:
            # Extract auth code
            code = self.path.split('code=')[1].split('&')[0]
            self.server.auth_code = code
            print(f"✅ AUTH CODE: {code[:20]}...")
            
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(b'<h1>SUCCESS! Auth code received.</h1>')
        else:
            print(f"❌ No auth code found")
            self.send_response(400)
            self.end_headers()
    
    def log_message(self, format, *args):
        pass

def main():
    print("Quick OAuth Test")
    print("================")
    
    # Start server on port 1455 (OpenAI CLI standard)
    server = HTTPServer(("localhost", 1455), QuickCallbackHandler)
    server.auth_code = None
    
    # Start in background
    thread = threading.Thread(target=server.serve_forever)
    thread.daemon = True
    thread.start()
    
    print("✅ Server running on localhost:1455")
    
    # Generate PKCE
    verifier = base64.urlsafe_b64encode(secrets.token_bytes(32)).decode('utf-8').rstrip('=')
    challenge = base64.urlsafe_b64encode(hashlib.sha256(verifier.encode()).digest()).decode('utf-8').rstrip('=')
    
    # Build OAuth URL
    params = {
        'response_type': 'code',
        'client_id': 'app_EMoamEEZ73f0CkXaXp7hrann',
        'redirect_uri': 'http://localhost:1455/auth/callback',
        'scope': 'openid profile email',
        'code_challenge': challenge,
        'code_challenge_method': 'S256',
        'state': 'test123'
    }
    
    url = 'https://auth.openai.com/authorize?' + urllib.parse.urlencode(params)
    
    print(f"\n🔗 OAUTH URL:")
    print(url)
    print(f"\n📝 INSTRUCTIONS:")
    print(f"1. Copy the URL above")
    print(f"2. Open it in your browser")
    print(f"3. Complete OpenAI login")
    print(f"4. Watch for callback in this terminal")
    
    # Wait for callback
    print(f"\n⏳ Waiting 60 seconds for callback...")
    
    start_time = time.time()
    while server.auth_code is None and (time.time() - start_time) < 60:
        time.sleep(1)
    
    if server.auth_code:
        print(f"\n🎉 SUCCESS! Got auth code: {server.auth_code[:20]}...")
        result = True
    else:
        print(f"\n⏰ TIMEOUT - no callback received")
        result = False
    
    server.shutdown()
    return result

if __name__ == "__main__":
    success = main()
    if success:
        print("✅ OAuth flow is working!")
    else:
        print("❌ OAuth flow failed")