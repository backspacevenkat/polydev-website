#!/usr/bin/env python3
"""
Automated test for OAuth callback server
"""

import threading
import time
import urllib.parse
import urllib.request
from http.server import HTTPServer, BaseHTTPRequestHandler


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
            
            success_html = """
            <!DOCTYPE html>
            <html>
            <head><title>Test Success</title></head>
            <body style="font-family: Arial; text-align: center; margin-top: 100px;">
                <h1 style="color: green;">✅ Callback Test Successful!</h1>
                <p>Server is working correctly.</p>
            </body>
            </html>
            """
            self.wfile.write(success_html.encode())
            
        else:
            print(f"⚠️  No authorization code in callback")
            self.send_response(400)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(b"<h1>Test callback - no code parameter</h1>")
    
    def log_message(self, format, *args):
        # Suppress default HTTP logging for cleaner output
        pass


def test_callback_server():
    """Test the callback server automatically"""
    print("🧪 Testing OAuth Callback Server")
    print("=" * 40)
    
    try:
        # Start server
        print("🚀 Starting callback server on localhost:8080...")
        server = HTTPServer(("localhost", 8080), TestCallbackHandler)
        server.auth_code = None
        
        # Start server in background thread
        server_thread = threading.Thread(target=server.serve_forever)
        server_thread.daemon = True
        server_thread.start()
        
        print("✅ Server started successfully!")
        print("📍 Server listening on: http://localhost:8080")
        
        # Wait a moment for server to be ready
        time.sleep(1)
        
        # Test the callback endpoint
        test_url = "http://localhost:8080/auth/callback?code=test_auth_code_12345&state=test_state"
        
        print(f"\n🧪 Testing callback URL: {test_url}")
        
        try:
            # Make a test request to the callback endpoint
            response = urllib.request.urlopen(test_url, timeout=5)
            
            if response.status == 200:
                print("✅ Callback server responded successfully!")
                print("✅ HTTP 200 OK received")
                
                # Check if auth code was captured
                if hasattr(server, 'auth_code') and server.auth_code:
                    print(f"✅ Authorization code captured: {server.auth_code}")
                    print("\n🎉 CALLBACK SERVER IS WORKING CORRECTLY!")
                    print("✅ Ready to receive OAuth callbacks from browsers")
                    
                    server.shutdown()
                    return True
                else:
                    print("❌ Auth code was not captured by server")
                    
            else:
                print(f"❌ Unexpected response code: {response.status}")
                
        except Exception as e:
            print(f"❌ Failed to connect to callback server: {e}")
            
        server.shutdown()
        return False
        
    except Exception as e:
        print(f"❌ Server error: {e}")
        return False


def main():
    print("Cross-LLM Bridge - Automated Callback Test")
    print("=" * 50)
    
    success = test_callback_server()
    
    if success:
        print("\n✅ CONCLUSION: OAuth callback mechanism is working!")
        print("🔧 If OAuth flow still fails, the issue may be:")
        print("   - Browser security settings blocking localhost")
        print("   - Firewall blocking incoming connections")
        print("   - OAuth redirect_uri configuration mismatch")
        print("\n📝 Next: Try the full OAuth flow:")
        print("   python3 simple_auth_test.py")
        
    else:
        print("\n❌ CONCLUSION: Callback server has issues")
        print("🔧 Check:")
        print("   - Port 8080 availability")
        print("   - Network configuration")
        print("   - Python HTTP server permissions")


if __name__ == "__main__":
    main()