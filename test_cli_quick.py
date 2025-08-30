#!/usr/bin/env python3
"""
Quick CLI test without requiring user interaction
"""

import asyncio
import sys
import os

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from auth_manager import SubscriptionAuthManager
from llm_communicator import LLMCommunicator


async def quick_test():
    """Quick test of core functionality"""
    print("🧪 Cross-LLM Bridge - Quick Test")
    print("=" * 40)
    
    # Initialize components
    auth_manager = SubscriptionAuthManager()
    communicator = LLMCommunicator(auth_manager)
    
    # Test status
    status = auth_manager.get_status()
    print(f"📊 Status: {len(status)} LLM types available")
    for llm_type, info in status.items():
        icon = "✅" if info['authenticated'] else "❌"
        print(f"  {llm_type.upper()}: {icon} {'Authenticated' if info['authenticated'] else 'Not authenticated'}")
    
    # Test mock responses (fallback when not authenticated)
    print(f"\n🧪 Testing mock responses...")
    try:
        claude_resp = await communicator.send_to_claude("Hello test", context="Test mode")
        print(f"Claude mock: {claude_resp[:100]}...")
        
        chatgpt_resp = await communicator.send_to_chatgpt("Hello test", context="Test mode") 
        print(f"ChatGPT mock: {chatgpt_resp[:100]}...")
        
    except Exception as e:
        print(f"Mock test error: {e}")
    
    print(f"\n✅ Quick test completed!")
    print(f"\nTo use real LLM communication:")
    print(f"1. Run: python3 cli.py")
    print(f"2. Authenticate: auth claude")
    print(f"3. Test: claude Hello, world!")


if __name__ == "__main__":
    asyncio.run(quick_test())