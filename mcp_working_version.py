#!/usr/bin/env python3
"""
Cross-LLM Bridge MCP Server - Working Version
This version bypasses OAuth issues and provides a clear path to test real ChatGPT integration
"""

import asyncio
import json
import os
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
            description="Send a message to ChatGPT (requires API key setup)",
            inputSchema={
                "type": "object",
                "properties": {
                    "prompt": {"type": "string", "description": "Message to send to ChatGPT"},
                    "model": {"type": "string", "default": "gpt-3.5-turbo"},
                    "max_tokens": {"type": "integer", "default": 500}
                },
                "required": ["prompt"]
            }
        ),
        Tool(
            name="setup_openai_key", 
            description="Set up OpenAI API key for real ChatGPT responses",
            inputSchema={
                "type": "object",
                "properties": {
                    "api_key": {"type": "string", "description": "Your OpenAI API key (starts with sk-)"}
                },
                "required": ["api_key"]
            }
        ),
        Tool(
            name="test_connection",
            description="Test if ChatGPT connection is working",
            inputSchema={
                "type": "object",
                "properties": {}
            }
        )
    ]

@app.call_tool()
async def call_tool(name: str, arguments: dict):
    if name == "setup_openai_key":
        try:
            api_key = arguments.get("api_key", "").strip()
            if not api_key.startswith("sk-"):
                return [TextContent(type="text", text="❌ Invalid API key format. Should start with 'sk-'")]
            
            # Save API key
            os.makedirs("/tmp/cross_llm_bridge", exist_ok=True)
            with open("/tmp/cross_llm_bridge/openai_key.txt", "w") as f:
                f.write(api_key)
            
            # Test the key immediately
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "gpt-3.5-turbo",
                        "messages": [{"role": "user", "content": "Test connection - respond with: CONNECTION_SUCCESS"}],
                        "max_tokens": 10
                    }
                )
            
            if response.status_code == 200:
                return [TextContent(type="text", text="✅ OpenAI API key set up successfully! You can now use send_to_openai tool.")]
            else:
                return [TextContent(type="text", text=f"❌ API key test failed: {response.status_code}. Please check your key.")]
                
        except Exception as e:
            return [TextContent(type="text", text=f"❌ Setup error: {str(e)}")]
    
    elif name == "test_connection":
        try:
            # Check if API key exists
            key_file = "/tmp/cross_llm_bridge/openai_key.txt"
            if not os.path.exists(key_file):
                return [TextContent(type="text", text="❌ No API key found. Use setup_openai_key tool first.")]
            
            with open(key_file, "r") as f:
                api_key = f.read().strip()
            
            # Test connection
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "gpt-3.5-turbo",
                        "messages": [{"role": "user", "content": "Connection test - say 'BRIDGE WORKING'"}],
                        "max_tokens": 10
                    }
                )
            
            if response.status_code == 200:
                result = response.json()
                content = result.get("choices", [{}])[0].get("message", {}).get("content", "")
                return [TextContent(type="text", text=f"✅ Connection working! ChatGPT responded: {content}")]
            else:
                return [TextContent(type="text", text=f"❌ Connection test failed: {response.status_code}")]
                
        except Exception as e:
            return [TextContent(type="text", text=f"❌ Test error: {str(e)}")]
    
    elif name == "send_to_openai":
        try:
            # Check if API key exists
            key_file = "/tmp/cross_llm_bridge/openai_key.txt"
            if not os.path.exists(key_file):
                return [TextContent(type="text", text="❌ No API key found. Use setup_openai_key tool first to set up your OpenAI API key.")]
            
            with open(key_file, "r") as f:
                api_key = f.read().strip()
            
            # Make API call
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
                return [TextContent(type="text", text=f"🤖 ChatGPT Response:\n{content}")]
            else:
                error_text = response.text
                return [TextContent(type="text", text=f"❌ OpenAI API Error ({response.status_code}): {error_text}")]
                
        except Exception as e:
            return [TextContent(type="text", text=f"❌ Error connecting to ChatGPT: {str(e)}")]
    
    return [TextContent(type="text", text=f"❌ Unknown tool: {name}")]

async def main():
    async with stdio_server() as streams:
        await app.run(streams[0], streams[1], app.create_initialization_options())

if __name__ == "__main__":
    asyncio.run(main())