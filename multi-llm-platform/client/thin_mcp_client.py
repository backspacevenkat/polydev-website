#!/usr/bin/env python3
"""
Multi-LLM Platform - Thin MCP Client
Minimal configuration client that routes all requests to central platform
"""

import asyncio
import json
import os
import httpx
from datetime import datetime
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import TextContent, Tool

app = Server("multi-llm-platform")

class PlatformClient:
    def __init__(self):
        # Minimal configuration - just platform connection
        self.platform_url = os.getenv('MULTI_LLM_PLATFORM_URL', 'http://localhost:8000')
        self.user_token = self.load_user_token()
        self.session = httpx.AsyncClient(timeout=120.0)
    
    def load_user_token(self):
        """Load user token from config file or environment"""
        # Priority 1: Environment variable
        token = os.getenv('MULTI_LLM_PLATFORM_TOKEN')
        if token:
            return token
            
        # Priority 2: Config file
        config_file = os.path.expanduser("~/.config/multi-llm-platform/token")
        if os.path.exists(config_file):
            with open(config_file, 'r') as f:
                return f.read().strip()
        
        return None
    
    def save_user_token(self, token):
        """Save user token to config file"""
        config_dir = os.path.expanduser("~/.config/multi-llm-platform")
        os.makedirs(config_dir, exist_ok=True)
        
        with open(f"{config_dir}/token", 'w') as f:
            f.write(token)
    
    async def execute_query(self, message, system_prompt=None, preferred_model=None, preferred_provider=None, priority="normal"):
        """Execute query via central platform"""
        if not self.user_token:
            return "❌ Platform token required. Run the 'setup_platform_token' tool first."
        
        try:
            query_data = {
                "message": message,
                "priority": priority
            }
            
            if system_prompt:
                query_data["system_prompt"] = system_prompt
            if preferred_model:
                query_data["preferred_model"] = preferred_model
            if preferred_provider:
                query_data["preferred_provider"] = preferred_provider
            
            response = await self.session.post(
                f"{self.platform_url}/api/query",
                headers={
                    "Authorization": f"Bearer {self.user_token}",
                    "Content-Type": "application/json"
                },
                json=query_data
            )
            
            if response.status_code == 401:
                return "❌ Invalid platform token. Please check your authentication."
            elif response.status_code == 429:
                return "❌ Query limit exceeded. Please upgrade your plan or wait for reset."
            elif response.status_code != 200:
                return f"❌ Platform error ({response.status_code}): {response.text}"
            
            data = response.json()
            
            # Format response with platform info
            result = f"🤖 **{data['model_used']}** (via Multi-LLM Platform)\n"
            result += f"📊 Tokens: {data['tokens_used']} | Time: {data['processing_time']:.2f}s\n"
            if data.get('cost_estimate'):
                result += f"💰 Cost: ${data['cost_estimate']:.4f}\n"
            result += f"🆔 Query ID: {data['query_id']}\n\n"
            result += data['response']
            
            return result
            
        except httpx.TimeoutException:
            return "❌ Platform request timed out. The query may be processing - check your dashboard."
        except Exception as e:
            return f"❌ Error connecting to platform: {str(e)}"
    
    async def get_user_config(self):
        """Get user configuration and usage stats"""
        if not self.user_token:
            return "❌ Platform token required."
        
        try:
            response = await self.session.get(
                f"{self.platform_url}/api/user/config",
                headers={"Authorization": f"Bearer {self.user_token}"}
            )
            
            if response.status_code != 200:
                return f"❌ Error: {response.text}"
            
            data = response.json()
            
            result = f"👤 **Platform User Configuration**\n\n"
            result += f"**Plan**: {data['tier'].title()}\n"
            result += f"**Usage**: {data['current_usage']}/{data['monthly_limit']} queries\n"
            result += f"**Remaining**: {data['remaining_queries']} queries\n"
            result += f"**Features**: {', '.join(data['features'])}\n"
            result += f"**CLI Configurations**: {', '.join([k for k, v in data['cli_configs'].items() if v])}\n"
            
            return result
            
        except Exception as e:
            return f"❌ Error: {str(e)}"
    
    async def get_analytics(self):
        """Get usage analytics"""
        if not self.user_token:
            return "❌ Platform token required."
        
        try:
            response = await self.session.get(
                f"{self.platform_url}/api/analytics",
                headers={"Authorization": f"Bearer {self.user_token}"}
            )
            
            if response.status_code != 200:
                return f"❌ Error: {response.text}"
            
            data = response.json()
            
            result = f"📊 **Usage Analytics**\n\n"
            result += f"**Total Queries**: {data['total_queries']}\n"
            result += f"**Total Tokens**: {data['total_tokens']:,}\n"
            result += f"**Avg Processing Time**: {data['avg_processing_time']}s\n"
            result += f"**This Month**: {data['current_month_usage']}/{data['monthly_limit']}\n\n"
            
            if data['model_usage']:
                result += "**Model Usage Distribution**:\n"
                for model, count in data['model_usage'].items():
                    percentage = (count / data['total_queries']) * 100
                    result += f"• {model}: {count} queries ({percentage:.1f}%)\n"
            
            if data['recent_queries']:
                result += f"\n**Recent Queries** (last {len(data['recent_queries'])}):\n"
                for i, query in enumerate(data['recent_queries'], 1):
                    timestamp = query['timestamp'][:19]
                    query_text = query['query'][:60] + ('...' if len(query['query']) > 60 else '')
                    result += f"{i}. {timestamp} - {query['model_used']} - \"{query_text}\"\n"
            
            return result
            
        except Exception as e:
            return f"❌ Error: {str(e)}"
    
    async def get_available_models(self):
        """Get available models and providers"""
        if not self.user_token:
            return "❌ Platform token required."
        
        try:
            response = await self.session.get(
                f"{self.platform_url}/api/models",
                headers={"Authorization": f"Bearer {self.user_token}"}
            )
            
            if response.status_code != 200:
                return f"❌ Error: {response.text}"
            
            data = response.json()
            
            result = f"🤖 **Available Models & Providers**\n\n"
            
            # Available models by provider
            for provider, models in data["models_by_provider"].items():
                provider_name = data["provider_info"][provider]["name"]
                result += f"**{provider_name} ({provider})**:\n"
                for model in models:
                    input_cost = f"${model['input_cost']:.6f}"
                    output_cost = f"${model['output_cost']:.6f}"
                    context = f"{model['context_length']:,} tokens"
                    strengths = ", ".join(model['strengths'][:3])  # Show top 3 strengths
                    result += f"• **{model['name']}** (`{model['id']}`)\n"
                    result += f"  📍 Context: {context} | In: {input_cost}/M | Out: {output_cost}/M\n"
                    result += f"  🎯 Best for: {strengths}\n"
                result += "\n"
            
            # Pricing and setup info 
            if "pricing_info" in data:
                pricing = data["pricing_info"]
                result += f"**💰 Pricing Model:**\n"
                result += f"• {pricing['description']}\n"
                result += f"• Business model: {pricing['business_model']}\n"
                result += f"• Setup: {pricing['setup_required']['openrouter_api_key']}\n\n"
            
            # Usage instructions
            result += "**🛠️ Usage Examples:**\n"
            result += f"• `query_llm` - Automatic routing based on complexity\n"
            result += f"• `query_with_provider` - Choose provider (openai, anthropic, google)\n"
            result += f"• `query_with_model` - Choose exact model with OpenRouter ID\n\n"
            
            result += f"**Available Providers**: {', '.join(data['available_providers'])}\n"
            result += f"**Total Models**: {len(data['all_models'])}"
            
            return result
            
        except Exception as e:
            return f"❌ Error: {str(e)}"

