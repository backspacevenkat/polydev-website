#!/usr/bin/env python3
"""
Pre-test verification script
Checks if everything is ready for the full test
"""

import os
import sys
import subprocess
import json
from pathlib import Path

def check_files():
    """Check if all required files exist"""
    required_files = [
        "cross_llm_bridge.py",
        "auth_manager.py", 
        "llm_communicator.py",
        "cli.py",
        "requirements.txt"
    ]
    
    print("📁 Checking required files...")
    all_good = True
    for file in required_files:
        if os.path.exists(file):
            print(f"  ✅ {file}")
        else:
            print(f"  ❌ {file} - MISSING!")
            all_good = False
    
    return all_good

def check_dependencies():
    """Check if Python dependencies are installed"""
    print("\n🐍 Checking Python dependencies...")
    
    required_modules = [
        "mcp", "httpx", "pydantic", "selenium", "requests"
    ]
    
    all_good = True
    for module in required_modules:
        try:
            __import__(module)
            print(f"  ✅ {module}")
        except ImportError:
            print(f"  ❌ {module} - NOT INSTALLED!")
            all_good = False
    
    return all_good

def check_chrome():
    """Check if Chrome is available"""
    print("\n🌐 Checking Chrome availability...")
    
    chrome_paths = [
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        "/usr/bin/google-chrome",
        "/usr/bin/chromium-browser"
    ]
    
    for path in chrome_paths:
        if os.path.exists(path):
            print(f"  ✅ Chrome found: {path}")
            return True
    
    try:
        subprocess.run(["google-chrome", "--version"], capture_output=True, check=True)
        print("  ✅ Chrome available in PATH")
        return True
    except:
        pass
    
    print("  ❌ Chrome not found - required for authentication!")
    return False

def check_claude_code_config():
    """Check Claude Code MCP configuration"""
    print("\n⚙️  Checking Claude Code MCP configuration...")
    
    config_path = Path.home() / ".claude-code" / "mcp_servers.json"
    
    if config_path.exists():
        try:
            with open(config_path, 'r') as f:
                config = json.load(f)
            
            if "cross-llm-bridge" in config.get("mcpServers", {}):
                print("  ✅ Cross-LLM Bridge already configured in Claude Code")
                return True
            else:
                print("  ⚠️  Claude Code config exists but Cross-LLM Bridge not configured")
                return False
        except Exception as e:
            print(f"  ❌ Error reading Claude Code config: {e}")
            return False
    else:
        print("  ⚠️  Claude Code MCP config not found - will need to create")
        return False

def test_components():
    """Test if components can be imported"""
    print("\n🧪 Testing component imports...")
    
    try:
        from auth_manager import SubscriptionAuthManager
        print("  ✅ AuthManager imports successfully")
    except Exception as e:
        print(f"  ❌ AuthManager import failed: {e}")
        return False
    
    try:
        from llm_communicator import LLMCommunicator
        print("  ✅ LLMCommunicator imports successfully") 
    except Exception as e:
        print(f"  ❌ LLMCommunicator import failed: {e}")
        return False
    
    try:
        # Test basic initialization
        auth_manager = SubscriptionAuthManager()
        communicator = LLMCommunicator(auth_manager)
        print("  ✅ Components initialize successfully")
        return True
    except Exception as e:
        print(f"  ❌ Component initialization failed: {e}")
        return False

def create_claude_code_config():
    """Create Claude Code MCP configuration"""
    print("\n⚙️  Creating Claude Code MCP configuration...")
    
    config_dir = Path.home() / ".claude-code"
    config_file = config_dir / "mcp_servers.json"
    
    # Create directory if it doesn't exist
    config_dir.mkdir(exist_ok=True)
    
    # Current directory absolute path
    current_dir = os.path.abspath(".")
    
    config = {
        "mcpServers": {
            "cross-llm-bridge": {
                "command": "python3",
                "args": [f"{current_dir}/cross_llm_bridge.py"],
                "env": {}
            }
        }
    }
    
    try:
        with open(config_file, 'w') as f:
            json.dump(config, f, indent=2)
        
        print(f"  ✅ Created Claude Code config: {config_file}")
        print(f"  📁 Server path: {current_dir}/cross_llm_bridge.py")
        return True
    except Exception as e:
        print(f"  ❌ Failed to create config: {e}")
        return False

def main():
    """Main verification function"""
    print("🔍 Cross-LLM Bridge Pre-Test Verification")
    print("=" * 50)
    
    all_checks = []
    
    # Run all checks
    all_checks.append(check_files())
    all_checks.append(check_dependencies()) 
    all_checks.append(check_chrome())
    claude_config_ok = check_claude_code_config()
    all_checks.append(test_components())
    
    print("\n" + "=" * 50)
    
    if all(all_checks):
        print("✅ ALL CHECKS PASSED!")
        
        if not claude_config_ok:
            print("\n🔧 Setting up Claude Code configuration...")
            if create_claude_code_config():
                print("✅ Claude Code configuration created!")
            else:
                print("❌ Failed to create Claude Code configuration")
                return False
        
        print("\n🚀 READY FOR TESTING!")
        print("\nNext steps:")
        print("1. python3 cli.py")
        print("2. > auth chatgpt")
        print("3. > quit")
        print("4. python3 cross_llm_bridge.py")
        print("5. Connect from Claude Code")
        
        return True
    else:
        print("❌ SOME CHECKS FAILED!")
        print("\nPlease fix the issues above before testing.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)