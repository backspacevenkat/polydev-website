# 🚀 Polydev - Multi-LLM Orchestration Platform

> **Intelligent routing across ChatGPT, Claude, Gemini, and more with centralized management, query limiting, and subscription support.**

Get multiple AI perspectives instantly with OpenRouter integration and MCP support for Claude Code.

## ✨ Features

### 🧠 **Intelligent Model Routing**
- **Query complexity analysis** - Automatically routes complex queries to GPT-5, medium queries to Claude Sonnet, simple queries to GPT-4o
- **Priority-based routing** - Urgent queries use fastest models, cost-optimized queries use Gemini Pro
- **Model preferences** - Override automatic routing with preferred models

### 🔐 **Multiple Authentication Methods**
- **CLI Integration** - Uses your existing Codex CLI, Claude Code, Google AI CLI subscriptions
- **API Keys** - Direct API access when CLIs aren't available
- **OpenRouter Integration** - Access 100+ models with unified API
- **Hybrid approach** - Falls back from CLI to API automatically

### 📊 **Usage Management**
- **Tiered subscriptions** - Free (50 queries/month), Pro (1000 queries), Enterprise (10000 queries)
- **Query limiting** - Works even with CLI subscriptions for fair usage
- **Real-time analytics** - Track usage, token consumption, model distribution
- **10% Markup Pricing** - Transparent cost structure with real-time cost tracking

### 🎛️ **Centralized Dashboard**
- **Web interface** - Configure API keys, view analytics, test queries
- **Real-time stats** - Monitor usage limits, processing times, costs
- **Model management** - Enable/disable different LLM providers
- **Quick testing** - Built-in query panel for immediate testing

### 🔌 **MCP Integration**
- **Thin client** - Simple MCP server that routes to central platform
- **Claude Code Native** - First-class integration with Claude Code
- **One-time setup** - Just add platform token, everything else managed centrally
- **Progress tracking** - Real-time updates during query processing

## 🏗️ Architecture

```
┌─────────────────┐    ┌────────────────────┐    ┌─────────────────┐
│   Claude Code   │    │  Thin MCP Client   │    │  Central Backend │
│                 │◄──►│                    │◄──►│                 │
│ (User Interface)│    │ (Minimal Config)   │    │ (Intelligence)  │
└─────────────────┘    └────────────────────┘    └─────────────────┘
                                                           │
                                                           ▼
                                                  ┌─────────────────┐
                                                  │  LLM Adapters   │
                                                  │                 │
                                                  │ ┌─────┐ ┌─────┐ │
                                                  │ │Codex│ │Claude│ │
                                                  │ │ CLI │ │ CLI │ │
                                                  │ └─────┘ └─────┘ │
                                                  │ ┌─────┐ ┌─────┐ │
                                                  │ │ AI  │ │Open │ │
                                                  │ │ CLI │ │Router│ │
                                                  │ └─────┘ └─────┘ │
                                                  └─────────────────┘
```

**Tech Stack:**
- **Backend**: FastAPI with async processing
- **Frontend**: Vue.js dashboard with Tailwind CSS
- **Integration**: OpenRouter API + CLI tools
- **MCP**: Native Model Context Protocol support

## 🚀 Quick Start

### 1. **Start the Platform**
```bash
# You're already in the right directory!
./start.sh
```

This will:
- Create virtual environment
- Install dependencies  
- Start backend server
- Open dashboard in browser

### 2. **Configure Your CLIs**
Make sure you have authenticated CLI tools:

```bash
# Codex CLI (for ChatGPT Plus/Pro)
codex auth

# Claude Code (for Claude Pro)
claude auth

# Google AI CLI (for Gemini)
ai auth
```

### 3. **Set Up MCP Client**
Add to your Claude Code MCP configuration:

```json
{
  "multi-llm-platform": {
    "command": "python3",
    "args": ["/Users/venkat/Documents/jarvis/multi-llm-platform/client/thin_mcp_client.py"],
    "env": {
      "OPENROUTER_API_KEY": "sk-or-v1-..."
    }
  }
}
```

### 4. **Get Platform Token**
1. Visit http://localhost:8000
2. Create account or get your user token
3. In Claude Code, run: `setup_platform_token` with your token

### 5. **Start Querying!**
Use the `query_llm` tool in Claude Code:
```
Can you help me analyze this complex architecture pattern?
```

## 📊 Model Support

### 2025 Models

