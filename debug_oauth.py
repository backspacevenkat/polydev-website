#!/usr/bin/env python3
"""
Debug OAuth flow step by step
"""

import asyncio
import webbrowser
import urllib.parse
from http.server import HTTPServer, BaseHTTPRequestHandler
import threading
import time


class DebugCallbackHandler(BaseHTTPRequestHandler):
    """Debug HTTP handler for OAuth callback"""
    
    def do_GET(self):
        print(f"\n🔍 DEBUG: Received callback: {self.path}")
        
        # Parse the callback URL
        url_parts = urllib.parse.urlparse(self.path)
        query_params = urllib.parse.parse_qs(url_parts.query)
        
        print(f"🔍 DEBUG: Query params: {query_params}")
        
        # Store the authorization code
        if 'code' in query_params:
            self.server.auth_code = query_params['code'][0]
            print(f"✅ DEBUG: Got auth code: {self.server.auth_code[:20]}...")
            
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            
            success_html = """
            <!DOCTYPE html>
            <html>
            <head><title>Debug OAuth Success</title></head>
            <body style="font-family: Arial; text-align: center; margin-top: 100px;">
                <h1 style="color: green;">✅ OAuth Debug Success!</h1>
                <p>Authorization code received successfully.</p>
                <p>You can close this window and return to the terminal.</p>
                <script>
                    console.log('OAuth callback received successfully');
                    setTimeout(() => window.close(), 3000);
                </script>
            </body>
            </html>
            """
            self.wfile.write(success_html.encode())
        else:
            print(f"❌ DEBUG: No auth code in callback")
            self.send_response(400)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            
            error_html = """
            <!DOCTYPE html>
            <html>
            <head><title>Debug OAuth Error</title></head>
            <body style="font-family: Arial; text-align: center; margin-top: 100px;">
                <h1 style="color: red;">❌ OAuth Debug Failed</h1>
                <p>No authorization code received.</p>
            </body>
            </html>
            """
            self.wfile.write(error_html.encode())
    
    def log_message(self, format, *args):
        # Print HTTP server logs for debugging
        print(f"🔍 HTTP: {format % args}")


async def debug_oauth_flow():
    """Debug the OAuth flow step by step"""
    print("🔍 OAuth Debug Flow")
    print("="*40)
    
    # Check if port 8080 is available
    import socket
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    result = sock.connect_ex(('localhost', 8080))
    sock.close()
    
    if result == 0:
        print("❌ Port 8080 is already in use!")
        print("Please kill any process using port 8080:")
        print("lsof -i :8080")
        print("kill -9 <PID>")
        return False
    
    print("✅ Port 8080 is available")
    
    # Start debug callback server
    print("\n🚀 Starting debug callback server on localhost:8080...")
    
    try:
        server = HTTPServer(("localhost", 8080), DebugCallbackHandler)
        server.auth_code = None
        
        server_thread = threading.Thread(target=server.serve_forever)
        server_thread.daemon = True
        server_thread.start()
        
        print("✅ Debug server started successfully")
        
        # Build test OAuth URL (simplified)
        auth_url = "https://auth.openai.com/authorize?" + urllib.parse.urlencode({
            "response_type": "code",
            "client_id": "TdJIcbe16WoTHtN95nyywh5E",
            "redirect_uri": "http://localhost:8080/auth/callback",
            "scope": "openid profile email",
            "state": "debug_test"
        })
        
        print(f"\n🌐 Opening OAuth URL...")
        print(f"URL: {auth_url}")
        
        webbrowser.open(auth_url)
        
        print(f"\n⏳ Waiting for OAuth callback...")
        print(f"📝 Instructions:")
        print(f"1. Complete login in the browser")
        print(f"2. Watch for callback in this terminal")
        print(f"3. Press Ctrl+C to cancel if needed")
        
        # Wait for callback with timeout
        timeout = 120  # 2 minutes
        start_time = time.time()
        
        while server.auth_code is None and (time.time() - start_time) < timeout:
            await asyncio.sleep(1)
        
        if server.auth_code:
            print(f"\n✅ SUCCESS! Received authorization code.")
            print(f"📝 Auth code (first 20 chars): {server.auth_code[:20]}...")
            
            server.shutdown()
            return True
        else:
            print(f"\n❌ TIMEOUT: No authorization code received within {timeout} seconds")
            server.shutdown()
            return False
            
    except Exception as e:
        print(f"❌ Error in debug flow: {e}")
        return False


async def main():
    print("Cross-LLM Bridge - OAuth Debug Tool")
    print("="*50)
    
    success = await debug_oauth_flow()
    
    if success:
        print("\n🎉 OAuth flow debugging successful!")
        print("The callback mechanism is working correctly.")
        print("\nNext: Try the full OAuth authentication again:")
        print("python3 simple_auth_test.py")
    else:
        print("\n🔧 OAuth flow needs debugging.")
        print("Check firewall settings and port availability.")


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n🛑 Debug cancelled by user")
    except Exception as e:
        print(f"\n❌ Debug error: {e}")