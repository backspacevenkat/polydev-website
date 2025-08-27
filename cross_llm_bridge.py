#!/usr/bin/env python3
"""
Cross-LLM Bridge MCP Server
Enables bidirectional communication between Claude Code/CLI and ChatGPT/Codex CLI
using subscription-based authentication instead of API keys.
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
from mcp.server import Server
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

from auth_manager import SubscriptionAuthManager
from llm_communicator import LLMCommunicator


# Configuration
@dataclass
class ServerConfig:
    server_name: str = "cross-llm-bridge"
    server_version: str = "1.0.0"
    claude_session_timeout: int = 3600  # 1 hour
    chatgpt_session_timeout: int = 3600  # 1 hour
    max_concurrent_requests: int = 10
    

class LLMSession(BaseModel):
    session_id: str
    llm_type: str  # "claude" or "chatgpt"
    created_at: datetime
    last_used: datetime
    is_active: bool = True
    context_data: Dict[str, Any] = {}


class CrossLLMBridge:
    def __init__(self, config: ServerConfig):
        self.config = config
        self.sessions: Dict[str, LLMSession] = {}
        self.server = Server(config.server_name)
        self.auth_manager = SubscriptionAuthManager()
        self.communicator = LLMCommunicator(self.auth_manager)
        self.setup_handlers()
        
    def setup_handlers(self):
        """Setup MCP server handlers for tools and resources"""
        
        @self.server.list_tools()
        async def handle_list_tools() -> List[Tool]:
            """List available cross-LLM communication tools"""
            return [
                Tool(
                    name="send_to_claude",
                    description="Send a prompt to Claude and get response via subscription",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "prompt": {
                                "type": "string",
                                "description": "The prompt to send to Claude"
                            },
                            "context": {
                                "type": "string", 
                                "description": "Additional context or conversation history",
                                "default": ""
                            },
                            "session_id": {
                                "type": "string",
                                "description": "Optional session ID for continuity",
                                "default": ""
                            }
                        },
                        "required": ["prompt"]
                    }
                ),
                Tool(
                    name="send_to_chatgpt",
                    description="Send a prompt to ChatGPT and get response via subscription",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "prompt": {
                                "type": "string",
                                "description": "The prompt to send to ChatGPT"
                            },
                            "context": {
                                "type": "string",
                                "description": "Additional context or conversation history", 
                                "default": ""
                            },
                            "session_id": {
                                "type": "string",
                                "description": "Optional session ID for continuity",
                                "default": ""
                            }
                        },
                        "required": ["prompt"]
                    }
                ),
                Tool(
                    name="compare_responses",
                    description="Send same prompt to both Claude and ChatGPT and compare responses",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "prompt": {
                                "type": "string",
                                "description": "The prompt to send to both LLMs"
                            },
                            "analysis_focus": {
                                "type": "string",
                                "description": "What aspect to focus on when comparing (e.g., 'accuracy', 'creativity', 'code_quality')",
                                "default": "general"
                            }
                        },
                        "required": ["prompt"]
                    }
                ),
                Tool(
                    name="create_session",
                    description="Create a new session for persistent conversation with an LLM",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "llm_type": {
                                "type": "string",
                                "enum": ["claude", "chatgpt"],
                                "description": "Which LLM to create session for"
                            },
                            "initial_context": {
                                "type": "string",
                                "description": "Initial context for the session",
                                "default": ""
                            }
                        },
                        "required": ["llm_type"]
                    }
                ),
                Tool(
                    name="list_sessions",
                    description="List all active sessions",
                    inputSchema={
                        "type": "object",
                        "properties": {}
                    }
                )
            ]

        @self.server.call_tool()
        async def handle_call_tool(name: str, arguments: Dict[str, Any]) -> List[TextContent]:
            """Handle tool calls for cross-LLM communication"""
            
            if name == "send_to_claude":
                return await self._send_to_claude(
                    arguments.get("prompt"),
                    arguments.get("context", ""),
                    arguments.get("session_id", "")
                )
            
            elif name == "send_to_chatgpt":
                return await self._send_to_chatgpt(
                    arguments.get("prompt"),
                    arguments.get("context", ""),
                    arguments.get("session_id", "")
                )
            
            elif name == "compare_responses":
                return await self._compare_responses(
                    arguments.get("prompt"),
                    arguments.get("analysis_focus", "general")
                )
            
            elif name == "create_session":
                return await self._create_session(
                    arguments.get("llm_type"),
                    arguments.get("initial_context", "")
                )
            
            elif name == "list_sessions":
                return await self._list_sessions()
            
            else:
                return [TextContent(type="text", text=f"Unknown tool: {name}")]

        @self.server.list_resources()
        async def handle_list_resources() -> List[Resource]:
            """List available resources"""
            return [
                Resource(
                    uri="cross-llm://sessions",
                    name="Active Sessions",
                    description="List of active LLM sessions and their status",
                    mimeType="application/json"
                ),
                Resource(
                    uri="cross-llm://config",
                    name="Server Configuration", 
                    description="Current server configuration and capabilities",
                    mimeType="application/json"
                )
            ]

        @self.server.read_resource()
        async def handle_read_resource(uri: str) -> str:
            """Read resource content"""
            if uri == "cross-llm://sessions":
                return json.dumps({
                    "sessions": [
                        {
                            "session_id": session.session_id,
                            "llm_type": session.llm_type,
                            "created_at": session.created_at.isoformat(),
                            "last_used": session.last_used.isoformat(),
                            "is_active": session.is_active
                        }
                        for session in self.sessions.values()
                    ]
                }, indent=2)
            
            elif uri == "cross-llm://config":
                return json.dumps({
                    "server_name": self.config.server_name,
                    "server_version": self.config.server_version,
                    "timeouts": {
                        "claude_session": self.config.claude_session_timeout,
                        "chatgpt_session": self.config.chatgpt_session_timeout
                    },
                    "limits": {
                        "max_concurrent_requests": self.config.max_concurrent_requests
                    }
                }, indent=2)
            
            else:
                raise ValueError(f"Unknown resource: {uri}")

    async def _send_to_claude(self, prompt: str, context: str = "", session_id: str = "") -> List[TextContent]:
        """Send prompt to Claude via subscription authentication"""
        try:
            if not self.auth_manager.is_authenticated("claude"):
                return [TextContent(
                    type="text",
                    text="❌ Not authenticated with Claude. Please authenticate first using the CLI: python cli.py"
                )]
            
            # Use the real communicator
            response = await self.communicator.send_to_claude(prompt, context, session_id)
            
            return [TextContent(
                type="text", 
                text=f"Claude Response:\n{response}"
            )]
        except Exception as e:
            return [TextContent(type="text", text=f"Error communicating with Claude: {str(e)}")]

    async def _send_to_chatgpt(self, prompt: str, context: str = "", session_id: str = "") -> List[TextContent]:
        """Send prompt to ChatGPT via subscription authentication"""
        try:
            if not self.auth_manager.is_authenticated("chatgpt"):
                return [TextContent(
                    type="text",
                    text="❌ Not authenticated with ChatGPT. Please authenticate first using the CLI: python cli.py"
                )]
            
            # Use the real communicator
            response = await self.communicator.send_to_chatgpt(prompt, context, session_id)
            
            return [TextContent(
                type="text",
                text=f"ChatGPT Response:\n{response}"
            )]
        except Exception as e:
            return [TextContent(type="text", text=f"Error communicating with ChatGPT: {str(e)}")]

    async def _compare_responses(self, prompt: str, analysis_focus: str = "general") -> List[TextContent]:
        """Send prompt to both LLMs and compare responses"""
        try:
            # Check authentication status
            auth_status = self.auth_manager.get_status()
            
            if not auth_status["claude"]["authenticated"] and not auth_status["chatgpt"]["authenticated"]:
                return [TextContent(
                    type="text",
                    text="❌ Not authenticated with any LLM. Please authenticate first using the CLI: python cli.py"
                )]
            
            # Use the real communicator for comparison
            comparison = await self.communicator.compare_responses(prompt, analysis_focus)
            
            return [TextContent(
                type="text",
                text=f"Cross-LLM Comparison Results:\n\n"
                     f"=== CLAUDE RESPONSE ===\n{comparison['claude_response']}\n\n"
                     f"=== CHATGPT RESPONSE ===\n{comparison['chatgpt_response']}\n\n"
                     f"=== ANALYSIS ({analysis_focus.upper()}) ===\n{comparison['analysis']}"
            )]
        except Exception as e:
            return [TextContent(type="text", text=f"Error in comparison: {str(e)}")]

    async def _create_session(self, llm_type: str, initial_context: str = "") -> List[TextContent]:
        """Create a new LLM session"""
        import uuid
        
        session_id = str(uuid.uuid4())[:8]
        now = datetime.now()
        
        session = LLMSession(
            session_id=session_id,
            llm_type=llm_type,
            created_at=now,
            last_used=now,
            context_data={"initial_context": initial_context}
        )
        
        self.sessions[session_id] = session
        
        return [TextContent(
            type="text",
            text=f"Created {llm_type} session: {session_id}\n"
                 f"Session will timeout after {self.config.claude_session_timeout if llm_type == 'claude' else self.config.chatgpt_session_timeout} seconds of inactivity."
        )]

    async def _list_sessions(self) -> List[TextContent]:
        """List all active sessions"""
        if not self.sessions:
            return [TextContent(type="text", text="No active sessions.")]
        
        session_list = []
        for session in self.sessions.values():
            age = datetime.now() - session.created_at
            session_list.append(
                f"• {session.session_id} ({session.llm_type}) - Created {age.seconds//3600}h {(age.seconds//60)%60}m ago"
            )
        
        return [TextContent(
            type="text",
            text=f"Active Sessions ({len(self.sessions)}):\n" + "\n".join(session_list)
        )]

    async def _mock_claude_response(self, prompt: str, context: str = "") -> str:
        """Mock Claude response for testing"""
        await asyncio.sleep(0.5)  # Simulate API delay
        return f"[Claude Mock] I understand you're asking: '{prompt[:50]}...' " \
               f"This is a placeholder response. In the full implementation, " \
               f"I would process your request using Claude's subscription interface."

    async def _mock_chatgpt_response(self, prompt: str, context: str = "") -> str:
        """Mock ChatGPT response for testing"""
        await asyncio.sleep(0.7)  # Simulate API delay
        return f"[ChatGPT Mock] Thanks for the question about: '{prompt[:50]}...' " \
               f"This is a mock response. The real implementation will connect " \
               f"to ChatGPT via your subscription credentials."

    def _analyze_responses(self, claude_resp: str, chatgpt_resp: str, focus: str) -> str:
        """Analyze and compare responses from both LLMs"""
        analysis = {
            "general": "Both responses show different approaches to the question.",
            "accuracy": "Need to implement fact-checking logic for accuracy comparison.",
            "creativity": "Responses show varying levels of creative interpretation.", 
            "code_quality": "Code structure and best practices analysis pending."
        }
        
        return analysis.get(focus, "Analysis type not implemented yet.") + \
               f"\n\nClaude response length: {len(claude_resp)} chars\n" \
               f"ChatGPT response length: {len(chatgpt_resp)} chars"

    async def run(self):
        """Run the MCP server"""
        async with stdio_server() as (read_stream, write_stream):
            await self.server.run(
                read_stream,
                write_stream,
                InitializationOptions(
                    server_name=self.config.server_name,
                    server_version=self.config.server_version,
                    capabilities=self.server.get_capabilities(
                        notification_options=None,
                        experimental_capabilities=None,
                    ),
                ),
            )


async def main():
    """Main entry point"""
    logging.basicConfig(level=logging.INFO)
    
    config = ServerConfig()
    bridge = CrossLLMBridge(config)
    
    print(f"Starting {config.server_name} v{config.server_version}")
    print("This server enables cross-LLM communication between Claude and ChatGPT")
    print("using subscription-based authentication.\n")
    
    await bridge.run()


if __name__ == "__main__":
    asyncio.run(main())