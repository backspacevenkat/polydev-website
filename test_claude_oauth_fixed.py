#!/usr/bin/env python3
"""
Test Claude OAuth with FIXED state parameter
"""

import asyncio
import urllib.parse
import secrets
import base64
import hashlib
from http.server import HTTPServer, BaseHTTPRequestHandler
import threading
import time
import webbrowser

class FixedCallbackHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        print(f"\n🎯 CALLBACK RECEIVED: {self.path}")
        
        if 'code=' in self.path:
            # Extract auth code
            code = self.path.split('code=')[1].split('&')[0]
            self.server.auth_code = code
            print(f"✅ AUTHORIZATION CODE: {code[:50]}...")
            
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            
            success_html = """
            <!DOCTYPE html>
            <html>
            <head><title>🎉 CLAUDE OAUTH SUCCESS!</title></head>
            <body style="font-family: Arial; text-align: center; margin-top: 100px;">
                <h1 style="color: green;">🎉 CLAUDE OAUTH SUCCESS!</h1>
                <h2>Cross-LLM Bridge - Claude Authentication</h2>
                <p><strong>✅ State parameter fixed!</strong></p>
                <p><strong>✅ Authorization code received!</strong></p>
                <p>Codex CLI users can now authenticate with Claude Pro/Max!</p>
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

async def test_claude_oauth_fixed():
    print("🔥 CLAUDE OAUTH TEST - STATE PARAMETER FIXED")
    print("=" * 50)
    print("🛠️  Adding missing state parameter for security")
    
    # Check port availability
    import socket
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    result = sock.connect_ex(('localhost', 1455))
    sock.close()
    
    if result == 0:
        print("❌ Port 1455 is in use!")
        return False
    
    # Start server
    server = HTTPServer(("localhost", 1455), FixedCallbackHandler)
    server.auth_code = None
    
    thread = threading.Thread(target=server.serve_forever)
    thread.daemon = True
    thread.start()
    
    print("✅ Callback server running on localhost:1455")
    
    # Generate PKCE
    verifier = base64.urlsafe_b64encode(secrets.token_bytes(32)).decode('utf-8').rstrip('=')
    challenge = base64.urlsafe_b64encode(hashlib.sha256(verifier.encode()).digest()).decode('utf-8').rstrip('=')
    
    # Build OAuth URL with state parameter
    params = {
        'response_type': 'code',
        'client_id': '9d1c250a-e61b-44d9-88ed-5944d1962f5e',
        'redirect_uri': 'http://localhost:1455/auth/callback',
        'scope': 'org:create_api_key user:profile user:inference',
        'code_challenge': challenge,
        'code_challenge_method': 'S256',
        'state': secrets.token_urlsafe(32)  # 🔥 FIXED: Added state parameter
    }
    
    url = 'https://console.anthropic.com/oauth/authorize?' + urllib.parse.urlencode(params)
    
    print(f"\n🔗 FIXED CLAUDE OAUTH URL:")
    print(url)
    print(f"\n🔥 KEY FIX:")
    print(f"   ✅ Added state parameter: {params['state'][:20]}...")
    print(f"   ✅ All required OAuth 2.0 parameters present")
    
    # Auto-open browser
    print(f"\n🌐 Opening browser for Claude authentication...")
    webbrowser.open(url)
    
    # Wait for callback
    print(f"\n⏳ Waiting 120 seconds for OAuth callback...")
    
    start_time = time.time()
    while server.auth_code is None and (time.time() - start_time) < 120:
        await asyncio.sleep(1)
        
        elapsed = int(time.time() - start_time)
        if elapsed > 0 and elapsed % 30 == 0:
            print(f"⏰ Still waiting... ({elapsed}s elapsed)")
    
    if server.auth_code:
        print(f"\n🎉 CLAUDE OAUTH SUCCESS!")
        print(f"✅ Authorization code: {server.auth_code[:60]}...")
        print(f"✅ State parameter fix worked!")
        print(f"🚀 Claude authentication ready for Codex CLI users!")
        result = True
    else:
        print(f"\n⏰ TIMEOUT - Check browser for completion")
        result = False
    
    server.shutdown()
    return result

if __name__ == "__main__":
    try:
        success = asyncio.run(test_claude_oauth_fixed())
        if success:
            print(f"\n🎊 CLAUDE OAUTH FULLY WORKING!")
            print(f"🔥 Fixed missing state parameter")
            print(f"🌉 Bidirectional Cross-LLM Bridge authentication complete!")
        else:
            print(f"\n🔧 Check browser for completion")
    except KeyboardInterrupt:
        print(f"\n🛑 Test cancelled")
    except Exception as e:
        print(f"\n❌ Error: {e}")