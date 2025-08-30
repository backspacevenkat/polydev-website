#!/usr/bin/env python3
"""
Complete authentication setup for Cross-LLM Bridge MCP server
"""

import asyncio
from oauth_auth_manager import OAuthAuthManager

async def setup_full_auth():
    print("🔧 SETTING UP COMPLETE CROSS-LLM BRIDGE AUTHENTICATION")
    print("=" * 60)
    print("This will authenticate both OpenAI and Claude for MCP server")
    
    auth_manager = OAuthAuthManager()
    
    # Check existing authentication
    print("\n📋 Checking existing authentication...")
    openai_loaded = await auth_manager.load_credentials("openai")
    claude_loaded = await auth_manager.load_credentials("anthropic")
    
    print(f"   OpenAI: {'✅ Ready' if openai_loaded else '❌ Need auth'}")
    print(f"   Claude: {'✅ Ready' if claude_loaded else '❌ Need auth'}")
    
    # Authenticate OpenAI if needed
    if not openai_loaded:
        print(f"\n🤖 Setting up OpenAI authentication...")
        openai_success = await auth_manager.authenticate_openai()
        if not openai_success:
            print("❌ OpenAI authentication failed")
            return False
    
    # Authenticate Claude if needed  
    if not claude_loaded:
        print(f"\n🤖 Setting up Claude authentication...")
        claude_success = await auth_manager.authenticate_anthropic()
        if not claude_success:
            print("❌ Claude authentication failed")
            return False
    
    # Verify both are working
    final_status = auth_manager.get_status()
    
    print(f"\n🎯 FINAL AUTHENTICATION STATUS:")
    print(f"=" * 40)
    
    openai_status = final_status.get("openai", {})
    claude_status = final_status.get("anthropic", {})
    
    print(f"OpenAI/ChatGPT:")
    print(f"   Authenticated: {'✅' if openai_status.get('authenticated') else '❌'}")
    print(f"   Has API Key: {'✅' if openai_status.get('has_api_key') else '❌'}")
    
    print(f"\nClaude/Anthropic:")
    print(f"   Authenticated: {'✅' if claude_status.get('authenticated') else '❌'}")
    print(f"   Has Token: {'✅' if claude_status.get('authenticated') else '❌'}")
    
    both_ready = (openai_status.get('authenticated', False) and 
                  claude_status.get('authenticated', False))
    
    if both_ready:
        print(f"\n🎊 SUCCESS: Cross-LLM Bridge MCP server ready!")
        print(f"✅ OpenAI OAuth authenticated")
        print(f"✅ Claude OAuth authenticated") 
        print(f"✅ MCP server configured in Claude Code")
        print(f"🚀 Ready to test ChatGPT communication through Claude Code!")
        return True
    else:
        print(f"\n❌ Authentication incomplete - check errors above")
        return False

if __name__ == "__main__":
    try:
        success = asyncio.run(setup_full_auth())
        if success:
            print(f"\n🌉 Cross-LLM Bridge MCP is ready for Claude Code testing!")
            print(f"\nNext step: Test in Claude Code with:")
            print(f"   Ask Claude Code to use the 'send_to_openai' tool")
            print(f"   Example: 'Use the Cross-LLM Bridge to ask ChatGPT about Python best practices'")
        else:
            print(f"\n❌ Setup incomplete - resolve authentication issues")
    except KeyboardInterrupt:
        print(f"\n🛑 Setup cancelled")
    except Exception as e:
        print(f"\n❌ Error: {e}")