#!/usr/bin/env python3
"""
Manual OAuth test - shows URL for manual testing
"""

import urllib.parse
from http.server import HTTPServer, BaseHTTPRequestHandler
import threading
import time
import secrets
import base64
import hashlib


class SimpleCallbackHandler(BaseHTTPRequestHandler):
    """Simple callback handler for manual testing"""
    
    def do_GET(self):
        print(f"\n🎯 CALLBACK RECEIVED!")
        print(f"📍 Path: {self.path}")
        
        # Parse the callback URL
        url_parts = urllib.parse.urlparse(self.path)
        query_params = urllib.parse.parse_qs(url_parts.query)
        
        if 'code' in query_params:
            self.server.auth_code = query_params['code'][0]
            print(f"✅ Got authorization code: {self.server.auth_code[:20]}...")
            
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            
            success_html = """
            <!DOCTYPE html>
            <html>
            <head><title>OAuth Success</title></head>
            <body style="font-family: Arial; text-align: center; margin-top: 100px;">
                <h1 style="color: green;">✅ OAuth Success!</h1>
                <p>Authorization code received successfully.</p>
                <p><strong>Cross-LLM Bridge OAuth is working!</strong></p>
            </body>
            </html>
            """
            self.wfile.write(success_html.encode())
        else:
            print(f"❌ No authorization code in callback")
            self.send_response(400)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(b"<h1>No authorization code</h1>")
    
    def log_message(self, format, *args):
        pass  # Suppress HTTP logs


def generate_pkce():
    """Generate PKCE parameters"""
    code_verifier = base64.urlsafe_b64encode(secrets.token_bytes(32)).decode('utf-8').rstrip('=')
    code_challenge = base64.urlsafe_b64encode(
        hashlib.sha256(code_verifier.encode('utf-8')).digest()
    ).decode('utf-8').rstrip('=')
    return code_verifier, code_challenge


def main():
    print("Cross-LLM Bridge - Manual OAuth Test")
    print("=" * 50)
    
    # Check port 8080
    import socket
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    result = sock.connect_ex(('localhost', 8080))
    sock.close()
    
    if result == 0:
        print("❌ Port 8080 is in use. Kill the process first:")
        print("   lsof -i :8080")
        print("   kill -9 <PID>")
        return
    
    print("✅ Port 8080 is available")
    
    try:
        # Start callback server
        print("\n🚀 Starting OAuth callback server...")
        server = HTTPServer(("localhost", 8080), SimpleCallbackHandler)
        server.auth_code = None
        
        # Start server in background
        server_thread = threading.Thread(target=server.serve_forever)
        server_thread.daemon = True
        server_thread.start()
        
        print("✅ Callback server running on localhost:8080")
        
        # Generate OAuth URL
        code_verifier, code_challenge = generate_pkce()
        state = secrets.token_urlsafe(16)
        
        oauth_params = {
            "response_type": "code",
            "client_id": "TdJIcbe16WoTHtN95nyywh5E",
            "redirect_uri": "http://localhost:8080/auth/callback",
            "scope": "openid profile email offline_access",
            "state": state,
            "code_challenge": code_challenge,
            "code_challenge_method": "S256"
        }
        
        oauth_url = "https://auth.openai.com/authorize?" + urllib.parse.urlencode(oauth_params)
        
        print(f"\n🔗 OAUTH URL GENERATED:")
        print(f"🌐 {oauth_url}")
        print(f"\n📝 MANUAL TEST INSTRUCTIONS:")
        print(f"1. Copy the OAuth URL above")
        print(f"2. Open it in your browser")
        print(f"3. Log in to OpenAI/ChatGPT")
        print(f"4. Authorize the application")
        print(f"5. Watch this terminal for the callback")
        print(f"\n⏳ Waiting for callback...")
        print(f"🛑 Press Ctrl+C to stop")
        
        # Wait for callback
        timeout = 300  # 5 minutes
        start_time = time.time()
        
        while server.auth_code is None and (time.time() - start_time) < timeout:
            time.sleep(1)
        
        if server.auth_code:
            print(f"\n🎉 SUCCESS!")
            print(f"✅ OAuth flow completed successfully!")
            print(f"✅ Authorization code: {server.auth_code[:30]}...")
            print(f"✅ Cross-LLM Bridge OAuth is working!")
            
            server.shutdown()
            return True
        else:
            print(f"\n⏰ Timeout after 5 minutes")
            server.shutdown()
            return False
            
    except KeyboardInterrupt:
        print(f"\n🛑 Test stopped by user")
        if 'server' in locals():
            server.shutdown()
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


if __name__ == "__main__":
    success = main()
    
    if success:
        print(f"\n✅ OAUTH TEST PASSED!")
        print(f"🎊 Ready to integrate with Cross-LLM Bridge MCP server!")
    else:
        print(f"\n🔧 OAuth needs debugging")