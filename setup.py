#!/usr/bin/env python3
"""
Setup script for Cross-LLM Bridge
"""

import subprocess
import sys
import os
from pathlib import Path


def check_python_version():
    """Check if Python version is 3.8+"""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8+ required. Current version:", sys.version)
        return False
    print("✅ Python version:", sys.version.split()[0])
    return True


def install_requirements():
    """Install required packages"""
    print("Installing required packages...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Requirements installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install requirements: {e}")
        return False


def check_chrome():
    """Check if Chrome/Chromium is available"""
    chrome_paths = [
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",  # macOS
        "/usr/bin/google-chrome",  # Linux
        "/usr/bin/chromium-browser",  # Linux Chromium
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",  # Windows
        "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",  # Windows x86
    ]
    
    for path in chrome_paths:
        if os.path.exists(path):
            print(f"✅ Chrome found at: {path}")
            return True
    
    # Try command line
    try:
        subprocess.run(["google-chrome", "--version"], capture_output=True, check=True)
        print("✅ Chrome available in PATH")
        return True
    except:
        pass
    
    try:
        subprocess.run(["chromium", "--version"], capture_output=True, check=True) 
        print("✅ Chromium available in PATH")
        return True
    except:
        pass
    
    print("⚠️  Chrome/Chromium not found. Please install Chrome for authentication.")
    print("   Download from: https://www.google.com/chrome/")
    return False


def create_test_script():
    """Create a simple test script"""
    test_content = '''#!/usr/bin/env python3
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
    
    print("\\n🎉 All components initialized successfully!")
    print("\\nNext steps:")
    print("1. Run: python cli.py")
    print("2. Authenticate: auth claude")
    print("3. Test: claude Hello, world!")
    
    return True


if __name__ == "__main__":
    asyncio.run(test_system())
'''
    
    with open("test_setup.py", "w") as f:
        f.write(test_content)
    print("✅ Test script created: test_setup.py")


def main():
    """Main setup function"""
    print("🚀 Cross-LLM Bridge Setup")
    print("=" * 40)
    
    # Check Python version
    if not check_python_version():
        return False
    
    # Install requirements
    if not install_requirements():
        return False
    
    # Check Chrome
    chrome_available = check_chrome()
    
    # Create test script
    create_test_script()
    
    print("\n" + "=" * 40)
    print("🎉 Setup Complete!")
    print("=" * 40)
    
    if chrome_available:
        print("✅ All dependencies ready")
        print("\nQuick Start:")
        print("1. python test_setup.py  # Test components")
        print("2. python cli.py         # Interactive CLI")
        print("3. python cross_llm_bridge.py  # MCP Server")
    else:
        print("⚠️  Chrome installation needed for authentication")
        print("\nAfter installing Chrome:")
        print("1. python test_setup.py  # Test components")
        print("2. python cli.py         # Interactive CLI")
    
    return True


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)