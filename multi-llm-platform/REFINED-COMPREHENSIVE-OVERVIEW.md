# 🚀 Multi-LLM Perspectives Platform: Refined Comprehensive Overview

## 🎯 **Core Problem Statement (Simplified)**

**The Universal Developer Pain Point**: When developers get stuck, they need multiple expert perspectives quickly, but switching between ChatGPT, Claude, Gemini loses context and wastes time.

**Our Solution**: One tool, one job: `get_perspectives(task, context, n, models)` → returns N raw answers. Your current LLM/agent decides what to do with them.

---

## 🔧 **Product Focus (Scoped)**

### **Single Tool Purpose**
```typescript
// One tool, one job
get_perspectives({
  task: "Why is our React route slow after upgrading?",
  context: {"git_diff":"...", "stack":"react@18", "trace":"..."},
  n: 3,
  models: ["openai/gpt-4o-mini", "anthropic/claude-3.5-sonnet", "google/gemini-1.5-pro"],
  project_memory: "light", // none|light|full
  io_log: true,
  max_messages: 1 // for tool call control
})

// Returns N raw answers, normalized schema
{
  perspectives: [
    {"model":"openai/gpt-4o-mini","content":"Check your bundle size...","tool_call":null},
    {"model":"anthropic/claude-3.5-sonnet","content":"Look at database queries...","tool_call":null},
    {"model":"google/gemini-1.5-pro","content":"Memory leak in WebSocket...","tool_call":null}
  ],
  conversation_id: "c_9f8c...",
  used_project_context: [{"path":"src/app.tsx","snippet":"..."}]
}
```

**No judging, no ranking, no extra ceremony.** Your current LLM/tool decides what to do with the N perspectives.

---

## 🛠️ **Technical Architecture (Simplified)**

### **Core Components**
```yaml
# Minimal, focused stack
Server: FastAPI (single file, 200 lines)
Storage: SQLite (I/O logging only)  
CLI: Python script (works offline)
MCP: Drop-in tool definition
Dashboard: Simple token + key management
```

### **Triple Mode Architecture**
```python
# Mode 1: Managed (we host keys + routing)
# Users subscribe; CLI or MCP calls us; we use our provider keys
persp login --token sk_sub_abc123
persp ask -q "Node service crashes under load" -n 3

# Mode 2: BYO Keys  
# User supplies provider keys via MCP config or dashboard
persp keys set --openai $OPENAI_API_KEY --anthropic $ANTHROPIC_API_KEY
persp ask -q "Optimize Postgres writes" -n 2 --byo

# Mode 3: CLI Subscription Passthrough
# Uses existing authenticated CLIs (codex, claude, ai) with subscription access
persp ask -q "Debug React performance" -n 3 --cli-mode
# Automatically detects: codex (ChatGPT Plus), claude (Claude Pro), ai (Gemini Pro)
```

### **Key Features**

#### **1. Project Memory Toggle**
```bash
# none: just task + context
persp ask -q "Fix this bug" --memory none

# light: ~6 relevant code snippets (~25KB context)
persp ask -q "Fix this bug" --memory light

# full: ~12 relevant code snippets (~60KB context) 
persp ask -q "Fix this bug" --memory full
```

**Implementation**: CLI does local TF-IDF similarity search, selects top-K relevant code snippets, passes as `project_context`. No server-side repo indexing required.

#### **2. I/O Logging**
```bash
# Log all inputs/outputs for analysis
persp ask -q "Debug this" --log --retain 14

# Retrieve conversation later
curl "https://api.yourhost.com/v1/logs/c_9f8c..."
```

**Storage**: SQLite with retention policies (7-30 days), retrievable via conversation_id.

