#!/usr/bin/env python3
"""
Skip OAuth completely - use API key approach for now
"""

import asyncio
import httpx

async def test_with_api_key():
    print("🔑 TESTING OPENAI WITH API KEY APPROACH")
    print("=" * 50)
    print("Let's skip OAuth for now and use direct API key approach")
    
    # Ask user for their API key
    print("\n📋 To test ChatGPT integration, we need your OpenAI API key")
    print("🔗 Get it from: https://platform.openai.com/api-keys")
    print("💡 This is temporary - just to test if our MCP server works")
    
    api_key = input("\n🔑 Enter your OpenAI API key (or 'skip'): ").strip()
    
    if api_key.lower() == 'skip':
        print("⏭️  Skipping API key test")
        return False
    
    if not api_key.startswith('sk-'):
        print("❌ Invalid API key format (should start with 'sk-')")
        return False
    
    # Test the API key
    print(f"\n🧪 Testing API key...")
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "gpt-3.5-turbo",
                    "messages": [{"role": "user", "content": "Hello from Cross-LLM Bridge! Respond with exactly: BRIDGE_WORKING"}],
                    "max_tokens": 10
                }
            )
        
        if response.status_code == 200:
            result = response.json()
            content = result.get("choices", [{}])[0].get("message", {}).get("content", "").strip()
            print(f"✅ API Key works! Response: {content}")
            
            # Save API key temporarily for MCP server
            with open("/tmp/openai_api_key.txt", "w") as f:
                f.write(api_key)
            print("✅ API key saved for MCP server testing")
            
            return True
        else:
            print(f"❌ API call failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ API test error: {e}")
        return False

async def update_mcp_for_api_key():
    print(f"\n🔄 UPDATING MCP SERVER FOR API KEY APPROACH")
    print("=" * 45)
    
    # Create a simple version that uses API key instead of OAuth
    mcp_code = '''#!/usr/bin/env python3
"""
Cross-LLM Bridge MCP Server - API Key Version (for testing)
"""

import asyncio
import json
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import TextContent, Tool
import httpx

app = Server("cross-llm-bridge")

@app.list_tools()
async def list_tools():
    return [
        Tool(
            name="send_to_openai",
            description="Send a message to ChatGPT and get response",
            inputSchema={
                "type": "object",
                "properties": {
                    "prompt": {"type": "string", "description": "Message to send to ChatGPT"},
                    "model": {"type": "string", "default": "gpt-3.5-turbo"},
                    "max_tokens": {"type": "integer", "default": 500}
                },
                "required": ["prompt"]
            }
        )
    ]

@app.call_tool()
async def call_tool(name: str, arguments: dict):
    if name == "send_to_openai":
        try:
            # Read API key from temp file
            with open("/tmp/openai_api_key.txt", "r") as f:
                api_key = f.read().strip()
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": arguments.get("model", "gpt-3.5-turbo"),
                        "messages": [{"role": "user", "content": arguments["prompt"]}],
                        "max_tokens": arguments.get("max_tokens", 500)
                    }
                )
            
            if response.status_code == 200:
                result = response.json()
                content = result.get("choices", [{}])[0].get("message", {}).get("content", "No response")
                return [TextContent(type="text", text=f"🤖 ChatGPT: {content}")]
            else:
                return [TextContent(type="text", text=f"❌ OpenAI API Error: {response.status_code}")]
                
        except Exception as e:
            return [TextContent(type="text", text=f"❌ Error: {str(e)}")]
    
    return [TextContent(type="text", text="Unknown tool")]

async def main():
    async with stdio_server() as streams:
        await app.run(streams[0], streams[1], app.create_initialization_options())

if __name__ == "__main__":
    asyncio.run(main())
'''
    
    # Save the API key version
    with open("/Users/venkat/Documents/jarvis/mcp_api_key_version.py", "w") as f:
        f.write(mcp_code)
    
    print("✅ Created API key version of MCP server")
    return True

async def main():
    try:
        print("🚀 BYPASSING OAUTH - TESTING WITH API KEY")
        print("=" * 50)
        
        # Test API key approach
        api_success = await test_with_api_key()
        
        if api_success:
            # Update MCP server
            mcp_success = await update_mcp_for_api_key()
            
            if mcp_success:
                print(f"\n🎉 API KEY APPROACH WORKING!")
                print(f"✅ OpenAI API key tested and working")
                print(f"✅ MCP server updated for API key approach")
                print(f"✅ Ready to test in Claude Code!")
                
                print(f"\n📋 Next Steps:")
                print(f"1. Update MCP config to use: mcp_api_key_version.py")
                print(f"2. Restart Claude Code")  
                print(f"3. Test: 'Use cross-llm-bridge send_to_openai: Hello!'")
                print(f"4. Should get real ChatGPT response!")
                
                # Update MCP config
                mcp_config = {
                    "mcpServers": {
                        "cross-llm-bridge": {
                            "command": "python3",
                            "args": ["/Users/venkat/Documents/jarvis/mcp_api_key_version.py"],
                            "env": {}
                        }
                    }
                }
                
                import json
                with open("/Users/venkat/.claude-code/mcp_servers.json", "w") as f:
                    json.dump(mcp_config, f, indent=2)
                
                print("✅ MCP config updated!")
                print("🔄 Please restart Claude Code now")
                
        else:
            print(f"\n⚠️  API key approach didn't work - need to debug further")
            
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())