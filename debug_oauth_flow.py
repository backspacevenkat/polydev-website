#!/usr/bin/env python3
"""
Debug the OAuth flow to see exactly what's happening
"""

import asyncio
import httpx
import secrets
import base64
import hashlib
import urllib.parse
from http.server import HTTPServer, BaseHTTPRequestHandler
import threading
import time
import webbrowser
import json

class DebugOAuthHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        print(f"\n🎯 RECEIVED CALLBACK: {self.path}")
        
        if '?' in self.path:
            query_string = self.path.split('?')[1]
            params = urllib.parse.parse_qs(query_string)
            
            if 'code' in params:
                self.server.auth_code = params['code'][0]
                print(f"✅ Authorization code: {self.server.auth_code[:50]}...")
            
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(b'<h1>OAuth Debug Complete!</h1>')
        else:
            self.send_response(400)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(b'<h1>No parameters received</h1>')
    
    def log_message(self, format, *args):
        pass

async def debug_oauth_flow():
    print("🔍 DEBUGGING OAUTH FLOW")
    print("=" * 40)
    
    # Start callback server
    server = HTTPServer(("localhost", 1455), DebugOAuthHandler)
    server.auth_code = None
    
    thread = threading.Thread(target=server.serve_forever)
    thread.daemon = True
    thread.start()
    
    # Generate PKCE parameters
    code_verifier = base64.urlsafe_b64encode(secrets.token_bytes(32)).decode('utf-8').rstrip('=')
    code_challenge = base64.urlsafe_b64encode(
        hashlib.sha256(code_verifier.encode()).digest()
    ).decode('utf-8').rstrip('=')
    
    # Build OAuth URL with API access scopes
    params = {
        'response_type': 'code',
        'client_id': 'app_EMoamEEZ73f0CkXaXp7hrann',
        'redirect_uri': 'http://localhost:1455/auth/callback',
        'scope': 'openid profile email offline_access model.request api.read api.write',
        'code_challenge': code_challenge,
        'code_challenge_method': 'S256',
        'id_token_add_organizations': 'true',
        'codex_cli_simplified_flow': 'true',
        'state': secrets.token_urlsafe(16)
    }
    
    oauth_url = 'https://auth.openai.com/oauth/authorize?' + urllib.parse.urlencode(params)
    print(f"🖱️  Opening browser for OAuth...")
    webbrowser.open(oauth_url)
    
    # Wait for callback
    start_time = time.time()
    while server.auth_code is None and (time.time() - start_time) < 60:
        await asyncio.sleep(1)
    
    if server.auth_code:
        print(f"✅ Authorization code received!")
        success = await test_token_exchange(server.auth_code, code_verifier)
        server.shutdown()
        return success
    else:
        print(f"❌ No authorization code received")
        server.shutdown()
        return False

async def test_token_exchange(auth_code, code_verifier):
    """Test the token exchange step"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                'https://auth.openai.com/oauth/token',
                data={
                    'grant_type': 'authorization_code',
                    'client_id': 'app_EMoamEEZ73f0CkXaXp7hrann',
                    'code': auth_code,
                    'redirect_uri': 'http://localhost:1455/auth/callback',
                    'code_verifier': code_verifier,
                },
                headers={'Content-Type': 'application/x-www-form-urlencoded'}
            )
            
            if response.status_code == 200:
                token_data = response.json()
                access_token = token_data.get('access_token')
                print(f"✅ Access token obtained!")
                
                # Test API call
                return await test_api_call(access_token)
            else:
                print(f"❌ Token exchange failed: {response.status_code} - {response.text}")
                return False
                
    except Exception as e:
        print(f"❌ Token exchange error: {e}")
        return False

async def test_api_call(access_token):
    """Test making an API call with the access token"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "gpt-3.5-turbo",
                    "messages": [{"role": "user", "content": "Test - say 'WORKING'"}],
                    "max_tokens": 10
                }
            )
            
            if response.status_code == 200:
                result = response.json()
                content = result.get("choices", [{}])[0].get("message", {}).get("content", "")
                print(f"🎉 SUCCESS! ChatGPT responded: {content}")
                return True
            else:
                print(f"❌ API call failed: {response.status_code} - {response.text}")
                return False
                
    except Exception as e:
        print(f"❌ API call error: {e}")
        return False

if __name__ == "__main__":
    success = asyncio.run(debug_oauth_flow())
    if success:
        print(f"\n🎊 OAUTH FLOW WORKING! The issue might be in the MCP integration.")
    else:
        print(f"\n🔧 Need to debug the OAuth flow further.")