#### **3. Tool Call Control**
```python
# max_messages=1 with tools → stops after first tool call
# Your agent can then execute the tool and continue
{
  "max_messages": 1,
  "tools": [{"type":"function","function":{"name":"fetchMetric",...}}],
  "tool_choice": "auto"
}

# Response includes tool_call so your agent can handle it
{
  "perspectives": [
    {"model":"openai/gpt-4o-mini","content":"","tool_call":{"function":{"name":"fetchMetric","arguments":"..."}}},
    {"model":"anthropic/claude-3.5-sonnet","content":"Check the logs for...","tool_call":null}
  ],
  "message_budget_exhausted": true
}
```

---

## 💰 **Business Model (Simplified)**

### **Revenue Streams**
1. **Managed Subscriptions**
   - **Starter**: $19/month (500 perspectives)
   - **Pro**: $49/month (2,000 perspectives)  
   - **Team**: $149/month (10,000 perspectives)

2. **CLI Subscription Access** (Premium feature)
   - **CLI Access**: $9/month (use existing ChatGPT Plus, Claude Pro, Gemini subscriptions)
   - **CLI Pro**: $19/month (CLI access + project memory + I/O logging)

3. **BYO Usage Tracking** (Optional premium)
   - **Free**: Basic usage tracking
   - **Analytics**: $9/month (detailed usage insights, I/O logging)

4. **Enterprise**
   - **Self-hosted**: $500/month (on-premise deployment)
   - **Custom integration**: $2,000/month (white-label, custom models)

### **Cost Structure (Conservative)**
```yaml
# At 50K perspectives/month
OpenRouter API Costs: $300
Infrastructure (VPS): $25
Total COGS: $325

Revenue (conservative): $2,500
Gross Margin: 87%
```

---

## 🏗️ **Implementation Details**

### **MCP Tool Definition**
```json
{
  "name": "perspectives",
  "version": "0.2.0",
  "tools": [{
    "name": "get_perspectives",
    "description": "Fan-out to multiple LLMs and return N raw perspectives",
    "input_schema": {
      "type": "object",
      "properties": {
        "task": {"type": "string"},
        "context": {"type": "object"},
        "n": {"type": "integer", "default": 3, "minimum": 1, "maximum": 8},
        "models": {"type": "array", "items": {"type": "string"}},
        "project_memory": {"type": "string", "enum": ["none","light","full"], "default": "none"},
        "io_log": {"type": "boolean", "default": false},
        "retain_days": {"type": "integer", "default": 7},
        "max_messages": {"type": "integer", "default": 1},
        "tools": {"type": "array"},
        "tool_choice": {"type": "string", "enum": ["auto","none"], "default": "none"}
      },
      "required": ["task"]
    }
  }]
}
```

