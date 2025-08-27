#!/usr/bin/env python3
"""
Test just the HTTP server to see if it can receive requests
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import threading
import time
import urllib.request

class TestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        print(f"📥 Received request: {self.path}")
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        self.wfile.write(b'<h1>Server is working!</h1>')
        self.server.request_received = True
    
    def log_message(self, format, *args):
        pass

def main():
    print("Testing HTTP Server on localhost:8080")
    print("=====================================")
    
    # Start server
    server = HTTPServer(("localhost", 8080), TestHandler)
    server.request_received = False
    
    # Start in background
    thread = threading.Thread(target=server.serve_forever)
    thread.daemon = True
    thread.start()
    
    print("✅ Server started on localhost:8080")
    time.sleep(1)  # Give server time to start
    
    # Test with a local request
    print("\n🧪 Testing with local HTTP request...")
    try:
        response = urllib.request.urlopen("http://localhost:8080/test", timeout=5)
        print(f"✅ Local request successful: {response.status}")
        print(f"✅ Response: {response.read().decode()[:50]}...")
    except Exception as e:
        print(f"❌ Local request failed: {e}")
    
    # Test OAuth-style callback
    print("\n🧪 Testing OAuth-style callback...")
    try:
        callback_url = "http://localhost:8080/auth/callback?code=test123&state=test"
        response = urllib.request.urlopen(callback_url, timeout=5)
        print(f"✅ OAuth callback test successful: {response.status}")
    except Exception as e:
        print(f"❌ OAuth callback test failed: {e}")
    
    server.shutdown()
    
    if server.request_received:
        print(f"\n✅ CONCLUSION: HTTP server is working correctly!")
        print(f"🔧 If OAuth still fails, the issue is likely:")
        print(f"   - OpenAI OAuth URL parameters")
        print(f"   - Browser security blocking localhost")
        print(f"   - Network firewall settings")
    else:
        print(f"\n❌ CONCLUSION: HTTP server has issues")

if __name__ == "__main__":
    main()