| Provider | Model | Context | Input Cost | Output Cost |
|----------|-------|---------|------------|-------------|
| OpenAI | GPT-5 | 128K | $1.38/1M | $11.00/1M |
| OpenAI | GPT-4o | 128K | $2.75/1M | $11.00/1M |
| Anthropic | Claude 4.1 Opus | 200K | $16.50/1M | $82.50/1M |
| Anthropic | Claude 3.5 Sonnet | 200K | $3.30/1M | $16.50/1M |
| Google | Gemini 2.5 Pro | 1M | $1.38/1M | $5.50/1M |
| Google | Gemini 2.5 Flash | 1M | $0.08/1M | $0.30/1M |

*All prices include 10% platform markup*

## 🔧 Configuration

### **MCP Tools Available**
- `query_llm` - Send queries with intelligent routing
- `get_perspectives` - Get multiple AI perspectives on any task
- `list_models` - View available models and pricing
- `get_user_status` - Check usage limits and configuration
- `get_analytics` - View detailed usage statistics  
- `setup_platform_token` - Configure authentication
- `health_check` - Check platform status

### **CLI Configuration**
Platform automatically detects and uses available CLIs:
- ✅ **Codex CLI** → GPT-5, GPT-4o models
- ✅ **Claude Code** → Claude 4.1, Claude 3.5 models  
- ✅ **Google AI CLI** → Gemini 2.5 models
- 🔑 **OpenRouter API** → 100+ additional models

### **Dashboard (http://localhost:8000)**
- Configure API keys for all providers
- View usage analytics and query history
- Test queries directly in the web interface
- Manage subscription tier and limits

## 💰 Pricing & Limits

### **Subscription Tiers**
| Tier | Monthly Queries | Features |
|------|----------------|----------|
| **Free** | 50 | Basic routing |
| **Pro** | 1,000 | Analytics, CLI integration |  
| **Enterprise** | 10,000 | Priority routing, team management |

### **Cost Structure**
- **CLI Subscriptions**: Use your existing ChatGPT Plus/Pro, Claude Pro subscriptions
- **API Usage**: 10% markup on all OpenRouter API costs
- **Platform Fee**: Included in subscription tiers

## 📈 Usage Examples

### **Simple Query (→ GPT-4o)**
```json
{
  "message": "What is machine learning?",
  "priority": "normal"
}
```

### **Complex Analysis (→ GPT-5)**  
```json
{
  "message": "Analyze the architectural trade-offs between microservices and monoliths for a 10M user e-commerce platform",
  "priority": "normal"
}
```

### **Multiple Perspectives**
```json
{
  "message": "Help me design a scalable authentication system",
  "get_perspectives": true,
  "models": ["gpt-5", "claude-4.1-opus", "gemini-2.5-pro"]
}
```

## 🚀 Deployment

### Prerequisites
- Node.js 18+
- Python 3.9+
- OpenRouter API key

### Environment Variables
```bash
# OpenRouter
OPENROUTER_API_KEY=sk-or-v1-...

# Optional CLI paths
CODEX_CLI_PATH=/usr/local/bin/codex
CLAUDE_CLI_PATH=/usr/local/bin/claude
GOOGLE_AI_CLI_PATH=/usr/local/bin/ai
```

### Local Development
```bash
# Install dependencies
pip install -r requirements.txt

# Start backend
python backend/main.py

# Open dashboard
open http://localhost:8000
```

## 🔗 Links

- **GitHub**: [github.com/backspacevenkat/polydev](https://github.com/backspacevenkat/polydev)
- **Dashboard**: http://localhost:8000 (local)
- **API Docs**: http://localhost:8000/docs
- **OpenRouter**: [openrouter.ai](https://openrouter.ai)

## 🔮 Roadmap

- [ ] **JWT Authentication** - Proper user auth system
- [ ] **Team Management** - Multi-user organizations
- [ ] **Prompt Templates** - Reusable prompt library
- [ ] **Webhook Support** - Integration notifications
- [ ] **Docker Deployment** - Containerized platform
- [ ] **Cloud Hosting** - Managed SaaS offering

## 📄 License

MIT License - see LICENSE file for details.

---

## 🚨 Getting Started Right Now

**Comprehensive platform ready in under 5 minutes:**

1. `./start.sh` → Platform running (you're already in the right directory!)
2. Configure your existing CLIs (codex, claude, ai)  
3. Add MCP client to Claude Code with the full path above
4. Get platform token from dashboard at http://localhost:8000
5. Start getting intelligent second opinions!

**The future of multi-LLM workflows is here! 🚀**

*Built with ❤️ by the Polydev team*

*Powered by OpenRouter • FastAPI • Vue.js • MCP Protocol*