### **Server Implementation (FastAPI)**
```python
# server_v2.py - Single file, ~250 lines
class GetReq(BaseModel):
    task: str
    context: Optional[Dict[str, Any]] = None
    n: int = 3
    models: Optional[List[str]] = None
    project_memory: str = "none"
    project_context: Optional[List[Snip]] = None
    io_log: bool = False
    retain_days: int = 7
    max_messages: int = 1
    tools: Optional[List[Dict[str,Any]]] = None
    tool_choice: str = "none"
    providers: Optional[Dict[str, str]] = None
    cli_mode: bool = False  # Use CLI subscription passthrough

@app.post("/v1/perspectives")
async def perspectives(req: GetReq, authorization: Optional[str] = Header(default=None)):
    # 1. Determine mode (managed vs BYO vs CLI)
    if req.cli_mode:
        mode = "cli_subscription"
    elif req.providers:
        mode = "byo"
    else:
        mode = "managed"
    
    # 2. Build messages with optional project context
    messages = make_messages(req.task, req.context, req.project_context)
    
    # 3. Fan out to N models in parallel
    results = await asyncio.gather(*[
        call_model_with_mode(model, messages, mode, req.providers or {}, req.tools, req.tool_choice, req.max_messages)
        for model in (req.models or DEFAULT_MODELS)[:req.n]
    ])
    
    # 4. Optional I/O logging
    if req.io_log:
        conversation_id = persist_io(req, results, req.retain_days)
    
    return GetResp(perspectives=results, conversation_id=conversation_id, mode=mode)

# CLI Adapters for subscription access
class CodexCLIAdapter:
    async def query(self, messages, model="gpt-4o"):
        # Use codex CLI with ChatGPT Plus/Pro subscription
        cmd = ["codex", "chat", "--model", model, "--message", json.dumps(messages)]
        result = await subprocess.run(cmd, capture_output=True, text=True)
        return result.stdout.strip()

class ClaudeCLIAdapter:
    async def query(self, messages, model="claude-3.5-sonnet"):
        # Use claude CLI with Claude Pro subscription  
        cmd = ["claude", "chat", "--model", model]
        for msg in messages:
            cmd.extend(["--message", f"{msg['role']}: {msg['content']}"])
        result = await subprocess.run(cmd, capture_output=True, text=True)
        return result.stdout.strip()

class GeminiCLIAdapter:
    async def query(self, messages, model="gemini-1.5-pro"):
        # Use ai CLI with Gemini subscription
        prompt = "\n".join([f"{msg['role']}: {msg['content']}" for msg in messages])
        cmd = ["ai", "query", "--model", model, prompt]
        result = await subprocess.run(cmd, capture_output=True, text=True)
        return result.stdout.strip()

async def call_model_with_mode(model: str, messages, mode: str, providers: Dict[str,str], tools, tool_choice, max_messages: int):
    if mode == "cli_subscription":
        return await call_via_cli(model, messages)
    elif mode == "byo":
        return await call_model(model, messages, providers, False, tools, tool_choice, max_messages)
    else:  # managed
        return await call_model(model, messages, {}, True, tools, tool_choice, max_messages)

async def call_via_cli(model: str, messages):
    provider = model.split("/")[0]
    try:
        if provider == "openai" and shutil.which("codex"):
            adapter = CodexCLIAdapter()
            content = await adapter.query(messages, model.split("/")[1])
            return {"text": content, "tool_call": None}
        elif provider == "anthropic" and shutil.which("claude"):
            adapter = ClaudeCLIAdapter()
            content = await adapter.query(messages, model.split("/")[1])
            return {"text": content, "tool_call": None}
        elif provider == "google" and shutil.which("ai"):
            adapter = GeminiCLIAdapter()
            content = await adapter.query(messages, model.split("/")[1])
            return {"text": content, "tool_call": None}
        else:
            # Fallback to managed mode if CLI not available
            return await call_model(model, messages, {}, True, None, "none", 1)
    except Exception as e:
        return {"text": f"[cli_error] {e}", "tool_call": None}
```

### **CLI Implementation**
```python
# cli_v2.py - Works managed + BYO, local project memory
def cmd_ask(args):
    # Local project memory retrieval
    proj_ctx = None
    if args.memory != "none":
        budget = 60_000 if args.memory == "full" else 25_000
        k = 12 if args.memory == "full" else 6
        proj_ctx = select_project_snippets(
            args.project_root, args.include, args.exclude, 
            args.query, k, budget
        )
    
    # Call API
    payload = {
        "task": args.query,
        "context": context,
        "project_context": proj_ctx,
        "project_memory": args.memory,
        "io_log": args.log,
        "max_messages": args.max_messages
    }
    
    r = requests.post(f"{server}/v1/perspectives", json=payload)
```

