#!/usr/bin/env python3
"""
Simple working OpenAI OAuth - do it the straightforward way
"""

import asyncio
from oauth_auth_manager import OAuthAuthManager

async def main():
    print("🚀 SIMPLE OPENAI OAUTH - NO COMPLICATIONS")
    print("=" * 50)
    
    # Use our existing OAuth manager that already works
    auth_manager = OAuthAuthManager()
    
    # Just authenticate - it will handle everything properly
    print("📱 Starting OpenAI OAuth...")
    success = await auth_manager.authenticate_openai()
    
    if success:
        print("✅ OAuth completed!")
        
        # Test the API immediately
        headers = auth_manager.get_auth_headers("openai")
        if headers.get("Authorization"):
            print("✅ Got valid authorization header")
            print("🎉 READY FOR REAL API CALLS!")
            return True
        else:
            print("❌ No authorization header")
            return False
    else:
        print("❌ OAuth failed")
        return False

if __name__ == "__main__":
    asyncio.run(main())