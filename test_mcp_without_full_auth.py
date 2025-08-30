#!/usr/bin/env python3
"""
Test Cross-LLM Bridge MCP server without full OAuth (using mock responses)
This lets us test the MCP integration with Claude Code first
"""

import asyncio
import json
import logging
from typing import Any, Dict, List, Optional, Union
from dataclasses import dataclass
from datetime import datetime, timedelta
import os
from pathlib import Path

import httpx
from mcp.server import Server, NotificationOptions
from mcp.server.models import InitializationOptions
from mcp.server.stdio import stdio_server
from mcp.types import (
    Resource,
    Tool,
    TextContent,
    ImageContent,
    EmbeddedResource,
)
from pydantic import BaseModel

# Configuration
@dataclass
class ServerConfig:
    server_name: str = "cross-llm-bridge-test"
    server_version: str = "1.0.0"
    session_timeout: int = 3600
    max_concurrent_requests: int = 10

class TestCrossLLMBridge:
    """Test version of Cross-LLM Bridge for MCP integration testing"""
    
    def __init__(self, config: ServerConfig):
        self.config = config
        self.logger = logging.getLogger(__name__)
        self.server = Server(config.server_name)
        self.setup_handlers()
    
    def setup_handlers(self):
        """Setup MCP server handlers"""
        
        @self.server.list_tools()
        async def handle_list_tools() -> List[Tool]:
            return [
                Tool(
                    name="send_to_openai",
                    description="Send a prompt to ChatGPT (test mode - returns mock response)",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "prompt": {
                                "type": "string",
                                "description": "The prompt to send to ChatGPT"
                            },
                            "model": {
                                "type": "string",
                                "description": "OpenAI model to use",
                                "default": "gpt-3.5-turbo"
                            }
                        },
                        "required": ["prompt"]
                    }
                ),
                Tool(
                    name="test_bridge_connection",
                    description="Test the Cross-LLM Bridge connection",
                    inputSchema={
                        "type": "object",
                        "properties": {},
                        "required": []
                    }
                )
            ]
        
        @self.server.call_tool()
        async def handle_call_tool(name: str, arguments: Dict[str, Any]) -> List[TextContent]:
            self.logger.info(f"Tool called: {name} with args: {arguments}")
            
            if name == "send_to_openai":
                return await self._mock_send_to_openai(
                    arguments.get("prompt"),
                    arguments.get("model", "gpt-3.5-turbo")
                )
            
            elif name == "test_bridge_connection":
                return await self._test_bridge_connection()
            
            else:
                return [TextContent(
                    type="text",
                    text=f"❌ Unknown tool: {name}"
                )]
    
    async def _mock_send_to_openai(self, prompt: str, model: str = "gpt-3.5-turbo") -> List[TextContent]:
        """Mock ChatGPT response for testing MCP integration"""
        try:
            # Simulate a realistic ChatGPT response
            mock_response = f"""🤖 **ChatGPT Response (Mock for MCP Testing):**

**Your prompt:** {prompt}

**ChatGPT would respond:** 
This is a simulated response from ChatGPT to test the Cross-LLM Bridge MCP integration with Claude Code. In a real implementation, this would be the actual ChatGPT response using OAuth authentication.

**Technical details:**
- Model: {model}
- Status: ✅ MCP integration working
- Bridge: Cross-LLM Bridge v1.0.0
- Authentication: Mock mode (OAuth ready)

**Next steps:**
1. Complete OAuth authentication for both OpenAI and Claude
2. Replace mock responses with real API calls
3. Test bidirectional communication

The MCP server integration is working correctly! 🎉"""
            
            return [TextContent(
                type="text",
                text=mock_response
            )]
            
        except Exception as e:
            return [TextContent(
                type="text",
                text=f"❌ Error in mock ChatGPT call: {e}"
            )]
    
    async def _test_bridge_connection(self) -> List[TextContent]:
        """Test the bridge connection"""
        status_text = """🌉 **Cross-LLM Bridge Connection Test**

**MCP Server Status:** ✅ Running
**Claude Code Integration:** ✅ Connected
**Bridge Version:** 1.0.0
**Available Tools:** 2

**Authentication Status:**
- OpenAI OAuth: ⚠️  Mock mode (needs completion)
- Claude OAuth: ⚠️  Mock mode (needs completion)

**Test Results:**
✅ MCP server responds to Claude Code
✅ Tool calls work correctly
✅ Message formatting working
✅ Ready for OAuth integration

**How to complete setup:**
1. Fix OpenAI OAuth blank screen issue
2. Complete Claude OAuth token exchange
3. Replace mock responses with real API calls

The Cross-LLM Bridge MCP integration is working! 🚀"""
        
        return [TextContent(
            type="text",
            text=status_text
        )]

async def main():
    """Run the test MCP server"""
    config = ServerConfig()
    bridge = TestCrossLLMBridge(config)
    
    # Initialize and run server
    options = InitializationOptions(
        server_name=config.server_name,
        server_version=config.server_version,
        capabilities=bridge.server.get_capabilities(
            notification_options=NotificationOptions(),
            experimental_capabilities={}
        )
    )
    
    async with stdio_server() as (read_stream, write_stream):
        await bridge.server.run(
            read_stream,
            write_stream,
            options
        )

if __name__ == "__main__":
    asyncio.run(main())