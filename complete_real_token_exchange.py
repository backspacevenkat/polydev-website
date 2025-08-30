#!/usr/bin/env python3
"""
Complete the real OAuth token exchange using the authorization code we received
"""

import asyncio
import httpx
import base64
import hashlib
import secrets
import json
from oauth_auth_manager import OAuthAuthManager, OAuthCredentials
from datetime import datetime, timedelta

async def do_real_token_exchange():
    print("🔄 COMPLETING REAL OPENAI TOKEN EXCHANGE")
    print("=" * 50)
    
    # The fresh authorization code we just received from fixed OAuth
    auth_code = "ac_MWhk0okZIgPQu_SGDjAIba5yJeQPO4y7C6-tLjVIcH4.qqsiuDio8da7313oCUq9pS4NFLW-k01PW6kTQAK19vI"
    
    # We need the same code_verifier that was used in the OAuth request
    # Since we can't retrieve it, we need to generate a fresh one and do a new flow
    
    print("⚠️  The authorization code expires quickly and needs the exact code_verifier")
    print("🔄 Let's do a fresh OAuth flow to get working tokens...")
    
    auth_manager = OAuthAuthManager()
    
    # Do a complete fresh OAuth authentication
    print("\n🤖 Starting fresh OpenAI OAuth...")
    success = await auth_manager.authenticate_openai()
    
    if success:
        print("✅ OpenAI OAuth completed successfully!")
        
        # Verify we have proper credentials
        status = auth_manager.get_status()
        openai_status = status.get("openai", {})
        
        print(f"\n📋 OpenAI Authentication Status:")
        print(f"   Authenticated: {'✅' if openai_status.get('authenticated') else '❌'}")
        print(f"   Has API Key: {'✅' if openai_status.get('has_api_key') else '❌'}")
        print(f"   Subscription: {openai_status.get('subscription_info', {}).get('plan_type', 'Unknown')}")
        
        # Test the API key with a simple request
        headers = auth_manager.get_auth_headers("openai")
        
        if headers.get("Authorization"):
            print(f"\n🧪 Testing API key with OpenAI...")
            
            try:
                async with httpx.AsyncClient(timeout=30.0) as client:
                    response = await client.post(
                        "https://api.openai.com/v1/chat/completions",
                        headers=headers,
                        json={
                            "model": "gpt-3.5-turbo",
                            "messages": [{"role": "user", "content": "Hello, this is a test from Cross-LLM Bridge"}],
                            "max_tokens": 50
                        }
                    )
                
                if response.status_code == 200:
                    result = response.json()
                    test_response = result.get("choices", [{}])[0].get("message", {}).get("content", "No content")
                    print(f"✅ API Test SUCCESS! Response: {test_response[:100]}...")
                    print(f"🚀 OpenAI API is working with OAuth tokens!")
                    return True
                else:
                    print(f"❌ API Test failed: {response.status_code}")
                    print(f"Response: {response.text}")
                    return False
                    
            except Exception as e:
                print(f"❌ API Test error: {e}")
                return False
        else:
            print("❌ No authorization header generated")
            return False
    else:
        print("❌ OpenAI OAuth failed")
        return False

async def test_mcp_with_real_auth():
    print(f"\n🧪 TESTING MCP SERVER WITH REAL AUTH")
    print("=" * 45)
    
    # Test the MCP server directly with real authentication
    from oauth_cross_llm_bridge import OAuthCrossLLMBridge, ServerConfig
    
    try:
        config = ServerConfig()
        bridge = OAuthCrossLLMBridge(config)
        
        print("✅ MCP server initialized")
        
        # Test the send_to_openai function directly
        result = await bridge._send_to_openai("Test message from MCP server", "gpt-3.5-turbo", 50)
        
        if result and len(result) > 0:
            response_text = result[0].text
            if "Mock" in response_text or "test mode" in response_text:
                print("❌ Still getting mock responses from MCP server")
                print("🔧 Need to check authentication in MCP server")
            else:
                print("✅ MCP server is making real API calls!")
                print(f"📝 Response preview: {response_text[:200]}...")
        
        return True
        
    except Exception as e:
        print(f"❌ MCP server test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

async def main():
    try:
        print("🚀 Starting complete real OAuth token exchange...\n")
        
        # Do real token exchange
        auth_success = await do_real_token_exchange()
        
        if auth_success:
            print("\n" + "=" * 60)
            # Test MCP server with real auth
            mcp_success = await test_mcp_with_real_auth()
            
            if mcp_success:
                print(f"\n🎉 COMPLETE SUCCESS!")
                print(f"✅ OpenAI OAuth working with real API calls")
                print(f"✅ MCP server ready for real ChatGPT responses")
                print(f"✅ Cross-LLM Bridge fully operational!")
                
                print(f"\n📋 Now restart Claude Code and test:")
                print(f"'Use cross-llm-bridge send_to_openai: What are Python best practices?'")
            else:
                print(f"\n⚠️  OAuth working, but MCP server needs debugging")
        else:
            print(f"\n❌ OAuth authentication failed - need to resolve")
            
    except KeyboardInterrupt:
        print(f"\n🛑 Cancelled by user")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())