# Global client instance
platform_client = PlatformClient()

@app.list_tools()
async def list_tools():
    return [
        Tool(
            name="query_llm",
            description="Send query to Multi-LLM Platform with intelligent routing or manual model selection",
            inputSchema={
                "type": "object",
                "properties": {
                    "message": {"type": "string", "description": "Your question or request"},
                    "system_prompt": {"type": "string", "description": "Optional system prompt for specialized context"},
                    "preferred_model": {"type": "string", "description": "Specific OpenRouter model ID (openai/gpt-5, anthropic/claude-4.1-opus, google/gemini-2.5-pro, etc.)"},
                    "preferred_provider": {"type": "string", "description": "Provider preference (openai, anthropic, google) - will select best model from that provider"},
                    "priority": {"type": "string", "description": "Query priority (normal, urgent, cost-optimized, manual)", "default": "normal"}
                },
                "required": ["message"]
            }
        ),
        Tool(
            name="list_models",
            description="List all available models and providers for your account",
            inputSchema={
                "type": "object",
                "properties": {}
            }
        ),
        Tool(
            name="query_with_provider",
            description="Query using a specific provider (OpenAI, Anthropic, or Google) with automatic model selection",
            inputSchema={
                "type": "object",
                "properties": {
                    "message": {"type": "string", "description": "Your question or request"},
                    "provider": {"type": "string", "description": "Provider to use (openai, anthropic, google)"},
                    "system_prompt": {"type": "string", "description": "Optional system prompt for specialized context"},
                    "priority": {"type": "string", "description": "Query priority within provider (normal, urgent, cost-optimized)", "default": "normal"}
                },
                "required": ["message", "provider"]
            }
        ),
        Tool(
            name="query_with_model",
            description="Query using a specific model for maximum control",
            inputSchema={
                "type": "object",
                "properties": {
                    "message": {"type": "string", "description": "Your question or request"},
                    "model": {"type": "string", "description": "Exact OpenRouter model ID (e.g., openai/gpt-5, anthropic/claude-4.1-opus, google/gemini-2.5-pro)"},
                    "system_prompt": {"type": "string", "description": "Optional system prompt for specialized context"}
                },
                "required": ["message", "model"]
            }
        ),
        Tool(
            name="setup_platform_token",
            description="Set up authentication token for Multi-LLM Platform",
            inputSchema={
                "type": "object",
                "properties": {
                    "token": {"type": "string", "description": "Platform authentication token"}
                },
                "required": ["token"]
            }
        ),
        Tool(
            name="get_user_status",
            description="View your platform configuration and usage limits",
            inputSchema={
                "type": "object",
                "properties": {}
            }
        ),
        Tool(
            name="get_analytics",
            description="View detailed usage analytics and query history",
            inputSchema={
                "type": "object",
                "properties": {}
            }
        ),
        Tool(
            name="platform_help",
            description="Get help on using the Multi-LLM Platform",
            inputSchema={
                "type": "object",
                "properties": {}
            }
        )
    ]

