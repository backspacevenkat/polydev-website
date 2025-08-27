#!/usr/bin/env python3
"""
Quick test script for Cross-LLM Bridge
"""

import asyncio
import sys
import os

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from auth_manager import SubscriptionAuthManager
from llm_communicator import LLMCommunicator


async def test_system():
    """Test the system components"""
    print("🧪 Testing Cross-LLM Bridge Components")
    print("=" * 50)
    
    # Test auth manager
    try:
        auth_manager = SubscriptionAuthManager()
        print("✅ Auth Manager initialized")
    except Exception as e:
        print(f"❌ Auth Manager failed: {e}")
        return False
    
    # Test communicator
    try:
        communicator = LLMCommunicator(auth_manager)
        print("✅ LLM Communicator initialized")
    except Exception as e:
        print(f"❌ LLM Communicator failed: {e}")
        return False
    
    # Test status
    try:
        status = auth_manager.get_status()
        print(f"✅ Status check: {len(status)} LLM types tracked")
    except Exception as e:
        print(f"❌ Status check failed: {e}")
        return False
    
    print("\n🎉 All components initialized successfully!")
    print("\nNext steps:")
    print("1. Run: python cli.py")
    print("2. Authenticate: auth claude")
    print("3. Test: claude Hello, world!")
    
    return True


if __name__ == "__main__":
    asyncio.run(test_system())
