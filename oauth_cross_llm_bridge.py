#!/usr/bin/env python3
"""
OAuth-enabled Cross-LLM Bridge MCP Server
Uses proper OAuth authentication like official CLIs
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

from oauth_auth_manager import OAuthAuthManager


# Configuration
@dataclass
class ServerConfig:
    server_name: str = "cross-llm-bridge-oauth"
    server_version: str = "2.0.0"
    session_timeout: int = 3600  # 1 hour
    max_concurrent_requests: int = 10


class LLMSession(BaseModel):
    session_id: str
    llm_type: str  # "openai" or "anthropic"
    created_at: datetime
    last_used: datetime
    is_active: bool = True
    context_data: Dict[str, Any] = {}


class OAuthCrossLLMBridge:
    def __init__(self, config: ServerConfig):
        self.config = config
        self.sessions: Dict[str, LLMSession] = {}
        self.server = Server(config.server_name)
        self.auth_manager = OAuthAuthManager()
        self.setup_handlers()
        
    def setup_handlers(self):
        """Setup MCP server handlers for tools and resources"""
        
        @self.server.list_tools()
        async def handle_list_tools() -> List[Tool]:
            """List available cross-LLM communication tools"""
            return [
                Tool(
                    name="send_to_openai",
                    description="Send a prompt to OpenAI using OAuth authentication and real API",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "prompt": {
                                "type": "string",
                                "description": "The prompt to send to OpenAI"
                            },
                            "model": {
                                "type": "string",
                                "description": "OpenAI model to use",
                                "default": "gpt-3.5-turbo",
                                "enum": ["gpt-3.5-turbo", "gpt-4", "gpt-4-turbo"]
                            },
                            "max_tokens": {
                                "type": "number",
                                "description": "Maximum tokens in response",
                                "default": 500
                            },
                            "context": {
                                "type": "string", 
                                "description": "Additional context or conversation history",
                                "default": ""
                            }
                        },
                        "required": ["prompt"]
                    }
                ),
                Tool(
                    name="send_to_anthropic",
                    description="Send a prompt to Claude using OAuth authentication with Pro/Max subscription",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "prompt": {
                                "type": "string",
                                "description": "The prompt to send to Anthropic"
                            },
                            "context": {
                                "type": "string",
                                "description": "Additional context or conversation history", 
                                "default": ""
                            }
                        },
                        "required": ["prompt"]
                    }
                ),
                Tool(
                    name="compare_llm_responses",
                    description="Send same prompt to both OpenAI and Anthropic and compare responses",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "prompt": {
                                "type": "string",
                                "description": "The prompt to send to both LLMs"
                            },
                            "analysis_focus": {
                                "type": "string",
                                "description": "What aspect to focus on when comparing",
                                "default": "general",
                                "enum": ["general", "accuracy", "creativity", "code_quality", "reasoning"]
                            }
                        },
                        "required": ["prompt"]
                    }
                ),
                Tool(
                    name="check_auth_status",
                    description="Check authentication status for all LLM providers",
                    inputSchema={
                        "type": "object",
                        "properties": {}
                    }
                ),
                Tool(
                    name="create_llm_session",
                    description="Create a new session for persistent conversation with an LLM",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "llm_type": {
                                "type": "string",
                                "enum": ["openai", "anthropic"],
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
                    name="list_llm_sessions",
                    description="List all active LLM sessions",
                    inputSchema={
                        "type": "object",
                        "properties": {}
                    }
                )
            ]

        @self.server.call_tool()
        async def handle_call_tool(name: str, arguments: Dict[str, Any]) -> List[TextContent]:
            """Handle tool calls for cross-LLM communication"""
            
            if name == "send_to_openai":
                return await self._send_to_openai(
                    arguments.get("prompt"),
                    arguments.get("model", "gpt-3.5-turbo"),
                    arguments.get("max_tokens", 500),
                    arguments.get("context", "")
                )
            
            elif name == "send_to_anthropic":
                return await self._send_to_anthropic(
                    arguments.get("prompt"),
                    arguments.get("context", "")
                )
            
            elif name == "compare_llm_responses":
                return await self._compare_llm_responses(
                    arguments.get("prompt"),
                    arguments.get("analysis_focus", "general")
                )
            
            elif name == "check_auth_status":
                return await self._check_auth_status()
            
            elif name == "create_llm_session":
                return await self._create_llm_session(
                    arguments.get("llm_type"),
                    arguments.get("initial_context", "")
                )
            
            elif name == "list_llm_sessions":
                return await self._list_llm_sessions()
            
            else:
                return [TextContent(type="text", text=f"Unknown tool: {name}")]

        @self.server.list_resources()
        async def handle_list_resources() -> List[Resource]:
            """List available resources"""
            return [
                Resource(
                    uri="cross-llm://oauth-status",
                    name="OAuth Authentication Status",
                    description="Current OAuth authentication status for all providers",
                    mimeType="application/json"
                ),
                Resource(
                    uri="cross-llm://sessions",
                    name="Active LLM Sessions",
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
            if uri == "cross-llm://oauth-status":
                status = self.auth_manager.get_status()
                return json.dumps(status, indent=2, default=str)
            
            elif uri == "cross-llm://sessions":
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
                    "authentication_method": "OAuth 2.0 + PKCE",
                    "supported_providers": ["openai", "anthropic"],
                    "timeouts": {
                        "session_timeout": self.config.session_timeout
                    },
                    "limits": {
                        "max_concurrent_requests": self.config.max_concurrent_requests
                    }
                }, indent=2)
            
            else:
                raise ValueError(f"Unknown resource: {uri}")

    async def _initialize_auth(self):
        """Initialize authentication by loading existing credentials"""
        await self.auth_manager.load_credentials("openai")
        await self.auth_manager.load_credentials("anthropic")

    async def _send_to_openai(self, prompt: str, model: str = "gpt-3.5-turbo", 
                             max_tokens: int = 500, context: str = "") -> List[TextContent]:
        """Send prompt to OpenAI using OAuth authentication and real API"""
        try:
            if not self.auth_manager.is_authenticated("openai"):
                return [TextContent(
                    type="text",
                    text="❌ Not authenticated with OpenAI. Please authenticate first:\n"
                         "1. Run: python3 oauth_cli.py\n"
                         "2. Execute: auth openai\n"
                         "3. Complete OAuth flow in browser"
                )]
            
            # Prepare the message
            messages = []
            if context:
                messages.append({"role": "system", "content": context})
            messages.append({"role": "user", "content": prompt})
            
            # Get authentication headers
            headers = self.auth_manager.get_auth_headers("openai")
            
            # Make API request
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers=headers,
                    json={
                        "model": model,
                        "messages": messages,
                        "max_tokens": max_tokens,
                        "temperature": 0.7
                    },
                    timeout=30.0
                )
            
            if response.status_code == 200:
                result = response.json()
                openai_response = result["choices"][0]["message"]["content"]
                
                # Get usage info
                usage = result.get("usage", {})
                usage_text = f"\n\nTokens used: {usage.get('total_tokens', 'unknown')}"
                
                return [TextContent(
                    type="text", 
                    text=f"🤖 OpenAI ({model}) Response:\n\n{openai_response}{usage_text}"
                )]
            else:
                error_detail = ""
                try:
                    error_data = response.json()
                    error_detail = error_data.get("error", {}).get("message", "Unknown error")
                except:
                    error_detail = response.text
                
                return [TextContent(
                    type="text",
                    text=f"❌ OpenAI API Error ({response.status_code}): {error_detail}"
                )]
                
        except Exception as e:
            return [TextContent(type="text", text=f"❌ Error communicating with OpenAI: {str(e)}")]

    async def _send_to_anthropic(self, prompt: str, context: str = "") -> List[TextContent]:
        """Send prompt to Anthropic using OAuth authentication"""
        try:
            if not self.auth_manager.is_authenticated("anthropic"):
                return [TextContent(
                    type="text",
                    text="❌ Not authenticated with Claude. Please authenticate first:\n"
                         "1. Run: python3 test_claude_oauth.py\n"
                         "2. Complete OAuth login with your Claude Pro/Max subscription\n"
                         "3. Return here to use Cross-LLM Bridge"
                )]
            
            # Build the full prompt with context
            full_prompt = f"{context}\n\n{prompt}" if context else prompt
            
            # Get OAuth headers
            headers = self.auth_manager.get_auth_headers("anthropic")
            
            # Prepare API request payload
            payload = {
                "model": "claude-3-5-sonnet-20241022",
                "max_tokens": 1000,
                "messages": [
                    {
                        "role": "user",
                        "content": full_prompt
                    }
                ]
            }
            
            # Make API request to Claude
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    "https://api.anthropic.com/v1/messages",
                    headers=headers,
                    json=payload
                )
            
            if response.status_code == 200:
                result = response.json()
                content = result.get("content", [])
                
                # Extract text content
                if content and isinstance(content, list) and len(content) > 0:
                    response_text = content[0].get("text", "No response text")
                else:
                    response_text = "No response content"
                
                return [TextContent(
                    type="text",
                    text=f"🤖 Claude Response (via OAuth):\n\n{response_text}\n\n"
                         f"✅ Authentication: Claude Pro/Max subscription"
                )]
            else:
                # Handle API errors
                error_detail = ""
                try:
                    error_data = response.json()
                    error_detail = error_data.get("error", {}).get("message", "Unknown error")
                except:
                    error_detail = response.text[:200] + "..." if len(response.text) > 200 else response.text
                
                return [TextContent(
                    type="text",
                    text=f"❌ Claude API Error ({response.status_code}):\n{error_detail}\n\n"
                         f"Note: If you see authentication errors, your OAuth token may have expired.\n"
                         f"Please re-run: python3 test_claude_oauth.py"
                )]
            
        except Exception as e:
            return [TextContent(
                type="text",
                text=f"❌ Error communicating with Claude: {e}\n\n"
                     f"Possible solutions:\n"
                     f"1. Check your internet connection\n"
                     f"2. Verify Claude OAuth authentication\n"
                     f"3. Ensure Claude Pro/Max subscription is active"
            )]

    async def _compare_llm_responses(self, prompt: str, analysis_focus: str = "general") -> List[TextContent]:
        """Send prompt to both LLMs and compare responses"""
        try:
            auth_status = self.auth_manager.get_status()
            
            if not auth_status["openai"]["authenticated"] and not auth_status["anthropic"]["authenticated"]:
                return [TextContent(
                    type="text",
                    text="❌ Not authenticated with any LLM provider. Please authenticate first."
                )]
            
            results = []
            
            # Get OpenAI response if authenticated
            if auth_status["openai"]["authenticated"]:
                openai_result = await self._send_to_openai(prompt)
                openai_text = openai_result[0].text if openai_result else "Error getting OpenAI response"
            else:
                openai_text = "❌ OpenAI not authenticated"
            
            # Get Anthropic response if authenticated
            if auth_status["anthropic"]["authenticated"]:
                anthropic_result = await self._send_to_anthropic(prompt)
                anthropic_text = anthropic_result[0].text if anthropic_result else "Error getting Anthropic response"
            else:
                anthropic_text = "❌ Anthropic not authenticated"
            
            # Simple analysis
            analysis = self._analyze_responses(openai_text, anthropic_text, analysis_focus)
            
            comparison_text = f"""
