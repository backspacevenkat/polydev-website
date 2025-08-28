'use client'

import { useState } from 'react'
import Link from 'next/link'

interface DocSection {
  id: string
  title: string
  items: {
    title: string
    href: string
    description?: string
  }[]
}

export default function Documentation() {
  const [activeSection, setActiveSection] = useState('getting-started')

  const docSections: DocSection[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      items: [
        { title: 'Introduction', href: '#introduction', description: 'What is Polydev AI?' },
        { title: 'Quick Start', href: '#quick-start', description: 'Get up and running in 5 minutes' },
        { title: 'Installation', href: '#installation', description: 'Install the Polydev CLI and SDKs' },
        { title: 'Authentication', href: '#authentication', description: 'Secure API access' }
      ]
    },
    {
      id: 'mcp-protocol',
      title: 'Model Context Protocol',
      items: [
        { title: 'MCP Overview', href: '#mcp-overview', description: 'Understanding MCP architecture' },
        { title: 'Server Implementation', href: '#server-implementation', description: 'Build custom MCP servers' },
        { title: 'Tool Integration', href: '#tool-integration', description: 'Connect external tools' },
        { title: 'Resource Management', href: '#resource-management', description: 'Handle data and resources' }
      ]
    },
    {
      id: 'multi-llm',
      title: 'Multi-LLM Integration',
      items: [
        { title: 'Supported Models', href: '#supported-models', description: 'Available LLM providers' },
        { title: 'Model Orchestration', href: '#model-orchestration', description: 'Route requests across models' },
        { title: 'Response Comparison', href: '#response-comparison', description: 'Compare model outputs' },
        { title: 'Cost Optimization', href: '#cost-optimization', description: 'Optimize usage costs' }
      ]
    },
    {
      id: 'api-reference',
      title: 'API Reference',
      items: [
        { title: 'REST API', href: '#rest-api', description: 'HTTP API endpoints' },
        { title: 'GraphQL API', href: '#graphql-api', description: 'GraphQL schema and queries' },
        { title: 'WebSocket API', href: '#websocket-api', description: 'Real-time connections' },
        { title: 'SDKs', href: '#sdks', description: 'Language-specific libraries' }
      ]
    },
    {
      id: 'integrations',
      title: 'Integrations',
      items: [
        { title: 'GitHub', href: '#github', description: 'Repository and code management' },
        { title: 'Supabase', href: '#supabase', description: 'Database and auth integration' },
        { title: 'Vercel', href: '#vercel', description: 'Deployment platform' },
        { title: 'Custom Integrations', href: '#custom-integrations', description: 'Build your own' }
      ]
    }
  ]

  const getDocContent = (section: string) => {
    switch (section) {
      case 'getting-started':
        return (
          <div className="prose max-w-none">
            <h1>Polydev Perspectives MCP Server</h1>
            
            <h2 id="introduction">Introduction</h2>
            <p>
              <strong>Never get stuck again.</strong> Polydev Perspectives is an MCP (Model Context Protocol) server that 
              eliminates agent roadblocks by providing instant access to multiple AI perspectives. When your agent encounters 
              a difficult problem, decision paralysis, or complex challenge, our <code>get_perspectives</code> tool fans out 
              queries to GPT-4, Claude 3.5 Sonnet, Gemini Pro, and 20+ other models in parallel, returning diverse expert 
              viewpoints to help break through.
            </p>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 my-8">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Why Multiple AI Perspectives?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-blue-800 font-medium mb-2">Different models have different strengths:</p>
                  <ul className="space-y-1 text-blue-700">
                    <li>• <strong>GPT-4</strong>: Strong reasoning and code generation</li>
                    <li>• <strong>Claude 3.5 Sonnet</strong>: Excellent analysis and explanations</li>
                    <li>• <strong>Gemini Pro</strong>: Creative solutions and alternatives</li>
                  </ul>
                </div>
                <div>
                  <p className="text-blue-800 font-medium mb-2">By consulting multiple models, agents can:</p>
                  <ul className="space-y-1 text-blue-700">
                    <li>✅ Break through decision paralysis</li>
                    <li>✅ Get diverse approaches to complex problems</li>
                    <li>✅ Validate solutions across different AI perspectives</li>
                    <li>✅ Discover blind spots in reasoning</li>
                  </ul>
                </div>
              </div>
            </div>

            <h2 id="quick-start">Quick Start Guide</h2>
            
            <h3>Step 1: Set Up Your API Keys</h3>
            
            <h4>Option A: Your Own API Keys (Recommended)</h4>
            <ol className="list-decimal list-inside space-y-3">
              <li>Create a free account at <a href="/auth" className="text-blue-600 hover:underline font-semibold">polydev.ai/auth</a></li>
              <li>Visit <a href="/dashboard/api-keys" className="text-blue-600 hover:underline font-semibold">Dashboard → API Keys</a></li>
              <li>Add API keys for providers you want to use:
                <div className="ml-6 mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-50 p-3 rounded">
                    <strong className="text-gray-900">Core Providers:</strong>
                    <ul className="mt-1 space-y-1">
                      <li>• <strong>OpenAI</strong>: GPT-4o, GPT-4, GPT-3.5-turbo</li>
                      <li>• <strong>Anthropic</strong>: Claude 3.5 Sonnet, Opus, Haiku</li>
                      <li>• <strong>Google AI</strong>: Gemini 1.5 Pro/Flash</li>
                      <li>• <strong>Groq</strong>: Llama 3.1 70B/8B, Mixtral</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <strong className="text-gray-900">Specialized Providers:</strong>
                    <ul className="mt-1 space-y-1">
                      <li>• <strong>Perplexity</strong>: Web-search enabled models</li>
                      <li>• <strong>Together AI</strong>: Llama 3.1 405B, Qwen2.5</li>
                      <li>• <strong>Cohere</strong>: Command R+</li>
                      <li>• <strong>16+ more providers</strong></li>
                    </ul>
                  </div>
                </div>
              </li>
              <li>Configure custom endpoints, budgets, and rate limits per provider</li>
              <li><strong>Sign in to authenticate</strong> - this enables user_keys mode for full model access</li>
            </ol>

            <h4>Option B: MCP Tokens (Legacy - Limited)</h4>
            <ol className="list-decimal list-inside space-y-2">
              <li>Visit <a href="/dashboard/mcp-tools" className="text-blue-600 hover:underline">Dashboard → MCP Tools</a></li>
              <li>Generate an MCP access token</li>
              <li>Use the token in your tool calls with <code>mode: "managed"</code></li>
            </ol>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-4">
              <p className="text-amber-800 text-sm">⚠️ <strong>Token mode limitations:</strong> Only includes basic models (GPT-4, Claude 3 Sonnet, Gemini Pro) with shared rate limits. Use your own API keys for full access to 20+ providers.</p>
            </div>

            <h3>Step 2: Add to Your MCP Configuration</h3>
            <p>Configure your MCP client to connect to Polydev Perspectives:</p>

            <h4>Claude Desktop</h4>
            <p>Edit <code>~/.config/claude/claude_desktop_config.json</code> (macOS) or <code>%APPDATA%/Claude/claude_desktop_config.json</code> (Windows):</p>
            <pre className="bg-slate-900 text-slate-300 p-4 rounded-lg overflow-x-auto"><code>{`{
  "mcpServers": {
    "polydev-perspectives": {
      "command": "node",
      "args": ["/path/to/polydev/mcp/server.js"],
      "env": {
        "POLYDEV_API_URL": "https://polydev.ai/api/perspectives"
      }
    }
  }
}`}</code></pre>

            <h4>Continue.dev</h4>
            <p>Add to <code>.continue/config.json</code>:</p>
            <pre className="bg-slate-900 text-slate-300 p-4 rounded-lg overflow-x-auto"><code>{`{
  "mcpServers": {
    "polydev-perspectives": {
      "command": "node",
      "args": ["/path/to/polydev/mcp/server.js"],
      "env": {
        "POLYDEV_API_URL": "https://polydev.ai/api/perspectives"
      }
    }
  }
}`}</code></pre>

            <h4>Cursor</h4>
            <p>Add to your Cursor settings → MCP servers:</p>
            <pre className="bg-slate-900 text-slate-300 p-4 rounded-lg overflow-x-auto"><code>{`{
  "mcp": {
    "servers": {
      "polydev-perspectives": {
        "command": "node",
        "args": ["/path/to/polydev/mcp/server.js"],
        "env": {
          "POLYDEV_API_URL": "https://polydev.ai/api/perspectives"
        }
      }
    }
  }
}`}</code></pre>

            <h4>Cline (VS Code Extension)</h4>
            <p>Configure MCP servers in Cline extension settings with similar configuration.</p>

            <h3>Step 3: Test the Integration</h3>
            <p>Restart your MCP client and test the <code>get_perspectives</code> tool:</p>
            
            <h4>With Your Own API Keys (Recommended):</h4>
            <pre className="bg-slate-900 text-slate-300 p-4 rounded-lg overflow-x-auto"><code>{`{
  "name": "get_perspectives",
  "arguments": {
    "prompt": "I'm debugging a React performance issue. The component re-renders excessively but I can't pinpoint why. Help me identify potential causes and solutions.",
    "mode": "user_keys",
    "models": ["gpt-4", "claude-3.5-sonnet", "gemini-1.5-pro", "llama-3.1-70b-versatile"],
    "project_memory": "light"
  }
}`}</code></pre>

            <h4>With MCP Token (Legacy):</h4>
            <pre className="bg-slate-900 text-slate-300 p-4 rounded-lg overflow-x-auto"><code>{`{
  "name": "get_perspectives",
  "arguments": {
    "prompt": "I'm debugging a React performance issue...",
    "user_token": "poly_your_token_here",
    "mode": "managed",
    "models": ["gpt-4", "claude-3-sonnet", "gemini-pro"]
  }
}`}</code></pre>

            <h3>Complete Tool Schema</h3>
            <p>The <code>get_perspectives</code> tool accepts these parameters:</p>
            <pre className="bg-slate-900 text-slate-300 p-4 rounded-lg overflow-x-auto"><code>{`{
  "name": "get_perspectives",
  "description": "Get multiple AI perspectives on a problem to break through roadblocks",
  "inputSchema": {
    "type": "object",
    "properties": {
      "prompt": {
        "type": "string", 
        "description": "The problem or question to get perspectives on"
      },
      "mode": {
        "type": "string",
        "enum": ["user_keys", "managed"],
        "description": "user_keys (your API keys) or managed (MCP token)"
      },
      "models": {
        "type": "array",
        "items": {"type": "string"},
        "description": "List of models to query in parallel"
      },
      "user_token": {
        "type": "string",
        "description": "Required for managed mode only"
      },
      "temperature": {
        "type": "number",
        "description": "Temperature for responses (0.1-1.0, default: 0.7)"
      },
      "project_memory": {
        "type": "string",
        "enum": ["none", "light", "full"],
        "description": "Include project context: none, light (recent files), full (similarity search)"
      },
      "project_context": {
        "type": "object",
        "description": "Project path and file patterns for context"
      }
    },
    "required": ["prompt"]
  }
}`}</code></pre>

            <h2 id="authentication">Authentication Details</h2>
            
            <h3>User Keys Mode (Recommended)</h3>
            <p>When using your own API keys, you get:</p>
            <ul className="space-y-2">
              <li>✅ <strong>Full model access</strong>: 20+ providers with all their models</li>
              <li>✅ <strong>Your rate limits</strong>: Use your own quotas and limits</li>
              <li>✅ <strong>Custom configurations</strong>: Set budgets, rate limits per provider</li>
              <li>✅ <strong>Best performance</strong>: Direct API access without shared bottlenecks</li>
            </ul>
            
            <p>To use user keys mode:</p>
            <ol className="list-decimal list-inside space-y-2">
              <li>Sign in to your Polydev account in the MCP client</li>
              <li>Add your API keys via the dashboard</li>
              <li>Use <code>"mode": "user_keys"</code> in your tool calls</li>
              <li>No token required - authentication handled by your signed-in session</li>
            </ol>

            <h3>MCP Token Mode (Legacy)</h3>
            <p>Limited access with managed keys:</p>
            <ul className="space-y-2">
              <li>⚠️ <strong>Basic models only</strong>: GPT-4, Claude 3 Sonnet, Gemini Pro</li>
              <li>⚠️ <strong>Shared rate limits</strong>: May hit limits during peak usage</li>
              <li>⚠️ <strong>No customization</strong>: Fixed configuration</li>
            </ul>

            <h3>Project Memory Integration</h3>
            <p>Enhance perspectives with your project context:</p>
            <ul className="space-y-2">
              <li><strong>none</strong>: No project context (fastest)</li>
              <li><strong>light</strong>: Include recently modified files</li>
              <li><strong>full</strong>: TF-IDF similarity matching for most relevant code</li>
            </ul>

            <pre className="bg-slate-900 text-slate-300 p-4 rounded-lg overflow-x-auto"><code>{`{
  "prompt": "How can I optimize this database query performance?",
  "mode": "user_keys",
  "project_memory": "full",
  "project_context": {
    "root_path": "/workspace/myapp",
    "includes": ["**/*.sql", "**/*.js", "**/*.ts"],
    "excludes": ["node_modules/**", "dist/**", "*.log"]
  }
}`}</code></pre>

            <h2 id="usage-examples">Real-World Agent Use Cases</h2>
            
            <h3>🐛 Debugging Roadblocks</h3>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
              <h4 className="font-semibold text-red-900 mb-2">Scenario: SQL Performance Mystery</h4>
              <p className="text-red-800 text-sm mb-3">Your agent is stuck - the SQL query has indexes but is still slow despite standard optimizations.</p>
              <pre className="bg-slate-900 text-slate-300 p-3 rounded text-xs overflow-x-auto"><code>{`{
  "name": "get_perspectives",
  "arguments": {
    "prompt": "My SQL query is slow despite having indexes. I've tried standard optimizations but performance is still poor. The query joins 3 tables and filters by date range. What advanced optimizations am I missing?",
    "mode": "user_keys",
    "models": ["gpt-4", "claude-3.5-sonnet", "gemini-1.5-pro"],
    "project_memory": "full",
    "temperature": 0.3
  }
}`}</code></pre>
            </div>

            <h3>🏗️ Architecture Decisions</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-4">
              <h4 className="font-semibold text-blue-900 mb-2">Scenario: Microservices vs Monolith</h4>
              <p className="text-blue-800 text-sm mb-3">Your agent needs expert perspectives on architectural trade-offs for a fintech application.</p>
              <pre className="bg-slate-900 text-slate-300 p-3 rounded text-xs overflow-x-auto"><code>{`{
  "name": "get_perspectives",
  "arguments": {
    "prompt": "I'm choosing between microservices and monolith architecture for a fintech app that needs to handle payments, user management, and compliance reporting. I need multiple expert perspectives on trade-offs, security implications, and scalability considerations.",
    "mode": "user_keys",
    "models": ["gpt-4", "claude-3-opus", "llama-3.1-405b-reasoning"],
    "temperature": 0.4
  }
}`}</code></pre>
            </div>

            <h3>🔍 Code Review & Security</h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-4">
              <h4 className="font-semibold text-green-900 mb-2">Scenario: Authentication Security Review</h4>
              <p className="text-green-800 text-sm mb-3">Your agent wants multiple security-focused perspectives on an authentication module.</p>
              <pre className="bg-slate-900 text-slate-300 p-3 rounded text-xs overflow-x-auto"><code>{`{
  "name": "get_perspectives",
  "arguments": {
    "prompt": "Review this authentication module for security vulnerabilities and suggest improvements. I want multiple security-focused perspectives on JWT handling, password policies, and session management.",
    "mode": "user_keys",
    "models": ["gpt-4", "claude-3.5-sonnet", "gemini-1.5-pro"],
    "project_memory": "full",
    "project_context": {
      "root_path": "/workspace/auth-service",
      "includes": ["**/*.js", "**/*.ts", "**/auth/**", "**/middleware/**"],
      "excludes": ["node_modules/**", "tests/**", "*.log"]
    },
    "temperature": 0.2
  }
}`}</code></pre>
            </div>

            <h3>🔧 Problem-Solving Stuck Points</h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-4">
              <h4 className="font-semibold text-yellow-900 mb-2">Scenario: OAuth2 Implementation Issues</h4>
              <p className="text-yellow-800 text-sm mb-3">Your agent is stuck with cryptic OAuth2 PKCE errors and unclear documentation.</p>
              <pre className="bg-slate-900 text-slate-300 p-3 rounded text-xs overflow-x-auto"><code>{`{
  "name": "get_perspectives",
  "arguments": {
    "prompt": "I'm implementing OAuth2 PKCE flow but getting 'invalid_request' errors. The documentation is unclear about parameter encoding, code_challenge generation, and redirect URI handling. Help me troubleshoot step by step.",
    "mode": "user_keys",
    "models": ["gpt-4", "claude-3.5-sonnet", "gemini-1.5-pro", "llama-3.1-sonar-large-128k-online"],
    "temperature": 0.3
  }
}`}</code></pre>
            </div>

            <h2 id="response-format">Response Format</h2>
            <p>Polydev returns formatted perspectives that your agent can directly process:</p>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 my-4">
              <pre className="text-sm"><code>{`# Multiple AI Perspectives

Got 3 perspectives in 1247ms using 892 tokens.

## GPT-4 Perspective

The performance issue likely stems from unnecessary re-renders caused by objects being recreated on every render. Here are the key areas to investigate:

1. **Inline object creation in JSX**: Check if you're creating objects directly in render methods
2. **useEffect dependencies**: Ensure dependency arrays don't contain objects that change reference
3. **Context value changes**: If using React Context, make sure the value isn't recreated each render

*Tokens: 234, Latency: 1100ms*

---

## CLAUDE-3.5-SONNET Perspective

Looking at React performance optimization, I'd focus on these systematic approaches:

1. **Profiler analysis**: Use React DevTools Profiler to identify which components re-render
2. **Memoization strategy**: Apply React.memo, useMemo, and useCallback strategically
3. **State structure**: Consider if state is normalized and properly scoped

The root cause is often improper memoization or state management patterns.

*Tokens: 198, Latency: 987ms*

---

## GEMINI-1.5-PRO Perspective

From a different angle, consider these React optimization strategies:

1. **Component tree analysis**: Look for parent components that re-render unnecessarily
2. **Props drilling**: Check if you're passing down props that frequently change
3. **Virtual DOM overhead**: Sometimes splitting components can reduce reconciliation work

I'd recommend starting with the React Profiler to get concrete data before optimizing.

*Tokens: 156, Latency: 892ms*`}</code></pre>
            </div>

            <h2 id="best-practices">Best Practices for Agents</h2>
            
            <h3>1. Be Specific in Prompts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-900 mb-2">❌ Too Generic</h4>
                <code className="text-sm text-red-800">"Help me with this code"</code>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2">✅ Specific & Actionable</h4>
                <code className="text-sm text-green-800">"This React component re-renders on every state change even with useMemo. Help me identify why the memoization isn't working."</code>
              </div>
            </div>

            <h3>2. Choose the Right Models</h3>
            <ul className="space-y-3">
              <li><strong>All models</strong> - For diverse perspectives and creative solutions</li>
              <li><strong>GPT-4 + Claude 3.5 Sonnet</strong> - For technical accuracy and analysis</li>
              <li><strong>Gemini + Perplexity Sonar</strong> - For research and latest information</li>
              <li><strong>Llama 3.1 405B</strong> - For complex reasoning and mathematical problems</li>
            </ul>

            <h3>3. Use Project Memory Strategically</h3>
            <ul className="space-y-2">
              <li><strong>none</strong>: For general questions not tied to your codebase</li>
              <li><strong>light</strong>: For debugging issues in recently modified files</li>
              <li><strong>full</strong>: For complex architectural decisions requiring deep context</li>
            </ul>

            <h3>4. Handle Responses Intelligently</h3>
            <pre className="bg-slate-900 text-slate-300 p-4 rounded-lg overflow-x-auto"><code>{`// Agent logic example
const perspectives = await getPerspectives({
  prompt: "How do I fix this memory leak?",
  models: ["gpt-4", "claude-3.5-sonnet", "gemini-1.5-pro"]
});

// Extract common themes across responses
const commonSolutions = findCommonAdvice(perspectives.responses);
const quickWins = findImmediateSolutions(perspectives.responses);

// Prioritize solutions mentioned by multiple models
if (commonSolutions.length > 0) {
  return implementSolution(commonSolutions[0]);
} else if (quickWins.length > 0) {
  return implementSolution(quickWins[0]);
}

// If no consensus, ask for more specific guidance
return requestMoreSpecificHelp();`}</code></pre>

            <h2 id="troubleshooting">Troubleshooting</h2>
            
            <h3>Common Issues</h3>
            
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-900 mb-2">❌ "Authentication failed"</h4>
                <ul className="text-red-800 text-sm space-y-1">
                  <li>• Generate new token at <a href="/dashboard/mcp-tools" className="underline">dashboard/mcp-tools</a></li>
                  <li>• Check token isn't expired</li>
                  <li>• Ensure proper token format (<code>poly_...</code>)</li>
                  <li>• For user_keys mode: Make sure you're signed in</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-900 mb-2">⚠️ "No perspectives received"</h4>
                <ul className="text-yellow-800 text-sm space-y-1">
                  <li>• Check internet connectivity</li>
                  <li>• Verify prompt isn't empty</li>
                  <li>• Try with default models: <code>["gpt-4", "claude-3-sonnet"]</code></li>
                  <li>• Check if you've hit rate limits</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">🔧 "Project memory not working"</h4>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• Ensure root_path exists and is accessible</li>
                  <li>• Check file patterns include target files</li>
                  <li>• Verify sufficient disk space for caching</li>
                  <li>• Try with <code>project_memory: "light"</code> first</li>
                </ul>
              </div>
            </div>

            <h3>Debug Mode</h3>
            <pre className="bg-slate-900 text-slate-300 p-4 rounded-lg overflow-x-auto"><code>{`# Enable debug logging in MCP server
export POLYDEV_DEBUG=1
node /path/to/polydev/mcp/server.js

# Check MCP client logs
tail -f ~/.config/claude/mcp_debug.log`}</code></pre>
          </div>
        )

      case 'mcp-protocol':
        return (
          <div className="prose max-w-none">
            <h1>Model Context Protocol (MCP)</h1>
            
            <h2 id="mcp-overview">MCP Overview</h2>
            <p>
              The Model Context Protocol (MCP) is an open-source standard for connecting AI models with external data sources and tools.
              Polydev AI implements MCP to provide seamless integration with various services and APIs.
            </p>

            <h3>Architecture</h3>
            <div className="bg-blue-50 p-6 rounded-lg">
              <pre><code>{`┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Client    │────│ MCP Server  │────│  Resource   │
│ (AI Model)  │    │ (Polydev)   │    │ (Database)  │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       │                   │                   │
   ┌───▼───┐          ┌────▼────┐         ┌────▼────┐
   │Tools  │          │Protocol │         │  Data   │
   │Context│          │Messages │         │Sources  │
   └───────┘          └─────────┘         └─────────┘`}</code></pre>
            </div>

            <h2 id="server-implementation">Server Implementation</h2>
            <p>Create custom MCP servers to connect your tools and data sources:</p>

            <h3>Basic Server</h3>
            <pre><code>{`import { Server } from '@polydev/mcp-server'

const server = new Server({
  name: 'my-custom-server',
  version: '1.0.0'
})

// Register tools
server.registerTool({
  name: 'get_weather',
  description: 'Get current weather for a location',
  schema: {
    type: 'object',
    properties: {
      location: { type: 'string' }
    }
  },
  handler: async ({ location }) => {
    // Implementation
    return { temperature: 72, conditions: 'sunny' }
  }
})

server.start()`}</code></pre>

            <h3>Advanced Features</h3>
            <ul>
              <li>Resource management and streaming</li>
              <li>Authentication and authorization</li>
              <li>Error handling and logging</li>
              <li>Performance monitoring</li>
            </ul>

            <h2 id="tool-integration">Tool Integration</h2>
            <p>Connect external tools and APIs to your MCP server:</p>

            <pre><code>{`// Database integration
server.registerTool({
  name: 'query_database',
  description: 'Execute SQL queries',
  handler: async ({ query }) => {
    const result = await db.query(query)
    return result
  }
})

// API integration
server.registerTool({
  name: 'call_external_api',
  description: 'Make HTTP requests',
  handler: async ({ url, method, data }) => {
    const response = await fetch(url, { method, body: data })
    return response.json()
  }
})`}</code></pre>

            <h2 id="resource-management">Resource Management</h2>
            <p>Handle data sources and file systems:</p>

            <pre><code>{`// File system resource
server.registerResource({
  name: 'file',
  description: 'Access file system',
  handler: {
    list: async (path) => {
      return fs.readdir(path)
    },
    read: async (path) => {
      return fs.readFile(path, 'utf8')
    },
    write: async (path, content) => {
      return fs.writeFile(path, content)
    }
  }
})`}</code></pre>
          </div>
        )

      case 'multi-llm':
        return (
          <div className="prose max-w-none">
            <h1>Multi-LLM Integration</h1>

            <h2 id="supported-models">Supported Models</h2>
            <p>Polydev AI supports all major language model providers:</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose">
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">OpenAI</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• GPT-4o</li>
                  <li>• GPT-4 Turbo</li>
                  <li>• GPT-3.5 Turbo</li>
                  <li>• DALL-E 3</li>
                </ul>
              </div>
              
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Anthropic</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Claude 3.5 Sonnet</li>
                  <li>• Claude 3 Opus</li>
                  <li>• Claude 3 Haiku</li>
                  <li>• Claude Instant</li>
                </ul>
              </div>
              
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Google AI</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Gemini Pro</li>
                  <li>• Gemini Ultra</li>
                  <li>• PaLM 2</li>
                  <li>• Bard</li>
                </ul>
              </div>
              
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Meta</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Llama 3.1 70B</li>
                  <li>• Llama 3.1 8B</li>
                  <li>• Code Llama</li>
                  <li>• Llama Guard</li>
                </ul>
              </div>
            </div>

            <h2 id="model-orchestration">Model Orchestration</h2>
            <p>Route requests intelligently across different models:</p>

            <pre><code>{`// Smart routing configuration
const orchestration = {
  rules: [
    {
      condition: 'task === "code"',
      model: 'gpt-4',
      fallback: 'claude-3-opus'
    },
    {
      condition: 'length > 10000',
      model: 'claude-3-opus',
      fallback: 'gpt-4-turbo'
    },
    {
      condition: 'cost_sensitive === true',
      model: 'gpt-3.5-turbo',
      fallback: 'claude-haiku'
    }
  ],
  default: 'gpt-4'
}`}</code></pre>

            <h3>Load Balancing</h3>
            <pre><code>{`// Distribute load across models
const loadBalancer = {
  strategy: 'round_robin', // or 'least_latency', 'least_cost'
  models: [
    { id: 'gpt-4', weight: 0.4 },
    { id: 'claude-3-opus', weight: 0.4 },
    { id: 'gemini-pro', weight: 0.2 }
  ]
}`}</code></pre>

            <h2 id="response-comparison">Response Comparison</h2>
            <p>Compare outputs from multiple models simultaneously:</p>

            <pre><code>{`POST /v1/compare
{
  "models": ["gpt-4", "claude-3-opus", "gemini-pro"],
  "prompt": "Explain quantum computing",
  "parameters": {
    "temperature": 0.7,
    "max_tokens": 500
  }
}`}</code></pre>

            <h3>Response Format</h3>
            <pre><code>{`{
  "comparison_id": "comp_123456",
  "responses": [
    {
      "model": "gpt-4",
      "response": "Quantum computing is...",
      "metrics": {
        "latency": 1200,
        "tokens": 487,
        "cost": 0.024
      }
    },
    {
      "model": "claude-3-opus", 
      "response": "Quantum computing represents...",
      "metrics": {
        "latency": 950,
        "tokens": 523,
        "cost": 0.031
      }
    }
  ],
  "analysis": {
    "best_for_speed": "claude-3-opus",
    "best_for_cost": "gpt-4", 
    "most_detailed": "claude-3-opus"
  }
}`}</code></pre>

            <h2 id="cost-optimization">Cost Optimization</h2>
            <p>Strategies to minimize API costs while maintaining quality:</p>

            <h3>Caching Strategy</h3>
            <pre><code>{`// Semantic caching
const cacheConfig = {
  enabled: true,
  similarity_threshold: 0.95,
  ttl: 3600, // 1 hour
  max_size: '1GB'
}

// Response caching reduces costs by ~60%`}</code></pre>

            <h3>Model Selection</h3>
            <pre><code>{`// Cost-aware model selection
const costOptimization = {
  budget_daily: 100.00,
  prefer_cheaper: true,
  quality_threshold: 0.8,
  escalation_rules: [
    {
      trigger: 'daily_cost > budget_daily * 0.8',
      action: 'switch_to_cheaper_model'
    }
  ]
}`}</code></pre>
          </div>
        )

      case 'api-reference':
        return (
          <div className="prose max-w-none">
            <h1>API Reference</h1>

            <h2 id="rest-api">REST API</h2>
            <p>The Polydev AI REST API provides HTTP endpoints for all platform features.</p>

            <h3>Base URL</h3>
            <pre><code>https://api.polydev.ai/v1</code></pre>

            <h3>Authentication</h3>
            <pre><code>{`Authorization: Bearer YOUR_API_KEY`}</code></pre>

            <h3>Chat Completions</h3>
            <div className="bg-green-50 p-4 rounded-lg">
              <strong>POST</strong> <code>/chat/completions</code>
            </div>

            <pre><code>{`curl -X POST https://api.polydev.ai/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4",
    "messages": [
      {
        "role": "system",
        "content": "You are a helpful assistant."
      },
      {
        "role": "user", 
        "content": "Hello!"
      }
    ],
    "temperature": 0.7,
    "max_tokens": 150
  }'`}</code></pre>

            <h3>MCP Server Management</h3>
            <div className="bg-blue-50 p-4 rounded-lg">
              <strong>GET</strong> <code>/mcp/servers</code> - List MCP servers<br/>
              <strong>POST</strong> <code>/mcp/servers</code> - Create MCP server<br/>
              <strong>GET</strong> <code>/mcp/servers/{'{id}'}</code> - Get MCP server<br/>
              <strong>PUT</strong> <code>/mcp/servers/{'{id}'}</code> - Update MCP server<br/>
              <strong>DELETE</strong> <code>/mcp/servers/{'{id}'}</code> - Delete MCP server
            </div>

            <h3>Model Comparison</h3>
            <div className="bg-purple-50 p-4 rounded-lg">
              <strong>POST</strong> <code>/compare</code>
            </div>

            <pre><code>{`{
  "models": ["gpt-4", "claude-3-opus"],
  "prompt": "Explain machine learning",
  "parameters": {
    "temperature": 0.7,
    "max_tokens": 300
  }
}`}</code></pre>

            <h2 id="graphql-api">GraphQL API</h2>
            <p>For more complex queries and real-time subscriptions.</p>

            <h3>Endpoint</h3>
            <pre><code>https://api.polydev.ai/graphql</code></pre>

            <h3>Example Query</h3>
            <pre><code>{`query GetDashboardData {
  user {
    id
    email
    subscription {
      plan
      usage {
        requests
        cost
      }
    }
  }
  mcpServers {
    id
    name
    status
    tools {
      name
      description
    }
  }
  llmProviders {
    id
    name
    models {
      id
      name
      pricing {
        input
        output
      }
    }
  }
}`}</code></pre>

            <h3>Subscriptions</h3>
            <pre><code>{`subscription SystemHealth {
  systemStatus {
    timestamp
    mcpServers {
      id
      status
      responseTime
    }
    llmProviders {
      id
      status
      latency
    }
  }
}`}</code></pre>

            <h2 id="websocket-api">WebSocket API</h2>
            <p>Real-time communication for streaming responses and live updates.</p>

            <h3>Connection</h3>
            <pre><code>{`const ws = new WebSocket('wss://api.polydev.ai/v1/ws');
ws.addEventListener('open', () => {
  ws.send(JSON.stringify({
    type: 'auth',
    token: 'YOUR_API_KEY'
  }));
});`}</code></pre>

            <h3>Streaming Chat</h3>
            <pre><code>{`ws.send(JSON.stringify({
  type: 'chat.stream',
  data: {
    model: 'gpt-4',
    messages: [
      { role: 'user', content: 'Hello!' }
    ],
    stream: true
  }
}));`}</code></pre>

            <h2 id="sdks">SDKs</h2>
            <p>Official SDKs for popular programming languages.</p>

            <h3>JavaScript/TypeScript</h3>
            <pre><code>{`import { PolydevAI } from '@polydev/sdk'

const polydev = new PolydevAI({
  apiKey: process.env.POLYDEV_API_KEY
})

const response = await polydev.chat.completions.create({
  model: 'gpt-4',
  messages: [{ role: 'user', content: 'Hello!' }]
})`}</code></pre>

            <h3>Python</h3>
            <pre><code>{`import polydev

client = polydev.PolydevAI(
    api_key=os.environ.get("POLYDEV_API_KEY")
)

response = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "Hello!"}]
)`}</code></pre>

            <h3>Go</h3>
            <pre><code>{`package main

import (
    "github.com/polydev-ai/go-sdk"
)

func main() {
    client := polydev.NewClient(
        polydev.WithAPIKey(os.Getenv("POLYDEV_API_KEY")),
    )
    
    response, err := client.Chat.Completions.Create(ctx, &polydev.ChatRequest{
        Model: "gpt-4",
        Messages: []polydev.Message{
            {Role: "user", Content: "Hello!"},
        },
    })
}`}</code></pre>
          </div>
        )

      case 'integrations':
        return (
          <div className="prose max-w-none">
            <h1>Integrations</h1>

            <h2 id="github">GitHub Integration</h2>
            <p>Connect your GitHub repositories for code analysis, issue management, and automated workflows.</p>

            <h3>Setup</h3>
            <pre><code>{`# Install GitHub MCP server
polydev mcp install github

# Configure authentication
polydev mcp configure github \\
  --token YOUR_GITHUB_TOKEN \\
  --repositories "owner/repo1,owner/repo2"`}</code></pre>

            <h3>Available Tools</h3>
            <ul>
              <li><strong>Repository Management</strong>: List, create, update repositories</li>
              <li><strong>Issue Tracking</strong>: Create, update, search issues and PRs</li>
              <li><strong>Code Analysis</strong>: Read files, analyze code structure</li>
              <li><strong>Commit History</strong>: Access commit logs and diffs</li>
              <li><strong>Branch Operations</strong>: Create, merge, delete branches</li>
            </ul>

            <h3>Example Usage</h3>
            <pre><code>{`// Analyze repository structure
const analysis = await polydev.tools.github.analyzeRepository({
  owner: 'polydev-ai',
  repo: 'platform'
})

// Create issue from AI conversation
const issue = await polydev.tools.github.createIssue({
  owner: 'polydev-ai',
  repo: 'platform',
  title: 'Bug: API rate limiting',
  body: 'Discovered during AI analysis...',
  labels: ['bug', 'api']
})`}</code></pre>

            <h2 id="supabase">Supabase Integration</h2>
            <p>Database operations, authentication, and real-time subscriptions.</p>

            <h3>Configuration</h3>
            <pre><code>{`# Install Supabase MCP server
polydev mcp install supabase

# Configure connection
polydev mcp configure supabase \\
  --url YOUR_SUPABASE_URL \\
  --key YOUR_SUPABASE_ANON_KEY \\
  --service-key YOUR_SERVICE_ROLE_KEY`}</code></pre>

            <h3>Database Operations</h3>
            <pre><code>{`// Query data
const users = await polydev.tools.supabase.select({
  table: 'users',
  columns: ['id', 'email', 'created_at'],
  filters: { active: true }
})

// Insert data
const newUser = await polydev.tools.supabase.insert({
  table: 'users',
  data: {
    email: 'user@example.com',
    active: true
  }
})

// Real-time subscription
const subscription = polydev.tools.supabase.subscribe({
  table: 'messages',
  event: 'INSERT',
  callback: (payload) => {
    console.log('New message:', payload.new)
  }
})`}</code></pre>

            <h3>Authentication</h3>
            <pre><code>{`// Sign up user
const { user, error } = await polydev.tools.supabase.auth.signUp({
  email: 'user@example.com',
  password: 'secure-password'
})

// Sign in with OAuth
const { user, session } = await polydev.tools.supabase.auth.signInWithOAuth({
  provider: 'github'
})`}</code></pre>

            <h2 id="vercel">Vercel Integration</h2>
            <p>Deployment management and serverless function orchestration.</p>

            <h3>Setup</h3>
            <pre><code>{`# Install Vercel MCP server  
polydev mcp install vercel

# Configure with your team
polydev mcp configure vercel \\
  --token YOUR_VERCEL_TOKEN \\
  --team YOUR_TEAM_ID`}</code></pre>

            <h3>Deployment Management</h3>
            <pre><code>{`// List deployments
const deployments = await polydev.tools.vercel.getDeployments({
  projectId: 'prj_your-project-id'
})

// Create deployment
const deployment = await polydev.tools.vercel.createDeployment({
  name: 'my-app',
  files: [
    { file: 'index.js', data: 'console.log("Hello World")' }
  ],
  projectSettings: {
    framework: 'nextjs'
  }
})

// Get deployment logs
const logs = await polydev.tools.vercel.getDeploymentLogs({
  deploymentId: deployment.id
})`}</code></pre>

            <h3>Domain Management</h3>
            <pre><code>{`// Add custom domain
const domain = await polydev.tools.vercel.addDomain({
  name: 'myapp.com',
  projectId: 'prj_your-project-id'
})

// Configure DNS records
const dnsRecord = await polydev.tools.vercel.createDNSRecord({
  domain: 'myapp.com',
  type: 'CNAME',
  name: 'api',
  value: 'api-server.herokuapp.com'
})`}</code></pre>

            <h2 id="custom-integrations">Custom Integrations</h2>
            <p>Build your own MCP server for custom tools and APIs.</p>

            <h3>Server Template</h3>
            <pre><code>{`import { MCPServer, Tool, Resource } from '@polydev/mcp-sdk'

class CustomServer extends MCPServer {
  constructor() {
    super({
      name: 'custom-integration',
      version: '1.0.0',
      description: 'My custom MCP server'
    })
  }

  async initialize() {
    // Register tools
    this.registerTool(new CustomTool())
    
    // Register resources
    this.registerResource(new CustomResource())
    
    // Start server
    await this.start()
  }
}

class CustomTool extends Tool {
  constructor() {
    super({
      name: 'custom_action',
      description: 'Performs a custom action',
      schema: {
        type: 'object',
        properties: {
          input: { type: 'string' }
        },
        required: ['input']
      }
    })
  }

  async execute(params) {
    // Custom implementation
    return { result: \`Processed: \${params.input}\` }
  }
}`}</code></pre>

            <h3>Publishing Your Server</h3>
            <pre><code>{`# Package your server
npm pack

# Publish to MCP registry
polydev mcp publish ./my-server.tgz

# Install from registry
polydev mcp install my-custom-server`}</code></pre>

            <h3>Best Practices</h3>
            <ul>
              <li><strong>Error Handling</strong>: Implement comprehensive error handling</li>
              <li><strong>Logging</strong>: Add detailed logging for debugging</li>
              <li><strong>Testing</strong>: Write unit and integration tests</li>
              <li><strong>Documentation</strong>: Provide clear API documentation</li>
              <li><strong>Security</strong>: Validate inputs and secure credentials</li>
            </ul>
          </div>
        )

      default:
        return <div>Select a section to view documentation</div>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Documentation</h2>
              <nav className="space-y-2">
                {docSections.map((section) => (
                  <div key={section.id}>
                    <button
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg font-medium ${
                        activeSection === section.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {section.title}
                    </button>
                    {activeSection === section.id && (
                      <div className="ml-4 mt-2 space-y-1">
                        {section.items.map((item) => (
                          <a
                            key={item.href}
                            href={item.href}
                            className="block px-3 py-1 text-sm text-gray-500 hover:text-gray-700"
                          >
                            {item.title}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow p-8">
              {getDocContent(activeSection)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}