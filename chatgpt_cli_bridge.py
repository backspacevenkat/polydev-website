#!/usr/bin/env python3
"""
Cross-LLM Bridge - ChatGPT CLI Wrapper MCP Server
Uses the same architecture as Cline's Claude Code integration
"""

import asyncio
import json
import os
import subprocess
import tempfile
from pathlib import Path
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import TextContent, Tool

app = Server("chatgpt-cli-bridge")

class ChatGPTCLIWrapper:
    def __init__(self):
        self.cli_path = os.path.join(os.path.dirname(__file__), "chatgpt_cli.py")
        
    async def run_chatgpt_process(self, messages, system_prompt=None, model="gpt-3.5-turbo"):
        """
        Run ChatGPT CLI process similar to how Cline runs Claude Code
        """
        try:
            # Prepare arguments (same pattern as Cline)
            args = ["python3", self.cli_path]
            
            if system_prompt:
                # For long system prompts, use temp file (like Cline does)
                if len(system_prompt) > 1000:  # Arbitrary threshold
                    with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as f:
                        f.write(system_prompt)
                        temp_file = f.name
                    args.extend(["--system-prompt-file", temp_file])
                else:
                    args.extend(["--system-prompt", system_prompt])
            
            args.extend([
                "--model", model,
                "--output-format", "stream-json",
                "--max-tokens", "4000",
                "-p"  # Prompt mode - read from stdin
            ])
            
            # Start the process (same pattern as Cline's execa)
            process = await asyncio.create_subprocess_exec(
                *args,
                stdin=asyncio.subprocess.PIPE,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            
            # Send messages as JSON to stdin (exactly like Cline does)
            messages_json = json.dumps(messages)
            stdout, stderr = await process.communicate(input=messages_json.encode())
            
            if process.returncode != 0:
                error_msg = stderr.decode() if stderr else "Unknown error"
                return f"❌ ChatGPT CLI Error: {error_msg}"
            
            # Parse the streamed response
            response_text = ""
            for line in stdout.decode().split('\n'):
                if line.strip():
                    try:
                        chunk = json.loads(line)
                        if chunk.get('type') == 'text':
                            response_text += chunk.get('text', '')
                        elif 'error' in chunk:
                            return f"❌ {chunk['error']}"
                    except json.JSONDecodeError:
                        continue
            
            return response_text or "No response received"
            
        except Exception as e:
            return f"❌ Error running ChatGPT CLI: {str(e)}"

# Global wrapper instance
chatgpt_wrapper = ChatGPTCLIWrapper()

@app.list_tools()
async def list_tools():
    return [
        Tool(
            name="setup_chatgpt_auth",
            description="Set up ChatGPT authentication (API key or session token)",
            inputSchema={
                "type": "object",
                "properties": {
                    "auth_type": {
                        "type": "string", 
                        "enum": ["api_key", "session_token"],
                        "description": "Authentication method"
                    },
                    "credential": {
                        "type": "string",
                        "description": "API key or session token"
                    }
                },
                "required": ["auth_type", "credential"]
            }
        ),
        Tool(
            name="send_to_chatgpt_cli",
            description="Send message to ChatGPT using CLI wrapper (like Cline's Claude Code integration)",
            inputSchema={
                "type": "object",
                "properties": {
                    "message": {"type": "string", "description": "Message to send to ChatGPT"},
                    "system_prompt": {"type": "string", "description": "Optional system prompt"},
                    "model": {
                        "type": "string", 
                        "default": "gpt-3.5-turbo",
                        "description": "ChatGPT model to use"
                    }
                },
                "required": ["message"]
            }
        ),
        Tool(
            name="check_chatgpt_cli_status",
            description="Check if ChatGPT CLI is set up and working",
            inputSchema={
                "type": "object",
                "properties": {}
            }
        )
    ]

@app.call_tool()
async def call_tool(name: str, arguments: dict):
    if name == "setup_chatgpt_auth":
        try:
            auth_type = arguments.get("auth_type")
            credential = arguments.get("credential")
            
            # Create config directory
            config_dir = os.path.expanduser("~/.config/chatgpt-cli")
            os.makedirs(config_dir, exist_ok=True)
            
            if auth_type == "api_key":
                if not credential.startswith('sk-'):
                    return [TextContent(type="text", text="❌ Invalid API key format. Should start with 'sk-'")]
                
                with open(f"{config_dir}/api_key", 'w') as f:
                    f.write(credential)
                
                # Test the API key
                test_response = await chatgpt_wrapper.run_chatgpt_process([
                    {"role": "user", "content": "Test - respond with: CLI_WORKING"}
                ])
                
                if "CLI_WORKING" in test_response:
                    return [TextContent(type="text", text="✅ ChatGPT API key configured successfully! CLI is working.")]
                else:
                    return [TextContent(type="text", text=f"⚠️ API key saved but test failed: {test_response}")]
                    
            elif auth_type == "session_token":
                with open(f"{config_dir}/session_token", 'w') as f:
                    f.write(credential)
                return [TextContent(type="text", text="✅ ChatGPT session token saved! (Note: Session token support is limited)")]
            
        except Exception as e:
            return [TextContent(type="text", text=f"❌ Setup error: {str(e)}")]
    
    elif name == "check_chatgpt_cli_status":
        try:
            # Check if CLI exists
            if not os.path.exists(chatgpt_wrapper.cli_path):
                return [TextContent(type="text", text="❌ ChatGPT CLI not found")]
            
            # Check authentication
            config_dir = os.path.expanduser("~/.config/chatgpt-cli")
            api_key_exists = os.path.exists(f"{config_dir}/api_key")
            session_token_exists = os.path.exists(f"{config_dir}/session_token")
            
            if not api_key_exists and not session_token_exists:
                return [TextContent(type="text", text="❌ No authentication configured. Use setup_chatgpt_auth tool first.")]
            
            auth_method = "API key" if api_key_exists else "Session token"
            return [TextContent(type="text", text=f"✅ ChatGPT CLI ready with {auth_method} authentication")]
            
        except Exception as e:
            return [TextContent(type="text", text=f"❌ Status check error: {str(e)}")]
    
    elif name == "send_to_chatgpt_cli":
        message = arguments.get("message", "")
        system_prompt = arguments.get("system_prompt")
        model = arguments.get("model", "gpt-3.5-turbo")
        
        if not message:
            return [TextContent(type="text", text="❌ Message is required")]
        
        # Format messages like Cline does
        messages = [{"role": "user", "content": message}]
        
        # Send to ChatGPT CLI (same pattern as Cline sending to Claude)
        response = await chatgpt_wrapper.run_chatgpt_process(
            messages=messages,
            system_prompt=system_prompt,
            model=model
        )
        
        return [TextContent(type="text", text=f"🤖 ChatGPT Response:\n{response}")]
    
    return [TextContent(type="text", text=f"❌ Unknown tool: {name}")]

async def main():
    async with stdio_server() as streams:
        await app.run(streams[0], streams[1], app.create_initialization_options())

if __name__ == "__main__":
    asyncio.run(main())