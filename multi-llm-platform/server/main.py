#!/usr/bin/env python3
"""
Polydev Multi-LLM Platform - FastAPI Backend
MCP Server implementation for Claude Code integration
"""

import asyncio
import json
import os
from typing import List, Optional, Dict, Any
from dataclasses import dataclass

import httpx
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

# Environment variables
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
UPSTASH_REDIS_REST_URL = os.getenv("UPSTASH_REDIS_REST_URL")
UPSTASH_REDIS_REST_TOKEN = os.getenv("UPSTASH_REDIS_REST_TOKEN")
DOMAIN = os.getenv("DOMAIN", "polydev.ai")

# FastAPI app
app = FastAPI(
    title="Polydev Multi-LLM Platform",
    description="Get multiple AI perspectives with OpenRouter integration",
    version="1.0.0"
)

# Request/Response models
class PerspectiveRequest(BaseModel):
    task: str
    context: Optional[Dict[str, Any]] = None
    n: int = 3
    models: Optional[List[str]] = None
    project_memory: str = "none"
    cli_mode: bool = False

class PerspectiveResponse(BaseModel):
    model: str
    content: str
    tokens_used: int
    cost: float
    provider: str

class MultiPerspectiveResponse(BaseModel):
    perspectives: List[PerspectiveResponse]
    total_perspectives: int
    total_cost: float
    timestamp: str

# Default model configurations
DEFAULT_MODELS = [
    "openai/gpt-4o",
    "anthropic/claude-3.5-sonnet", 
    "google/gemini-2.5-pro"
]

MODEL_CATALOG = {
    # OpenAI Models (2025)
    "openai/gpt-4o": {"provider": "openai", "context": 128000, "cost_per_1k_tokens": 0.005},
    "openai/gpt-4o-mini": {"provider": "openai", "context": 128000, "cost_per_1k_tokens": 0.00015},
    "openai/gpt-4-turbo": {"provider": "openai", "context": 128000, "cost_per_1k_tokens": 0.01},
    
    # Anthropic Models (2025)
    "anthropic/claude-3.5-sonnet": {"provider": "anthropic", "context": 200000, "cost_per_1k_tokens": 0.003},
    "anthropic/claude-3.5-haiku": {"provider": "anthropic", "context": 200000, "cost_per_1k_tokens": 0.00025},
    "anthropic/claude-3-opus": {"provider": "anthropic", "context": 200000, "cost_per_1k_tokens": 0.015},
    
    # Google Models (2025)
    "google/gemini-2.5-pro": {"provider": "google", "context": 1000000, "cost_per_1k_tokens": 0.002},
    "google/gemini-2.5-flash": {"provider": "google", "context": 1000000, "cost_per_1k_tokens": 0.0001},
}

MARKUP_PERCENTAGE = 0.10  # 10% markup

@app.get("/")
async def root():
    return {
        "name": "Polydev Multi-LLM Platform",
        "version": "1.0.0",
        "description": "Get multiple AI perspectives instantly",
        "domain": DOMAIN,
        "available_models": len(MODEL_CATALOG),
        "status": "operational"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "openrouter_configured": bool(OPENROUTER_API_KEY),
        "supabase_configured": bool(SUPABASE_URL and SUPABASE_KEY),
        "redis_configured": bool(UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN)
    }

@app.get("/models")
async def list_models():
    return {
        "models": MODEL_CATALOG,
        "default_models": DEFAULT_MODELS,
        "total_count": len(MODEL_CATALOG)
    }

@app.post("/perspectives", response_model=MultiPerspectiveResponse)
async def get_perspectives(request: PerspectiveRequest):
    if not OPENROUTER_API_KEY:
        raise HTTPException(status_code=500, detail="OpenRouter API key not configured")
    
    # Select models
    selected_models = request.models or DEFAULT_MODELS[:request.n]
    
    if len(selected_models) > request.n:
        selected_models = selected_models[:request.n]
    
    # Get perspectives from multiple models
    perspectives = []
    total_cost = 0.0
    
    async with httpx.AsyncClient() as client:
        tasks = [
            get_model_perspective(client, model, request.task)
            for model in selected_models
        ]
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        for result in results:
            if isinstance(result, Exception):
                print(f"Error getting perspective: {result}")
                continue
            
            perspectives.append(result)
            total_cost += result.cost
    
    from datetime import datetime
    
    return MultiPerspectiveResponse(
        perspectives=perspectives,
        total_perspectives=len(perspectives),
        total_cost=total_cost,
        timestamp=datetime.utcnow().isoformat()
    )