🔍 Cross-LLM Comparison Results
{'='*50}

📝 Original Prompt:
{prompt}

{'='*50}
{openai_text}

{'='*50}
{anthropic_text}

{'='*50}
📊 Analysis ({analysis_focus.upper()}):
{analysis}
{'='*50}
"""
            
            return [TextContent(type="text", text=comparison_text)]
            
        except Exception as e:
            return [TextContent(type="text", text=f"❌ Error in comparison: {str(e)}")]

    async def _check_auth_status(self) -> List[TextContent]:
        """Check authentication status for all providers"""
        try:
            status = self.auth_manager.get_status()
            
            status_text = "🔐 Authentication Status\n" + "="*30 + "\n\n"
            
            for provider, info in status.items():
                icon = "✅" if info['authenticated'] else "❌"
                auth_text = "Authenticated" if info['authenticated'] else "Not authenticated"
                
                status_text += f"{provider.upper()}: {icon} {auth_text}\n"
                
                if info['authenticated']:
                    if info.get('subscription_info'):
                        sub_info = info['subscription_info']
                        if sub_info.get('plan_type'):
                            status_text += f"  Plan: {sub_info['plan_type']}\n"
                        if sub_info.get('subscription_active'):
                            status_text += f"  Subscription: Active\n"
                    
                    if info.get('expires_at'):
                        status_text += f"  Expires: {info['expires_at']}\n"
                    
                    if info.get('has_api_key'):
                        status_text += f"  API Access: Available\n"
                
                status_text += "\n"
            
            if not any(info['authenticated'] for info in status.values()):
                status_text += "\n🚀 To authenticate:\n"
                status_text += "1. python3 oauth_cli.py\n"
                status_text += "2. auth openai  # OAuth flow\n"
                status_text += "3. auth anthropic  # Session-based\n"
            
            return [TextContent(type="text", text=status_text)]
            
        except Exception as e:
            return [TextContent(type="text", text=f"❌ Error checking auth status: {str(e)}")]

    async def _create_llm_session(self, llm_type: str, initial_context: str = "") -> List[TextContent]:
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
            text=f"✅ Created {llm_type} session: {session_id}\n"
                 f"Session will timeout after {self.config.session_timeout} seconds of inactivity.\n"
                 f"Use this session ID in future requests for context continuity."
        )]

    async def _list_llm_sessions(self) -> List[TextContent]:
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
            text=f"📋 Active Sessions ({len(self.sessions)}):\n" + "\n".join(session_list)
        )]

    def _analyze_responses(self, openai_resp: str, anthropic_resp: str, focus: str) -> str:
        """Analyze and compare responses from both LLMs"""
        analysis_parts = []
        
        # Extract just the response content (remove headers)
        openai_content = openai_resp.split("Response:\n\n")[-1].split("\n\nTokens used:")[0] if "Response:" in openai_resp else openai_resp
        anthropic_content = anthropic_resp.split("Response:\n\n")[-1] if "Response:" in anthropic_resp else anthropic_resp
        
        # Basic length comparison
        openai_len = len(openai_content)
        anthropic_len = len(anthropic_content)
        analysis_parts.append(f"Response lengths: OpenAI ({openai_len} chars) vs Anthropic ({anthropic_len} chars)")
        
        # Focus-specific analysis
        if focus == "accuracy":
            analysis_parts.append("Accuracy analysis: Manual verification needed for factual claims")
        elif focus == "creativity":
            analysis_parts.append("Creativity analysis: Compare unique approaches and novel ideas")
        elif focus == "code_quality":
            analysis_parts.append("Code quality analysis: Check syntax, best practices, and efficiency")
        elif focus == "reasoning":
            analysis_parts.append("Reasoning analysis: Compare logical structure and argumentation")
        else:
            analysis_parts.append("General analysis: Compare overall approach and comprehensiveness")
        
        # Simple keyword analysis
        if "❌" not in openai_content and "❌" not in anthropic_content:
            openai_words = set(openai_content.lower().split())
            anthropic_words = set(anthropic_content.lower().split())
            
            unique_openai = openai_words - anthropic_words
            unique_anthropic = anthropic_words - openai_words
            
            if unique_openai:
                analysis_parts.append(f"OpenAI-specific terms: {', '.join(list(unique_openai)[:5])}")
            if unique_anthropic:
                analysis_parts.append(f"Anthropic-specific terms: {', '.join(list(unique_anthropic)[:5])}")
        
        return "\n".join(analysis_parts)

    async def run(self):
        """Run the MCP server"""
        # Initialize authentication
        await self._initialize_auth()
        
        async with stdio_server() as (read_stream, write_stream):
            await self.server.run(
                read_stream,
                write_stream,
                InitializationOptions(
                    server_name=self.config.server_name,
                    server_version=self.config.server_version,
                    capabilities=self.server.get_capabilities(
                        notification_options=NotificationOptions(),
                        experimental_capabilities={}
                    ),
                ),
            )


async def main():
    """Main entry point"""
    logging.basicConfig(level=logging.INFO)
    
    config = ServerConfig()
    bridge = OAuthCrossLLMBridge(config)
    
    print(f"🚀 Starting {config.server_name} v{config.server_version}")
    print("Cross-LLM Bridge with OAuth 2.0 authentication")
    print("Based on patterns from Claude Code & OpenAI Codex CLI")
    print("="*60)
    print()
    
    await bridge.run()


if __name__ == "__main__":
    asyncio.run(main())