@app.call_tool()
async def call_tool(name: str, arguments: dict):
    if name == "query_llm":
        message = arguments.get("message", "")
        system_prompt = arguments.get("system_prompt")
        preferred_model = arguments.get("preferred_model")
        preferred_provider = arguments.get("preferred_provider")
        priority = arguments.get("priority", "normal")
        
        if not message:
            return [TextContent(type="text", text="❌ Message is required")]
        
        # Show progress with routing info
        progress_text = "⏳ Sending query to Multi-LLM Platform...\n"
        if preferred_model:
            progress_text += f"🎯 Using specified model: {preferred_model}\n"
        elif preferred_provider:
            progress_text += f"🏢 Using preferred provider: {preferred_provider}\n"
            progress_text += "🧠 Platform selecting best model from provider...\n"
        else:
            progress_text += "🧠 Platform analyzing query complexity and routing to optimal model...\n"
        progress_text += "⚡ Processing your request...\n\n"
        
        result = await platform_client.execute_query(
            message=message,
            system_prompt=system_prompt,
            preferred_model=preferred_model,
            preferred_provider=preferred_provider,
            priority=priority
        )
        
        return [TextContent(type="text", text=progress_text + result)]
    
    elif name == "list_models":
        result = await platform_client.get_available_models()
        return [TextContent(type="text", text=result)]
    
    elif name == "query_with_provider":
        message = arguments.get("message", "")
        provider = arguments.get("provider", "")
        system_prompt = arguments.get("system_prompt")
        priority = arguments.get("priority", "normal")
        
        if not message or not provider:
            return [TextContent(type="text", text="❌ Message and provider are required")]
        
        progress_text = f"⏳ Sending query to {provider.title()} via Multi-LLM Platform...\n"
        progress_text += f"🏢 Using provider: {provider}\n"
        progress_text += "🧠 Platform selecting optimal model from provider...\n"
        progress_text += "⚡ Processing your request...\n\n"
        
        result = await platform_client.execute_query(
            message=message,
            system_prompt=system_prompt,
            preferred_provider=provider,
            priority=priority
        )
        
        return [TextContent(type="text", text=progress_text + result)]
    
    elif name == "query_with_model":
        message = arguments.get("message", "")
        model = arguments.get("model", "")
        system_prompt = arguments.get("system_prompt")
        
        if not message or not model:
            return [TextContent(type="text", text="❌ Message and model are required")]
        
        progress_text = f"⏳ Sending query to {model} via Multi-LLM Platform...\n"
        progress_text += f"🎯 Using exact model: {model}\n"
        progress_text += "⚡ Processing your request...\n\n"
        
        result = await platform_client.execute_query(
            message=message,
            system_prompt=system_prompt,
            preferred_model=model,
            priority="manual"  # Manual priority for exact model selection
        )
        
        return [TextContent(type="text", text=progress_text + result)]
    
    elif name == "setup_platform_token":
        token = arguments.get("token", "").strip()
        
        if not token:
            return [TextContent(type="text", text="❌ Platform token is required")]
        
        # Save token and update client
        platform_client.save_user_token(token)
        platform_client.user_token = token
        
        # Test connection
        test_result = await platform_client.get_user_config()
        if "❌" not in test_result:
            return [TextContent(type="text", text="✅ Platform token configured successfully!\n\n" + test_result)]
        else:
            return [TextContent(type="text", text="❌ Invalid token or platform connection failed.")]
    
    elif name == "get_user_status":
        result = await platform_client.get_user_config()
        return [TextContent(type="text", text=result)]
    
    elif name == "get_analytics":
        result = await platform_client.get_analytics()
        return [TextContent(type="text", text=result)]
    
    elif name == "platform_help":
        help_text = """
🚀 **Multi-LLM Platform Help**

**First Time Setup:**
1. Get your platform token from the dashboard at http://localhost:8000
2. Run `setup_platform_token` tool with your token
3. Start querying with `query_llm` tool!

**Available Tools:**
• **query_llm**: Send questions with intelligent routing or manual selection
• **list_models**: View all available models and providers
• **query_with_provider**: Choose specific provider (OpenAI, Anthropic, Google)
• **query_with_model**: Choose exact model for maximum control
• **get_user_status**: Check your plan, usage limits, and remaining queries  
• **get_analytics**: View detailed usage statistics and query history
• **setup_platform_token**: Configure your authentication token

**Query Options:**
• **Automatic Routing**: Just send your message, platform chooses best model
• **Provider Selection**: Choose openai, anthropic, or google
• **Exact Model**: Pick specific model (gpt-5, claude-3.5-sonnet, o1-preview, etc.)

**Priority Levels:**
• **normal**: Intelligent routing based on complexity
• **urgent**: Fastest available model
• **cost-optimized**: Most economical model
• **manual**: Use exact model specified

**🤖 Current 2025 Models (OpenRouter-style IDs):**
• **OpenAI**: openai/gpt-5, openai/gpt-5-chat, openai/gpt-5-mini, openai/o3, openai/o3-mini
• **Anthropic**: anthropic/claude-4.1-opus, anthropic/claude-4-sonnet, anthropic/claude-3.5-sonnet
• **Google**: google/gemini-2.5-pro, google/gemini-2.5-flash, google/gemini-2.5-flash-lite

**Usage Examples:**
```
query_llm: "Analyze this architecture" (automatic routing)
query_with_provider: provider="anthropic" (best Claude model)
query_with_model: model="openai/o3" (exact 2025 model)
```

**Features:**
✅ Intelligent query routing based on complexity
✅ Usage tracking and query limits
✅ Multiple authentication methods (CLI subscriptions + API keys)
✅ Analytics dashboard and query history
✅ Tiered subscription system

**Need Help?** Visit the dashboard for configuration and detailed analytics!
"""
        return [TextContent(type="text", text=help_text)]
    
    return [TextContent(type="text", text=f"❌ Unknown tool: {name}")]

async def main():
    async with stdio_server() as streams:
        await app.run(streams[0], streams[1], app.create_initialization_options())

if __name__ == "__main__":
    asyncio.run(main())