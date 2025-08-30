#!/usr/bin/env python3
"""
CLI for Cross-LLM Bridge
Interactive command-line interface for testing and managing the bridge
"""

import asyncio
import json
import sys
from typing import Dict, List, Optional
import argparse
from datetime import datetime

from auth_manager import SubscriptionAuthManager
from llm_communicator import LLMCommunicator


class CrossLLMCLI:
    """Interactive CLI for the Cross-LLM Bridge"""
    
    def __init__(self):
        self.auth_manager = SubscriptionAuthManager()
        self.communicator = LLMCommunicator(self.auth_manager)
        self.session_active = True
        
    async def run(self):
        """Main CLI loop"""
        print("=" * 60)
        print("Cross-LLM Bridge CLI v1.0.0")
        print("Connect Claude Code and ChatGPT via subscription authentication")
        print("=" * 60)
        print()
        
        # Check authentication status
        await self._check_auth_status()
        
        while self.session_active:
            try:
                command = input("\n> ").strip().lower()
                
                if not command:
                    continue
                
                if command in ['quit', 'exit', 'q']:
                    self.session_active = False
                    print("Goodbye!")
                    break
                
                elif command in ['help', 'h']:
                    self._show_help()
                
                elif command.startswith('auth'):
                    await self._handle_auth_command(command)
                
                elif command.startswith('claude'):
                    await self._handle_claude_command(command)
                
                elif command.startswith('chatgpt') or command.startswith('gpt'):
                    await self._handle_chatgpt_command(command)
                
                elif command.startswith('compare'):
                    await self._handle_compare_command(command)
                
                elif command in ['status', 'st']:
                    await self._show_status()
                
                elif command.startswith('test'):
                    await self._handle_test_command(command)
                
                else:
                    print(f"Unknown command: {command}")
                    print("Type 'help' for available commands")
                    
            except KeyboardInterrupt:
                print("\nUse 'quit' to exit gracefully")
            except Exception as e:
                print(f"Error: {e}")
    
    def _show_help(self):
        """Show help information"""
        help_text = """
Available Commands:
==================

Authentication:
  auth claude       - Authenticate with Claude
  auth chatgpt      - Authenticate with ChatGPT  
  auth status       - Show authentication status

LLM Communication:
  claude <message>  - Send message to Claude
  chatgpt <message> - Send message to ChatGPT
  gpt <message>     - Send message to ChatGPT (alias)
  compare <message> - Send to both and compare responses

Status & Testing:
  status           - Show system status
  test mock        - Test with mock responses
  test auth        - Test authentication
  
General:
  help, h          - Show this help
  quit, exit, q    - Exit the CLI

Examples:
  > claude What is machine learning?
  > chatgpt Explain quantum computing
  > compare What are the benefits of Python?
  > auth claude
"""
        print(help_text)
    
    async def _check_auth_status(self):
        """Check and display authentication status"""
        status = self.auth_manager.get_status()
        
        print("Authentication Status:")
        for llm_type, info in status.items():
            status_icon = "✅" if info['authenticated'] else "❌"
            print(f"  {llm_type.upper()}: {status_icon} {'Authenticated' if info['authenticated'] else 'Not authenticated'}")
        
        if not any(info['authenticated'] for info in status.values()):
            print("\nTo get started, authenticate with at least one LLM:")
            print("  > auth claude")
            print("  > auth chatgpt")
    
    async def _handle_auth_command(self, command: str):
        """Handle authentication commands"""
        parts = command.split()
        
        if len(parts) < 2:
            print("Usage: auth <claude|chatgpt|status>")
            return
        
        sub_command = parts[1].lower()
        
        if sub_command == "claude":
            print("Starting Claude authentication...")
            success = await self.auth_manager.authenticate_claude(interactive=True)
            if success:
                print("✅ Claude authentication successful!")
            else:
                print("❌ Claude authentication failed")
        
        elif sub_command in ["chatgpt", "gpt"]:
            print("Starting ChatGPT authentication...")
            success = await self.auth_manager.authenticate_chatgpt(interactive=True)
            if success:
                print("✅ ChatGPT authentication successful!")
            else:
                print("❌ ChatGPT authentication failed")
        
        elif sub_command == "status":
            await self._show_status()
        
        else:
            print("Unknown auth command. Use: auth <claude|chatgpt|status>")
    
    async def _handle_claude_command(self, command: str):
        """Handle Claude commands"""
        if not self.auth_manager.is_authenticated("claude"):
            print("❌ Not authenticated with Claude. Run 'auth claude' first.")
            return
        
        # Extract message (everything after "claude ")
        message = command[6:].strip()
        if not message:
            print("Usage: claude <your message>")
            return
        
        print(f"Sending to Claude: {message}")
        print("⏳ Waiting for response...")
        
        try:
            response = await self.communicator.send_to_claude(message)
            print(f"\n📝 Claude's Response:")
            print("-" * 40)
            print(response)
            print("-" * 40)
        except Exception as e:
            print(f"❌ Error: {e}")
    
    async def _handle_chatgpt_command(self, command: str):
        """Handle ChatGPT commands"""
        if not self.auth_manager.is_authenticated("chatgpt"):
            print("❌ Not authenticated with ChatGPT. Run 'auth chatgpt' first.")
            return
        
        # Extract message
        prefix_len = 7 if command.startswith("chatgpt") else 3  # "chatgpt " or "gpt "
        message = command[prefix_len:].strip()
        if not message:
            print("Usage: chatgpt <your message> (or gpt <your message>)")
            return
        
        print(f"Sending to ChatGPT: {message}")
        print("⏳ Waiting for response...")
        
        try:
            response = await self.communicator.send_to_chatgpt(message)
            print(f"\n🤖 ChatGPT's Response:")
            print("-" * 40)
            print(response)
            print("-" * 40)
        except Exception as e:
            print(f"❌ Error: {e}")
    
    async def _handle_compare_command(self, command: str):
        """Handle compare commands"""
        auth_status = self.auth_manager.get_status()
        
        if not auth_status["claude"]["authenticated"] and not auth_status["chatgpt"]["authenticated"]:
            print("❌ Need authentication with at least one LLM to compare")
            return
        
        # Extract message
        message = command[7:].strip()  # "compare "
        if not message:
            print("Usage: compare <your message>")
            return
        
        print(f"Comparing responses for: {message}")
        print("⏳ This may take a moment...")
        
        try:
            if auth_status["claude"]["authenticated"] and auth_status["chatgpt"]["authenticated"]:
                # Both authenticated - full comparison
                comparison = await self.communicator.compare_responses(message)
                
                print("\n" + "=" * 60)
                print("CROSS-LLM COMPARISON RESULTS")
                print("=" * 60)
                
                print(f"\n🤖 CLAUDE RESPONSE:")
                print("-" * 30)
                print(comparison["claude_response"])
                
                print(f"\n🤖 CHATGPT RESPONSE:")
                print("-" * 30)
                print(comparison["chatgpt_response"])
                
                print(f"\n📊 ANALYSIS:")
                print("-" * 30)
                print(comparison["analysis"])
                print("=" * 60)
                
            else:
                # Only one authenticated - send to available one
                if auth_status["claude"]["authenticated"]:
                    response = await self.communicator.send_to_claude(message)
                    print(f"\n📝 Claude Response (ChatGPT not available):")
                    print("-" * 40)
                    print(response)
                else:
                    response = await self.communicator.send_to_chatgpt(message)
                    print(f"\n🤖 ChatGPT Response (Claude not available):")
                    print("-" * 40)
                    print(response)
                
        except Exception as e:
            print(f"❌ Comparison error: {e}")
    
    async def _show_status(self):
        """Show detailed system status"""
        print("\n" + "=" * 50)
        print("CROSS-LLM BRIDGE STATUS")
        print("=" * 50)
        
        # Authentication status
        auth_status = self.auth_manager.get_status()
        print("\n🔐 Authentication Status:")
        for llm_type, info in auth_status.items():
            icon = "✅" if info['authenticated'] else "❌"
            status_text = "Authenticated" if info['authenticated'] else "Not authenticated"
            print(f"  {llm_type.upper()}: {icon} {status_text}")
            
            if info['expires_at']:
                print(f"    Expires: {info['expires_at']}")
            if info['user_id']:
                print(f"    User: {info['user_id']}")
        
        # System info
        print(f"\n⚙️  System Info:")
        print(f"  Server: Cross-LLM Bridge v1.0.0")
        print(f"  Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"  Mode: Local Development")
        
        print("=" * 50)
    
    async def _handle_test_command(self, command: str):
        """Handle test commands"""
        parts = command.split()
        
        if len(parts) < 2:
            print("Usage: test <mock|auth>")
            return
        
        test_type = parts[1].lower()
        
        if test_type == "mock":
            print("Testing with mock responses...")
            
            # Test mock Claude
            print("\n🧪 Testing Claude (mock):")
            claude_mock = await self.communicator.send_to_claude("Hello, this is a test", context="Test mode")
            print(claude_mock)
            
            # Test mock ChatGPT  
            print("\n🧪 Testing ChatGPT (mock):")
            chatgpt_mock = await self.communicator.send_to_chatgpt("Hello, this is a test", context="Test mode")
            print(chatgpt_mock)
            
        elif test_type == "auth":
            print("Testing authentication status...")
            await self._show_status()
            
        else:
            print("Unknown test type. Use: test <mock|auth>")


async def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description="Cross-LLM Bridge CLI")
    parser.add_argument("--version", action="version", version="Cross-LLM Bridge CLI v1.0.0")
    
    args = parser.parse_args()
    
    cli = CrossLLMCLI()
    await cli.run()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nExiting...")
        sys.exit(0)