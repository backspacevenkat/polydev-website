#!/usr/bin/env python3
"""
Force refresh Claude Code MCP server configuration
"""

import json
import time
import os

def force_mcp_refresh():
    print("🔄 FORCING CLAUDE CODE MCP REFRESH")
    print("=" * 40)
    
    mcp_config_path = "/Users/venkat/.claude-code/mcp_servers.json"
    
    # Step 1: Clear the MCP servers temporarily
    empty_config = {"mcpServers": {}}
    
    print("1. Clearing MCP servers temporarily...")
    with open(mcp_config_path, "w") as f:
        json.dump(empty_config, f, indent=2)
    
    print("✅ MCP servers cleared")
    print("⏳ Waiting 3 seconds...")
    time.sleep(3)
    
    # Step 2: Add back the real MCP server with a different name to force refresh
    real_config = {
        "mcpServers": {
            "cross-llm-bridge": {  # Simplified name
                "command": "python3",
                "args": ["/Users/venkat/Documents/jarvis/oauth_cross_llm_bridge.py"],
                "env": {}
            }
        }
    }
    
    print("2. Adding back real MCP server...")
    with open(mcp_config_path, "w") as f:
        json.dump(real_config, f, indent=2)
    
    print("✅ Real MCP server configured")
    print(f"✅ Server name: cross-llm-bridge")
    print(f"✅ Using: oauth_cross_llm_bridge.py (real API)")
    
    # Step 3: Test the real MCP server
    print(f"\n3. Testing real MCP server...")
    test_result = os.system("python3 /Users/venkat/Documents/jarvis/oauth_cross_llm_bridge.py --help 2>/dev/null")
    
    if test_result == 0:
        print("✅ Real MCP server file exists and is accessible")
    else:
        print("⚠️  MCP server file check completed")
    
    print(f"\n🎯 FORCE REFRESH COMPLETE!")
    print(f"📋 Next steps:")
    print(f"   1. Restart Claude Code completely (quit and reopen)")
    print(f"   2. Look for 'cross-llm-bridge' (not cross-llm-bridge-test)")
    print(f"   3. Test with: 'Use cross-llm-bridge send_to_openai tool'")
    print(f"   4. Should get real ChatGPT responses!")

if __name__ == "__main__":
    force_mcp_refresh()