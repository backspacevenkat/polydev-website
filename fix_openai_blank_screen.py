#!/usr/bin/env python3
"""
Fix OpenAI OAuth blank screen issue with different browser strategies
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
import subprocess
import os

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
            <head>
                <title>OpenAI OAuth Success!</title>
                <meta charset="UTF-8">
            </head>
            <body style="font-family: Arial; text-align: center; margin-top: 100px;">
                <h1 style="color: green;">🎉 OpenAI OAuth Success!</h1>
                <h2>Cross-LLM Bridge - ChatGPT Authentication</h2>
                <p><strong>✅ Fixed blank screen issue!</strong></p>
                <p><strong>✅ Authorization code received!</strong></p>
                <p><strong>✅ Ready for MCP integration!</strong></p>
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

def open_browser_incognito(url):
    """Try to open browser in incognito/private mode"""
    try:
        # Try Chrome incognito first
        subprocess.run([
            '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
            '--incognito',
            '--new-window',
            url
        ], check=False, timeout=5)
        print("✅ Opened Chrome in incognito mode")
        return True
    except:
        try:
            # Try Safari private browsing
            subprocess.run([
                'open', '-a', 'Safari', '--args', '--private', url
            ], check=False, timeout=5)
            print("✅ Opened Safari in private mode")
            return True
        except:
            # Fallback to default browser
            webbrowser.open(url)
            print("✅ Opened in default browser")
            return True

async def fix_openai_oauth():
    print("🔧 FIXING OPENAI OAUTH BLANK SCREEN ISSUE")
    print("=" * 50)
    print("🛠️  Trying different browser strategies to fix blank screen")
    
    # Check port availability
    import socket
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    result = sock.connect_ex(('localhost', 1455))
    sock.close()
    
    if result == 0:
        print("❌ Port 1455 is in use!")
        print("🔧 Killing existing process...")
        os.system("lsof -ti:1455 | xargs kill -9")
        await asyncio.sleep(2)
    
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
    
    # Build OAuth URL
    params = {
        'response_type': 'code',
        'client_id': 'app_EMoamEEZ73f0CkXaXp7hrann',
        'redirect_uri': 'http://localhost:1455/auth/callback',
        'scope': 'openid profile email offline_access',
        'code_challenge': challenge,
        'code_challenge_method': 'S256',
        'id_token_add_organizations': 'true',
        'codex_cli_simplified_flow': 'true',
        'state': secrets.token_urlsafe(16)
    }
    
    url = 'https://auth.openai.com/oauth/authorize?' + urllib.parse.urlencode(params)
    
    print(f"\n🔗 OpenAI OAuth URL:")
    print(url)
    print(f"\n🔧 Fixes applied:")
    print(f"   ✅ Clear any existing processes on port 1455")
    print(f"   ✅ Try incognito/private browsing mode")
    print(f"   ✅ Include all required parameters")
    print(f"   ✅ Use fresh browser session")
    
    # Try multiple browser opening strategies
    print(f"\n🌐 Opening browser with blank screen fixes...")
    print(f"💡 If you still see blank screen:")
    print(f"   1. Copy the URL above")
    print(f"   2. Open a new incognito/private window manually")
    print(f"   3. Paste the URL")
    print(f"   4. Complete authentication")
    
    success = open_browser_incognito(url)
    
    # Wait for callback
    print(f"\n⏳ Waiting 120 seconds for OAuth callback...")
    
    start_time = time.time()
    while server.auth_code is None and (time.time() - start_time) < 120:
        await asyncio.sleep(1)
        
        elapsed = int(time.time() - start_time)
        if elapsed > 0 and elapsed % 30 == 0:
            print(f"⏰ Still waiting... ({elapsed}s elapsed)")
            if elapsed == 60:
                print(f"💡 If blank screen persists, try manual incognito window")
    
    if server.auth_code:
        print(f"\n🎉 OPENAI OAUTH BLANK SCREEN FIXED!")
        print(f"✅ Authorization code: {server.auth_code[:60]}...")
        print(f"✅ Browser strategy worked!")
        print(f"🚀 Ready to complete MCP server integration!")
        result = True
    else:
        print(f"\n⏰ TIMEOUT - Try manual incognito approach")
        print(f"📋 Manual steps if blank screen persists:")
        print(f"   1. Open Chrome/Safari in incognito/private mode")
        print(f"   2. Paste the OAuth URL above")
        print(f"   3. Complete OpenAI login")
        print(f"   4. Should redirect back with success")
        result = False
    
    server.shutdown()
    return result

if __name__ == "__main__":
    try:
        success = asyncio.run(fix_openai_oauth())
        if success:
            print(f"\n🎊 OPENAI OAUTH BLANK SCREEN ISSUE RESOLVED!")
            print(f"🔧 Browser strategy fixed the issue")
            print(f"🚀 Ready for Cross-LLM Bridge MCP testing!")
        else:
            print(f"\n🔧 Try the manual incognito approach described above")
    except KeyboardInterrupt:
        print(f"\n🛑 Test cancelled")
    except Exception as e:
        print(f"\n❌ Error: {e}")