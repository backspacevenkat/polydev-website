#!/usr/bin/env python3
"""
Fixed OAuth test using port 1455 (like real OpenAI Codex CLI)
"""

import urllib.parse
import secrets
import base64
import hashlib
from http.server import HTTPServer, BaseHTTPRequestHandler
import threading
import time

class FixedCallbackHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        print(f"\n🎯 CALLBACK RECEIVED: {self.path}")
        
        if 'code=' in self.path:
            # Extract auth code
            code = self.path.split('code=')[1].split('&')[0]
            self.server.auth_code = code
            print(f"✅ AUTHORIZATION CODE: {code[:30]}...")
            
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            
            success_html = """
            <!DOCTYPE html>
            <html>
            <head><title>Cross-LLM Bridge - OAuth Success</title></head>
            <body style="font-family: Arial; text-align: center; margin-top: 100px;">
                <h1 style="color: green;">🎉 OAuth Authentication Successful!</h1>
                <h2>Cross-LLM Bridge</h2>
                <p><strong>Authorization code received successfully.</strong></p>
                <p>You can close this window and return to the terminal.</p>
                <div style="background: #f0f0f0; padding: 20px; margin: 20px; border-radius: 5px;">
                    <h3>What happens next:</h3>
                    <p>1. ✅ Authorization code captured</p>
                    <p>2. 🔄 Exchange code for access token</p>
                    <p>3. 🚀 Ready for Cross-LLM communication!</p>
                </div>
            </body>
            </html>
            """
            self.wfile.write(success_html.encode())
        else:
            print(f"❌ No auth code in callback: {self.path}")
            self.send_response(400)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(b'<h1>OAuth Error: No authorization code</h1>')
    
    def log_message(self, format, *args):
        pass

def main():
    print("Cross-LLM Bridge - Fixed OAuth Test (Port 1455)")
    print("===============================================")
    
    # Check if port 1455 is available
    import socket
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    result = sock.connect_ex(('localhost', 1455))
    sock.close()
    
    if result == 0:
        print("❌ Port 1455 is in use!")
        print("🔧 Kill the process: lsof -i :1455 && kill -9 <PID>")
        return False
    
    # Start server on port 1455 (like real OpenAI CLI)
    server = HTTPServer(("localhost", 1455), FixedCallbackHandler)
    server.auth_code = None
    
    # Start in background
    thread = threading.Thread(target=server.serve_forever)
    thread.daemon = True
    thread.start()
    
    print("✅ Callback server running on localhost:1455")
    print("📍 Using OpenAI Codex CLI standard port")
    
    # Generate PKCE (same as real implementation)
    verifier = base64.urlsafe_b64encode(secrets.token_bytes(32)).decode('utf-8').rstrip('=')
    challenge = base64.urlsafe_b64encode(hashlib.sha256(verifier.encode()).digest()).decode('utf-8').rstrip('=')
    
    # Build OAuth URL with correct port
    params = {
        'response_type': 'code',
        'client_id': 'app_EMoamEEZ73f0CkXaXp7hrann',
        'redirect_uri': 'http://localhost:1455/auth/callback',  # Changed to 1455!
        'scope': 'openid profile email offline_access',
        'code_challenge': challenge,
        'code_challenge_method': 'S256',
        'state': secrets.token_urlsafe(16)
    }
    
    url = 'https://auth.openai.com/authorize?' + urllib.parse.urlencode(params)
    
    print(f"\n🔗 FIXED OAUTH URL (Port 1455):")
    print(url)
    print(f"\n📝 MANUAL TEST:")
    print(f"1. Copy the OAuth URL above")
    print(f"2. Open it in your browser")
    print(f"3. Log in to OpenAI/ChatGPT")
    print(f"4. Authorize the application")
    print(f"5. Watch this terminal for callback")
    print(f"\n🔍 Key Changes:")
    print(f"   - Using port 1455 (OpenAI CLI standard)")
    print(f"   - Proper PKCE implementation")
    print(f"   - Enhanced callback handling")
    
    # Wait for callback (2 minutes)
    print(f"\n⏳ Waiting 120 seconds for OAuth callback...")
    print(f"🛑 Press Ctrl+C to stop")
    
    start_time = time.time()
    while server.auth_code is None and (time.time() - start_time) < 120:
        time.sleep(1)
        
        # Show progress every 30 seconds
        elapsed = int(time.time() - start_time)
        if elapsed > 0 and elapsed % 30 == 0:
            print(f"⏰ Still waiting... ({elapsed}s elapsed)")
    
    if server.auth_code:
        print(f"\n🎉 SUCCESS! OAuth flow completed!")
        print(f"✅ Authorization code: {server.auth_code[:40]}...")
        print(f"✅ Code verifier: {verifier[:20]}...")
        print(f"✅ Cross-LLM Bridge OAuth is working!")
        print(f"\n📝 Next: Exchange code for access token")
        result = True
    else:
        print(f"\n⏰ TIMEOUT - No OAuth callback received")
        print(f"\n🔧 If this still fails, the issue might be:")
        print(f"   - OpenAI client_id is invalid/restricted")
        print(f"   - OpenAI doesn't allow localhost redirects")
        print(f"   - Browser security blocking the redirect")
        print(f"   - Need to register app with OpenAI first")
        result = False
    
    server.shutdown()
    return result

if __name__ == "__main__":
    try:
        success = main()
        if success:
            print(f"\n🎊 READY FOR CROSS-LLM BRIDGE INTEGRATION!")
        else:
            print(f"\n🔧 OAuth still needs debugging")
    except KeyboardInterrupt:
        print(f"\n🛑 Test cancelled by user")
    except Exception as e:
        print(f"\n❌ Error: {e}")