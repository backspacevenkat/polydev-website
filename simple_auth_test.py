#!/usr/bin/env python3
"""
Simple OAuth authentication test
"""

import asyncio
import webbrowser
from oauth_auth_manager import OAuthAuthManager


async def simple_openai_test():
    """Simple test of OpenAI OAuth flow"""
    print("🧪 Simple OpenAI OAuth Test")
    print("="*40)
    
    auth_manager = OAuthAuthManager()
    
    print("This will:")
    print("1. Open your browser to OpenAI OAuth page")
    print("2. You log in normally in your browser") 
    print("3. OAuth tokens are captured automatically")
    print("4. API key is generated")
    
    proceed = input("\nProceed with OAuth test? (y/n): ").lower()
    
    if proceed == 'y':
        print("\n🚀 Starting OAuth flow...")
        success = await auth_manager.authenticate_openai()
        
        if success:
            print("\n✅ SUCCESS! OAuth authentication worked!")
            
            # Show status
            status = auth_manager.get_status()
            print(f"\nOpenAI Status: {status['openai']}")
            
            # Test API call
            print("\n🧪 Testing API call...")
            if auth_manager.is_authenticated("openai"):
                import httpx
                headers = auth_manager.get_auth_headers("openai")
                
                async with httpx.AsyncClient() as client:
                    response = await client.post(
                        "https://api.openai.com/v1/chat/completions",
                        headers=headers,
                        json={
                            "model": "gpt-3.5-turbo",
                            "messages": [{"role": "user", "content": "Say hello from the Cross-LLM Bridge!"}],
                            "max_tokens": 50
                        },
                        timeout=10.0
                    )
                
                if response.status_code == 200:
                    result = response.json()
                    api_response = result["choices"][0]["message"]["content"]
                    print(f"✅ API Response: {api_response}")
                    return True
                else:
                    print(f"❌ API Error: {response.status_code}")
                    return False
        else:
            print("❌ OAuth authentication failed")
            return False
    else:
        print("Test cancelled")
        return False


async def simple_mcp_test():
    """Test MCP server with OAuth"""
    print("\n🧪 MCP Server Test")
    print("="*40)
    
    print("Starting OAuth MCP server...")
    print("You can then test from Claude Code!")
    
    # Import and run MCP server
    from oauth_cross_llm_bridge import OAuthCrossLLMBridge, ServerConfig
    
    config = ServerConfig()
    bridge = OAuthCrossLLMBridge(config)
    
    print(f"🚀 Starting {config.server_name} v{config.server_version}")
    
    await bridge.run()


if __name__ == "__main__":
    print("Cross-LLM Bridge - Simple OAuth Test")
    print("="*50)
    
    choice = input("Choose test:\n1. OAuth Authentication\n2. MCP Server\nChoice (1-2): ")
    
    if choice == "1":
        result = asyncio.run(simple_openai_test())
        if result:
            print("\n🎉 Ready for MCP integration!")
    elif choice == "2":
        asyncio.run(simple_mcp_test())
    else:
        print("Invalid choice")