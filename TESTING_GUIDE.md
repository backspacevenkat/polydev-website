# Cross-LLM Bridge Testing Guide

Complete step-by-step instructions to test the Cross-LLM Bridge functionality.

## 🎯 **Test Objective**
Host MCP locally → Authenticate ChatGPT → Connect to Claude Code → Ask ChatGPT via Claude Code

---

## **Phase 1: Setup and Authentication**

### Step 1: Verify Installation
```bash
cd /Users/venkat/Documents/jarvis
python3 test_setup.py
```
**Expected**: All components initialized successfully ✅

### Step 2: Start Interactive CLI for Authentication
```bash
python3 cli.py
```

### Step 3: Authenticate with ChatGPT
```
> auth chatgpt
```

**What happens:**
1. Browser window opens to ChatGPT login page
2. **YOU DO**: Log in with your ChatGPT account normally
3. **YOU DO**: After successful login, return to terminal and press Enter
4. **Expected**: "✅ ChatGPT authentication successful!"

### Step 4: Test ChatGPT Communication
```
> chatgpt Hello, this is a test from the Cross-LLM Bridge
```

**Expected**: Real response from ChatGPT (may take 30-60 seconds)

### Step 5: Verify Status
```
> status
```

**Expected**: 
```
🔐 Authentication Status:
  CLAUDE: ❌ Not authenticated  
  CHATGPT: ✅ Authenticated
```

### Step 6: Exit CLI
```
> quit
```

---

## **Phase 2: Start MCP Server**

### Step 7: Start the MCP Server
```bash
python3 cross_llm_bridge.py
```

**Expected Output:**
```
Starting cross-llm-bridge v1.0.0
This server enables cross-LLM communication between Claude and ChatGPT
using subscription-based authentication.
```

**IMPORTANT**: Leave this terminal running! The MCP server needs to stay active.

---

## **Phase 3: Connect to Claude Code**

### Step 8: Configure Claude Code MCP

Open a **new terminal** and create the MCP configuration:

```bash
# Create Claude Code MCP config directory if it doesn't exist
mkdir -p ~/.claude-code

# Create the MCP configuration file
cat > ~/.claude-code/mcp_servers.json << 'EOF'
{
  "mcpServers": {
    "cross-llm-bridge": {
      "command": "python3",
      "args": ["/Users/venkat/Documents/jarvis/cross_llm_bridge.py"],
      "env": {}
    }
  }
}
EOF
```

### Step 9: Restart Claude Code

1. **Close Claude Code completely**
2. **Restart Claude Code**
3. **Verify MCP Connection**: You should see "cross-llm-bridge" in the MCP servers list

---

## **Phase 4: Test Cross-LLM Communication**

### Step 10: Test ChatGPT via Claude Code

In Claude Code, use these MCP tool calls:

#### Test 1: Basic ChatGPT Communication
```
Please use the send_to_chatgpt tool to ask ChatGPT: "What is the capital of France and why is it significant?"
```

#### Test 2: Technical Question
```
Use send_to_chatgpt to ask: "Explain the difference between REST and GraphQL APIs in simple terms"
```

#### Test 3: Comparison Test (if you authenticate Claude too)
```
Use compare_responses to ask both LLMs: "What are the pros and cons of Python vs JavaScript?"
```

---

## **Phase 5: Verification Steps**

### Expected Behaviors:

#### ✅ **Success Indicators:**
- ChatGPT responses appear in Claude Code
- Responses are real and contextual (not mock responses)
- Response time: 30-90 seconds per request
- No "[ChatGPT Error]" messages

#### ⚠️ **If You See Issues:**

**"Not authenticated with ChatGPT"**
- Return to Step 3, re-authenticate
- Ensure browser login was successful

**"Communication failed"**  
- Check if Step 7 MCP server is still running
- Restart MCP server if needed

**"Unknown tool"**
- Verify Step 8 configuration file
- Restart Claude Code

---

## **Phase 6: Advanced Testing**

### Optional: Add Claude Authentication

If you want to test both LLMs:

1. **In CLI** (new terminal):
```bash
python3 cli.py
> auth claude
> quit
```

2. **Test comparison in Claude Code**:
```
Use compare_responses to ask: "Which programming language should I learn first: Python or JavaScript?"
```

### Optional: Session Management

```
Use create_session to create a ChatGPT session, then send multiple related messages to maintain context.
```

---

## **Troubleshooting**

### Common Issues:

#### Browser Authentication Fails
```bash
# Try manual authentication
python3 cli.py
> auth chatgpt
# Make sure you're fully logged in before pressing Enter
```

#### MCP Server Connection Issues
```bash
# Check if server is running
ps aux | grep cross_llm_bridge

# Restart server
python3 cross_llm_bridge.py
```

#### Claude Code Not Recognizing MCP
```bash
# Verify config file exists and is correct
cat ~/.claude-code/mcp_servers.json

# Check file permissions
ls -la ~/.claude-code/mcp_servers.json
```

---

## **Success Criteria**

✅ **Test Passes If:**
1. ChatGPT authentication succeeds via browser
2. MCP server starts without errors  
3. Claude Code recognizes the cross-llm-bridge server
4. send_to_chatgpt tool returns real ChatGPT responses
5. Responses are coherent and contextual (not error messages)

🎉 **If all steps work**: You've successfully created the first subscription-based cross-LLM bridge!

---

## **Performance Notes**

- **Response Time**: 30-90 seconds (browser automation overhead)
- **Rate Limits**: Subject to ChatGPT web interface limits
- **Concurrent Requests**: Limited to 1 at a time per authentication

---

## **Next Steps After Success**

1. **Document the achievement** - This is genuinely novel technology
2. **Test with different prompt types** - Code, creative writing, analysis
3. **Evaluate response quality** compared to direct ChatGPT usage
4. **Consider optimizations** for production deployment

---

*Note: This test validates the core innovation - using subscription authentication for cross-LLM communication without API keys.*