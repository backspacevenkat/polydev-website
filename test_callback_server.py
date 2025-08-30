#!/usr/bin/env python3
"""
Test the OAuth callback server independently
"""

import asyncio
import webbrowser
import urllib.parse
from http.server import HTTPServer, BaseHTTPRequestHandler
import threading
import time
import json


class TestCallbackHandler(BaseHTTPRequestHandler):
    """Simple callback handler for testing"""
    
    def do_GET(self):
        print(f"\n🎯 CALLBACK RECEIVED!")
        print(f"📍 Path: {self.path}")
        
        # Parse the callback URL
        url_parts = urllib.parse.urlparse(self.path)
        query_params = urllib.parse.parse_qs(url_parts.query)
        
        print(f"📋 Query parameters:")
        for key, value in query_params.items():
            print(f"  {key}: {value[0][:50]}{'...' if len(value[0]) > 50 else ''}")
        
        # Check for authorization code
        if 'code' in query_params:
            self.server.auth_code = query_params['code'][0]
            print(f"✅ Authorization code captured!")
            
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            
            success_html = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <title>OAuth Callback Success</title>
                <style>
                    body {{ font-family: Arial, sans-serif; text-align: center; margin-top: 100px; }}
                    .success {{ color: green; }}
                    .info {{ background: #f0f0f0; padding: 20px; margin: 20px; border-radius: 5px; }}
                </style>
            </head>
            <body>
                <h1 class="success">✅ OAuth Callback Successful!</h1>
                <div class="info">
                    <h3>Callback Details:</h3>
                    <p><strong>Path:</strong> {self.path}</p>
                    <p><strong>Authorization Code:</strong> {self.server.auth_code[:20]}...</p>
                </div>
                <p>You can close this window and return to the terminal.</p>
                <script>
                    console.log('OAuth callback received successfully');
                    console.log('Auth code:', '{self.server.auth_code[:20]}...');
                    setTimeout(() => {{
                        if (window.opener) {{
                            window.close();
                        }}
                    }}, 5000);
                </script>
            </body>
            </html>
            """
            self.wfile.write(success_html.encode())
            
        elif 'error' in query_params:
            error_code = query_params['error'][0]
            error_description = query_params.get('error_description', ['Unknown error'])[0]
            
            print(f"❌ OAuth Error: {error_code}")
            print(f"📝 Description: {error_description}")
            
            self.send_response(400)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            
            error_html = f"""
            <!DOCTYPE html>
            <html>
            <head><title>OAuth Error</title></head>
            <body style="font-family: Arial; text-align: center; margin-top: 100px;">
                <h1 style="color: red;">❌ OAuth Error</h1>
                <p><strong>Error:</strong> {error_code}</p>
                <p><strong>Description:</strong> {error_description}</p>
                <p>Please try again from the terminal.</p>
            </body>
            </html>
            """
            self.wfile.write(error_html.encode())
            
        else:
            print(f"⚠️  Unexpected callback - no code or error parameter")
            self.send_response(400)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(b"<h1>Unexpected callback</h1>")
    
    def log_message(self, format, *args):
        # Print all HTTP requests for debugging
        print(f"🌐 HTTP Request: {format % args}")


def test_server_only():
    """Test just the callback server without OAuth"""
    print("🧪 Testing Callback Server Only")
    print("="*40)
    
    try:
        # Start server
        print("🚀 Starting callback server on localhost:8080...")
        server = HTTPServer(("localhost", 8080), TestCallbackHandler)
        server.auth_code = None
        
        print("✅ Server started successfully!")
        print("📍 Server address: http://localhost:8080")
        print("🧪 Test URLs:")
        print("  Success: http://localhost:8080/auth/callback?code=test123&state=test")
        print("  Error:   http://localhost:8080/auth/callback?error=access_denied")
        print("")
        print("💡 Open one of these URLs in your browser to test the callback")
        print("🛑 Press Ctrl+C to stop the server")
        
        # Run server
        server.serve_forever()
        
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
        server.shutdown()
    except Exception as e:
        print(f"❌ Server error: {e}")


def test_full_oauth_flow():
    """Test the full OAuth flow with callback server"""
    print("🧪 Testing Full OAuth Flow")
    print("="*40)
    
    try:
        # Start callback server
        print("🚀 Starting callback server on localhost:8080...")
        server = HTTPServer(("localhost", 8080), TestCallbackHandler)
        server.auth_code = None
        
        # Start server in background thread
        server_thread = threading.Thread(target=server.serve_forever)
        server_thread.daemon = True
        server_thread.start()
        
        print("✅ Callback server is running!")
        
        # Build OAuth URL
        oauth_params = {
            "response_type": "code",
            "client_id": "TdJIcbe16WoTHtN95nyywh5E",  # OpenAI public client ID
            "redirect_uri": "http://localhost:8080/auth/callback",
            "scope": "openid profile email offline_access",
            "state": "test_state_123"
        }
        
        oauth_url = "https://auth.openai.com/authorize?" + urllib.parse.urlencode(oauth_params)
        
        print(f"\n🌐 Opening OAuth URL in browser...")
        print(f"📍 URL: {oauth_url}")
        
        webbrowser.open(oauth_url)
        
        print(f"\n⏳ Waiting for OAuth callback...")
        print(f"📝 Instructions:")
        print(f"1. Complete OpenAI login in the browser")
        print(f"2. Accept application permissions")
        print(f"3. You should be redirected to localhost:8080")
        print(f"4. Watch this terminal for callback confirmation")
        print(f"")
        print(f"🛑 Press Ctrl+C to cancel")
        
        # Wait for callback
        timeout = 300  # 5 minutes
        start_time = time.time()
        
        while server.auth_code is None and (time.time() - start_time) < timeout:
            time.sleep(1)
        
        if server.auth_code:
            print(f"\n🎉 SUCCESS! OAuth flow completed!")
            print(f"✅ Authorization code received: {server.auth_code[:20]}...")
            print(f"📝 Next step: Exchange this code for access tokens")
            
            server.shutdown()
            return True
        else:
            print(f"\n⏰ TIMEOUT: No callback received within {timeout/60} minutes")
            print(f"❓ Possible issues:")
            print(f"  - Firewall blocking localhost:8080")
            print(f"  - Browser security settings")
            print(f"  - Network configuration")
            
            server.shutdown()
            return False
            
    except KeyboardInterrupt:
        print(f"\n🛑 Test cancelled by user")
        if 'server' in locals():
            server.shutdown()
        return False
    except Exception as e:
        print(f"❌ Test error: {e}")
        if 'server' in locals():
            server.shutdown()
        return False


def check_port():
    """Check if port 8080 is available"""
    import socket
    
    print("🔍 Checking port 8080 availability...")
    
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    result = sock.connect_ex(('localhost', 8080))
    sock.close()
    
    if result == 0:
        print("❌ Port 8080 is already in use!")
        
        # Try to find what's using it
        import subprocess
        try:
            result = subprocess.run(['lsof', '-i', ':8080'], 
                                  capture_output=True, text=True)
            if result.stdout:
                print("📋 Process using port 8080:")
                print(result.stdout)
        except:
            pass
            
        return False
    else:
        print("✅ Port 8080 is available")
        return True


def main():
    print("Cross-LLM Bridge - OAuth Callback Server Test")
    print("="*60)
    
    # Check port availability
    if not check_port():
        print("\n🔧 Please free port 8080 first:")
        print("   lsof -i :8080")
        print("   kill -9 <PID>")
        return
    
    print("\nChoose test:")
    print("1. Test callback server only (manual URL testing)")
    print("2. Test full OAuth flow with OpenAI")
    print("0. Exit")
    
    choice = input("\nChoice (0-2): ").strip()
    
    if choice == "1":
        test_server_only()
    elif choice == "2":
        success = test_full_oauth_flow()
        if success:
            print("\n🎉 OAuth callback mechanism is working!")
            print("✅ Ready to test the full authentication flow")
        else:
            print("\n🔧 OAuth callback needs debugging")
    elif choice == "0":
        print("👋 Goodbye!")
    else:
        print("❌ Invalid choice")


if __name__ == "__main__":
    main()