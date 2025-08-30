// Auto-generated provider configurations from api.ts
// This file contains all 35 supported AI providers with their model configurations

export interface ModelInfo {
  maxTokens: number;
  contextWindow: number;
  inputPrice: number;
  outputPrice: number;
  cacheWritePrice?: number;
  cacheReadPrice?: number;
  supportsImages: boolean;
  supportsPromptCache: boolean;
  supportsTools: boolean;
  supportsStreaming: boolean;
}

export interface ProviderConfig {
  name: string;
  displayName: string;
  description: string;
  website?: string;
  models: Record<string, ModelInfo>;
  category: 'major' | 'cloud' | 'local' | 'aggregator' | 'specialized';
  requiresAuth?: boolean;
  setupInstructions?: string;
}

// Provider configurations
export const PROVIDERS = {
  "anthropic": {
    name: "anthropic",
    displayName: "Anthropic",
    description: "Advanced AI models including Claude Sonnet and Opus",
    website: "https://www.anthropic.com",
    category: "major",
    requiresAuth: true,
    models:     {
          "claude-sonnet-4-20250514:1m": {
                "maxTokens": 8192,
                "contextWindow": 1000000,
                "inputPrice": 3,
                "outputPrice": 15,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 3.75,
                "cacheReadPrice": 0.3
          },
          "claude-sonnet-4-20250514": {
                "maxTokens": 8192,
                "contextWindow": 200000,
                "inputPrice": 3,
                "outputPrice": 15,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 3.75,
                "cacheReadPrice": 0.3
          },
          "claude-opus-4-1-20250805": {
                "maxTokens": 8192,
                "contextWindow": 200000,
                "inputPrice": 15,
                "outputPrice": 75,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 18.75,
                "cacheReadPrice": 1.5
          },
          "claude-opus-4-20250514": {
                "maxTokens": 8192,
                "contextWindow": 200000,
                "inputPrice": 15,
                "outputPrice": 75,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 18.75,
                "cacheReadPrice": 1.5
          },
          "claude-3-7-sonnet-20250219": {
                "maxTokens": 8192,
                "contextWindow": 200000,
                "inputPrice": 3,
                "outputPrice": 15,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 3.75,
                "cacheReadPrice": 0.3
          },
          "claude-3-5-sonnet-20241022": {
                "maxTokens": 8192,
                "contextWindow": 200000,
                "inputPrice": 3,
                "outputPrice": 15,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 3.75,
                "cacheReadPrice": 0.3
          },
          "claude-3-5-haiku-20241022": {
                "maxTokens": 8192,
                "contextWindow": 200000,
                "inputPrice": 0.8,
                "outputPrice": 4,
                "supportsImages": false,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 1,
                "cacheReadPrice": 0.08
          },
          "claude-3-opus-20240229": {
                "maxTokens": 4096,
                "contextWindow": 200000,
                "inputPrice": 15,
                "outputPrice": 75,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 18.75,
                "cacheReadPrice": 1.5
          },
          "claude-3-haiku-20240307": {
                "maxTokens": 4096,
                "contextWindow": 200000,
                "inputPrice": 0.25,
                "outputPrice": 1.25,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0.3,
                "cacheReadPrice": 0.03
          }
    },
  },
  "asksage": {
    name: "asksage",
    displayName: "AskSage",
    description: "AI platform with multiple model access",
    category: "specialized",
    requiresAuth: true,
    models:     {
          "gpt-4o": {
                "maxTokens": 4096,
                "contextWindow": 128000,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "gpt-4o-gov": {
                "maxTokens": 4096,
                "contextWindow": 128000,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "gpt-4.1": {
                "maxTokens": 32768,
                "contextWindow": 1047576,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "claude-35-sonnet": {
                "maxTokens": 8192,
                "contextWindow": 200000,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "aws-bedrock-claude-35-sonnet-gov": {
                "maxTokens": 8192,
                "contextWindow": 200000,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "claude-37-sonnet": {
                "maxTokens": 8192,
                "contextWindow": 200000,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "claude-4-sonnet": {
                "maxTokens": 8192,
                "contextWindow": 200000,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "claude-4-opus": {
                "maxTokens": 8192,
                "contextWindow": 200000,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "google-gemini-2.5-pro": {
                "maxTokens": 65536,
                "contextWindow": 1048576,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "deepseek-ai/DeepSeek-V3": {
                "maxTokens": 32000,
                "contextWindow": 96000,
                "inputPrice": 0.5,
                "outputPrice": 1.5,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "deepseek-ai/DeepSeek-V3-0324-fast": {
                "maxTokens": 128000,
                "contextWindow": 128000,
                "inputPrice": 2,
                "outputPrice": 6,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "deepseek-ai/DeepSeek-R1": {
                "maxTokens": 32000,
                "contextWindow": 96000,
                "inputPrice": 0.8,
                "outputPrice": 2.4,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "deepseek-ai/DeepSeek-R1-fast": {
                "maxTokens": 32000,
                "contextWindow": 96000,
                "inputPrice": 2,
                "outputPrice": 6,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "deepseek-ai/DeepSeek-R1-0528": {
                "maxTokens": 128000,
                "contextWindow": 163840,
                "inputPrice": 0.8,
                "outputPrice": 2.4,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "meta-llama/Llama-3.3-70B-Instruct-fast": {
                "maxTokens": 32000,
                "contextWindow": 96000,
                "inputPrice": 0.25,
                "outputPrice": 0.75,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "Qwen/Qwen2.5-32B-Instruct-fast": {
                "maxTokens": 8192,
                "contextWindow": 32768,
                "inputPrice": 0.13,
                "outputPrice": 0.4,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "Qwen/Qwen2.5-Coder-32B-Instruct-fast": {
                "maxTokens": 128000,
                "contextWindow": 128000,
                "inputPrice": 0.1,
                "outputPrice": 0.3,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "Qwen/Qwen3-4B-fast": {
                "maxTokens": 32000,
                "contextWindow": 41000,
                "inputPrice": 0.08,
                "outputPrice": 0.24,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "Qwen/Qwen3-30B-A3B-fast": {
                "maxTokens": 32000,
                "contextWindow": 41000,
                "inputPrice": 0.3,
                "outputPrice": 0.9,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "Qwen/Qwen3-235B-A22B": {
                "maxTokens": 32000,
                "contextWindow": 41000,
                "inputPrice": 0.2,
                "outputPrice": 0.6,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "openai/gpt-oss-120b": {
                "maxTokens": 32766,
                "contextWindow": 131000,
                "inputPrice": 0.15,
                "outputPrice": 0.6,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "moonshotai/Kimi-K2-Instruct": {
                "maxTokens": 16384,
                "contextWindow": 131000,
                "inputPrice": 0.5,
                "outputPrice": 2.4,
                "supportsImages": false,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "Qwen/Qwen3-Coder-480B-A35B-Instruct": {
                "maxTokens": 163800,
                "contextWindow": 262000,
                "inputPrice": 0.4,
                "outputPrice": 1.8,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "openai/gpt-oss-20b": {
                "maxTokens": 32766,
                "contextWindow": 131000,
                "inputPrice": 0.05,
                "outputPrice": 0.2,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "zai-org/GLM-4.5": {
                "maxTokens": 98304,
                "contextWindow": 128000,
                "inputPrice": 0.6,
                "outputPrice": 2.2,
                "supportsImages": false,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "zai-org/GLM-4.5-Air": {
                "maxTokens": 98304,
                "contextWindow": 128000,
                "inputPrice": 0.2,
                "outputPrice": 1.2,
                "supportsImages": false,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "deepseek-ai/DeepSeek-R1-0528-fast": {
                "maxTokens": 128000,
                "contextWindow": 164000,
                "inputPrice": 2,
                "outputPrice": 6,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "Qwen/Qwen3-235B-A22B-Instruct-2507": {
                "maxTokens": 64000,
                "contextWindow": 262000,
                "inputPrice": 0.2,
                "outputPrice": 0.6,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "Qwen/Qwen3-30B-A3B": {
                "maxTokens": 32000,
                "contextWindow": 41000,
                "inputPrice": 0.1,
                "outputPrice": 0.3,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "Qwen/Qwen3-32B": {
                "maxTokens": 16384,
                "contextWindow": 41000,
                "inputPrice": 0.1,
                "outputPrice": 0.3,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "Qwen/Qwen3-32B-fast": {
                "maxTokens": 16384,
                "contextWindow": 41000,
                "inputPrice": 0.2,
                "outputPrice": 0.6,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          }
    },
  },
  "baseten": {
    name: "baseten",
    displayName: "Baseten",
    description: "ML model serving platform",
    category: "cloud",
    requiresAuth: true,
    models:     {
          "deepseek-ai/DeepSeek-R1-0528": {
                "maxTokens": 131072,
                "contextWindow": 163840,
                "inputPrice": 2.55,
                "outputPrice": 5.95,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0,
                "cacheReadPrice": 0
          },
          "deepseek-ai/DeepSeek-V3-0324": {
                "maxTokens": 131072,
                "contextWindow": 163840,
                "inputPrice": 0.77,
                "outputPrice": 0.77,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0,
                "cacheReadPrice": 0
          },
          "meta-llama/Llama-4-Maverick-17B-128E-Instruct": {
                "maxTokens": 8192,
                "contextWindow": 131072,
                "inputPrice": 0.19,
                "outputPrice": 0.72,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0,
                "cacheReadPrice": 0
          },
          "meta-llama/Llama-4-Scout-17B-16E-Instruct": {
                "maxTokens": 8192,
                "contextWindow": 131072,
                "inputPrice": 0.13,
                "outputPrice": 0.5,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0,
                "cacheReadPrice": 0
          },
          "moonshotai/Kimi-K2-Instruct": {
                "maxTokens": 131072,
                "contextWindow": 131072,
                "inputPrice": 0.6,
                "outputPrice": 2.5,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0,
                "cacheReadPrice": 0
          },
          "Qwen/Qwen3-235B-A22B-Instruct-2507": {
                "maxTokens": 163800,
                "contextWindow": 163800,
                "inputPrice": 0.22,
                "outputPrice": 0.8,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0,
                "cacheReadPrice": 0
          },
          "Qwen/Qwen3-Coder-480B-A35B-Instruct": {
                "maxTokens": 163800,
                "contextWindow": 163800,
                "inputPrice": 1.7,
                "outputPrice": 1.7,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0,
                "cacheReadPrice": 0
          }
    },
  },
  "bedrock": {
    name: "bedrock",
    displayName: "AWS Bedrock",
    description: "AWS managed AI service",
    website: "https://aws.amazon.com/bedrock/",
    category: "cloud",
    requiresAuth: true,
    models:     {
          "anthropic.claude-sonnet-4-20250514-v1:0:1m": {
                "maxTokens": 8192,
                "contextWindow": 1000000,
                "inputPrice": 3,
                "outputPrice": 15,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 3.75,
                "cacheReadPrice": 0.3
          },
          "anthropic.claude-sonnet-4-20250514-v1:0": {
                "maxTokens": 8192,
                "contextWindow": 200000,
                "inputPrice": 3,
                "outputPrice": 15,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 3.75,
                "cacheReadPrice": 0.3
          },
          "anthropic.claude-opus-4-20250514-v1:0": {
                "maxTokens": 8192,
                "contextWindow": 200000,
                "inputPrice": 15,
                "outputPrice": 75,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 18.75,
                "cacheReadPrice": 1.5
          },
          "anthropic.claude-opus-4-1-20250805-v1:0": {
                "maxTokens": 8192,
                "contextWindow": 200000,
                "inputPrice": 15,
                "outputPrice": 75,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 18.75,
                "cacheReadPrice": 1.5
          },
          "amazon.nova-premier-v1:0": {
                "maxTokens": 10000,
                "contextWindow": 1000000,
                "inputPrice": 2.5,
                "outputPrice": 12.5,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "amazon.nova-pro-v1:0": {
                "maxTokens": 5000,
                "contextWindow": 300000,
                "inputPrice": 0.8,
                "outputPrice": 3.2,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 3.2,
                "cacheReadPrice": 0.2
          },
          "amazon.nova-lite-v1:0": {
                "maxTokens": 5000,
                "contextWindow": 300000,
                "inputPrice": 0.06,
                "outputPrice": 0.24,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0.24,
                "cacheReadPrice": 0.015
          },
          "amazon.nova-micro-v1:0": {
                "maxTokens": 5000,
                "contextWindow": 128000,
                "inputPrice": 0.035,
                "outputPrice": 0.14,
                "supportsImages": false,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0.14,
                "cacheReadPrice": 0.00875
          },
          "anthropic.claude-3-7-sonnet-20250219-v1:0": {
                "maxTokens": 8192,
                "contextWindow": 200000,
                "inputPrice": 3,
                "outputPrice": 15,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 3.75,
                "cacheReadPrice": 0.3
          },
          "anthropic.claude-3-5-sonnet-20241022-v2:0": {
                "maxTokens": 8192,
                "contextWindow": 200000,
                "inputPrice": 3,
                "outputPrice": 15,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 3.75,
                "cacheReadPrice": 0.3
          },
          "anthropic.claude-3-5-haiku-20241022-v1:0": {
                "maxTokens": 8192,
                "contextWindow": 200000,
                "inputPrice": 0.8,
                "outputPrice": 4,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 1,
                "cacheReadPrice": 0.08
          },
          "anthropic.claude-3-5-sonnet-20240620-v1:0": {
                "maxTokens": 8192,
                "contextWindow": 200000,
                "inputPrice": 3,
                "outputPrice": 15,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "anthropic.claude-3-opus-20240229-v1:0": {
                "maxTokens": 4096,
                "contextWindow": 200000,
                "inputPrice": 15,
                "outputPrice": 75,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "anthropic.claude-3-sonnet-20240229-v1:0": {
                "maxTokens": 4096,
                "contextWindow": 200000,
                "inputPrice": 3,
                "outputPrice": 15,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "anthropic.claude-3-haiku-20240307-v1:0": {
                "maxTokens": 4096,
                "contextWindow": 200000,
                "inputPrice": 0.25,
                "outputPrice": 1.25,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "deepseek.r1-v1:0": {
                "maxTokens": 8000,
                "contextWindow": 64000,
                "inputPrice": 1.35,
                "outputPrice": 5.4,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "openai.gpt-oss-120b-1:0": {
                "maxTokens": 8192,
                "contextWindow": 128000,
                "inputPrice": 0.15,
                "outputPrice": 0.6,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "openai.gpt-oss-20b-1:0": {
                "maxTokens": 8192,
                "contextWindow": 128000,
                "inputPrice": 0.07,
                "outputPrice": 0.3,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          }
    },
  },
  "cerebras": {
    name: "cerebras",
    displayName: "Cerebras",
    description: "High-performance AI compute platform",
    website: "https://cerebras.ai",
    category: "specialized",
    requiresAuth: true,
    models:     {
          "gpt-oss-120b": {
                "maxTokens": 65536,
                "contextWindow": 128000,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "qwen-3-coder-480b-free": {
                "maxTokens": 40000,
                "contextWindow": 64000,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "qwen-3-coder-480b": {
                "maxTokens": 40000,
                "contextWindow": 128000,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "qwen-3-235b-a22b-instruct-2507": {
                "maxTokens": 64000,
                "contextWindow": 64000,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "llama-3.3-70b": {
                "maxTokens": 64000,
                "contextWindow": 64000,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "qwen-3-32b": {
                "maxTokens": 64000,
                "contextWindow": 64000,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "qwen-3-235b-a22b-thinking-2507": {
                "maxTokens": 32000,
                "contextWindow": 65000,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          }
    },
  },
  "claude-code": {
    name: "claude-code",
    displayName: "Claude Code",
    description: "Claude models optimized for coding tasks",
    website: "https://claude.ai/code",
    category: "major",
    requiresAuth: true,
    models:     {
          "claude-sonnet-4-20250514": {
                "maxTokens": 8192,
                "contextWindow": 128000,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "claude-opus-4-1-20250805": {
                "maxTokens": 8192,
                "contextWindow": 128000,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "claude-opus-4-20250514": {
                "maxTokens": 8192,
                "contextWindow": 128000,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "claude-3-7-sonnet-20250219": {
                "maxTokens": 8192,
                "contextWindow": 128000,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "claude-3-5-sonnet-20241022": {
                "maxTokens": 8192,
                "contextWindow": 128000,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "claude-3-5-haiku-20241022": {
                "maxTokens": 8192,
                "contextWindow": 128000,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          }
    },
  },
  "cline": {
    name: "cline",
    displayName: "Cline",
    description: "AI coding assistant",
    category: "specialized",
    requiresAuth: true,
    models:     {
          "cline-default": {
                "maxTokens": 8192,
                "contextWindow": 128000,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          }
    },
  },
  "deepseek": {
    name: "deepseek",
    displayName: "DeepSeek",
    description: "AI models focused on coding and reasoning",
    website: "https://www.deepseek.com",
    category: "specialized",
    requiresAuth: true,
    models:     {
          "deepseek-chat": {
                "maxTokens": 8000,
                "contextWindow": 128000,
                "inputPrice": 0,
                "outputPrice": 1.1,
                "supportsImages": false,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0.27,
                "cacheReadPrice": 0.07
          },
          "deepseek-reasoner": {
                "maxTokens": 8000,
                "contextWindow": 128000,
                "inputPrice": 0,
                "outputPrice": 2.19,
                "supportsImages": false,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0.55,
                "cacheReadPrice": 0.14
          }
    },
  },
  "dify": {
    name: "dify",
    displayName: "Dify",
    description: "LLMOps platform",
    category: "specialized",
    requiresAuth: true,
    models:     {
          "dify-default": {
                "maxTokens": 8192,
                "contextWindow": 128000,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          }
    },
  },
  "doubao": {
    name: "doubao",
    displayName: "Doubao",
    description: "ByteDance's AI models",
    website: "https://www.doubao.com",
    category: "specialized",
    requiresAuth: true,
    models:     {
          "doubao-1-5-pro-256k-250115": {
                "maxTokens": 12288,
                "contextWindow": 256000,
                "inputPrice": 0.7,
                "outputPrice": 1.3,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0,
                "cacheReadPrice": 0
          },
          "doubao-1-5-pro-32k-250115": {
                "maxTokens": 12288,
                "contextWindow": 32000,
                "inputPrice": 0.11,
                "outputPrice": 0.3,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0,
                "cacheReadPrice": 0
          },
          "deepseek-v3-250324": {
                "maxTokens": 12288,
                "contextWindow": 128000,
                "inputPrice": 0.55,
                "outputPrice": 2.19,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0,
                "cacheReadPrice": 0
          },
          "deepseek-r1-250120": {
                "maxTokens": 32768,
                "contextWindow": 64000,
                "inputPrice": 0.27,
                "outputPrice": 1.09,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0,
                "cacheReadPrice": 0
          }
    },
  },
  "fireworks": {
    name: "fireworks",
    displayName: "Fireworks AI",
    description: "Production AI inference platform",
    website: "https://fireworks.ai",
    category: "aggregator",
    requiresAuth: true,
    models:     {
          "accounts/fireworks/models/kimi-k2-instruct": {
                "maxTokens": 16384,
                "contextWindow": 128000,
                "inputPrice": 0.6,
                "outputPrice": 2.5,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "accounts/fireworks/models/qwen3-235b-a22b-instruct-2507": {
                "maxTokens": 32768,
                "contextWindow": 256000,
                "inputPrice": 0.22,
                "outputPrice": 0.88,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "accounts/fireworks/models/qwen3-coder-480b-a35b-instruct": {
                "maxTokens": 32768,
                "contextWindow": 256000,
                "inputPrice": 0.45,
                "outputPrice": 1.8,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "accounts/fireworks/models/deepseek-r1-0528": {
                "maxTokens": 20480,
                "contextWindow": 160000,
                "inputPrice": 3,
                "outputPrice": 8,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "accounts/fireworks/models/deepseek-v3": {
                "maxTokens": 16384,
                "contextWindow": 128000,
                "inputPrice": 0.9,
                "outputPrice": 0.9,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          }
    },
  },
  "gemini": {
    name: "gemini",
    displayName: "Google Gemini",
    description: "Google's Gemini AI models",
    website: "https://gemini.google.com",
    category: "major",
    requiresAuth: true,
    models:     {
          "gemini-2.5-pro": {
                "maxTokens": 65536,
                "contextWindow": 1048576,
                "inputPrice": 2.5,
                "outputPrice": 15,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheReadPrice": 0.625
          },
          "gemini-2.5-flash-lite-preview-06-17": {
                "maxTokens": 64000,
                "contextWindow": 1000000,
                "inputPrice": 0.1,
                "outputPrice": 0.4,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheReadPrice": 0.025
          },
          "gemini-2.5-flash": {
                "maxTokens": 65536,
                "contextWindow": 1048576,
                "inputPrice": 0.3,
                "outputPrice": 2.5,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheReadPrice": 0.075
          },
          "gemini-2.0-flash-001": {
                "maxTokens": 8192,
                "contextWindow": 1048576,
                "inputPrice": 0.1,
                "outputPrice": 0.4,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 1,
                "cacheReadPrice": 0.025
          },
          "gemini-2.0-flash-lite-preview-02-05": {
                "maxTokens": 8192,
                "contextWindow": 1048576,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "gemini-2.0-pro-exp-02-05": {
                "maxTokens": 8192,
                "contextWindow": 2097152,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "gemini-2.0-flash-thinking-exp-01-21": {
                "maxTokens": 65536,
                "contextWindow": 1048576,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "gemini-2.0-flash-thinking-exp-1219": {
                "maxTokens": 8192,
                "contextWindow": 32767,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "gemini-2.0-flash-exp": {
                "maxTokens": 8192,
                "contextWindow": 1048576,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "gemini-1.5-flash-002": {
                "maxTokens": 8192,
                "contextWindow": 1048576,
                "inputPrice": 0.15,
                "outputPrice": 0.6,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 1,
                "cacheReadPrice": 0.0375
          },
          "gemini-1.5-flash-exp-0827": {
                "maxTokens": 8192,
                "contextWindow": 1048576,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "gemini-1.5-flash-8b-exp-0827": {
                "maxTokens": 8192,
                "contextWindow": 1048576,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "gemini-1.5-pro-002": {
                "maxTokens": 8192,
                "contextWindow": 2097152,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "gemini-1.5-pro-exp-0827": {
                "maxTokens": 8192,
                "contextWindow": 2097152,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "gemini-exp-1206": {
                "maxTokens": 8192,
                "contextWindow": 2097152,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          }
    },
  },
  "groq": {
    name: "groq",
    displayName: "Groq",
    description: "Fast inference for open-source models",
    website: "https://groq.com",
    category: "aggregator",
    requiresAuth: true,
    models:     {
          "openai/gpt-oss-120b": {
                "maxTokens": 32766,
                "contextWindow": 131072,
                "inputPrice": 0.15,
                "outputPrice": 0.75,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "openai/gpt-oss-20b": {
                "maxTokens": 32766,
                "contextWindow": 131072,
                "inputPrice": 0.1,
                "outputPrice": 0.5,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "compound-beta": {
                "maxTokens": 8192,
                "contextWindow": 128000,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "compound-beta-mini": {
                "maxTokens": 8192,
                "contextWindow": 128000,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "deepseek-r1-distill-llama-70b": {
                "maxTokens": 131072,
                "contextWindow": 131072,
                "inputPrice": 0.75,
                "outputPrice": 0.99,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "meta-llama/llama-4-maverick-17b-128e-instruct": {
                "maxTokens": 8192,
                "contextWindow": 131072,
                "inputPrice": 0.2,
                "outputPrice": 0.6,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "meta-llama/llama-4-scout-17b-16e-instruct": {
                "maxTokens": 8192,
                "contextWindow": 131072,
                "inputPrice": 0.11,
                "outputPrice": 0.34,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "llama-3.3-70b-versatile": {
                "maxTokens": 32768,
                "contextWindow": 131072,
                "inputPrice": 0.59,
                "outputPrice": 0.79,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "llama-3.1-8b-instant": {
                "maxTokens": 131072,
                "contextWindow": 131072,
                "inputPrice": 0.05,
                "outputPrice": 0.08,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "moonshotai/kimi-k2-instruct": {
                "maxTokens": 16384,
                "contextWindow": 131072,
                "inputPrice": 1,
                "outputPrice": 3,
                "supportsImages": false,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheReadPrice": 0.5
          }
    },
  },
  "huawei-cloud-maas": {
    name: "huawei-cloud-maas",
    displayName: "Huawei Cloud MaaS",
    description: "Huawei's cloud AI services",
    category: "cloud",
    requiresAuth: true,
    models:     {
          "DeepSeek-V3": {
                "maxTokens": 16384,
                "contextWindow": 64000,
                "inputPrice": 0.27,
                "outputPrice": 1.1,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0,
                "cacheReadPrice": 0
          },
          "DeepSeek-R1": {
                "maxTokens": 16384,
                "contextWindow": 64000,
                "inputPrice": 0.55,
                "outputPrice": 2.2,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0,
                "cacheReadPrice": 0
          },
          "deepseek-r1-250528": {
                "maxTokens": 16384,
                "contextWindow": 64000,
                "inputPrice": 0.55,
                "outputPrice": 2.2,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0,
                "cacheReadPrice": 0
          },
          "qwen3-235b-a22b": {
                "maxTokens": 8192,
                "contextWindow": 32000,
                "inputPrice": 0.27,
                "outputPrice": 1.1,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0,
                "cacheReadPrice": 0
          },
          "qwen3-32b": {
                "maxTokens": 8192,
                "contextWindow": 32000,
                "inputPrice": 0.27,
                "outputPrice": 1.1,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0,
                "cacheReadPrice": 0
          }
    },
  },
  "huggingface": {
    name: "huggingface",
    displayName: "Hugging Face",
    description: "Open-source ML platform and model hub",
    website: "https://huggingface.co",
    category: "aggregator",
    requiresAuth: true,
    models:     {
          "openai/gpt-oss-120b": {
                "maxTokens": 32766,
                "contextWindow": 131072,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "openai/gpt-oss-20b": {
                "maxTokens": 32766,
                "contextWindow": 131072,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "moonshotai/Kimi-K2-Instruct": {
                "maxTokens": 131072,
                "contextWindow": 131072,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "deepseek-ai/DeepSeek-V3-0324": {
                "maxTokens": 8192,
                "contextWindow": 64000,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "deepseek-ai/DeepSeek-R1": {
                "maxTokens": 8192,
                "contextWindow": 64000,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "deepseek-ai/DeepSeek-R1-0528": {
                "maxTokens": 64000,
                "contextWindow": 64000,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "meta-llama/Llama-3.1-8B-Instruct": {
                "maxTokens": 8192,
                "contextWindow": 128000,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          }
    },
  },
  "litellm": {
    name: "litellm",
    displayName: "LiteLLM",
    description: "Unified API for 100+ LLM providers",
    category: "aggregator",
    requiresAuth: true,
    models:     {
          "litellm-default": {
                "maxTokens": 8192,
                "contextWindow": 128000,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          }
    },
  },
  "lmstudio": {
    name: "lmstudio",
    displayName: "LM Studio",
    description: "Local AI model hosting",
    website: "https://lmstudio.ai",
    category: "local",
    setupInstructions: "Install LM Studio and start the local server",
    models:     {
          "lmstudio-default": {
                "maxTokens": 8192,
                "contextWindow": 128000,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          }
    },
  },
  "mistral": {
    name: "mistral",
    displayName: "Mistral AI",
    description: "European AI company with powerful models",
    website: "https://mistral.ai",
    category: "major",
    requiresAuth: true,
    models:     {
          "mistral-large-2411": {
                "maxTokens": 128000,
                "contextWindow": 128000,
                "inputPrice": 2,
                "outputPrice": 6,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "pixtral-large-2411": {
                "maxTokens": 131000,
                "contextWindow": 131000,
                "inputPrice": 2,
                "outputPrice": 6,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "ministral-3b-2410": {
                "maxTokens": 128000,
                "contextWindow": 128000,
                "inputPrice": 0.04,
                "outputPrice": 0.04,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "ministral-8b-2410": {
                "maxTokens": 128000,
                "contextWindow": 128000,
                "inputPrice": 0.1,
                "outputPrice": 0.1,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "mistral-small-latest": {
                "maxTokens": 128000,
                "contextWindow": 128000,
                "inputPrice": 0.1,
                "outputPrice": 0.3,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "mistral-medium-latest": {
                "maxTokens": 128000,
                "contextWindow": 128000,
                "inputPrice": 0.4,
                "outputPrice": 2,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "mistral-small-2501": {
                "maxTokens": 32000,
                "contextWindow": 32000,
                "inputPrice": 0.1,
                "outputPrice": 0.3,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "pixtral-12b-2409": {
                "maxTokens": 128000,
                "contextWindow": 128000,
                "inputPrice": 0.15,
                "outputPrice": 0.15,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "open-mistral-nemo-2407": {
                "maxTokens": 128000,
                "contextWindow": 128000,
                "inputPrice": 0.15,
                "outputPrice": 0.15,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "open-codestral-mamba": {
                "maxTokens": 256000,
                "contextWindow": 256000,
                "inputPrice": 0.15,
                "outputPrice": 0.15,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "codestral-2501": {
                "maxTokens": 256000,
                "contextWindow": 256000,
                "inputPrice": 0.3,
                "outputPrice": 0.9,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "devstral-small-2505": {
                "maxTokens": 128000,
                "contextWindow": 131072,
                "inputPrice": 0.1,
                "outputPrice": 0.3,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "devstral-medium-latest": {
                "maxTokens": 128000,
                "contextWindow": 131072,
                "inputPrice": 0.4,
                "outputPrice": 2,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          }
    },
  },
  "moonshot": {
    name: "moonshot",
    displayName: "Moonshot AI",
    description: "Chinese AI company with Kimi models",
    website: "https://www.moonshot.cn",
    category: "specialized",
    requiresAuth: true,
    models:     {
          "kimi-k2-0711-preview": {
                "maxTokens": 32000,
                "contextWindow": 131072,
                "inputPrice": 0.6,
                "outputPrice": 2.5,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "kimi-k2-turbo-preview": {
                "maxTokens": 32000,
                "contextWindow": 131072,
                "inputPrice": 2.4,
                "outputPrice": 10,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "moonshot-v1-128k-vision-preview": {
                "maxTokens": 32000,
                "contextWindow": 131072,
                "inputPrice": 2,
                "outputPrice": 5,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "kimi-thinking-preview": {
                "maxTokens": 32000,
                "contextWindow": 131072,
                "inputPrice": 30,
                "outputPrice": 30,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          }
    },
  },
  "nebius": {
    name: "nebius",
    displayName: "Nebius",
    description: "Cloud AI platform",
    category: "specialized",
    requiresAuth: true,
    models:     {
          "deepseek-ai/DeepSeek-V3": {
                "maxTokens": 32000,
                "contextWindow": 96000,
                "inputPrice": 0.5,
                "outputPrice": 1.5,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "deepseek-ai/DeepSeek-V3-0324-fast": {
                "maxTokens": 128000,
                "contextWindow": 128000,
                "inputPrice": 2,
                "outputPrice": 6,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "deepseek-ai/DeepSeek-R1": {
                "maxTokens": 32000,
                "contextWindow": 96000,
                "inputPrice": 0.8,
                "outputPrice": 2.4,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "deepseek-ai/DeepSeek-R1-fast": {
                "maxTokens": 32000,
                "contextWindow": 96000,
                "inputPrice": 2,
                "outputPrice": 6,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "deepseek-ai/DeepSeek-R1-0528": {
                "maxTokens": 128000,
                "contextWindow": 163840,
                "inputPrice": 0.8,
                "outputPrice": 2.4,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "meta-llama/Llama-3.3-70B-Instruct-fast": {
                "maxTokens": 32000,
                "contextWindow": 96000,
                "inputPrice": 0.25,
                "outputPrice": 0.75,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "Qwen/Qwen2.5-32B-Instruct-fast": {
                "maxTokens": 8192,
                "contextWindow": 32768,
                "inputPrice": 0.13,
                "outputPrice": 0.4,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "Qwen/Qwen2.5-Coder-32B-Instruct-fast": {
                "maxTokens": 128000,
                "contextWindow": 128000,
                "inputPrice": 0.1,
                "outputPrice": 0.3,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "Qwen/Qwen3-4B-fast": {
                "maxTokens": 32000,
                "contextWindow": 41000,
                "inputPrice": 0.08,
                "outputPrice": 0.24,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "Qwen/Qwen3-30B-A3B-fast": {
                "maxTokens": 32000,
                "contextWindow": 41000,
                "inputPrice": 0.3,
                "outputPrice": 0.9,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "Qwen/Qwen3-235B-A22B": {
                "maxTokens": 32000,
                "contextWindow": 41000,
                "inputPrice": 0.2,
                "outputPrice": 0.6,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "openai/gpt-oss-120b": {
                "maxTokens": 32766,
                "contextWindow": 131000,
                "inputPrice": 0.15,
                "outputPrice": 0.6,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "moonshotai/Kimi-K2-Instruct": {
                "maxTokens": 16384,
                "contextWindow": 131000,
                "inputPrice": 0.5,
                "outputPrice": 2.4,
                "supportsImages": false,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "Qwen/Qwen3-Coder-480B-A35B-Instruct": {
                "maxTokens": 163800,
                "contextWindow": 262000,
                "inputPrice": 0.4,
                "outputPrice": 1.8,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "openai/gpt-oss-20b": {
                "maxTokens": 32766,
                "contextWindow": 131000,
                "inputPrice": 0.05,
                "outputPrice": 0.2,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "zai-org/GLM-4.5": {
                "maxTokens": 98304,
                "contextWindow": 128000,
                "inputPrice": 0.6,
                "outputPrice": 2.2,
                "supportsImages": false,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "zai-org/GLM-4.5-Air": {
                "maxTokens": 98304,
                "contextWindow": 128000,
                "inputPrice": 0.2,
                "outputPrice": 1.2,
                "supportsImages": false,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "deepseek-ai/DeepSeek-R1-0528-fast": {
                "maxTokens": 128000,
                "contextWindow": 164000,
                "inputPrice": 2,
                "outputPrice": 6,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "Qwen/Qwen3-235B-A22B-Instruct-2507": {
                "maxTokens": 64000,
                "contextWindow": 262000,
                "inputPrice": 0.2,
                "outputPrice": 0.6,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "Qwen/Qwen3-30B-A3B": {
                "maxTokens": 32000,
                "contextWindow": 41000,
                "inputPrice": 0.1,
                "outputPrice": 0.3,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "Qwen/Qwen3-32B": {
                "maxTokens": 16384,
                "contextWindow": 41000,
                "inputPrice": 0.1,
                "outputPrice": 0.3,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "Qwen/Qwen3-32B-fast": {
                "maxTokens": 16384,
                "contextWindow": 41000,
                "inputPrice": 0.2,
                "outputPrice": 0.6,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          }
    },
  },
  "ollama": {
    name: "ollama",
    displayName: "Ollama",
    description: "Run large language models locally",
    website: "https://ollama.ai",
    category: "local",
    setupInstructions: "Install Ollama locally and ensure it's running on localhost:11434",
    models:     {
          "ollama-default": {
                "maxTokens": 8192,
                "contextWindow": 128000,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          }
    },
  },
  "openai": {
    name: "openai",
    displayName: "OpenAI",
    description: "GPT models from OpenAI",
    website: "https://openai.com",
    category: "major",
    requiresAuth: true,
    models:     {
          "gpt-5-2025-08-07": {
                "maxTokens": 8192,
                "contextWindow": 272000,
                "inputPrice": 1.25,
                "outputPrice": 10,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheReadPrice": 0.125
          },
          "gpt-5-mini-2025-08-07": {
                "maxTokens": 8192,
                "contextWindow": 272000,
                "inputPrice": 0.25,
                "outputPrice": 2,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheReadPrice": 0.025
          },
          "gpt-5-nano-2025-08-07": {
                "maxTokens": 8192,
                "contextWindow": 272000,
                "inputPrice": 0.05,
                "outputPrice": 0.4,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheReadPrice": 0.005
          },
          "gpt-5-chat-latest": {
                "maxTokens": 8192,
                "contextWindow": 400000,
                "inputPrice": 1.25,
                "outputPrice": 10,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheReadPrice": 0.125
          },
          "o4-mini": {
                "maxTokens": 100000,
                "contextWindow": 200000,
                "inputPrice": 1.1,
                "outputPrice": 4.4,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheReadPrice": 0.275
          },
          "gpt-4.1": {
                "maxTokens": 32768,
                "contextWindow": 1047576,
                "inputPrice": 2,
                "outputPrice": 8,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheReadPrice": 0.5
          },
          "gpt-4.1-mini": {
                "maxTokens": 32768,
                "contextWindow": 1047576,
                "inputPrice": 0.4,
                "outputPrice": 1.6,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheReadPrice": 0.1
          },
          "gpt-4.1-nano": {
                "maxTokens": 32768,
                "contextWindow": 1047576,
                "inputPrice": 0.1,
                "outputPrice": 0.4,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheReadPrice": 0.025
          },
          "o3-mini": {
                "maxTokens": 100000,
                "contextWindow": 200000,
                "inputPrice": 1.1,
                "outputPrice": 4.4,
                "supportsImages": false,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheReadPrice": 0.55
          },
          "o1-preview": {
                "maxTokens": 32768,
                "contextWindow": 128000,
                "inputPrice": 15,
                "outputPrice": 60,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheReadPrice": 7.5
          },
          "o1-mini": {
                "maxTokens": 65536,
                "contextWindow": 128000,
                "inputPrice": 1.1,
                "outputPrice": 4.4,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheReadPrice": 0.55
          },
          "gpt-4o": {
                "maxTokens": 4096,
                "contextWindow": 128000,
                "inputPrice": 2.5,
                "outputPrice": 10,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheReadPrice": 1.25
          },
          "gpt-4o-mini": {
                "maxTokens": 16384,
                "contextWindow": 128000,
                "inputPrice": 0.15,
                "outputPrice": 0.6,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheReadPrice": 0.075
          },
          "chatgpt-4o-latest": {
                "maxTokens": 16384,
                "contextWindow": 128000,
                "inputPrice": 5,
                "outputPrice": 15,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          }
    },
  },
  "openai-native": {
    name: "openai-native",
    displayName: "OpenAI (Native)",
    description: "Native OpenAI API integration",
    website: "https://openai.com",
    category: "major",
    requiresAuth: true,
    models:     {
          "gpt-5-2025-08-07": {
                "maxTokens": 8192,
                "contextWindow": 272000,
                "inputPrice": 1.25,
                "outputPrice": 10,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheReadPrice": 0.125
          },
          "gpt-5-mini-2025-08-07": {
                "maxTokens": 8192,
                "contextWindow": 272000,
                "inputPrice": 0.25,
                "outputPrice": 2,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheReadPrice": 0.025
          },
          "gpt-5-nano-2025-08-07": {
                "maxTokens": 8192,
                "contextWindow": 272000,
                "inputPrice": 0.05,
                "outputPrice": 0.4,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheReadPrice": 0.005
          },
          "gpt-5-chat-latest": {
                "maxTokens": 8192,
                "contextWindow": 400000,
                "inputPrice": 1.25,
                "outputPrice": 10,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheReadPrice": 0.125
          },
          "o4-mini": {
                "maxTokens": 100000,
                "contextWindow": 200000,
                "inputPrice": 1.1,
                "outputPrice": 4.4,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheReadPrice": 0.275
          },
          "gpt-4.1": {
                "maxTokens": 32768,
                "contextWindow": 1047576,
                "inputPrice": 2,
                "outputPrice": 8,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheReadPrice": 0.5
          },
          "gpt-4.1-mini": {
                "maxTokens": 32768,
                "contextWindow": 1047576,
                "inputPrice": 0.4,
                "outputPrice": 1.6,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheReadPrice": 0.1
          },
          "gpt-4.1-nano": {
                "maxTokens": 32768,
                "contextWindow": 1047576,
                "inputPrice": 0.1,
                "outputPrice": 0.4,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheReadPrice": 0.025
          },
          "o3-mini": {
                "maxTokens": 100000,
                "contextWindow": 200000,
                "inputPrice": 1.1,
                "outputPrice": 4.4,
                "supportsImages": false,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheReadPrice": 0.55
          },
          "o1-preview": {
                "maxTokens": 32768,
                "contextWindow": 128000,
                "inputPrice": 15,
                "outputPrice": 60,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheReadPrice": 7.5
          },
          "o1-mini": {
                "maxTokens": 65536,
                "contextWindow": 128000,
                "inputPrice": 1.1,
                "outputPrice": 4.4,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheReadPrice": 0.55
          },
          "gpt-4o": {
                "maxTokens": 4096,
                "contextWindow": 128000,
                "inputPrice": 2.5,
                "outputPrice": 10,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheReadPrice": 1.25
          },
          "gpt-4o-mini": {
                "maxTokens": 16384,
                "contextWindow": 128000,
                "inputPrice": 0.15,
                "outputPrice": 0.6,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheReadPrice": 0.075
          },
          "chatgpt-4o-latest": {
                "maxTokens": 16384,
                "contextWindow": 128000,
                "inputPrice": 5,
                "outputPrice": 15,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          }
    },
  },
  "openrouter": {
    name: "openrouter",
    displayName: "OpenRouter",
    description: "API aggregator with access to multiple providers",
    website: "https://openrouter.ai",
    category: "aggregator",
    requiresAuth: true,
    models:     {
          "openrouter-default": {
                "maxTokens": 8192,
                "contextWindow": 128000,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          }
    },
  },
  "qwen": {
    name: "qwen",
    displayName: "Qwen",
    description: "Alibaba's Qwen language models",
    website: "https://qwenlm.github.io",
    category: "specialized",
    requiresAuth: true,
    models:     {
          "qwen3-235b-a22b": {
                "maxTokens": 16384,
                "contextWindow": 131072,
                "inputPrice": 2,
                "outputPrice": 8,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 2,
                "cacheReadPrice": 8
          },
          "qwen3-32b": {
                "maxTokens": 16384,
                "contextWindow": 131072,
                "inputPrice": 2,
                "outputPrice": 8,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 2,
                "cacheReadPrice": 8
          },
          "qwen3-30b-a3b": {
                "maxTokens": 16384,
                "contextWindow": 131072,
                "inputPrice": 0.75,
                "outputPrice": 3,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0.75,
                "cacheReadPrice": 3
          },
          "qwen3-14b": {
                "maxTokens": 8192,
                "contextWindow": 131072,
                "inputPrice": 1,
                "outputPrice": 4,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 1,
                "cacheReadPrice": 4
          },
          "qwen3-8b": {
                "maxTokens": 8192,
                "contextWindow": 131072,
                "inputPrice": 0.5,
                "outputPrice": 2,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0.5,
                "cacheReadPrice": 2
          },
          "qwen3-4b": {
                "maxTokens": 8192,
                "contextWindow": 131072,
                "inputPrice": 0.3,
                "outputPrice": 1.2,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0.3,
                "cacheReadPrice": 1.2
          },
          "qwen3-1.7b": {
                "maxTokens": 8192,
                "contextWindow": 32768,
                "inputPrice": 0.3,
                "outputPrice": 1.2,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0.3,
                "cacheReadPrice": 1.2
          },
          "qwen3-0.6b": {
                "maxTokens": 8192,
                "contextWindow": 32768,
                "inputPrice": 0.3,
                "outputPrice": 1.2,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0.3,
                "cacheReadPrice": 1.2
          },
          "qwen2.5-coder-32b-instruct": {
                "maxTokens": 8192,
                "contextWindow": 131072,
                "inputPrice": 0.002,
                "outputPrice": 0.006,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0.002,
                "cacheReadPrice": 0.006
          },
          "qwen2.5-coder-14b-instruct": {
                "maxTokens": 8192,
                "contextWindow": 131072,
                "inputPrice": 0.002,
                "outputPrice": 0.006,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0.002,
                "cacheReadPrice": 0.006
          },
          "qwen2.5-coder-7b-instruct": {
                "maxTokens": 8192,
                "contextWindow": 131072,
                "inputPrice": 0.001,
                "outputPrice": 0.002,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0.001,
                "cacheReadPrice": 0.002
          },
          "qwen2.5-coder-3b-instruct": {
                "maxTokens": 8192,
                "contextWindow": 32768,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0,
                "cacheReadPrice": 0
          },
          "qwen2.5-coder-1.5b-instruct": {
                "maxTokens": 8192,
                "contextWindow": 32768,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0,
                "cacheReadPrice": 0
          },
          "qwen2.5-coder-0.5b-instruct": {
                "maxTokens": 8192,
                "contextWindow": 32768,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0,
                "cacheReadPrice": 0
          },
          "qwen-coder-plus-latest": {
                "maxTokens": 129024,
                "contextWindow": 131072,
                "inputPrice": 3.5,
                "outputPrice": 7,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 3.5,
                "cacheReadPrice": 7
          },
          "qwen-plus-latest": {
                "maxTokens": 16384,
                "contextWindow": 131072,
                "inputPrice": 0.8,
                "outputPrice": 2,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0.8,
                "cacheReadPrice": 2
          },
          "qwen-turbo-latest": {
                "maxTokens": 16384,
                "contextWindow": 1000000,
                "inputPrice": 0.3,
                "outputPrice": 0.6,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0.3,
                "cacheReadPrice": 0.6
          },
          "qwen-max-latest": {
                "maxTokens": 30720,
                "contextWindow": 32768,
                "inputPrice": 2.4,
                "outputPrice": 9.6,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 2.4,
                "cacheReadPrice": 9.6
          },
          "qwq-plus-latest": {
                "maxTokens": 8192,
                "contextWindow": 131071,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0,
                "cacheReadPrice": 0
          },
          "qwq-plus": {
                "maxTokens": 8192,
                "contextWindow": 131071,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0,
                "cacheReadPrice": 0
          },
          "qwen-coder-plus": {
                "maxTokens": 129024,
                "contextWindow": 131072,
                "inputPrice": 3.5,
                "outputPrice": 7,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 3.5,
                "cacheReadPrice": 7
          },
          "qwen-plus": {
                "maxTokens": 129024,
                "contextWindow": 131072,
                "inputPrice": 0.8,
                "outputPrice": 2,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0.8,
                "cacheReadPrice": 0.2
          },
          "qwen-turbo": {
                "maxTokens": 1000000,
                "contextWindow": 1000000,
                "inputPrice": 0.3,
                "outputPrice": 0.6,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0.3,
                "cacheReadPrice": 0.6
          },
          "qwen-max": {
                "maxTokens": 30720,
                "contextWindow": 32768,
                "inputPrice": 2.4,
                "outputPrice": 9.6,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 2.4,
                "cacheReadPrice": 9.6
          },
          "deepseek-v3": {
                "maxTokens": 8000,
                "contextWindow": 64000,
                "inputPrice": 0,
                "outputPrice": 0.28,
                "supportsImages": false,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0.14,
                "cacheReadPrice": 0.014
          },
          "deepseek-r1": {
                "maxTokens": 8000,
                "contextWindow": 64000,
                "inputPrice": 0,
                "outputPrice": 2.19,
                "supportsImages": false,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0.55,
                "cacheReadPrice": 0.14
          },
          "qwen-vl-max": {
                "maxTokens": 30720,
                "contextWindow": 32768,
                "inputPrice": 3,
                "outputPrice": 9,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 3,
                "cacheReadPrice": 9
          },
          "qwen-vl-max-latest": {
                "maxTokens": 129024,
                "contextWindow": 131072,
                "inputPrice": 3,
                "outputPrice": 9,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 3,
                "cacheReadPrice": 9
          },
          "qwen-vl-plus": {
                "maxTokens": 6000,
                "contextWindow": 8000,
                "inputPrice": 1.5,
                "outputPrice": 4.5,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 1.5,
                "cacheReadPrice": 4.5
          },
          "qwen-vl-plus-latest": {
                "maxTokens": 129024,
                "contextWindow": 131072,
                "inputPrice": 1.5,
                "outputPrice": 4.5,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 1.5,
                "cacheReadPrice": 4.5
          }
    },
  },
  "qwen-code": {
    name: "qwen-code",
    displayName: "Qwen Code",
    description: "Qwen models specialized for code generation",
    category: "specialized",
    requiresAuth: true,
    models:     {
          "qwen3-coder-plus": {
                "maxTokens": 65536,
                "contextWindow": 1000000,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0,
                "cacheReadPrice": 0
          },
          "qwen3-coder-flash": {
                "maxTokens": 65536,
                "contextWindow": 1000000,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0,
                "cacheReadPrice": 0
          }
    },
  },
  "qwen-international": {
    name: "qwen-international",
    displayName: "Qwen (International)",
    description: "Qwen models for international users",
    category: "specialized",
    requiresAuth: true,
    models:     {
          "qwen3-coder-plus": {
                "maxTokens": 65536,
                "contextWindow": 1000000,
                "inputPrice": 1,
                "outputPrice": 5,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "qwen3-coder-480b-a35b-instruct": {
                "maxTokens": 65536,
                "contextWindow": 204800,
                "inputPrice": 1.5,
                "outputPrice": 7.5,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "qwen3-235b-a22b": {
                "maxTokens": 16384,
                "contextWindow": 131072,
                "inputPrice": 2,
                "outputPrice": 8,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 2,
                "cacheReadPrice": 8
          },
          "qwen3-32b": {
                "maxTokens": 16384,
                "contextWindow": 131072,
                "inputPrice": 2,
                "outputPrice": 8,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 2,
                "cacheReadPrice": 8
          },
          "qwen3-30b-a3b": {
                "maxTokens": 16384,
                "contextWindow": 131072,
                "inputPrice": 0.75,
                "outputPrice": 3,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0.75,
                "cacheReadPrice": 3
          },
          "qwen3-14b": {
                "maxTokens": 8192,
                "contextWindow": 131072,
                "inputPrice": 1,
                "outputPrice": 4,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 1,
                "cacheReadPrice": 4
          },
          "qwen3-8b": {
                "maxTokens": 8192,
                "contextWindow": 131072,
                "inputPrice": 0.5,
                "outputPrice": 2,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0.5,
                "cacheReadPrice": 2
          },
          "qwen3-4b": {
                "maxTokens": 8192,
                "contextWindow": 131072,
                "inputPrice": 0.3,
                "outputPrice": 1.2,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0.3,
                "cacheReadPrice": 1.2
          },
          "qwen3-1.7b": {
                "maxTokens": 8192,
                "contextWindow": 32768,
                "inputPrice": 0.3,
                "outputPrice": 1.2,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0.3,
                "cacheReadPrice": 1.2
          },
          "qwen3-0.6b": {
                "maxTokens": 8192,
                "contextWindow": 32768,
                "inputPrice": 0.3,
                "outputPrice": 1.2,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0.3,
                "cacheReadPrice": 1.2
          },
          "qwen2.5-coder-32b-instruct": {
                "maxTokens": 8192,
                "contextWindow": 131072,
                "inputPrice": 0.002,
                "outputPrice": 0.006,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0.002,
                "cacheReadPrice": 0.006
          },
          "qwen2.5-coder-14b-instruct": {
                "maxTokens": 8192,
                "contextWindow": 131072,
                "inputPrice": 0.002,
                "outputPrice": 0.006,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0.002,
                "cacheReadPrice": 0.006
          },
          "qwen2.5-coder-7b-instruct": {
                "maxTokens": 8192,
                "contextWindow": 131072,
                "inputPrice": 0.001,
                "outputPrice": 0.002,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0.001,
                "cacheReadPrice": 0.002
          },
          "qwen2.5-coder-3b-instruct": {
                "maxTokens": 8192,
                "contextWindow": 32768,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0,
                "cacheReadPrice": 0
          },
          "qwen2.5-coder-1.5b-instruct": {
                "maxTokens": 8192,
                "contextWindow": 32768,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0,
                "cacheReadPrice": 0
          },
          "qwen2.5-coder-0.5b-instruct": {
                "maxTokens": 8192,
                "contextWindow": 32768,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0,
                "cacheReadPrice": 0
          },
          "qwen-coder-plus-latest": {
                "maxTokens": 129024,
                "contextWindow": 131072,
                "inputPrice": 3.5,
                "outputPrice": 7,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 3.5,
                "cacheReadPrice": 7
          },
          "qwen-plus-latest": {
                "maxTokens": 16384,
                "contextWindow": 131072,
                "inputPrice": 0.8,
                "outputPrice": 2,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0.8,
                "cacheReadPrice": 2
          },
          "qwen-turbo-latest": {
                "maxTokens": 16384,
                "contextWindow": 1000000,
                "inputPrice": 0.3,
                "outputPrice": 0.6,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0.3,
                "cacheReadPrice": 0.6
          },
          "qwen-max-latest": {
                "maxTokens": 30720,
                "contextWindow": 32768,
                "inputPrice": 2.4,
                "outputPrice": 9.6,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 2.4,
                "cacheReadPrice": 9.6
          },
          "qwen-coder-plus": {
                "maxTokens": 129024,
                "contextWindow": 131072,
                "inputPrice": 3.5,
                "outputPrice": 7,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 3.5,
                "cacheReadPrice": 7
          },
          "qwen-plus": {
                "maxTokens": 129024,
                "contextWindow": 131072,
                "inputPrice": 0.8,
                "outputPrice": 2,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0.8,
                "cacheReadPrice": 0.2
          },
          "qwen-turbo": {
                "maxTokens": 1000000,
                "contextWindow": 1000000,
                "inputPrice": 0.3,
                "outputPrice": 0.6,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0.3,
                "cacheReadPrice": 0.6
          },
          "qwen-max": {
                "maxTokens": 30720,
                "contextWindow": 32768,
                "inputPrice": 2.4,
                "outputPrice": 9.6,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 2.4,
                "cacheReadPrice": 9.6
          },
          "deepseek-v3": {
                "maxTokens": 8000,
                "contextWindow": 64000,
                "inputPrice": 0,
                "outputPrice": 0.28,
                "supportsImages": false,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0.14,
                "cacheReadPrice": 0.014
          },
          "deepseek-r1": {
                "maxTokens": 8000,
                "contextWindow": 64000,
                "inputPrice": 0,
                "outputPrice": 2.19,
                "supportsImages": false,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0.55,
                "cacheReadPrice": 0.14
          },
          "qwen-vl-max": {
                "maxTokens": 30720,
                "contextWindow": 32768,
                "inputPrice": 3,
                "outputPrice": 9,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 3,
                "cacheReadPrice": 9
          },
          "qwen-vl-max-latest": {
                "maxTokens": 129024,
                "contextWindow": 131072,
                "inputPrice": 3,
                "outputPrice": 9,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 3,
                "cacheReadPrice": 9
          },
          "qwen-vl-plus": {
                "maxTokens": 6000,
                "contextWindow": 8000,
                "inputPrice": 1.5,
                "outputPrice": 4.5,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 1.5,
                "cacheReadPrice": 4.5
          },
          "qwen-vl-plus-latest": {
                "maxTokens": 129024,
                "contextWindow": 131072,
                "inputPrice": 1.5,
                "outputPrice": 4.5,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 1.5,
                "cacheReadPrice": 4.5
          }
    },
  },
  "requesty": {
    name: "requesty",
    displayName: "Requesty",
    description: "HTTP client with AI integration",
    category: "specialized",
    requiresAuth: true,
    models:     {
          "requesty-default": {
                "maxTokens": 8192,
                "contextWindow": 128000,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          }
    },
  },
  "sambanova": {
    name: "sambanova",
    displayName: "SambaNova",
    description: "AI platform optimized for enterprise",
    website: "https://sambanova.ai",
    category: "specialized",
    requiresAuth: true,
    models:     {
          "Llama-4-Maverick-17B-128E-Instruct": {
                "maxTokens": 4096,
                "contextWindow": 8000,
                "inputPrice": 0.63,
                "outputPrice": 1.8,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "Llama-4-Scout-17B-16E-Instruct": {
                "maxTokens": 4096,
                "contextWindow": 8000,
                "inputPrice": 0.4,
                "outputPrice": 0.7,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "Meta-Llama-3.3-70B-Instruct": {
                "maxTokens": 4096,
                "contextWindow": 128000,
                "inputPrice": 0.6,
                "outputPrice": 1.2,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "DeepSeek-R1-Distill-Llama-70B": {
                "maxTokens": 4096,
                "contextWindow": 128000,
                "inputPrice": 0.7,
                "outputPrice": 1.4,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "DeepSeek-R1": {
                "maxTokens": 4096,
                "contextWindow": 16000,
                "inputPrice": 5,
                "outputPrice": 7,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "Meta-Llama-3.1-405B-Instruct": {
                "maxTokens": 4096,
                "contextWindow": 16000,
                "inputPrice": 5,
                "outputPrice": 10,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "Meta-Llama-3.1-8B-Instruct": {
                "maxTokens": 4096,
                "contextWindow": 16000,
                "inputPrice": 0.1,
                "outputPrice": 0.2,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "Meta-Llama-3.2-1B-Instruct": {
                "maxTokens": 4096,
                "contextWindow": 16000,
                "inputPrice": 0.04,
                "outputPrice": 0.08,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "Meta-Llama-3.2-3B-Instruct": {
                "maxTokens": 4096,
                "contextWindow": 8000,
                "inputPrice": 0.08,
                "outputPrice": 0.16,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "Qwen3-32B": {
                "maxTokens": 4096,
                "contextWindow": 16000,
                "inputPrice": 0.4,
                "outputPrice": 0.8,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "QwQ-32B": {
                "maxTokens": 4096,
                "contextWindow": 16000,
                "inputPrice": 0.5,
                "outputPrice": 1,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "DeepSeek-V3-0324": {
                "maxTokens": 4096,
                "contextWindow": 8000,
                "inputPrice": 3,
                "outputPrice": 4.5,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          }
    },
  },
  "sapaicore": {
    name: "sapaicore",
    displayName: "SAP AI Core",
    description: "SAP's AI platform",
    category: "cloud",
    requiresAuth: true,
    models:     {
          "anthropic--claude-4-sonnet": {
                "maxTokens": 8192,
                "contextWindow": 200000,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "anthropic--claude-4-opus": {
                "maxTokens": 8192,
                "contextWindow": 200000,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "anthropic--claude-3.7-sonnet": {
                "maxTokens": 64000,
                "contextWindow": 200000,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "anthropic--claude-3.5-sonnet": {
                "maxTokens": 8192,
                "contextWindow": 200000,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "anthropic--claude-3-sonnet": {
                "maxTokens": 4096,
                "contextWindow": 200000,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "anthropic--claude-3-haiku": {
                "maxTokens": 4096,
                "contextWindow": 200000,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "anthropic--claude-3-opus": {
                "maxTokens": 4096,
                "contextWindow": 200000,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "gemini-2.5-pro": {
                "maxTokens": 65536,
                "contextWindow": 1048576,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "gemini-2.5-flash": {
                "maxTokens": 65536,
                "contextWindow": 1048576,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "gpt-4": {
                "maxTokens": 4096,
                "contextWindow": 200000,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "gpt-4o": {
                "maxTokens": 4096,
                "contextWindow": 200000,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "gpt-4o-mini": {
                "maxTokens": 4096,
                "contextWindow": 200000,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "gpt-4.1": {
                "maxTokens": 32768,
                "contextWindow": 1047576,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "gpt-4.1-nano": {
                "maxTokens": 32768,
                "contextWindow": 1047576,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "gpt-5": {
                "maxTokens": 128000,
                "contextWindow": 272000,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "gpt-5-nano": {
                "maxTokens": 128000,
                "contextWindow": 272000,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "gpt-5-mini": {
                "maxTokens": 128000,
                "contextWindow": 272000,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "o3-mini": {
                "maxTokens": 4096,
                "contextWindow": 200000,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "o4-mini": {
                "maxTokens": 100000,
                "contextWindow": 200000,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true
          }
    },
  },
  "together": {
    name: "together",
    displayName: "Together AI",
    description: "Platform for running open-source models",
    website: "https://together.ai",
    category: "aggregator",
    requiresAuth: true,
    models:     {
          "together-default": {
                "maxTokens": 8192,
                "contextWindow": 128000,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          }
    },
  },
  "vercel-ai-gateway": {
    name: "vercel-ai-gateway",
    displayName: "Vercel AI Gateway",
    description: "Vercel's AI model gateway",
    website: "https://vercel.com/ai",
    category: "cloud",
    requiresAuth: true,
    models:     {
          "vercel-ai-gateway-default": {
                "maxTokens": 8192,
                "contextWindow": 128000,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          }
    },
  },
  "vertex": {
    name: "vertex",
    displayName: "Google Vertex AI",
    description: "Google Cloud AI platform",
    website: "https://cloud.google.com/vertex-ai",
    category: "cloud",
    requiresAuth: true,
    models:     {
          "claude-sonnet-4@20250514": {
                "maxTokens": 8192,
                "contextWindow": 200000,
                "inputPrice": 3,
                "outputPrice": 15,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 3.75,
                "cacheReadPrice": 0.3
          },
          "claude-opus-4-1@20250805": {
                "maxTokens": 8192,
                "contextWindow": 200000,
                "inputPrice": 15,
                "outputPrice": 75,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 18.75,
                "cacheReadPrice": 1.5
          },
          "claude-opus-4@20250514": {
                "maxTokens": 8192,
                "contextWindow": 200000,
                "inputPrice": 15,
                "outputPrice": 75,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 18.75,
                "cacheReadPrice": 1.5
          },
          "claude-3-7-sonnet@20250219": {
                "maxTokens": 8192,
                "contextWindow": 200000,
                "inputPrice": 3,
                "outputPrice": 15,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 3.75,
                "cacheReadPrice": 0.3
          },
          "claude-3-5-sonnet-v2@20241022": {
                "maxTokens": 8192,
                "contextWindow": 200000,
                "inputPrice": 3,
                "outputPrice": 15,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 3.75,
                "cacheReadPrice": 0.3
          },
          "claude-3-5-sonnet@20240620": {
                "maxTokens": 8192,
                "contextWindow": 200000,
                "inputPrice": 3,
                "outputPrice": 15,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 3.75,
                "cacheReadPrice": 0.3
          },
          "claude-3-5-haiku@20241022": {
                "maxTokens": 8192,
                "contextWindow": 200000,
                "inputPrice": 1,
                "outputPrice": 5,
                "supportsImages": false,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 1.25,
                "cacheReadPrice": 0.1
          },
          "claude-3-opus@20240229": {
                "maxTokens": 4096,
                "contextWindow": 200000,
                "inputPrice": 15,
                "outputPrice": 75,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 18.75,
                "cacheReadPrice": 1.5
          },
          "claude-3-haiku@20240307": {
                "maxTokens": 4096,
                "contextWindow": 200000,
                "inputPrice": 0.25,
                "outputPrice": 1.25,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0.3,
                "cacheReadPrice": 0.03
          },
          "mistral-large-2411": {
                "maxTokens": 128000,
                "contextWindow": 128000,
                "inputPrice": 2,
                "outputPrice": 6,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "mistral-small-2503": {
                "maxTokens": 128000,
                "contextWindow": 128000,
                "inputPrice": 0.1,
                "outputPrice": 0.3,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "codestral-2501": {
                "maxTokens": 256000,
                "contextWindow": 256000,
                "inputPrice": 0.3,
                "outputPrice": 0.9,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "llama-4-maverick-17b-128e-instruct-maas": {
                "maxTokens": 128000,
                "contextWindow": 1048576,
                "inputPrice": 0.35,
                "outputPrice": 1.15,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "llama-4-scout-17b-16e-instruct-maas": {
                "maxTokens": 1000000,
                "contextWindow": 10485760,
                "inputPrice": 0.25,
                "outputPrice": 0.7,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "gemini-2.0-flash-001": {
                "maxTokens": 8192,
                "contextWindow": 1048576,
                "inputPrice": 0.15,
                "outputPrice": 0.6,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 1,
                "cacheReadPrice": 0.025
          },
          "gemini-2.0-flash-lite-001": {
                "maxTokens": 8192,
                "contextWindow": 1048576,
                "inputPrice": 0.075,
                "outputPrice": 0.3,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "gemini-2.0-flash-thinking-exp-1219": {
                "maxTokens": 8192,
                "contextWindow": 32767,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "gemini-2.0-flash-exp": {
                "maxTokens": 8192,
                "contextWindow": 1048576,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "gemini-2.5-pro-exp-03-25": {
                "maxTokens": 65536,
                "contextWindow": 1048576,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "gemini-2.5-pro": {
                "maxTokens": 65536,
                "contextWindow": 1048576,
                "inputPrice": 2.5,
                "outputPrice": 15,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheReadPrice": 0.625
          },
          "gemini-2.5-flash": {
                "maxTokens": 65536,
                "contextWindow": 1048576,
                "inputPrice": 0.3,
                "outputPrice": 2.5,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "gemini-2.5-flash-lite-preview-06-17": {
                "maxTokens": 64000,
                "contextWindow": 1000000,
                "inputPrice": 0.1,
                "outputPrice": 0.4,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheReadPrice": 0.025
          },
          "gemini-2.0-flash-thinking-exp-01-21": {
                "maxTokens": 65536,
                "contextWindow": 1048576,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "gemini-exp-1206": {
                "maxTokens": 8192,
                "contextWindow": 2097152,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "gemini-1.5-flash-002": {
                "maxTokens": 8192,
                "contextWindow": 1048576,
                "inputPrice": 0.15,
                "outputPrice": 0.6,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 1,
                "cacheReadPrice": 0.0375
          },
          "gemini-1.5-flash-exp-0827": {
                "maxTokens": 8192,
                "contextWindow": 1048576,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "gemini-1.5-flash-8b-exp-0827": {
                "maxTokens": 8192,
                "contextWindow": 1048576,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "gemini-1.5-pro-002": {
                "maxTokens": 8192,
                "contextWindow": 2097152,
                "inputPrice": 1.25,
                "outputPrice": 5,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "gemini-1.5-pro-exp-0827": {
                "maxTokens": 8192,
                "contextWindow": 2097152,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          }
    },
  },
  "vscode-lm": {
    name: "vscode-lm",
    displayName: "VS Code LM",
    description: "VS Code integrated language models",
    category: "local",
    setupInstructions: "Enable Language Model API in VS Code settings",
    models:     {
          "vscode-lm-default": {
                "maxTokens": 8192,
                "contextWindow": 128000,
                "inputPrice": 0,
                "outputPrice": 0,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          }
    },
  },
  "xai": {
    name: "xai",
    displayName: "xAI",
    description: "Elon Musk's AI company with Grok models",
    website: "https://x.ai",
    category: "major",
    requiresAuth: true,
    models:     {
          "grok-4": {
                "maxTokens": 8192,
                "contextWindow": 262144,
                "inputPrice": 3,
                "outputPrice": 15,
                "supportsImages": true,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheReadPrice": 0.75
          },
          "grok-3-beta": {
                "maxTokens": 8192,
                "contextWindow": 131072,
                "inputPrice": 3,
                "outputPrice": 15,
                "supportsImages": false,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "grok-3-fast-beta": {
                "maxTokens": 8192,
                "contextWindow": 131072,
                "inputPrice": 5,
                "outputPrice": 25,
                "supportsImages": false,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "grok-3-mini-beta": {
                "maxTokens": 8192,
                "contextWindow": 131072,
                "inputPrice": 0.3,
                "outputPrice": 0.5,
                "supportsImages": false,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "grok-3-mini-fast-beta": {
                "maxTokens": 8192,
                "contextWindow": 131072,
                "inputPrice": 0.6,
                "outputPrice": 4,
                "supportsImages": false,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "grok-3": {
                "maxTokens": 8192,
                "contextWindow": 131072,
                "inputPrice": 3,
                "outputPrice": 15,
                "supportsImages": false,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "grok-3-fast": {
                "maxTokens": 8192,
                "contextWindow": 131072,
                "inputPrice": 5,
                "outputPrice": 25,
                "supportsImages": false,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "grok-3-mini": {
                "maxTokens": 8192,
                "contextWindow": 131072,
                "inputPrice": 0.3,
                "outputPrice": 0.5,
                "supportsImages": false,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "grok-3-mini-fast": {
                "maxTokens": 8192,
                "contextWindow": 131072,
                "inputPrice": 0.6,
                "outputPrice": 4,
                "supportsImages": false,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "grok-2-latest": {
                "maxTokens": 8192,
                "contextWindow": 131072,
                "inputPrice": 2,
                "outputPrice": 10,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "grok-2": {
                "maxTokens": 8192,
                "contextWindow": 131072,
                "inputPrice": 2,
                "outputPrice": 10,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "grok-2-1212": {
                "maxTokens": 8192,
                "contextWindow": 131072,
                "inputPrice": 2,
                "outputPrice": 10,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "grok-2-vision-latest": {
                "maxTokens": 8192,
                "contextWindow": 32768,
                "inputPrice": 2,
                "outputPrice": 10,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "grok-2-vision": {
                "maxTokens": 8192,
                "contextWindow": 32768,
                "inputPrice": 2,
                "outputPrice": 10,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "grok-2-vision-1212": {
                "maxTokens": 8192,
                "contextWindow": 32768,
                "inputPrice": 2,
                "outputPrice": 10,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "grok-vision-beta": {
                "maxTokens": 8192,
                "contextWindow": 8192,
                "inputPrice": 5,
                "outputPrice": 15,
                "supportsImages": true,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          },
          "grok-beta": {
                "maxTokens": 8192,
                "contextWindow": 131072,
                "inputPrice": 5,
                "outputPrice": 15,
                "supportsImages": false,
                "supportsPromptCache": false,
                "supportsTools": true,
                "supportsStreaming": true
          }
    },
  },
  "zai": {
    name: "zai",
    displayName: "ZAI",
    description: "ZhipuAI's GLM models",
    category: "specialized",
    requiresAuth: true,
    models:     {
          "glm-4.5": {
                "maxTokens": 98304,
                "contextWindow": 131072,
                "inputPrice": 0.29,
                "outputPrice": 1.14,
                "supportsImages": false,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0,
                "cacheReadPrice": 0.057
          },
          "glm-4.5-air": {
                "maxTokens": 98304,
                "contextWindow": 128000,
                "inputPrice": 0.086,
                "outputPrice": 0.57,
                "supportsImages": false,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0,
                "cacheReadPrice": 0.017
          }
    },
  },
  "zai-international": {
    name: "zai-international",
    displayName: "ZAI (International)",
    description: "ZhipuAI models for international users",
    category: "specialized",
    requiresAuth: true,
    models:     {
          "glm-4.5": {
                "maxTokens": 98304,
                "contextWindow": 131072,
                "inputPrice": 0.6,
                "outputPrice": 2.2,
                "supportsImages": false,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0,
                "cacheReadPrice": 0.11
          },
          "glm-4.5-air": {
                "maxTokens": 98304,
                "contextWindow": 128000,
                "inputPrice": 0.2,
                "outputPrice": 1.2,
                "supportsImages": false,
                "supportsPromptCache": true,
                "supportsTools": true,
                "supportsStreaming": true,
                "cacheWritePrice": 0,
                "cacheReadPrice": 0.03
          }
    },
  }
} as const;

export type ProviderId = keyof typeof PROVIDERS;

export const PROVIDER_CATEGORIES = {
  major: 'Major AI Providers',
  cloud: 'Cloud Platforms', 
  local: 'Local/Self-Hosted',
  aggregator: 'API Aggregators',
  specialized: 'Specialized Tools'
} as const;

export type ProviderCategory = keyof typeof PROVIDER_CATEGORIES;

export function filterProviders(category?: ProviderCategory): ProviderConfig[] {
  const providers = Object.values(PROVIDERS) as ProviderConfig[];
  if (!category) return providers;
  return providers.filter(p => p.category === category);
}

export interface ApiHandlerOptions {
  apiKey?: string;
  baseUrl?: string;
  modelOverrides?: Record<string, Partial<ModelInfo>>;
  
  // Anthropic specific
  anthropicApiKey?: string;
  anthropicBaseUrl?: string;
  
  // Claude Code specific
  claudeCodeApiKey?: string;
  claudeCodeBaseUrl?: string;
  
  // OpenRouter specific
  openRouterApiKey?: string;
  openRouterBaseUrl?: string;
  
  // Bedrock specific
  bedrockAccessKeyId?: string;
  bedrockSecretAccessKey?: string;
  bedrockRegion?: string;
  bedrockSessionToken?: string;
  
  // Vertex specific
  vertexProjectId?: string;
  vertexLocation?: string;
  vertexServiceAccountKey?: string;
  
  // OpenAI specific
  openAiApiKey?: string;
  openAiBaseUrl?: string;
  openAiOrganization?: string;
  
  // Gemini specific
  geminiApiKey?: string;
  geminiBaseUrl?: string;
  
  // DeepSeek specific
  deepSeekApiKey?: string;
  deepSeekBaseUrl?: string;
  
  // Hugging Face specific
  huggingFaceApiKey?: string;
  huggingFaceBaseUrl?: string;
  
  // Qwen specific
  qwenApiKey?: string;
  qwenBaseUrl?: string;
  
  // Doubao specific
  doubaoApiKey?: string;
  doubaoBaseUrl?: string;
  
  // Mistral specific
  mistralApiKey?: string;
  mistralBaseUrl?: string;
  
  // Ask Sage specific
  askSageApiKey?: string;
  askSageBaseUrl?: string;
  
  // Nebius specific
  nebiusApiKey?: string;
  nebiusBaseUrl?: string;
  
  // XAI specific
  xaiApiKey?: string;
  xaiBaseUrl?: string;
  
  // SambaNova specific
  sambanovaApiKey?: string;
  sambanovaBaseUrl?: string;
  
  // Cerebras specific
  cerebrasApiKey?: string;
  cerebrasBaseUrl?: string;
  
  // Groq specific
  groqApiKey?: string;
  groqBaseUrl?: string;
  
  // SAP AI Core specific
  sapAiCoreApiKey?: string;
  sapAiCoreBaseUrl?: string;
  
  // Moonshot specific
  moonshotApiKey?: string;
  moonshotBaseUrl?: string;
  
  // Huawei Cloud MaaS specific
  huaweiCloudMaasApiKey?: string;
  huaweiCloudMaasBaseUrl?: string;
  
  // Baseten specific
  basetenApiKey?: string;
  basetenBaseUrl?: string;
  
  // ZAI specific
  zaiApiKey?: string;
  zaiBaseUrl?: string;
  
  // Fireworks specific
  fireworksApiKey?: string;
  fireworksBaseUrl?: string;
  
  // Local providers
  ollamaBaseUrl?: string;
  lmstudioBaseUrl?: string;
  
  // Generic options for aggregators
  requestyApiKey?: string;
  requestyBaseUrl?: string;
  togetherApiKey?: string;
  togetherBaseUrl?: string;
  litellmBaseUrl?: string;
  difyApiKey?: string;
  difyBaseUrl?: string;
  vercelAiGatewayApiKey?: string;
  vercelAiGatewayBaseUrl?: string;
}
