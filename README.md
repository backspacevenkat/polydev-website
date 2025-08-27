# Cross-LLM Bridge MCP Server

A Model Context Protocol (MCP) server that enables bidirectional communication between Claude Code/CLI and ChatGPT/Codex CLI using subscription-based authentication instead of API keys.

**Note: Latest deployment configured for polydev-website Next.js application**

## 🌟 Key Features

- **Subscription-Based Authentication**: Use your existing Claude Pro and ChatGPT Plus subscriptions instead of API keys
- **Cross-LLM Communication**: Send prompts to either Claude or ChatGPT from any MCP client
- **Response Comparison**: Get perspectives from both LLMs and compare their approaches
- **Session Management**: Maintain conversation context across interactions
- **Local Development**: Start with local implementation, scalable to remote hosting

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Chrome/Chromium browser (for authentication)
- Active subscriptions to Claude Pro and/or ChatGPT Plus

### Installation

1. **Clone and Setup**
   ```bash
   cd /Users/venkat/Documents/jarvis
   pip install -r requirements.txt
   ```

2. **Test the CLI Interface**
   ```bash
   python cli.py
   ```

3. **Authenticate with LLMs**
   ```
   > auth claude     # Opens browser for Claude authentication
   > auth chatgpt    # Opens browser for ChatGPT authentication
   ```

4. **Start Communicating**
   ```
   > claude What is machine learning?
   > chatgpt Explain quantum computing
   > compare What are the benefits of Python?
   ```

### MCP Server Usage

1. **Start the MCP Server**
   ```bash
   python cross_llm_bridge.py
   ```

2. **Connect from Claude Code**
   Add to your MCP client configuration:
   ```json
   {
     "mcpServers": {
       "cross-llm-bridge": {
         "command": "python",
         "args": ["/Users/venkat/Documents/jarvis/cross_llm_bridge.py"]
       }
     }
   }
   ```

## 🛠 Available Tools

### MCP Tools

- **send_to_claude**: Send prompts to Claude via subscription
- **send_to_chatgpt**: Send prompts to ChatGPT via subscription  
- **compare_responses**: Compare responses from both LLMs
- **create_session**: Create persistent conversation sessions
- **list_sessions**: View active sessions

### CLI Commands

- **auth <llm>**: Authenticate with Claude or ChatGPT
- **claude <message>**: Send message to Claude
- **chatgpt <message>**: Send message to ChatGPT
- **compare <message>**: Send to both and compare
- **status**: Show authentication and system status
- **help**: Show available commands

## 🔧 How It Works

### Authentication Flow

1. **Browser Automation**: Uses Selenium to open LLM websites
2. **Interactive Login**: User logs in normally through browser
3. **Session Capture**: Extracts session cookies and tokens
4. **Persistent Auth**: Maintains authentication for subsequent requests

### Communication Process

1. **Request Routing**: MCP server receives tool calls
2. **Auth Validation**: Checks for valid authentication
3. **Browser Communication**: Uses stored credentials to interact with LLMs
4. **Response Processing**: Extracts and formats responses
5. **Result Delivery**: Returns formatted responses to MCP client

## 📁 Project Structure

```
/Users/venkat/Documents/jarvis/
├── cross_llm_bridge.py     # Main MCP server
├── auth_manager.py         # Subscription authentication
├── llm_communicator.py     # LLM interaction logic
├── cli.py                  # Interactive CLI interface
├── requirements.txt        # Python dependencies
└── README.md              # This file
```

## 🧪 Testing

### Test CLI Interface
```bash
python cli.py
> test mock      # Test with mock responses
> test auth      # Test authentication status
```

### Test MCP Server
```bash
# Terminal 1: Start server
python cross_llm_bridge.py

# Terminal 2: Test with MCP client
# (Connect via Claude Code or other MCP client)
```

## 🔐 Security Notes

- **Local Storage**: Authentication data stored locally only
- **No API Keys**: Uses existing subscriptions, no additional API keys needed
- **Session Management**: Automatic session timeout and refresh
- **Browser Isolation**: Uses separate browser instances for auth

## 🚧 Current Limitations

- **Browser Dependency**: Requires Chrome/Chromium for authentication
- **Manual Auth**: Interactive authentication required on first use
- **Rate Limits**: Subject to LLM web interface rate limits
- **Local Only**: Currently local development version

## 🔮 Roadmap

### Phase 1: Local MVP ✅
- [x] Basic MCP server structure
- [x] Subscription authentication
- [x] Browser-based communication
- [x] CLI interface for testing
- [x] Cross-LLM comparison

### Phase 2: Enhancement 🔄
- [ ] Improved response parsing
- [ ] Better error handling  
- [ ] Session persistence
- [ ] Auto-authentication refresh
- [ ] Performance optimization

### Phase 3: Remote Deployment 📋
- [ ] Cloud hosting setup
- [ ] Multi-user support
- [ ] API endpoint creation
- [ ] Subscription billing
- [ ] Security hardening

## 💡 Usage Examples

### Basic Communication
```python
# Via CLI
> claude What's the difference between REST and GraphQL?
> chatgpt Same question: What's the difference between REST and GraphQL?
```

### Cross-LLM Comparison
```python
# Via CLI  
> compare Write a Python function to calculate fibonacci numbers

# Via MCP (JSON-RPC)
{
  "method": "tools/call",
  "params": {
    "name": "compare_responses",
    "arguments": {
      "prompt": "Write a Python function to calculate fibonacci numbers",
      "analysis_focus": "code_quality"
    }
  }
}
```

### Session Management
```python
# Via CLI
> claude Create a session
> claude [session_id] Continue our conversation about...

# Via MCP
{
  "method": "tools/call", 
  "params": {
    "name": "create_session",
    "arguments": {
      "llm_type": "claude",
      "initial_context": "We're discussing Python best practices"
    }
  }
}
```

## 🤝 Contributing

This is currently a local development project. Once the MVP is validated, we'll open it up for contributions.

## 📄 License

Proprietary - All rights reserved.

## 🆘 Support

For issues during local development:
1. Check authentication status: `python cli.py` → `status`
2. Re-authenticate if needed: `auth claude` or `auth chatgpt`  
3. Test with mock responses: `test mock`
4. Check browser compatibility (Chrome required)

---

**Note**: This is the first implementation of subscription-based cross-LLM communication. The technology is novel and actively being developed.