### **Project Memory Implementation**
```python
# Local TF-IDF similarity search
def select_project_snippets(root, includes, excludes, query, k, budget_chars):
    # 1. Gather relevant files
    files = gather_files(root, includes, excludes)
    
    # 2. Chunk into ~120 line snippets  
    snippets = []
    for file in files:
        snippets += chunk_text(file.read_text(), file.path, 120)
    
    # 3. TF-IDF similarity with query
    corpus = [s["snippet"] for s in snippets]
    vectorizer = TfidfVectorizer(min_df=1, stop_words="english")
    vectors = vectorizer.fit_transform(corpus + [query])
    similarities = cosine_similarity(vectors[-1], vectors[:-1]).flatten()
    
    # 4. Select top-K within budget
    top_indices = sorted(range(len(similarities)), 
                        key=lambda i: similarities[i], reverse=True)
    
    selected = []
    used_chars = 0
    for i in top_indices:
        if used_chars + len(snippets[i]["snippet"]) > budget_chars:
            break
        selected.append(snippets[i])
        used_chars += len(snippets[i]["snippet"])
        if len(selected) >= k:
            break
    
    return selected
```

---

## 🚀 **Developer UX Examples**

### **Basic Usage**
```bash
# Managed mode (no keys needed)
persp login --token sk_sub_abc123
persp ask -q "Why is Postgres slow?" -n 3

# BYO keys mode
persp keys set --openai sk-... --anthropic sk-ant-...
persp ask -q "Optimize React renders" -n 2 --byo
```

### **With Project Memory**
```bash
# Include relevant code snippets automatically
persp ask -q "Fix memory leak in WebSocket" --memory light

# Full project context for complex issues
persp ask -q "Refactor authentication system" --memory full
```

### **CLI Subscription Mode**
```bash
# Auto-detect available CLIs and use subscriptions
persp ask -q "Optimize database queries" --cli-mode

# Specify which CLIs to use
persp ask -q "Debug React performance" --cli-mode --models openai/gpt-4o,anthropic/claude-3.5-sonnet

# Mixed mode: CLI + managed fallbacks
persp ask -q "Security audit" --cli-mode --fallback-managed
```

### **MCP Integration (Claude Code)**
```json
{
  "tool_name": "get_perspectives", 
  "arguments": {
    "task": "Why does our API timeout after 30 seconds?",
    "context": {"error_log": "...", "recent_changes": "..."},
    "project_memory": "light",
    "n": 3,
    "models": ["openai/gpt-4o-mini", "anthropic/claude-3.5-sonnet", "google/gemini-1.5-pro"]
  }
}
```

### **With Tool Calls**
```bash
# Stop after first tool call, let your agent handle execution
persp ask -q "Get database metrics" --tools tools.json --tool-choice auto --max-messages 1
```

---

## 📊 **Market Opportunity (Focused)**

### **Target Market**
- **Primary**: Individual developers using Claude Code, Cursor, VS Code
- **Secondary**: Small dev teams (2-10 people) wanting multiple AI perspectives
- **Tertiary**: Companies wanting self-hosted multi-LLM solutions

### **Market Size**
- **Claude Code users**: ~100K active developers
- **Cursor users**: ~500K active developers  
- **VS Code AI extension users**: ~2M active developers
- **Addressable market**: ~200K developers willing to pay for multi-LLM

### **Revenue Projections**
```yaml
Year 1 (Focus: Claude Code integration):
  Users: 2,000
  ARPU: $35/month
  ARR: $840K

Year 2 (Add: VS Code extension):  
  Users: 10,000
  ARPU: $45/month
  ARR: $5.4M

Year 3 (Add: Team features):
  Users: 25,000  
  ARPU: $60/month
  ARR: $18M
```

---

## 🎯 **Key Advantages**

### **1. Ultra-Simple Integration**
- **Drop-in MCP tool** - works in any agent/LLM tool
- **No context switching** - stays in your current workflow
- **Minimal API surface** - one endpoint, predictable responses

### **2. Flexible Modes**
- **Managed**: Zero setup, subscription-based
- **BYO**: Privacy-conscious, cost-controlled  
- **CLI Subscription**: Use existing ChatGPT Plus, Claude Pro, Gemini subscriptions
- **Toggle per request** - same API, different modes

### **3. Privacy-First Project Memory**
- **Local analysis** - no repo upload required
- **Smart selection** - TF-IDF finds relevant snippets
- **Configurable budget** - control context size/cost

