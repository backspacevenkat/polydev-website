#!/usr/bin/env python3
"""
Debug the blank white page issue in OAuth flow
"""

import urllib.parse
import secrets
import base64
import hashlib
import webbrowser

def main():
    print("🔍 Debugging OAuth Blank White Page Issue")
    print("=" * 45)
    
    # Generate PKCE
    verifier = base64.urlsafe_b64encode(secrets.token_bytes(32)).decode('utf-8').rstrip('=')
    challenge = base64.urlsafe_b64encode(hashlib.sha256(verifier.encode()).digest()).decode('utf-8').rstrip('=')
    
    # Try different OAuth URL configurations
    configs = [
        {
            "name": "Standard OAuth (what we've been using)",
            "params": {
                'response_type': 'code',
                'client_id': 'app_EMoamEEZ73f0CkXaXp7hrann',
                'redirect_uri': 'http://localhost:1455/auth/callback',
                'scope': 'openid profile email offline_access',
                'code_challenge': challenge,
                'code_challenge_method': 'S256',
                'state': secrets.token_urlsafe(16)
            }
        },
        {
            "name": "Simplified scope (openid only)",
            "params": {
                'response_type': 'code',
                'client_id': 'app_EMoamEEZ73f0CkXaXp7hrann',
                'redirect_uri': 'http://localhost:1455/auth/callback',
                'scope': 'openid',
                'code_challenge': challenge,
                'code_challenge_method': 'S256',
                'state': 'test'
            }
        },
        {
            "name": "Without PKCE (testing)",
            "params": {
                'response_type': 'code',
                'client_id': 'app_EMoamEEZ73f0CkXaXp7hrann',
                'redirect_uri': 'http://localhost:1455/auth/callback',
                'scope': 'openid',
                'state': 'test'
            }
        },
        {
            "name": "With prompt parameter",
            "params": {
                'response_type': 'code',
                'client_id': 'app_EMoamEEZ73f0CkXaXp7hrann',
                'redirect_uri': 'http://localhost:1455/auth/callback',
                'scope': 'openid profile email',
                'code_challenge': challenge,
                'code_challenge_method': 'S256',
                'state': 'test',
                'prompt': 'login'
            }
        }
    ]
    
    for i, config in enumerate(configs, 1):
        print(f"\n{i}. {config['name']}:")
        url = 'https://auth.openai.com/authorize?' + urllib.parse.urlencode(config['params'])
        print(f"   {url}")
    
    print(f"\n🧪 TESTS TO TRY:")
    print(f"1. Copy URL #2 (simplified scope) and test in browser")
    print(f"2. Check if you're already logged into ChatGPT in another tab")
    print(f"3. Try private/incognito browser window")
    print(f"4. Clear browser cache/cookies for auth.openai.com")
    
    print(f"\n🔧 POSSIBLE CAUSES OF BLANK PAGE:")
    print(f"   - Browser cache/cookie conflicts")
    print(f"   - Already authenticated session interfering")
    print(f"   - JavaScript loading issues")
    print(f"   - CORS or security policy blocking")
    print(f"   - OpenAI rate limiting")
    
    choice = input(f"\nWhich URL would you like to test? (1-4): ").strip()
    
    try:
        idx = int(choice) - 1
        if 0 <= idx < len(configs):
            config = configs[idx]
            url = 'https://auth.openai.com/authorize?' + urllib.parse.urlencode(config['params'])
            print(f"\n🌐 Opening: {config['name']}")
            print(f"URL: {url}")
            webbrowser.open(url)
            print(f"\n📝 If still blank:")
            print(f"   1. Try in private/incognito mode")
            print(f"   2. Clear auth.openai.com cookies")
            print(f"   3. Check browser console for errors")
        else:
            print("Invalid choice")
    except ValueError:
        print("Invalid choice")

if __name__ == "__main__":
    main()