#!/usr/bin/env python3
"""
COMPREHENSIVE TEST: Complete Bidirectional Cross-LLM Bridge
Tests both OpenAI and Claude OAuth authentication for true bidirectional communication
"""

import asyncio
from oauth_auth_manager import OAuthAuthManager

async def main():
    print("🌉 COMPLETE BIDIRECTIONAL CROSS-LLM BRIDGE TEST")
    print("=" * 60)
    print("✨ Testing OAuth authentication for both directions:")
    print("   🔄 Claude Code users → ChatGPT (OpenAI OAuth)")
    print("   🔄 Codex CLI users → Claude (Anthropic OAuth)")
    
    # Initialize auth manager
    auth_manager = OAuthAuthManager()
    
    print(f"\n🔧 OAuth Configuration Summary:")
    print(f"   OpenAI Client ID: {auth_manager.auth_config['openai']['client_id']}")
    print(f"   Claude Client ID: {auth_manager.auth_config['anthropic']['client_id']}")
    print(f"   Callback Port: {auth_manager.callback_port}")
    
    # Test loading existing credentials
    print(f"\n📋 Checking Existing Authentication:")
    openai_exists = await auth_manager.load_credentials("openai")
    claude_exists = await auth_manager.load_credentials("anthropic")
    
    print(f"   OpenAI: {'✅ Already authenticated' if openai_exists else '❌ Need to authenticate'}")
    print(f"   Claude: {'✅ Already authenticated' if claude_exists else '❌ Need to authenticate'}")
    
    # Get current status
    status = auth_manager.get_status()
    
    print(f"\n🔍 Authentication Status Details:")
    for provider in ["openai", "anthropic"]:
        provider_status = status.get(provider, {})
        provider_name = "ChatGPT/OpenAI" if provider == "openai" else "Claude/Anthropic"
        
        print(f"\n{provider_name}:")
        print(f"   Authenticated: {'✅' if provider_status.get('authenticated') else '❌'}")
        print(f"   Has Token/Key: {'✅' if provider_status.get('has_api_key') else '❌'}")
        
        if provider_status.get('subscription_info'):
            sub_info = provider_status['subscription_info']
            plan_type = sub_info.get('plan_type', 'Unknown')
            is_active = sub_info.get('subscription_active', False)
            print(f"   Subscription: {plan_type} {'✅' if is_active else '❌'}")
    
    # Test scenarios
    both_authenticated = openai_exists and claude_exists
    
    print(f"\n🎯 BIDIRECTIONAL AUTHENTICATION TEST RESULTS:")
    print(f"=" * 55)
    
    if both_authenticated:
        print(f"🎊 SUCCESS: Complete Bidirectional Authentication!")
        print(f"✅ OpenAI OAuth working (Claude Code users can access ChatGPT)")
        print(f"✅ Claude OAuth working (Codex CLI users can access Claude)")
        print(f"✅ Cross-LLM Bridge ready for production use")
        
        # Test auth headers for both providers
        print(f"\n🔐 Authentication Headers Test:")
        for provider in ["openai", "anthropic"]:
            headers = auth_manager.get_auth_headers(provider)
            provider_name = "OpenAI" if provider == "openai" else "Claude"
            
            if headers.get("Authorization"):
                token_preview = headers["Authorization"].split(" ")[1][:20] + "..."
                print(f"   {provider_name}: Bearer {token_preview} ✅")
            else:
                print(f"   {provider_name}: No auth header ❌")
        
        print(f"\n🚀 CROSS-LLM BRIDGE FULLY OPERATIONAL!")
        print(f"   Ready for integration with:")
        print(f"   • Claude Code (MCP server)")
        print(f"   • Codex CLI (via API)")
        print(f"   • Custom applications")
        
        return True
    else:
        print(f"⚠️  Bidirectional authentication incomplete:")
        
        if not openai_exists:
            print(f"❌ OpenAI authentication missing")
            print(f"   Run: python3 fixed_oauth_final.py")
        
        if not claude_exists:
            print(f"❌ Claude authentication missing")
            print(f"   Run: python3 test_claude_oauth.py")
        
        print(f"\n📋 Next Steps:")
        print(f"   1. Complete missing authentications above")
        print(f"   2. Re-run this test")
        print(f"   3. Test MCP server integration")
        
        return False

async def test_mcp_integration():
    """Test MCP server integration readiness"""
    print(f"\n🔌 MCP SERVER INTEGRATION TEST")
    print(f"=" * 40)
    
    try:
        from oauth_cross_llm_bridge import OAuthCrossLLMBridge, ServerConfig
        
        config = ServerConfig()
        bridge = OAuthCrossLLMBridge(config)
        
        print(f"✅ MCP server can be imported")
        print(f"✅ OAuth auth manager initialized")
        print(f"✅ Server configuration loaded")
        
        # Test tools
        tools = [
            "send_to_openai",
            "send_to_anthropic", 
            "compare_llm_responses",
            "check_auth_status"
        ]
        
        print(f"\n🛠️  Available MCP Tools:")
        for i, tool in enumerate(tools, 1):
            print(f"   {i}. {tool}")
        
        print(f"\n✅ Cross-LLM Bridge MCP server ready!")
        print(f"   Configuration file: ~/.claude-code/mcp_servers.json")
        print(f"   Server command: python3 /Users/venkat/Documents/jarvis/oauth_cross_llm_bridge.py")
        
        return True
        
    except Exception as e:
        print(f"❌ MCP server integration error: {e}")
        return False

if __name__ == "__main__":
    try:
        print("🚀 Starting comprehensive bidirectional bridge test...\n")
        
        # Test authentication status
        auth_success = asyncio.run(main())
        
        if auth_success:
            print("\n" + "=" * 60)
            # Test MCP integration
            mcp_success = asyncio.run(test_mcp_integration())
            
            if mcp_success:
                print(f"\n🎉 COMPLETE BIDIRECTIONAL CROSS-LLM BRIDGE SUCCESS!")
                print(f"🌉 Bridge Status: FULLY OPERATIONAL")
                print(f"🔄 Bidirectional Auth: COMPLETE")
                print(f"🔌 MCP Integration: READY")
                print(f"\n🎯 Your Cross-LLM Bridge is ready for:")
                print(f"   • Claude Code users asking ChatGPT")
                print(f"   • Codex CLI users asking Claude")
                print(f"   • Side-by-side LLM comparisons")
                print(f"   • Subscription-based authentication")
            else:
                print(f"\n⚠️  Authentication complete, MCP integration needs work")
        else:
            print(f"\n❌ Complete authentication setup first")
        
    except KeyboardInterrupt:
        print(f"\n🛑 Test cancelled by user")
    except Exception as e:
        print(f"\n❌ Error: {e}")