### **4. Conversation Logging**
- **Full I/O capture** - debug multi-LLM responses
- **Retention policies** - automatic cleanup
- **Retrievable conversations** - learn from past sessions

### **5. Tool Call Integration**
- **Stops at first tool call** - no multi-turn loops
- **Agent stays in control** - you decide what to execute
- **Predictable behavior** - max_messages caps interaction

---

## 🏆 **Competitive Moats**

### **1. Simplicity**
- **One tool, one job** - easier to integrate than complex orchestration
- **Stateless** - predictable, debuggable, scalable
- **No AI wrapper complexity** - raw model responses

### **2. Privacy + Cost Control**
- **BYO mode** - enterprises keep their keys
- **CLI mode** - use existing subscriptions, no additional costs
- **Local project memory** - no sensitive code uploads  
- **Transparent pricing** - know exactly what you're paying

### **3. Developer Workflow Native**
- **MCP integration** - works in Claude Code out of the box
- **CLI that works offline** - project memory analysis local
- **Tool call passthrough** - respects agent architecture

---

## 📈 **Implementation Roadmap (Tight)**

### **Phase 1: MVP (2 weeks)**
- [ ] FastAPI server with dual modes (managed/BYO)
- [ ] CLI with local project memory (TF-IDF)
- [ ] MCP tool definition and basic integration
- [ ] SQLite I/O logging with retention

### **Phase 2: Polish (2 weeks)**  
- [ ] Dashboard for token/key management
- [ ] Tool call passthrough with max_messages
- [ ] Docker deployment + basic monitoring
- [ ] Claude Code integration testing

### **Phase 3: Scale (4 weeks)**
- [ ] Usage analytics and billing integration
- [ ] VS Code extension (future)
- [ ] Team features and collaboration
- [ ] Enterprise self-hosted deployment

---

## 🎉 **Why This Will Succeed**

### **Market Timing**
- **Multi-LLM need is proven** - developers manually switch between ChatGPT/Claude/Gemini daily
- **Agent architecture is mature** - Claude Code, Cursor, Cline show demand for tool integration
- **Privacy concerns growing** - enterprises want control over their code/keys

### **Technical Advantages**
- **Genuinely simple** - 200 lines of server code vs complex orchestration
- **Actually useful** - solves real daily pain of context switching
- **Privacy-preserving** - local project analysis, optional BYO keys

### **Business Model Strength**  
- **Low technical complexity** - easier to maintain and scale
- **Multiple pricing models** - managed subscriptions + BYO analytics
- **High gross margins** - minimal infrastructure requirements

---

## 🚀 **The Big Picture**

**Vision**: Every developer should be able to get multiple expert AI perspectives without losing context or switching tools.

**Mission**: Build the simplest, most reliable multi-LLM fanout tool that integrates seamlessly into existing developer workflows.

**Core Values**:
- **Simplicity over features** - one tool, one job, done well
- **Privacy by design** - local analysis, optional key hosting
- **Developer workflow native** - works where developers already are

---

## 🎯 **Success Metrics**

### **Product Metrics**
- **Integration success rate**: >95% (MCP tool works first try)
- **Response consistency**: >99% (N models return responses)
- **Context relevance**: >85% (project memory finds useful snippets)

### **Business Metrics**  
- **Monthly active users**: 2K (Year 1) → 25K (Year 3)
- **Conversion rate**: >15% (trial to paid)
- **Net revenue retention**: >110%

### **Technical Metrics**
- **API uptime**: >99.5%
- **Response time**: <3 seconds for 3 perspectives
- **Error rate**: <1% across all providers

---

## 🚀 **Bottom Line**

We're building **the simplest tool that solves the #1 daily developer frustration**: getting stuck and needing multiple expert perspectives.

**Not another complex AI platform.** Just a reliable fanout service that works where developers already are, with the privacy and cost control they need.

**This is the missing piece in every developer's AI toolkit.** 🚀