async def get_model_perspective(
    client: httpx.AsyncClient, 
    model: str, 
    task: str
) -> PerspectiveResponse:
    try:
        response = await client.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
                "X-Title": "Polydev Multi-LLM Platform"
            },
            json={
                "model": model,
                "messages": [
                    {
                        "role": "user",
                        "content": task
                    }
                ],
                "temperature": 0.7,
                "max_tokens": 1000
            },
            timeout=60.0
        )
        
        response.raise_for_status()
        data = response.json()
        
        usage = data.get("usage", {})
        tokens_used = usage.get("total_tokens", 0)
        
        # Calculate cost with markup
        model_config = MODEL_CATALOG.get(model, {"cost_per_1k_tokens": 0.002})
        base_cost = (tokens_used / 1000) * model_config["cost_per_1k_tokens"]
        final_cost = base_cost * (1 + MARKUP_PERCENTAGE)
        
        return PerspectiveResponse(
            model=model,
            content=data["choices"][0]["message"]["content"],
            tokens_used=tokens_used,
            cost=final_cost,
            provider=model_config.get("provider", "openrouter")
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get perspective from {model}: {str(e)}")

# MCP Server Tools for Claude Code
if __name__ == "__main__":
    import sys
    import uvicorn
    
    if len(sys.argv) > 1 and sys.argv[1] == "--mcp":
        # Run as MCP server for Claude Code
        from mcp.server import Server
        from mcp.server.models import InitializationOptions
        import mcp.server.stdio
        import mcp.types as types
        
        server = Server("polydev-multi-llm")
        
        @server.list_tools()
        async def handle_list_tools() -> list[types.Tool]:
            return [
                types.Tool(
                    name="get_perspectives",
                    description="Get multiple AI perspectives on a task or question",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "task": {
                                "type": "string",
                                "description": "The task or question to get perspectives on"
                            },
                            "n": {
                                "type": "integer",
                                "description": "Number of perspectives to get (default: 3)",
                                "default": 3
                            },
                            "models": {
                                "type": "array",
                                "items": {"type": "string"},
                                "description": "Specific models to use (optional)"
                            }
                        },
                        "required": ["task"]
                    }
                ),
                types.Tool(
                    name="list_models",
                    description="List available models and their configurations",
                    inputSchema={"type": "object", "properties": {}}
                ),
                types.Tool(
                    name="health_check",
                    description="Check the health status of the Multi-LLM Platform",
                    inputSchema={"type": "object", "properties": {}}
                )
            ]
        
        @server.call_tool()
        async def handle_call_tool(
            name: str, arguments: dict | None
        ) -> list[types.TextContent]:
            if name == "get_perspectives":
                request = PerspectiveRequest(**arguments)
                response = await get_perspectives(request)
                
                result_text = f"Got {response.total_perspectives} perspectives:\n\n"
                for i, perspective in enumerate(response.perspectives, 1):
                    result_text += f"**{i}. {perspective.model}**\n"
                    result_text += f"{perspective.content}\n\n"
                    result_text += f"*{perspective.tokens_used} tokens, ${perspective.cost:.4f}*\n\n---\n\n"
                
                result_text += f"**Total Cost: ${response.total_cost:.4f}**"
                
                return [types.TextContent(type="text", text=result_text)]
            
            elif name == "list_models":
                models_info = await list_models()
                result_text = "Available Models:\n\n"
                for model, config in models_info["models"].items():
                    result_text += f"- **{model}** ({config['provider']})\n"
                    result_text += f"  Context: {config['context']:,} tokens\n"
                    result_text += f"  Cost: ${config['cost_per_1k_tokens']}/1K tokens\n\n"
                
                return [types.TextContent(type="text", text=result_text)]
            
            elif name == "health_check":
                health = await health_check()
                result_text = f"**Platform Status: {health['status'].upper()}**\n\n"
                result_text += f"- OpenRouter: {'✅ Configured' if health['openrouter_configured'] else '❌ Not configured'}\n"
                result_text += f"- Supabase: {'✅ Configured' if health['supabase_configured'] else '❌ Not configured'}\n"
                result_text += f"- Redis: {'✅ Configured' if health['redis_configured'] else '❌ Not configured'}\n"
                
                return [types.TextContent(type="text", text=result_text)]
            
            else:
                raise ValueError(f"Unknown tool: {name}")
        
        async def run_mcp_server():
            async with mcp.server.stdio.stdio_server() as (read_stream, write_stream):
                await server.run(
                    read_stream,
                    write_stream,
                    InitializationOptions(
                        server_name="polydev-multi-llm",
                        server_version="1.0.0",
                        capabilities=server.get_capabilities(
                            notification_options=None,
                            experimental_capabilities={},
                        ),
                    ),
                )
        
        # Run MCP server
        asyncio.run(run_mcp_server())
    else:
        # Run as FastAPI server
        uvicorn.run(
            app,
            host="0.0.0.0",
            port=8000,
            reload=True
        )