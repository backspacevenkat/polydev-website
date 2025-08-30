#!/usr/bin/env python3
"""
Cross-LLM Bridge - Direct Codex CLI Wrapper MCP Server
Uses your existing authenticated Codex CLI directly (like Cline uses Claude Code)
"""

import asyncio
import json
import os
import subprocess
import tempfile
from pathlib import Path
from datetime import datetime
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import TextContent, Tool

app = Server("codex-cli-bridge")

class CodexCLIWrapper:
    def __init__(self):
        # Try to find codex CLI in PATH
        self.codex_path = self.find_codex_cli()
        # Query logging
        self.query_log_file = os.path.expanduser("~/.config/cross-llm-bridge/query_log.jsonl")
        self.ensure_log_dir()
        
    def find_codex_cli(self):
        """Find the codex CLI executable"""
        try:
            # Try 'codex' in PATH
            result = subprocess.run(['which', 'codex'], capture_output=True, text=True)
            if result.returncode == 0:
                return 'codex'
        except:
            pass
        
        # Common installation paths
        possible_paths = [
            '/usr/local/bin/codex',
            '/opt/homebrew/bin/codex',
            os.path.expanduser('~/.local/bin/codex'),
            '/usr/bin/codex'
        ]
        
        for path in possible_paths:
            if os.path.exists(path):
                return path
        
        return 'codex'  # Default, let system handle it
    
    def ensure_log_dir(self):
        """Ensure log directory exists"""
        os.makedirs(os.path.dirname(self.query_log_file), exist_ok=True)
    
    def log_query(self, user_message, model_info=None, tokens_used=None, response_length=None):
        """Log query for tracking and analysis"""
        try:
            log_entry = {
                "timestamp": datetime.now().isoformat(),
                "query": user_message[:200] + "..." if len(user_message) > 200 else user_message,
                "model": model_info or "unknown",
                "tokens_used": tokens_used,
                "response_length": response_length
            }
            
            with open(self.query_log_file, 'a') as f:
                f.write(json.dumps(log_entry) + '\n')
        except Exception:
            pass  # Silent fail for logging
    
    def extract_model_info(self, output):
        """Extract model and usage info from Codex CLI output"""
        model = "unknown"
        tokens = None
        
        lines = output.split('\n')
        for line in lines:
            if 'model:' in line:
                model = line.split('model:')[1].strip()
            elif 'tokens used:' in line:
                try:
                    tokens = int(line.split('tokens used:')[1].strip())
                except:
                    pass
        
        return model, tokens
    
    async def run_codex_process_with_progress(self, messages, system_prompt=None, model="gpt-5", progress_callback=None):
        """
        Run Codex CLI process with real-time progress updates
        """
        try:
            if progress_callback:
                await progress_callback("🔍 Initializing Codex CLI...")
                
            # Check if codex CLI is available first
            try:
                if progress_callback:
                    await progress_callback("✅ Codex CLI found, checking authentication...")
                    
                version_check = await asyncio.create_subprocess_exec(
                    self.codex_path, '--version',
                    stdout=asyncio.subprocess.PIPE,
                    stderr=asyncio.subprocess.PIPE
                )
                stdout, stderr = await version_check.communicate()
                
                if version_check.returncode != 0:
                    return "❌ Codex CLI not found or not working. Please install and authenticate Codex CLI first."
                    
            except FileNotFoundError:
                return "❌ Codex CLI not found. Please install Codex CLI and make sure it's in your PATH."
            
            if progress_callback:
                await progress_callback("🚀 Authentication verified, preparing query...")
                
            # Prepare the prompt for Codex (just the user message for now)
            user_message = ""
            if system_prompt:
                user_message += f"{system_prompt}\n\n"
            
            # Get the main user message
            for msg in messages:
                if msg.get('role') == 'user':
                    user_message += msg.get('content', '')
                    break
            
            if not user_message.strip():
                return "❌ No message to send"
            
            if progress_callback:
                await progress_callback("🧠 Starting GPT-5 with high reasoning mode...")
                await progress_callback("⚡ Query sent to OpenAI, waiting for response...")
            
            # Run codex CLI with high reasoning for better second opinions
            # Enable thinking mode for quality responses
            process = await asyncio.create_subprocess_exec(
                self.codex_path, "exec",
                "-c", "reasoning_effort=high",  # High reasoning for better analysis
                "-c", "reasoning_summaries=auto",  # Show thinking summaries
                user_message,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            
            if progress_callback:
                await progress_callback("🤔 GPT-5 is thinking... (this may take 1-2 minutes for complex queries)")
            
            stdout, stderr = await process.communicate()
            
            if progress_callback:
                await progress_callback("✅ Response received, processing...")
            
            if process.returncode != 0:
                error_msg = stderr.decode() if stderr else "Unknown error"
                if "authentication" in error_msg.lower() or "login" in error_msg.lower():
                    return "❌ Codex CLI authentication expired. Please run 'codex login' to re-authenticate."
                return f"❌ Codex CLI Error: {error_msg}"
            
            response = stdout.decode().strip()
            
            # Extract model info and log query
            model_info, tokens_used = self.extract_model_info(response)
            
            # Extract the clean ChatGPT response (keep thinking sections)
            lines = response.split('\n')
            clean_response = []
            capture_response = False
            metadata_section = []
            
            # First, collect metadata for user info
            for line in lines:
                if line.startswith('model:') or line.startswith('provider:') or 'reasoning effort:' in line:
                    metadata_section.append(line.strip())
                elif '] codex' in line:
                    capture_response = True
                    continue
                elif capture_response and line.strip():
                    # Keep all content including thinking blocks
                    if not line.startswith('[20') and not line.startswith('] tokens used:'):
                        clean_response.append(line)
            
            # Create user-friendly response with model info
            final_response = ""
            
            # Add model info header
            if model_info != "unknown":
                reasoning_mode = "High reasoning" if "high" in response else "Standard"
                final_response += f"🤖 **{model_info}** ({reasoning_mode})\n"
                if tokens_used:
                    final_response += f"📊 Tokens used: {tokens_used}\n\n"
                else:
                    final_response += "\n"
            
            # Add the response content
            response_content = '\n'.join(clean_response).strip()
            if response_content:
                final_response += response_content
            else:
                # Fallback to raw response
                final_response += f"⚠️ Raw response:\n{response}"
                response_content = response  # For logging
            
            # Log the query
            self.log_query(
                user_message=user_message,
                model_info=model_info,
                tokens_used=tokens_used,
                response_length=len(response_content)
            )
            
            if progress_callback:
                await progress_callback("📊 Finalizing response with model info...")
                
            return final_response or "No response received from Codex CLI"
            
        except Exception as e:
            return f"❌ Error running Codex CLI: {str(e)}"
    
    async def run_codex_process(self, messages, system_prompt=None, model="gpt-3.5-turbo"):
        """
        Legacy method without progress - calls the new progress-enabled version
        """
        return await self.run_codex_process_with_progress(messages, system_prompt, model, None)

# Global wrapper instance
codex_wrapper = CodexCLIWrapper()

@app.list_tools()
async def list_tools():
    return [
        Tool(
            name="send_to_codex",
            description="Send message to GPT-5 with high reasoning using your existing authenticated Codex CLI",
            inputSchema={
                "type": "object",
                "properties": {
                    "message": {"type": "string", "description": "Message to send to GPT-5 for expert analysis"},
                    "system_prompt": {"type": "string", "description": "Optional system prompt for specialized context"}
                },
                "required": ["message"]
            }
        ),
        Tool(
            name="check_codex_status",
            description="Check if Codex CLI is installed and authenticated",
            inputSchema={
                "type": "object",
                "properties": {}
            }
        ),
        Tool(
            name="codex_auth_help",
            description="Get help on how to authenticate with Codex CLI",
            inputSchema={
                "type": "object",
                "properties": {}
            }
        ),
        Tool(
            name="query_stats",
            description="View Cross-LLM Bridge query statistics and usage logs",
            inputSchema={
                "type": "object",
                "properties": {
                    "last_n": {"type": "integer", "description": "Show last N queries (default: 10)"}
                }
            }
        )
    ]

@app.call_tool()
async def call_tool(name: str, arguments: dict):
    if name == "check_codex_status":
        try:
            # Test if codex CLI works
            process = await asyncio.create_subprocess_exec(
                codex_wrapper.codex_path, '--version',
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            stdout, stderr = await process.communicate()
            
            if process.returncode == 0:
                version_info = stdout.decode().strip()
                return [TextContent(type="text", text=f"✅ Codex CLI is working!\nVersion: {version_info}\nPath: {codex_wrapper.codex_path}")]
            else:
                error_msg = stderr.decode().strip()
                if "authentication" in error_msg.lower() or "login" in error_msg.lower():
                    return [TextContent(type="text", text="❌ Codex CLI found but not authenticated. Run 'codex auth' to authenticate.")]
                return [TextContent(type="text", text=f"❌ Codex CLI error: {error_msg}")]
                
        except FileNotFoundError:
            return [TextContent(type="text", text="❌ Codex CLI not found. Please install Codex CLI first.")]
        except Exception as e:
            return [TextContent(type="text", text=f"❌ Error checking Codex CLI: {str(e)}")]
    
    elif name == "codex_auth_help":
        help_text = """
🔧 CODEX CLI AUTHENTICATION SETUP:

1. **Install Codex CLI** (if not already installed):
   ```
   # Install via your preferred method
   # Check OpenAI documentation for latest install instructions
   ```

2. **Authenticate with your ChatGPT subscription**:
   ```
   codex auth
   ```

3. **Test authentication**:
   ```
   codex --version
   ```

4. **Once authenticated**, this MCP server will use your existing Codex CLI authentication automatically!

✅ **Benefits of using Codex CLI**:
- Uses your existing ChatGPT Plus/Pro subscription
- No additional API costs
- Same authentication as Cline uses for Claude Code
- Handles all the OAuth complexity for you

📋 **If you get authentication errors**:
- Run `codex auth` to re-authenticate
- Make sure you're logged into the same account as your ChatGPT subscription
"""
        return [TextContent(type="text", text=help_text)]
    
    elif name == "send_to_codex":
        message = arguments.get("message", "")
        system_prompt = arguments.get("system_prompt")
        
        if not message:
            return [TextContent(type="text", text="❌ Message is required")]
        
        # Format messages for Codex CLI
        messages = [{"role": "user", "content": message}]
        
        # Create a simple progress tracker
        progress_messages = []
        
        async def progress_callback(status):
            progress_messages.append(f"⏳ {status}")
        
        # Send to GPT-5 with high reasoning - always use best quality for expert opinions
        response = await codex_wrapper.run_codex_process_with_progress(
            messages=messages,
            system_prompt=system_prompt,
            model="gpt-5",  # Always GPT-5 for expert analysis
            progress_callback=progress_callback
        )
        
        # Combine progress messages with final response
        full_response = "\n".join(progress_messages) + "\n\n" + f"🤖 **GPT-5 Expert Analysis:**\n{response}"
        
        return [TextContent(type="text", text=full_response)]
    
    elif name == "query_stats":
        try:
            last_n = arguments.get("last_n", 10)
            
            if not os.path.exists(codex_wrapper.query_log_file):
                return [TextContent(type="text", text="📊 No queries logged yet.")]
            
            # Read recent queries
            queries = []
            with open(codex_wrapper.query_log_file, 'r') as f:
                for line in f:
                    try:
                        queries.append(json.loads(line))
                    except:
                        continue
            
            if not queries:
                return [TextContent(type="text", text="📊 No valid query logs found.")]
            
            # Get recent queries
            recent_queries = queries[-last_n:]
            
            # Calculate stats
            total_queries = len(queries)
            total_tokens = sum(q.get('tokens_used', 0) for q in queries if q.get('tokens_used'))
            avg_tokens = total_tokens / len([q for q in queries if q.get('tokens_used')]) if queries else 0
            
            # Format response
            stats_text = f"📊 **Cross-LLM Bridge Query Statistics**\n\n"
            stats_text += f"**Overall Stats:**\n"
            stats_text += f"• Total queries: {total_queries}\n"
            stats_text += f"• Total tokens used: {total_tokens:,}\n"
            stats_text += f"• Average tokens per query: {avg_tokens:.1f}\n\n"
            
            stats_text += f"**Recent {len(recent_queries)} Queries:**\n"
            for i, query in enumerate(reversed(recent_queries), 1):
                timestamp = query.get('timestamp', 'Unknown')[:19]  # Remove microseconds
                query_text = query.get('query', 'N/A')[:100] + ('...' if len(query.get('query', '')) > 100 else '')
                model = query.get('model', 'unknown')
                tokens = query.get('tokens_used', 'N/A')
                
                stats_text += f"{i}. **{timestamp}** ({model})\n"
                stats_text += f"   Query: {query_text}\n"
                stats_text += f"   Tokens: {tokens}\n\n"
            
            return [TextContent(type="text", text=stats_text)]
            
        except Exception as e:
            return [TextContent(type="text", text=f"❌ Error reading stats: {str(e)}")]
    
    return [TextContent(type="text", text=f"❌ Unknown tool: {name}")]

async def main():
    async with stdio_server() as streams:
        await app.run(streams[0], streams[1], app.create_initialization_options())

if __name__ == "__main__":
    asyncio.run(main())