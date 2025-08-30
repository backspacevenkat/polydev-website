#!/usr/bin/env python3
"""
ChatGPT CLI Tool - Similar to Claude Code CLI
This tool handles ChatGPT authentication and provides a CLI interface like `claude` command
"""

import argparse
import asyncio
import json
import sys
import os
import httpx
from typing import List, Dict, Any, Optional

class ChatGPTCLI:
    def __init__(self):
        self.api_key = None
        self.session_token = None
        self.base_url = "https://api.openai.com/v1"
        
    def load_auth(self):
        """Load authentication from various sources"""
        # Priority 1: Environment variable
        self.api_key = os.getenv('OPENAI_API_KEY')
        
        # Priority 2: API key file (like how Cline saves keys)
        api_key_file = os.path.expanduser("~/.config/chatgpt-cli/api_key")
        if not self.api_key and os.path.exists(api_key_file):
            with open(api_key_file, 'r') as f:
                self.api_key = f.read().strip()
        
        # Priority 3: Session token file (for subscription access)
        session_file = os.path.expanduser("~/.config/chatgpt-cli/session_token")
        if not self.api_key and os.path.exists(session_file):
            with open(session_file, 'r') as f:
                self.session_token = f.read().strip()
        
        if not self.api_key and not self.session_token:
            print(json.dumps({
                "error": "No authentication found. Set OPENAI_API_KEY or run 'chatgpt auth' first."
            }))
            sys.exit(1)
    
    def setup_auth_interactive(self):
        """Interactive authentication setup"""
        print("ChatGPT CLI Authentication Setup")
        print("=" * 40)
        print("Choose authentication method:")
        print("1. API Key (pay-per-use)")
        print("2. Session Token (use subscription)")
        
        choice = input("Enter choice (1/2): ").strip()
        
        config_dir = os.path.expanduser("~/.config/chatgpt-cli")
        os.makedirs(config_dir, exist_ok=True)
        
        if choice == "1":
            api_key = input("Enter your OpenAI API key: ").strip()
            if api_key.startswith('sk-'):
                with open(f"{config_dir}/api_key", 'w') as f:
                    f.write(api_key)
                print("✅ API key saved successfully!")
            else:
                print("❌ Invalid API key format")
                sys.exit(1)
        elif choice == "2":
            print("\n📋 To get your session token:")
            print("1. Go to https://chatgpt.com and login")
            print("2. Open DevTools (F12)")
            print("3. Go to Application > Cookies")
            print("4. Find '__Secure-next-auth.session-token'")
            print("5. Copy the value")
            
            session_token = input("\nEnter session token: ").strip()
            if session_token:
                with open(f"{config_dir}/session_token", 'w') as f:
                    f.write(session_token)
                print("✅ Session token saved successfully!")
            else:
                print("❌ Session token cannot be empty")
                sys.exit(1)
        else:
            print("❌ Invalid choice")
            sys.exit(1)
    
    async def stream_chat_completion(self, messages: List[Dict], model: str = "gpt-3.5-turbo", 
                                   system_prompt: Optional[str] = None, max_tokens: int = 4000):
        """Stream chat completion like Claude Code does"""
        
        # Prepare messages with system prompt
        formatted_messages = []
        if system_prompt:
            formatted_messages.append({"role": "system", "content": system_prompt})
        
        formatted_messages.extend(messages)
        
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                if self.api_key:
                    # Use API key authentication
                    response = await client.post(
                        f"{self.base_url}/chat/completions",
                        headers={
                            "Authorization": f"Bearer {self.api_key}",
                            "Content-Type": "application/json"
                        },
                        json={
                            "model": model,
                            "messages": formatted_messages,
                            "max_tokens": max_tokens,
                            "stream": True
                        }
                    )
                    
                    if response.status_code != 200:
                        error_data = response.text
                        print(json.dumps({
                            "error": f"API Error ({response.status_code}): {error_data}"
                        }))
                        return
                    
                    # For now, let's use non-streaming to simplify
                    # We can add streaming later once the basic flow works
                    full_response = ""
                    async for line in response.aiter_lines():
                        if line.startswith('data: '):
                            data_str = line[6:]  # Remove 'data: '
                            if data_str.strip() == '[DONE]':
                                break
                            
                            try:
                                data = json.loads(data_str)
                                if 'choices' in data and data['choices']:
                                    delta = data['choices'][0].get('delta', {})
                                    if 'content' in delta:
                                        full_response += delta['content']
                            except json.JSONDecodeError:
                                continue
                    
                    # Output the complete response as one chunk
                    if full_response:
                        chunk = {
                            "type": "text", 
                            "text": full_response
                        }
                        print(json.dumps(chunk), flush=True)
                    
                else:
                    # Use session token (subscription access)
                    print(json.dumps({
                        "error": "Session token authentication not yet implemented. Use API key for now."
                    }))
                    return
                    
        except Exception as e:
            print(json.dumps({
                "error": f"Request failed: {str(e)}"
            }))

async def main():
    parser = argparse.ArgumentParser(description="ChatGPT CLI - Claude Code style interface")
    parser.add_argument("--system-prompt", help="System prompt")
    parser.add_argument("--system-prompt-file", help="System prompt from file")
    parser.add_argument("--model", default="gpt-3.5-turbo", help="Model to use")
    parser.add_argument("--max-tokens", type=int, default=4000, help="Max tokens")
    parser.add_argument("--output-format", default="stream-json", help="Output format")
    parser.add_argument("--verbose", action="store_true", help="Verbose output")
    parser.add_argument("-p", "--prompt", action="store_true", help="Prompt mode - read messages from stdin")
    parser.add_argument("subcommand", nargs="?", help="Subcommand (auth, etc.)")
    
    args = parser.parse_args()
    
    cli = ChatGPTCLI()
    
    # Handle auth subcommand
    if args.subcommand == "auth":
        cli.setup_auth_interactive()
        return
    
    # Load authentication for normal usage
    cli.load_auth()
    
    # Get system prompt
    system_prompt = None
    if args.system_prompt_file:
        with open(args.system_prompt_file, 'r') as f:
            system_prompt = f.read().strip()
    elif args.system_prompt:
        system_prompt = args.system_prompt
    
    if args.prompt:
        # Read messages from stdin (like Claude Code)
        try:
            input_data = sys.stdin.read()
            messages = json.loads(input_data)
            
            # Stream the completion
            await cli.stream_chat_completion(
                messages=messages,
                model=args.model,
                system_prompt=system_prompt,
                max_tokens=args.max_tokens
            )
            
        except json.JSONDecodeError as e:
            print(json.dumps({
                "error": f"Invalid JSON input: {str(e)}"
            }))
            sys.exit(1)
        except Exception as e:
            print(json.dumps({
                "error": f"Error: {str(e)}"
            }))
            sys.exit(1)
    else:
        print(json.dumps({
            "error": "No input mode specified. Use -p for prompt mode."
        }))
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())