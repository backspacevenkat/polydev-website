#!/usr/bin/env python3
"""
Multi-LLM Orchestration Platform - Central Backend Service
Comprehensive platform for routing queries across ChatGPT, Claude, Gemini, and other LLMs
"""

from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
import asyncio
import json
import os
import uuid
from datetime import datetime, timedelta
import httpx

app = FastAPI(
    title="Multi-LLM Orchestration Platform",
    description="Central service for routing queries across multiple LLM providers",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

# Data Models
class LLMQuery(BaseModel):
    message: str
    system_prompt: Optional[str] = None
    preferred_model: Optional[str] = None
    preferred_provider: Optional[str] = None  # openai, anthropic, google
    priority: str = "normal"  # normal, urgent, cost-optimized, manual
    max_tokens: Optional[int] = None
    context: Optional[Dict[str, Any]] = None

class UserConfig(BaseModel):
    user_id: str
    tier: str  # free, pro, enterprise
    api_keys: Dict[str, str]
    cli_configs: Dict[str, bool]  # which CLIs are configured
    preferences: Dict[str, Any]
    monthly_limit: int
    current_usage: int = 0

class QueryResponse(BaseModel):
    response: str
    model_used: str
    tokens_used: int
    processing_time: float
    query_id: str
    cost_estimate: Optional[float] = None

# In-memory storage (replace with proper database)
users_db: Dict[str, UserConfig] = {}
queries_db: Dict[str, Dict] = {}

# Subscription tiers
TIERS = {
    "free": {"monthly_queries": 50, "features": ["basic_routing"]},
    "pro": {"monthly_queries": 1000, "features": ["advanced_routing", "analytics", "cli_integration"]},
    "enterprise": {"monthly_queries": 10000, "features": ["all", "priority_routing", "team_management"]}
}

class LLMRouter:
    """Intelligent LLM routing based on query analysis and user preferences"""
    
    def __init__(self):
        # OpenRouter-style unified model catalog with current 2025 models
        # Prices are from OpenRouter API with 10% markup applied
        self.models = {
            # OpenAI 2025 Models
            "openai/gpt-5": {
                "provider": "openai",
                "name": "GPT-5",
                "context_length": 128000,
                "input_cost": 0.00000138,   # $1.25/M + 10% markup
                "output_cost": 0.000011,    # $10/M + 10% markup
                "strengths": ["advanced_reasoning", "complex_analysis", "multimodal"],
                "adapter": "openrouter",
                "description": "Most advanced model, improved reasoning, code quality, and user experience"
            },
            "openai/gpt-5-chat": {
                "provider": "openai",
                "name": "GPT-5 Chat",
                "context_length": 128000,
                "input_cost": 0.00000138,   # $1.25/M + 10% markup
                "output_cost": 0.000011,    # $10/M + 10% markup
                "strengths": ["natural_conversation", "context_aware", "multimodal"],
                "adapter": "openrouter",
                "description": "Designed for advanced, natural, multimodal, and context-aware conversations"
            },
            "openai/gpt-5-mini": {
                "provider": "openai",
                "name": "GPT-5 Mini",
                "context_length": 128000,
                "input_cost": 0.000000275,  # $0.25/M + 10% markup
                "output_cost": 0.0000022,   # $2/M + 10% markup
                "strengths": ["fast_reasoning", "cost_effective", "lightweight"],
                "adapter": "openrouter",
                "description": "Compact version designed for lighter-weight reasoning tasks"
            },
            "openai/gpt-5-nano": {
                "provider": "openai",
                "name": "GPT-5 Nano",
                "context_length": 64000,
                "input_cost": 0.000000055,  # $0.05/M + 10% markup
                "output_cost": 0.00000044,  # $0.4/M + 10% markup
                "strengths": ["ultra_fast", "developer_tools", "embedded"],
                "adapter": "openrouter",
                "description": "Smallest and fastest variant, optimized for developer tools"
            },
            "openai/o3": {
                "provider": "openai",
                "name": "O3",
                "context_length": 200000,
                "input_cost": 0.000017,     # Premium reasoning model pricing
                "output_cost": 0.000068,
                "strengths": ["deep_reasoning", "mathematics", "scientific_research"],
                "adapter": "openrouter",
                "description": "Advanced reasoning model for complex problem-solving"
            },
            "openai/o3-mini": {
                "provider": "openai",
                "name": "O3 Mini",
                "context_length": 128000,
                "input_cost": 0.0000035,    # Smaller reasoning model
                "output_cost": 0.000014,
                "strengths": ["reasoning", "cost_effective", "problem_solving"],
                "adapter": "openrouter",
                "description": "Compact reasoning model for analytical tasks"
            },
            
            # Anthropic 2025 Models
            "anthropic/claude-4.1-opus": {
                "provider": "anthropic",
                "name": "Claude 4.1 Opus",
                "context_length": 200000,
                "input_cost": 0.0000165,    # $15/M + 10% markup
                "output_cost": 0.0000825,   # $75/M + 10% markup
                "strengths": ["world_class_coding", "advanced_reasoning", "creative_writing"],
                "adapter": "openrouter",
                "description": "Benchmarked as world's best coding model with superior reasoning"
            },
            "anthropic/claude-4-sonnet": {
                "provider": "anthropic",
                "name": "Claude 4 Sonnet",
                "context_length": 200000,
                "input_cost": 0.0000033,    # $3/M + 10% markup
                "output_cost": 0.0000165,   # $15/M + 10% markup
                "strengths": ["enhanced_coding", "reasoning", "balanced_performance"],
                "adapter": "openrouter",
                "description": "Enhanced capabilities with improved coding and reasoning"
            },
            "anthropic/claude-3.5-sonnet": {
                "provider": "anthropic",
                "name": "Claude 3.5 Sonnet",
                "context_length": 200000,
                "input_cost": 0.0000033,    # $3/M + 10% markup
                "output_cost": 0.0000165,   # $15/M + 10% markup
                "strengths": ["coding", "writing", "analysis"],
                "adapter": "openrouter",
                "description": "Excellent balance of intelligence, speed, and cost"
            },
            
            # Google 2025 Models  
            "google/gemini-2.5-pro": {
                "provider": "google",
                "name": "Gemini 2.5 Pro",
                "context_length": 2000000,
                "input_cost": 0.00000138,   # $1.25/M + 10% markup
                "output_cost": 0.000011,    # $10/M + 10% markup
                "strengths": ["advanced_reasoning", "coding", "mathematics", "scientific_tasks"],
                "adapter": "openrouter",
                "description": "State-of-the-art AI model for advanced reasoning and long context"
            },
            "google/gemini-2.5-flash": {
                "provider": "google",
                "name": "Gemini 2.5 Flash",
                "context_length": 1000000,
                "input_cost": 0.00000033,   # $0.3/M + 10% markup
                "output_cost": 0.00000275,  # $2.5/M + 10% markup
                "strengths": ["fast_reasoning", "coding", "scientific_tasks", "cost_effective"],
                "adapter": "openrouter",
                "description": "Workhorse model for reasoning, coding, and scientific tasks"
            },
            "google/gemini-2.5-flash-lite": {
                "provider": "google",
                "name": "Gemini 2.5 Flash Lite",
                "context_length": 1000000,
                "input_cost": 0.00000022,   # $0.2/M + 10% markup  
                "output_cost": 0.0000011,   # $1/M + 10% markup
                "strengths": ["lightweight_reasoning", "ultra_fast", "ultra_cost_effective"],
                "adapter": "openrouter",
                "description": "Lightweight reasoning model in the Gemini 2.5 family"
            },
            
            # Legacy models for fallback
            "openai/gpt-4o": {
                "provider": "openai",
                "name": "GPT-4o",
                "context_length": 128000,
                "input_cost": 0.0000055,    # $5/M + 10% markup
                "output_cost": 0.000017,    # $15/M + 10% markup
                "strengths": ["general", "multimodal", "reliable"],
                "adapter": "openrouter",
                "description": "Reliable general-purpose model with multimodal capabilities"
            }
        }
        
        # Provider shortcuts for easy selection (OpenRouter-style IDs)
        self.provider_models = {
            "openai": ["openai/gpt-5", "openai/gpt-5-chat", "openai/gpt-5-mini", "openai/gpt-5-nano", "openai/o3", "openai/o3-mini", "openai/gpt-4o"],
            "anthropic": ["anthropic/claude-4.1-opus", "anthropic/claude-4-sonnet", "anthropic/claude-3.5-sonnet"], 
            "google": ["google/gemini-2.5-pro", "google/gemini-2.5-flash", "google/gemini-2.5-flash-lite"]
        }
        
        # OpenRouter API configuration
        self.openrouter_base_url = "https://openrouter.ai/api/v1"
        self.markup_percentage = 0.10  # 10% markup on all API calls
    
    def analyze_query_complexity(self, query: str) -> str:
        """Analyze query to determine complexity level"""
        complexity_indicators = {
            "high": ["analyze", "comprehensive", "detailed analysis", "architecture", "implementation", "strategy"],
            "medium": ["explain", "compare", "describe", "how to"],
            "low": ["what is", "define", "list", "simple"]
        }
        
        query_lower = query.lower()
        
        for level, indicators in complexity_indicators.items():
            if any(indicator in query_lower for indicator in indicators):
                return level
        return "medium"
    
    def route_query(self, query: LLMQuery, user: UserConfig) -> str:
        """Determine the best LLM for this query"""
        
        # Manual selection - user has full control
        if query.priority == "manual":
            if query.preferred_model and query.preferred_model in self.models:
                return query.preferred_model
            elif query.preferred_provider and query.preferred_provider in self.provider_models:
                # Use best model from preferred provider
                provider_models = self.provider_models[query.preferred_provider]
                return self.get_best_model_from_provider(provider_models, user)
        
        # Exact model preference override
        if query.preferred_model and query.preferred_model in self.models:
            return query.preferred_model
        
        # Provider preference with intelligent model selection
        if query.preferred_provider and query.preferred_provider in self.provider_models:
            provider_models = self.provider_models[query.preferred_provider]
            complexity = self.analyze_query_complexity(query.message)
            return self.get_model_by_complexity_from_provider(provider_models, complexity, query.priority, user)
        
        # Automatic routing based on priority and complexity
        complexity = self.analyze_query_complexity(query.message)
        
        # Priority-based routing
        if query.priority == "urgent":
            return self.get_fastest_available_model(user)
        elif query.priority == "cost-optimized":
            return self.get_cheapest_available_model(user)
        
        # Complexity-based routing (default intelligent routing) - updated for 2025 models
        if complexity == "high":
            return self.get_best_reasoning_model(user)
        elif complexity == "medium":
            return self.get_best_general_model(user)
        else:
            return self.get_fastest_available_model(user)
    
    def get_best_model_from_provider(self, provider_models: List[str], user: UserConfig) -> str:
        """Get the best available model from a specific provider"""
        # Priority order for each provider
        for model in provider_models:
            if self.is_model_available(model, user):
                return model
        return provider_models[0]  # Fallback to first model
    
    def get_model_by_complexity_from_provider(self, provider_models: List[str], complexity: str, priority: str, user: UserConfig) -> str:
        """Get model from specific provider based on complexity"""
        if complexity == "high" and len(provider_models) > 1:
            # Use most capable model from provider
            return provider_models[0] if self.is_model_available(provider_models[0], user) else provider_models[1]
        elif priority == "cost-optimized" and len(provider_models) > 2:
            # Use cheapest model from provider
            return provider_models[-1] if self.is_model_available(provider_models[-1], user) else provider_models[0]
        else:
            # Use balanced model
            mid_idx = len(provider_models) // 2
            return provider_models[mid_idx] if self.is_model_available(provider_models[mid_idx], user) else provider_models[0]
    
    def get_fastest_available_model(self, user: UserConfig) -> str:
        """Get the fastest available model"""
        fast_models = ["openai/gpt-5-nano", "google/gemini-2.5-flash-lite", "google/gemini-2.5-flash", "openai/gpt-5-mini"]
        for model in fast_models:
            if self.is_model_available(model, user):
                return model
        return "google/gemini-2.5-flash-lite"  # Fallback
    
    def get_cheapest_available_model(self, user: UserConfig) -> str:
        """Get the most cost-effective available model"""
        cheap_models = ["openai/gpt-5-nano", "google/gemini-2.5-flash-lite", "google/gemini-2.5-flash", "openai/gpt-5-mini"]
        for model in cheap_models:
            if self.is_model_available(model, user):
                return model
        return "google/gemini-2.5-flash-lite"  # Fallback
    
    def get_best_reasoning_model(self, user: UserConfig) -> str:
        """Get the best reasoning model available"""
        reasoning_models = ["openai/o3", "anthropic/claude-4.1-opus", "openai/gpt-5", "google/gemini-2.5-pro", "anthropic/claude-4-sonnet"]
        for model in reasoning_models:
            if self.is_model_available(model, user):
                return model
        return "anthropic/claude-4.1-opus"  # Fallback
    
    def get_best_general_model(self, user: UserConfig) -> str:
        """Get the best general-purpose model available"""
        general_models = ["anthropic/claude-4-sonnet", "openai/gpt-5-chat", "google/gemini-2.5-pro", "anthropic/claude-3.5-sonnet"]
        for model in general_models:
            if self.is_model_available(model, user):
                return model
        return "anthropic/claude-4-sonnet"  # Fallback
    
    def is_model_available(self, model: str, user: UserConfig) -> bool:
        """Check if a model is available for the user"""
        if model not in self.models:
            return False
            
        model_info = self.models[model]
        adapter = model_info["adapter"]
        provider = model_info["provider"]
        
        # For OpenRouter models, just check if we have OpenRouter API key
        if adapter == "openrouter":
            return "openrouter" in user.api_keys and user.api_keys["openrouter"]
        
        # Legacy CLI availability check
        if adapter in user.cli_configs and user.cli_configs[adapter]:
            return True
            
        # Check API key availability
        if provider in user.api_keys:
            return True
            
        return False
    
    def calculate_cost_with_markup(self, model: str, input_tokens: int, output_tokens: int) -> float:
        """Calculate cost with 10% markup like OpenRouter business model"""
        if model not in self.models:
            return 0.0
            
        model_info = self.models[model]
        base_cost = (input_tokens * model_info["input_cost"]) + (output_tokens * model_info["output_cost"])
        markup_cost = base_cost * (1 + self.markup_percentage)
        return markup_cost

class LLMAdapter:
    """Base adapter for LLM providers"""
    
    async def execute_query(self, query: LLMQuery, model: str, user: UserConfig) -> QueryResponse:
        raise NotImplementedError

class CodexCLIAdapter(LLMAdapter):
    """Adapter for ChatGPT via Codex CLI"""
    
    def __init__(self):
        self.codex_path = self.find_codex_cli()
    
    def find_codex_cli(self):
        """Find Codex CLI executable"""
        import subprocess
        try:
            result = subprocess.run(['which', 'codex'], capture_output=True, text=True)
            if result.returncode == 0:
                return 'codex'
        except:
            pass
        return 'codex'
    
    async def execute_query(self, query: LLMQuery, model: str, user: UserConfig) -> QueryResponse:
        """Execute query via Codex CLI"""
        start_time = datetime.now()
        query_id = str(uuid.uuid4())
        
        try:
            # Prepare message
            user_message = query.message
            if query.system_prompt:
                user_message = f"{query.system_prompt}\n\n{user_message}"
            
            # Execute Codex CLI
            process = await asyncio.create_subprocess_exec(
                self.codex_path, "exec",
                "-c", "reasoning_effort=high",
                "-c", "reasoning_summaries=auto",
                user_message,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            
            stdout, stderr = await process.communicate()
            
            if process.returncode != 0:
                raise Exception(f"Codex CLI error: {stderr.decode()}")
            
            response = stdout.decode().strip()
            
            # Extract token usage (simple parsing)
            tokens_used = self.extract_token_count(response)
            processing_time = (datetime.now() - start_time).total_seconds()
            
            # Clean response
            clean_response = self.clean_codex_response(response)
            
            return QueryResponse(
                response=clean_response,
                model_used="gpt-5",
                tokens_used=tokens_used,
                processing_time=processing_time,
                query_id=query_id
            )
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Codex CLI execution failed: {str(e)}")
    
    def extract_token_count(self, response: str) -> int:
        """Extract token count from Codex CLI response"""
        lines = response.split('\n')
        for line in lines:
            if 'tokens used:' in line:
                try:
                    return int(line.split('tokens used:')[1].strip())
                except:
                    pass
        return 0
    
    def clean_codex_response(self, response: str) -> str:
        """Clean Codex CLI response to extract just the LLM response"""
        lines = response.split('\n')
        clean_lines = []
        capture = False
        
        for line in lines:
            if '] codex' in line:
                capture = True
                continue
            elif capture and line.strip():
                if not line.startswith('[20') and not line.startswith('] tokens used:'):
                    clean_lines.append(line)
        
        return '\n'.join(clean_lines).strip()

class ClaudeCLIAdapter(LLMAdapter):
    """Adapter for Claude via Claude Code CLI"""
    
    def __init__(self):
        self.claude_path = self.find_claude_cli()
    
    def find_claude_cli(self):
        """Find Claude Code CLI executable"""
        import subprocess
        try:
            result = subprocess.run(['which', 'claude'], capture_output=True, text=True)
            if result.returncode == 0:
                return 'claude'
        except:
            pass
        
        # Common installation paths for Claude Code
        possible_paths = [
            '/usr/local/bin/claude',
            '/opt/homebrew/bin/claude',
            os.path.expanduser('~/.local/bin/claude'),
            '/usr/bin/claude'
        ]
        
        for path in possible_paths:
            if os.path.exists(path):
                return path
        
        return 'claude'  # Default, let system handle it
    
    async def execute_query(self, query: LLMQuery, model: str, user: UserConfig) -> QueryResponse:
        """Execute query via Claude Code CLI"""
        start_time = datetime.now()
        query_id = str(uuid.uuid4())
        
        try:
            # Prepare message for Claude Code
            user_message = query.message
            if query.system_prompt:
                user_message = f"{query.system_prompt}\n\n{user_message}"
            
            # Execute Claude Code CLI with streaming
            process = await asyncio.create_subprocess_exec(
                self.claude_path, "chat",
                "--no-markdown",  # Plain text output
                user_message,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            
            stdout, stderr = await process.communicate()
            
            if process.returncode != 0:
                error_msg = stderr.decode() if stderr else "Unknown error"
                if "authentication" in error_msg.lower() or "login" in error_msg.lower():
                    raise Exception("Claude Code CLI not authenticated. Please run 'claude auth' first.")
                raise Exception(f"Claude Code CLI error: {error_msg}")
            
            response = stdout.decode().strip()
            
            # Extract token usage if available
            tokens_used = self.extract_token_count(response)
            processing_time = (datetime.now() - start_time).total_seconds()
            
            # Clean response
            clean_response = self.clean_claude_response(response)
            
            return QueryResponse(
                response=clean_response,
                model_used="claude-sonnet",
                tokens_used=tokens_used,
                processing_time=processing_time,
                query_id=query_id
            )
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Claude CLI execution failed: {str(e)}")
    
    def extract_token_count(self, response: str) -> int:
        """Extract token count from Claude Code response"""
        lines = response.split('\n')
        for line in lines:
            if 'tokens:' in line or 'usage:' in line:
                try:
                    # Look for numbers in the line
                    import re
                    numbers = re.findall(r'\d+', line)
                    if numbers:
                        return int(numbers[-1])
                except:
                    pass
        return 0
    
    def clean_claude_response(self, response: str) -> str:
        """Clean Claude Code CLI response"""
        lines = response.split('\n')
        clean_lines = []
        
        for line in lines:
            # Skip metadata lines
            if line.startswith('[') or 'claude:' in line.lower():
                continue
            clean_lines.append(line)
        
        return '\n'.join(clean_lines).strip()

class GeminiCLIAdapter(LLMAdapter):
    """Adapter for Google Gemini via AI CLI or direct API"""
    
    def __init__(self):
        self.ai_cli_path = self.find_ai_cli()
    
    def find_ai_cli(self):
        """Find Google AI CLI executable"""
        import subprocess
        try:
            result = subprocess.run(['which', 'ai'], capture_output=True, text=True)
            if result.returncode == 0:
                return 'ai'
        except:
            pass
        
        # Common installation paths for Google AI CLI
        possible_paths = [
            '/usr/local/bin/ai',
            '/opt/homebrew/bin/ai',
            os.path.expanduser('~/.local/bin/ai'),
            '/usr/bin/ai'
        ]
        
        for path in possible_paths:
            if os.path.exists(path):
                return path
        
        return 'ai'  # Default, let system handle it
    
    async def execute_query(self, query: LLMQuery, model: str, user: UserConfig) -> QueryResponse:
        """Execute query via Google AI CLI or direct API"""
        start_time = datetime.now()
        query_id = str(uuid.uuid4())
        
        try:
            # Try AI CLI first
            if await self.is_ai_cli_available():
                return await self.execute_via_cli(query, model, query_id, start_time)
            else:
                # Fall back to direct API
                return await self.execute_via_api(query, model, user, query_id, start_time)
                
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Gemini execution failed: {str(e)}")
    
    async def is_ai_cli_available(self):
        """Check if Google AI CLI is available and authenticated"""
        try:
            process = await asyncio.create_subprocess_exec(
                self.ai_cli_path, "auth", "list",
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            stdout, stderr = await process.communicate()
            return process.returncode == 0
        except:
            return False
    
    async def execute_via_cli(self, query: LLMQuery, model: str, query_id: str, start_time: datetime) -> QueryResponse:
        """Execute via Google AI CLI"""
        user_message = query.message
        if query.system_prompt:
            user_message = f"{query.system_prompt}\n\n{user_message}"
        
        # Execute Google AI CLI
        process = await asyncio.create_subprocess_exec(
            self.ai_cli_path, "chat",
            "--model", "gemini-pro",
            user_message,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        
        stdout, stderr = await process.communicate()
        
        if process.returncode != 0:
            error_msg = stderr.decode() if stderr else "Unknown error"
            raise Exception(f"Google AI CLI error: {error_msg}")
        
        response = stdout.decode().strip()
        processing_time = (datetime.now() - start_time).total_seconds()
        
        return QueryResponse(
            response=response,
            model_used="gemini-pro",
            tokens_used=self.estimate_tokens(user_message, response),
            processing_time=processing_time,
            query_id=query_id
        )
    
    async def execute_via_api(self, query: LLMQuery, model: str, user: UserConfig, query_id: str, start_time: datetime) -> QueryResponse:
        """Execute via direct Google Gemini API"""
        api_key = user.api_keys.get("gemini")
        if not api_key:
            raise Exception("Gemini API key required. Please configure in user settings.")
        
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                user_message = query.message
                if query.system_prompt:
                    user_message = f"{query.system_prompt}\n\n{user_message}"
                
                response = await client.post(
                    f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
                    headers={
                        "Content-Type": "application/json"
                    },
                    params={"key": api_key},
                    json={
                        "contents": [{
                            "parts": [{"text": user_message}]
                        }],
                        "generationConfig": {
                            "maxOutputTokens": query.max_tokens or 4000
                        }
                    }
                )
                
                if response.status_code != 200:
                    error_data = response.text
                    raise Exception(f"Gemini API Error ({response.status_code}): {error_data}")
                
                data = response.json()
                
                if "candidates" not in data or not data["candidates"]:
                    raise Exception("No response generated by Gemini")
                
                content = data["candidates"][0]["content"]["parts"][0]["text"]
                
                # Extract usage metadata if available
                usage = data.get("usageMetadata", {})
                tokens_used = usage.get("totalTokenCount", self.estimate_tokens(user_message, content))
                
                processing_time = (datetime.now() - start_time).total_seconds()
                
                return QueryResponse(
                    response=content,
                    model_used="gemini-pro",
                    tokens_used=tokens_used,
                    processing_time=processing_time,
                    query_id=query_id,
                    cost_estimate=self.calculate_cost(tokens_used)
                )
                
        except httpx.TimeoutException:
            raise Exception("Gemini API request timed out")
        except Exception as e:
            raise Exception(f"Gemini API request failed: {str(e)}")
    
    def estimate_tokens(self, input_text: str, output_text: str = "") -> int:
        """Estimate token count for Gemini"""
        # Rough estimation: ~4 characters per token
        total_chars = len(input_text) + len(output_text)
        return int(total_chars / 4)
    
    def calculate_cost(self, tokens: int) -> float:
        """Calculate cost for Gemini Pro"""
        # Gemini Pro pricing: roughly $0.00003 per token
        return tokens * 0.00003

class OpenRouterAdapter(LLMAdapter):
    """OpenRouter-style unified API adapter for all 2025 models"""
    
    def __init__(self):
        self.base_url = "https://openrouter.ai/api/v1"
        self.markup_percentage = 0.10  # 10% markup
    
    async def execute_query(self, query: LLMQuery, model: str, user: UserConfig) -> QueryResponse:
        """Execute query via OpenRouter unified API"""
        start_time = datetime.now()
        query_id = str(uuid.uuid4())
        
        # Get OpenRouter API key
        api_key = user.api_keys.get("openrouter")
        if not api_key:
            raise HTTPException(
                status_code=400, 
                detail="OpenRouter API key required. Please add your OpenRouter API key in user settings."
            )
        
        try:
            async with httpx.AsyncClient(timeout=120.0) as client:
                # Prepare messages
                messages = []
                if query.system_prompt:
                    messages.append({"role": "system", "content": query.system_prompt})
                messages.append({"role": "user", "content": query.message})
                
                # OpenRouter request payload
                payload = {
                    "model": model,
                    "messages": messages,
                    "max_tokens": query.max_tokens or 4000,
                    "temperature": 0.7
                }
                
                # Optional: Add fallback models for reliability
                if query.priority == "urgent":
                    # Add fast fallback models for urgent queries
                    payload["models"] = [model, "openai/gpt-5-nano", "google/gemini-2.5-flash-lite"]
                
                response = await client.post(
                    f"{self.base_url}/chat/completions",
                    headers={
                        "Authorization": f"Bearer {api_key}",
                        "Content-Type": "application/json",
                        "HTTP-Referer": "https://multi-llm-platform.local",  # For OpenRouter attribution
                        "X-Title": "Multi-LLM Orchestration Platform"  # For OpenRouter leaderboard
                    },
                    json=payload
                )
                
                if response.status_code != 200:
                    error_data = response.text
                    if response.status_code == 429:
                        raise HTTPException(status_code=429, detail="Rate limit exceeded. Please try again later.")
                    elif response.status_code == 402:
                        raise HTTPException(status_code=402, detail="Insufficient credits. Please add more credits to your OpenRouter account.")
                    else:
                        raise HTTPException(status_code=response.status_code, detail=f"OpenRouter API Error: {error_data}")
                
                data = response.json()
                
                if "choices" not in data or not data["choices"]:
                    raise HTTPException(status_code=500, detail="No response generated")
                
                content = data["choices"][0]["message"]["content"]
                model_used = data.get("model", model)  # OpenRouter returns actual model used
                
                # Extract usage information
                usage = data.get("usage", {})
                input_tokens = usage.get("prompt_tokens", 0)
                output_tokens = usage.get("completion_tokens", 0)
                total_tokens = usage.get("total_tokens", input_tokens + output_tokens)
                
                processing_time = (datetime.now() - start_time).total_seconds()
                
                # Calculate cost with markup
                cost_estimate = router.calculate_cost_with_markup(model, input_tokens, output_tokens)
                
                return QueryResponse(
                    response=content,
                    model_used=model_used,
                    tokens_used=total_tokens,
                    processing_time=processing_time,
                    query_id=query_id,
                    cost_estimate=cost_estimate
                )
                
        except httpx.TimeoutException:
            raise HTTPException(status_code=504, detail="Request timed out. Please try again.")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"OpenRouter request failed: {str(e)}")

class APIAdapter(LLMAdapter):
    """Legacy adapter for direct API calls (kept for backward compatibility)"""
    
    async def execute_query(self, query: LLMQuery, model: str, user: UserConfig) -> QueryResponse:
        # Redirect to OpenRouter adapter for all new models
        if model.startswith(("openai/", "anthropic/", "google/")):
            openrouter_adapter = OpenRouterAdapter()
            return await openrouter_adapter.execute_query(query, model, user)
        
        # Legacy fallback
        query_id = str(uuid.uuid4())
        return QueryResponse(
            response="This model is not supported. Please use OpenRouter models.",
            model_used=model,
            tokens_used=0,
            processing_time=0.1,
            query_id=query_id
        )

# Initialize components
router = LLMRouter()
adapters = {
    "codex": CodexCLIAdapter(),
    "claude": ClaudeCLIAdapter(),
    "gemini": GeminiCLIAdapter(),
    "openrouter": OpenRouterAdapter(),  # Primary adapter for all 2025 models
    "api": APIAdapter()  # Legacy fallback
}

# Authentication
async def get_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> UserConfig:
    """Get user from authorization token"""
    token = credentials.credentials
    
    # Simple token validation (implement proper JWT in production)
    user_id = token  # For now, token IS the user_id
    
    if user_id not in users_db:
        # Create new user with free tier
        users_db[user_id] = UserConfig(
            user_id=user_id,
            tier="free",
            api_keys={},
            cli_configs={
                "codex": True,      # Assume Codex is available (legacy)
                "claude": False,    # User needs to configure Claude Code (legacy)
                "gemini": False,    # User needs to configure Google AI CLI or API key (legacy)
                "openrouter": False # User needs to configure OpenRouter API key (primary)
            },
            preferences={},
            monthly_limit=TIERS["free"]["monthly_queries"],
            current_usage=0
        )
    
    return users_db[user_id]

async def check_query_limit(user: UserConfig) -> bool:
    """Check if user has remaining queries"""
    return user.current_usage < user.monthly_limit

# API Endpoints
@app.post("/api/query", response_model=QueryResponse)
async def execute_query(query: LLMQuery, user: UserConfig = Depends(get_user)):
    """Execute an LLM query with intelligent routing"""
    
    # Check query limits
    if not await check_query_limit(user):
        raise HTTPException(
            status_code=429, 
            detail=f"Monthly query limit ({user.monthly_limit}) exceeded. Upgrade your plan."
        )
    
    # Route query to best LLM
    selected_model = router.route_query(query, user)
    
    # Select adapter based on model metadata
    model_info = router.models.get(selected_model, {})
    adapter_name = model_info.get("adapter", "api")
    provider = model_info.get("provider", "unknown")
    
    # Priority: Use OpenRouter for all 2025 models
    if adapter_name == "openrouter":
        if "openrouter" in user.api_keys and user.api_keys["openrouter"]:
            adapter = adapters["openrouter"]
        else:
            raise HTTPException(
                status_code=400,
                detail="OpenRouter API key required for this model. Please add your OpenRouter API key in user settings. Get one at https://openrouter.ai"
            )
    # Legacy CLI support
    elif adapter_name in adapters and adapter_name in user.cli_configs and user.cli_configs[adapter_name]:
        adapter = adapters[adapter_name]
    # Check if API key is available for this provider (legacy)
    elif provider in user.api_keys and adapter_name in adapters:
        adapter = adapters[adapter_name]
    else:
        # Fallback to API adapter
        adapter = adapters["api"]
    
    # Execute query
    response = await adapter.execute_query(query, selected_model, user)
    
    # Update usage
    user.current_usage += 1
    users_db[user.user_id] = user
    
    # Log query
    queries_db[response.query_id] = {
        "user_id": user.user_id,
        "query": query.message[:200],
        "model_used": response.model_used,
        "tokens_used": response.tokens_used,
        "timestamp": datetime.now().isoformat(),
        "processing_time": response.processing_time
    }
    
    return response

@app.get("/api/user/config")
async def get_user_config(user: UserConfig = Depends(get_user)):
    """Get user configuration and usage stats"""
    return {
        "user_id": user.user_id,
        "tier": user.tier,
        "monthly_limit": user.monthly_limit,
        "current_usage": user.current_usage,
        "remaining_queries": user.monthly_limit - user.current_usage,
        "cli_configs": user.cli_configs,
        "features": TIERS[user.tier]["features"]
    }

@app.post("/api/user/config")
async def update_user_config(
    config_update: Dict[str, Any], 
    user: UserConfig = Depends(get_user)
):
    """Update user configuration"""
    
    # Update API keys
    if "api_keys" in config_update:
        user.api_keys.update(config_update["api_keys"])
    
    # Update CLI configs
    if "cli_configs" in config_update:
        user.cli_configs.update(config_update["cli_configs"])
    
    # Update preferences
    if "preferences" in config_update:
        user.preferences.update(config_update["preferences"])
    
    users_db[user.user_id] = user
    return {"status": "updated"}

@app.get("/api/analytics")
async def get_analytics(user: UserConfig = Depends(get_user)):
    """Get user analytics and usage statistics"""
    user_queries = [q for q in queries_db.values() if q["user_id"] == user.user_id]
    
    total_tokens = sum(q["tokens_used"] for q in user_queries)
    avg_processing_time = sum(q["processing_time"] for q in user_queries) / len(user_queries) if user_queries else 0
    
    model_usage = {}
    for q in user_queries:
        model = q["model_used"]
        model_usage[model] = model_usage.get(model, 0) + 1
    
    return {
        "total_queries": len(user_queries),
        "total_tokens": total_tokens,
        "avg_processing_time": round(avg_processing_time, 2),
        "current_month_usage": user.current_usage,
        "monthly_limit": user.monthly_limit,
        "model_usage": model_usage,
        "recent_queries": user_queries[-10:]  # Last 10 queries
    }

@app.get("/api/models")
async def get_available_models(user: UserConfig = Depends(get_user)):
    """Get available models and providers for the user"""
    available_models = {}
    available_providers = set()
    
    for model_name, model_info in router.models.items():
        if router.is_model_available(model_name, user):
            provider = model_info["provider"]
            if provider not in available_models:
                available_models[provider] = []
            
            available_models[provider].append({
                "id": model_name,
                "name": model_info["name"],
                "context_length": model_info["context_length"],
                "input_cost": model_info["input_cost"],
                "output_cost": model_info["output_cost"],
                "strengths": model_info["strengths"],
                "adapter": model_info["adapter"],
                "description": model_info["description"]
            })
            available_providers.add(provider)
    
    return {
        "models_by_provider": available_models,
        "available_providers": list(available_providers),
        "all_models": list(router.models.keys()),
        "provider_info": {
            "openai": {"name": "OpenAI", "models": router.provider_models.get("openai", [])},
            "anthropic": {"name": "Anthropic", "models": router.provider_models.get("anthropic", [])},
            "google": {"name": "Google", "models": router.provider_models.get("google", [])}
        },
        "pricing_info": {
            "markup_percentage": router.markup_percentage * 100,  # Show as percentage
            "description": "All prices include 10% platform markup on top of base API costs",
            "business_model": "OpenRouter-style unified API with markup pricing + monthly subscription",
            "setup_required": {
                "openrouter_api_key": "Required for all 2025 models. Get yours at https://openrouter.ai",
                "monthly_subscription": "Platform subscription for query limits and advanced features"
            }
        }
    }

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)