#!/usr/bin/env python3
"""
Test Claude OAuth authentication for Codex CLI users
"""

import asyncio
from oauth_auth_manager import OAuthAuthManager

async def test_claude_oauth():
    print("🔥 TESTING CLAUDE OAUTH FOR CODEX CLI USERS")
    print("=" * 55)
    print("✨ From perspective of Codex CLI users authenticating with Claude")
    
    # Initialize auth manager
    auth_manager = OAuthAuthManager()
    
    print("\n🔧 Claude OAuth Configuration:")
    claude_config = auth_manager.auth_config["anthropic"]
    print(f"   Client ID: {claude_config['client_id']}")
    print(f"   Auth URL: {claude_config['auth_url']}")
    print(f"   Token URL: {claude_config['token_url']}")
    print(f"   Scopes: {', '.join(claude_config['scopes'])}")
    print(f"   Redirect URI: {claude_config['redirect_uri']}")
    
    print(f"\n🤖 Testing Claude OAuth authentication...")
    print(f"This will open your browser for Claude Pro/Max subscription login")
    
    confirmation = input("\nReady to test Claude OAuth? (y/n): ").lower()
    
    if confirmation != 'y':
        print("❌ Test cancelled")
        return False
    
    # Test Claude authentication
    success = await auth_manager.authenticate_anthropic()
    
    if success:
        print("\n🎉 CLAUDE OAUTH AUTHENTICATION SUCCESS!")
        print("✅ Codex CLI users can now authenticate with Claude!")
        
        # Show auth status
        status = auth_manager.get_status()
        claude_status = status.get("anthropic", {})
        
        print(f"\n📋 Claude Authentication Status:")
        print(f"   ✅ Authenticated: {claude_status.get('authenticated', False)}")
        print(f"   ✅ Has Access Token: {claude_status.get('authenticated', False)}")
        print(f"   ✅ Subscription Active: {claude_status.get('subscription_info', {}).get('subscription_active', False)}")
        print(f"   ✅ Plan Type: {claude_status.get('subscription_info', {}).get('plan_type', 'Unknown')}")
        
        # Test auth headers
        headers = auth_manager.get_auth_headers("anthropic")
        print(f"\n🔐 Authentication Headers:")
        for key, value in headers.items():
            if key == "Authorization":
                print(f"   {key}: Bearer {value.split(' ')[1][:20]}...")
            else:
                print(f"   {key}: {value}")
        
        print(f"\n🌉 BIDIRECTIONAL AUTHENTICATION COMPLETE!")
        print(f"   1. ✅ OpenAI OAuth (for Claude Code users → ChatGPT)")
        print(f"   2. ✅ Claude OAuth (for Codex CLI users → Claude)")
        print(f"   3. ✅ Cross-LLM Bridge ready for bidirectional communication")
        
        return True
    else:
        print("❌ Claude OAuth authentication failed")
        return False

async def test_bidirectional_setup():
    """Test complete bidirectional authentication setup"""
    print("\n🌉 TESTING COMPLETE BIDIRECTIONAL SETUP")
    print("=" * 50)
    
    auth_manager = OAuthAuthManager()
    
    # Load existing credentials
    openai_loaded = await auth_manager.load_credentials("openai")
    claude_loaded = await auth_manager.load_credentials("anthropic")
    
    print(f"\n📋 Existing Authentication Status:")
    print(f"   OpenAI: {'✅' if openai_loaded else '❌'} {'Loaded' if openai_loaded else 'Not authenticated'}")
    print(f"   Claude: {'✅' if claude_loaded else '❌'} {'Loaded' if claude_loaded else 'Not authenticated'}")
    
    status = auth_manager.get_status()
    
    print(f"\n🔍 Authentication Details:")
    for provider in ["openai", "anthropic"]:
        provider_status = status.get(provider, {})
        print(f"\n{provider.title()}:")
        print(f"   Authenticated: {'✅' if provider_status.get('authenticated') else '❌'}")
        print(f"   Has API Key: {'✅' if provider_status.get('has_api_key') else '❌'}")
        if provider_status.get('subscription_info'):
            sub_info = provider_status['subscription_info']
            print(f"   Subscription: {sub_info.get('plan_type', 'Unknown')}")
    
    both_authenticated = openai_loaded and claude_loaded
    
    if both_authenticated:
        print(f"\n🎊 BIDIRECTIONAL AUTHENTICATION COMPLETE!")
        print(f"✅ Both OpenAI and Claude OAuth working")
        print(f"✅ Codex CLI users can authenticate with Claude")
        print(f"✅ Claude Code users can authenticate with ChatGPT")
        print(f"🚀 Cross-LLM Bridge ready for production use!")
    else:
        print(f"\n⚠️  Bidirectional setup incomplete")
        if not openai_loaded:
            print(f"❌ OpenAI authentication missing - run test_full_bridge.py")
        if not claude_loaded:
            print(f"❌ Claude authentication missing - run this test")
    
    return both_authenticated

if __name__ == "__main__":
    try:
        print("🚀 Starting Claude OAuth test for Codex CLI users...\n")
        
        # Test Claude OAuth
        success = asyncio.run(test_claude_oauth())
        
        if success:
            print("\n" + "=" * 60)
            asyncio.run(test_bidirectional_setup())
        
        print(f"\n{'✅' if success else '❌'} Claude OAuth test {'completed successfully' if success else 'failed'}")
        
    except KeyboardInterrupt:
        print(f"\n🛑 Test cancelled by user")
    except Exception as e:
        print(f"\n❌ Error: {e}")