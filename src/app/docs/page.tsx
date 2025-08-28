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
            <h1>Getting Started with Polydev AI</h1>
            
            <h2 id="introduction">Introduction</h2>
            <p>
              Polydev AI is an advanced Model Context Protocol (MCP) platform that enables seamless integration 
              with multiple language models, OAuth bridges, and comprehensive tooling for AI development.
            </p>
            
            <h3>Key Features</h3>
            <ul>
              <li><strong>Multi-LLM Integration</strong>: Connect to OpenAI, Anthropic, Google AI, and more</li>
              <li><strong>Model Context Protocol</strong>: Industry-standard for AI tool integration</li>
              <li><strong>OAuth Bridges</strong>: Secure authentication flows</li>
              <li><strong>Real-time Analytics</strong>: Monitor usage, costs, and performance</li>
              <li><strong>Developer Tools</strong>: API explorer, SDKs, and documentation</li>
            </ul>

            <h2 id="quick-start">Quick Start</h2>
            <p>Get started with Polydev AI in just a few steps:</p>
            
            <h3>1. Create an Account</h3>
            <pre><code>{`# Sign up at https://polydev.ai
# Verify your email address
# Complete onboarding`}</code></pre>

            <h3>2. Install the CLI</h3>
            <pre><code>{`npm install -g @polydev/cli
# or
yarn global add @polydev/cli
# or  
pip install polydev-cli`}</code></pre>

            <h3>3. Authenticate</h3>
            <pre><code>{`polydev auth login
# Follow the browser authentication flow`}</code></pre>

            <h3>4. Make Your First API Call</h3>
            <pre><code>{`curl -X POST https://api.polydev.ai/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4",
    "messages": [
      {"role": "user", "content": "Hello, Polydev!"}
    ]
  }'`}</code></pre>

            <h2 id="installation">Installation</h2>
            <p>Multiple ways to get started with Polydev AI:</p>

            <h3>CLI Installation</h3>
            <div className="bg-gray-100 p-4 rounded-lg">
              <pre><code>{`# Node.js
npm install -g @polydev/cli

# Python
pip install polydev-cli

# Go
go install github.com/polydev-ai/cli@latest

# Docker
docker run -it polydev/cli`}</code></pre>
            </div>

            <h3>SDK Installation</h3>
            <div className="bg-gray-100 p-4 rounded-lg">
              <pre><code>{`# JavaScript/TypeScript
npm install @polydev/sdk

# Python
pip install polydev-python

# Go
go get github.com/polydev-ai/go-sdk

# Rust
cargo add polydev`}</code></pre>
            </div>

            <h2 id="authentication">Authentication</h2>
            <p>Polydev AI uses API keys for authentication. You can create and manage API keys in your dashboard.</p>
            
            <h3>API Key Types</h3>
            <ul>
              <li><strong>Development</strong>: Rate-limited, for testing and development</li>
              <li><strong>Production</strong>: Full access, for production applications</li>
              <li><strong>Read-only</strong>: Limited to read operations, for analytics</li>
            </ul>

            <h3>Using API Keys</h3>
            <pre><code>{`# In headers
Authorization: Bearer YOUR_API_KEY

# As query parameter (not recommended for production)
?api_key=YOUR_API_KEY

# Environment variable
export POLYDEV_API_KEY=YOUR_API_KEY`}</code></pre>
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
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                Polydev AI
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/dashboard" className="text-gray-500 hover:text-gray-900">Dashboard</Link>
              <Link href="/docs" className="text-blue-600 font-medium">Documentation</Link>
              <Link href="/api-explorer" className="text-gray-500 hover:text-gray-900">API Explorer</Link>
              <Link href="/pricing" className="text-gray-500 hover:text-gray-900">Pricing</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </header>

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