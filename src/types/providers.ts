export interface ModelInfo {
  maxTokens: number
  contextWindow: number
  inputPrice?: number  // per million tokens
  outputPrice?: number // per million tokens
  cacheWritePrice?: number
  cacheReadPrice?: number
  supportsImages?: boolean
  supportsPromptCache?: boolean
  supportsTools?: boolean
  supportsStreaming?: boolean
}

export interface ApiHandlerOptions {
  // Core options
  model?: string
  messages: any[]
  maxTokens?: number
  temperature?: number
  tools?: any[]
  
  // Provider-specific API keys
  apiKey?: string
  anthropicApiKey?: string
  openAiApiKey?: string
  googleApiKey?: string
  azureApiKey?: string
  groqApiKey?: string
  mistralApiKey?: string
  togetherApiKey?: string
  fireworksApiKey?: string
  deepseekApiKey?: string
  xaiApiKey?: string
  huggingfaceApiKey?: string
  
  // Base URLs and endpoints
  anthropicBaseUrl?: string
  openAiBaseUrl?: string
  googleBaseUrl?: string
  azureBaseUrl?: string
  groqBaseUrl?: string
  mistralBaseUrl?: string
  ollamaBaseUrl?: string
  lmStudioBaseUrl?: string
  
  // Azure-specific
  azureResourceName?: string
  azureDeploymentName?: string
  azureApiVersion?: string
  
  // AWS Bedrock
  awsAccessKeyId?: string
  awsSecretAccessKey?: string
  awsRegion?: string
  
  // Google Cloud
  googleProjectId?: string
  googleServiceAccountJson?: string
  vertexProjectId?: string
  vertexRegion?: string
  
  // Model selection
  apiModelId?: string
  planModeModelId?: string
  actModeModelId?: string
  
  // Advanced options
  thinkingBudgetTokens?: number
  topP?: number
  topK?: number
  customHeaders?: Record<string, string>
  
  // CLI-based options
  claudeCodePath?: string
  vsCodeEnabled?: boolean
  
  // Local model options
  ollamaHost?: string
  lmStudioPort?: number
}

export interface ProviderConfiguration {
  id: string
  name: string
  description: string
  category: 'api' | 'cli' | 'local' | 'cloud'
  authType: 'api_key' | 'oauth' | 'cli' | 'local' | 'cloud_credentials'
  baseUrl?: string
  defaultModel?: string
  supportedModels: Record<string, ModelInfo>
  features: {
    streaming: boolean
    tools: boolean
    images: boolean
    reasoning: boolean
    caching: boolean
  }
  pricing: {
    type: 'token_based' | 'subscription' | 'free' | 'custom'
    currency?: string
  }
  documentation?: string
  setupInstructions?: string
}

// Comprehensive provider definitions based on Cline
export const PROVIDERS: Record<string, ProviderConfiguration> = {
  // === ANTHROPIC FAMILY ===
  anthropic: {
    id: 'anthropic',
    name: 'Anthropic',
    description: 'Claude models with advanced reasoning capabilities',
    category: 'api',
    authType: 'api_key',
    baseUrl: 'https://api.anthropic.com',
    defaultModel: 'claude-3-5-sonnet-20241022',
    supportedModels: {
      'claude-opus-4-1-20250805': {
        maxTokens: 8192,
        contextWindow: 200000,
        inputPrice: 15,
        outputPrice: 75,
        cacheWritePrice: 18.75,
        cacheReadPrice: 1.50,
        supportsImages: true,
        supportsPromptCache: true,
        supportsTools: true,
        supportsStreaming: true
      },
      'claude-sonnet-4-20250514': {
        maxTokens: 8192,
        contextWindow: 200000,
        inputPrice: 3,
        outputPrice: 15,
        cacheWritePrice: 3.75,
        cacheReadPrice: 0.30,
        supportsImages: true,
        supportsPromptCache: true,
        supportsTools: true,
        supportsStreaming: true
      },
      'claude-3-5-sonnet-20241022': {
        maxTokens: 8192,
        contextWindow: 200000,
        inputPrice: 3,
        outputPrice: 15,
        cacheWritePrice: 3.75,
        cacheReadPrice: 0.30,
        supportsImages: true,
        supportsPromptCache: true,
        supportsTools: true,
        supportsStreaming: true
      },
      'claude-3-5-haiku-20241022': {
        maxTokens: 8192,
        contextWindow: 200000,
        inputPrice: 0.80,
        outputPrice: 4,
        cacheWritePrice: 1,
        cacheReadPrice: 0.08,
        supportsImages: true,
        supportsPromptCache: true,
        supportsTools: true,
        supportsStreaming: true
      },
      'claude-3-opus-20240229': {
        maxTokens: 4096,
        contextWindow: 200000,
        inputPrice: 15,
        outputPrice: 75,
        cacheWritePrice: 18.75,
        cacheReadPrice: 1.50,
        supportsImages: true,
        supportsPromptCache: true,
        supportsTools: true,
        supportsStreaming: true
      }
    },
    features: {
      streaming: true,
      tools: true,
      images: true,
      reasoning: true,
      caching: true
    },
    pricing: {
      type: 'token_based',
      currency: 'USD'
    },
    documentation: 'https://docs.anthropic.com'
  },

  'claude-code': {
    id: 'claude-code',
    name: 'Claude Code (CLI)',
    description: 'Anthropic Claude via CLI for Pro/Max subscribers',
    category: 'cli',
    authType: 'cli',
    defaultModel: 'claude-opus-4-1-20250805',
    supportedModels: {
      'claude-opus-4-1-20250805': {
        maxTokens: 8192,
        contextWindow: 200000,
        inputPrice: 0, // Subscription-based
        outputPrice: 0,
        supportsImages: true,
        supportsPromptCache: true,
        supportsTools: true,
        supportsStreaming: true
      }
    },
    features: {
      streaming: true,
      tools: true,
      images: true,
      reasoning: true,
      caching: false
    },
    pricing: {
      type: 'subscription'
    },
    setupInstructions: 'Install Claude Code CLI and authenticate with your Pro/Max subscription'
  },

  // === OPENAI FAMILY ===
  openai: {
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT models including reasoning and multimodal capabilities',
    category: 'api',
    authType: 'api_key',
    baseUrl: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4o',
    supportedModels: {
      'gpt-5-2025-08-07': {
        maxTokens: 16384,
        contextWindow: 272000,
        inputPrice: 1.25,
        outputPrice: 10,
        supportsImages: true,
        supportsTools: true,
        supportsStreaming: true
      },
      'gpt-4o': {
        maxTokens: 4096,
        contextWindow: 128000,
        inputPrice: 2.50,
        outputPrice: 10,
        supportsImages: true,
        supportsTools: true,
        supportsStreaming: true
      },
      'gpt-4o-mini': {
        maxTokens: 16384,
        contextWindow: 128000,
        inputPrice: 0.15,
        outputPrice: 0.60,
        supportsImages: true,
        supportsTools: true,
        supportsStreaming: true
      },
      'o3-mini': {
        maxTokens: 65536,
        contextWindow: 200000,
        inputPrice: 2,
        outputPrice: 8,
        supportsTools: true,
        supportsStreaming: true
      },
      'o3-mini-high': {
        maxTokens: 65536,
        contextWindow: 200000,
        inputPrice: 4,
        outputPrice: 16,
        supportsTools: true,
        supportsStreaming: true
      },
      'o1-preview': {
        maxTokens: 32768,
        contextWindow: 128000,
        inputPrice: 15,
        outputPrice: 60,
        supportsTools: false,
        supportsStreaming: false
      },
      'o1-mini': {
        maxTokens: 65536,
        contextWindow: 128000,
        inputPrice: 3,
        outputPrice: 12,
        supportsTools: false,
        supportsStreaming: false
      }
    },
    features: {
      streaming: true,
      tools: true,
      images: true,
      reasoning: true,
      caching: false
    },
    pricing: {
      type: 'token_based',
      currency: 'USD'
    },
    documentation: 'https://platform.openai.com/docs'
  },

  // === GOOGLE FAMILY ===
  gemini: {
    id: 'gemini',
    name: 'Google Gemini',
    description: 'Google Gemini models with large context windows',
    category: 'api',
    authType: 'api_key',
    baseUrl: 'https://generativelanguage.googleapis.com/v1',
    defaultModel: 'gemini-2.5-flash-002',
    supportedModels: {
      'gemini-2.5-pro-002': {
        maxTokens: 8192,
        contextWindow: 1000000,
        inputPrice: 2.50,
        outputPrice: 15,
        supportsImages: true,
        supportsTools: true,
        supportsStreaming: true
      },
      'gemini-2.5-flash-002': {
        maxTokens: 8192,
        contextWindow: 1000000,
        inputPrice: 0.30,
        outputPrice: 2.50,
        supportsImages: true,
        supportsTools: true,
        supportsStreaming: true
      },
      'gemini-1.5-pro-002': {
        maxTokens: 8192,
        contextWindow: 2000000,
        inputPrice: 1.25,
        outputPrice: 5,
        supportsImages: true,
        supportsTools: true,
        supportsStreaming: true
      }
    },
    features: {
      streaming: true,
      tools: true,
      images: true,
      reasoning: false,
      caching: false
    },
    pricing: {
      type: 'token_based',
      currency: 'USD'
    },
    documentation: 'https://ai.google.dev/docs'
  },

  vertex: {
    id: 'vertex',
    name: 'Google Vertex AI',
    description: 'Google Cloud Vertex AI platform with enterprise features',
    category: 'cloud',
    authType: 'cloud_credentials',
    baseUrl: 'https://us-central1-aiplatform.googleapis.com',
    defaultModel: 'gemini-2.5-pro-002',
    supportedModels: {
      'gemini-2.5-pro-002': {
        maxTokens: 8192,
        contextWindow: 1000000,
        inputPrice: 2.50,
        outputPrice: 15,
        supportsImages: true,
        supportsTools: true,
        supportsStreaming: true
      }
    },
    features: {
      streaming: true,
      tools: true,
      images: true,
      reasoning: false,
      caching: false
    },
    pricing: {
      type: 'token_based',
      currency: 'USD'
    },
    documentation: 'https://cloud.google.com/vertex-ai/docs'
  },

  // === GROQ ===
  groq: {
    id: 'groq',
    name: 'Groq',
    description: 'Ultra-fast inference with Groq hardware acceleration',
    category: 'api',
    authType: 'api_key',
    baseUrl: 'https://api.groq.com/openai/v1',
    defaultModel: 'llama-3.3-70b-versatile',
    supportedModels: {
      'llama-3.3-70b-versatile': {
        maxTokens: 8192,
        contextWindow: 128000,
        inputPrice: 0.59,
        outputPrice: 0.79,
        supportsTools: true,
        supportsStreaming: true
      },
      'deepseek-r1-distill-llama-70b': {
        maxTokens: 8192,
        contextWindow: 128000,
        inputPrice: 0.59,
        outputPrice: 0.79,
        supportsTools: true,
        supportsStreaming: true
      },
      'openai/gpt-oss-120b': {
        maxTokens: 8192,
        contextWindow: 32768,
        inputPrice: 1.20,
        outputPrice: 1.20,
        supportsTools: true,
        supportsStreaming: true
      }
    },
    features: {
      streaming: true,
      tools: true,
      images: false,
      reasoning: false,
      caching: false
    },
    pricing: {
      type: 'token_based',
      currency: 'USD'
    },
    documentation: 'https://console.groq.com/docs'
  },

  // === ADDITIONAL PROVIDERS ===
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek',
    description: 'Advanced reasoning models from DeepSeek',
    category: 'api',
    authType: 'api_key',
    baseUrl: 'https://api.deepseek.com',
    defaultModel: 'deepseek-v3',
    supportedModels: {
      'deepseek-v3': {
        maxTokens: 8192,
        contextWindow: 64000,
        inputPrice: 0.14,
        outputPrice: 0.28,
        supportsTools: true,
        supportsStreaming: true
      },
      'deepseek-reasoner': {
        maxTokens: 8192,
        contextWindow: 64000,
        inputPrice: 0.55,
        outputPrice: 2.19,
        supportsTools: true,
        supportsStreaming: true
      }
    },
    features: {
      streaming: true,
      tools: true,
      images: false,
      reasoning: true,
      caching: false
    },
    pricing: {
      type: 'token_based',
      currency: 'USD'
    },
    documentation: 'https://platform.deepseek.com/docs'
  },

  xai: {
    id: 'xai',
    name: 'xAI',
    description: 'Grok models by xAI with real-time information access',
    category: 'api',
    authType: 'api_key',
    baseUrl: 'https://api.x.ai/v1',
    defaultModel: 'grok-3-beta',
    supportedModels: {
      'grok-3-beta': {
        maxTokens: 4096,
        contextWindow: 131072,
        inputPrice: 5,
        outputPrice: 15,
        supportsTools: true,
        supportsStreaming: true
      },
      'grok-2-1212': {
        maxTokens: 8192,
        contextWindow: 131072,
        inputPrice: 2,
        outputPrice: 10,
        supportsImages: true,
        supportsTools: true,
        supportsStreaming: true
      }
    },
    features: {
      streaming: true,
      tools: true,
      images: true,
      reasoning: false,
      caching: false
    },
    pricing: {
      type: 'token_based',
      currency: 'USD'
    },
    documentation: 'https://docs.x.ai'
  },

  // === LOCAL/SELF-HOSTED ===
  ollama: {
    id: 'ollama',
    name: 'Ollama',
    description: 'Local model serving with Ollama',
    category: 'local',
    authType: 'local',
    baseUrl: 'http://localhost:11434',
    defaultModel: 'llama3.2',
    supportedModels: {
      'llama3.2': {
        maxTokens: 4096,
        contextWindow: 131072,
        inputPrice: 0,
        outputPrice: 0,
        supportsTools: true,
        supportsStreaming: true
      },
      'qwen2.5-coder': {
        maxTokens: 8192,
        contextWindow: 32768,
        inputPrice: 0,
        outputPrice: 0,
        supportsTools: true,
        supportsStreaming: true
      },
      'deepseek-r1': {
        maxTokens: 8192,
        contextWindow: 32768,
        inputPrice: 0,
        outputPrice: 0,
        supportsTools: true,
        supportsStreaming: true
      }
    },
    features: {
      streaming: true,
      tools: true,
      images: false,
      reasoning: false,
      caching: false
    },
    pricing: {
      type: 'free'
    },
    setupInstructions: 'Install Ollama and pull desired models',
    documentation: 'https://ollama.com/docs'
  },

  lmstudio: {
    id: 'lmstudio',
    name: 'LM Studio',
    description: 'Local model serving with LM Studio',
    category: 'local',
    authType: 'local',
    baseUrl: 'http://localhost:1234/v1',
    defaultModel: 'local-model',
    supportedModels: {
      'local-model': {
        maxTokens: 4096,
        contextWindow: 32768,
        inputPrice: 0,
        outputPrice: 0,
        supportsTools: true,
        supportsStreaming: true
      }
    },
    features: {
      streaming: true,
      tools: true,
      images: false,
      reasoning: false,
      caching: false
    },
    pricing: {
      type: 'free'
    },
    setupInstructions: 'Start LM Studio local server',
    documentation: 'https://lmstudio.ai/docs'
  },

  // === ADDITIONAL CLOUD/API PROVIDERS ===
  mistral: {
    id: 'mistral',
    name: 'Mistral AI',
    description: 'European AI company with efficient models',
    category: 'api',
    authType: 'api_key',
    baseUrl: 'https://api.mistral.ai/v1',
    defaultModel: 'mistral-large-latest',
    supportedModels: {
      'mistral-large-latest': {
        maxTokens: 8192,
        contextWindow: 128000,
        inputPrice: 2,
        outputPrice: 6,
        supportsTools: true,
        supportsStreaming: true
      },
      'mistral-small-latest': {
        maxTokens: 8192,
        contextWindow: 128000,
        inputPrice: 0.2,
        outputPrice: 0.6,
        supportsTools: true,
        supportsStreaming: true
      },
      'codestral-latest': {
        maxTokens: 8192,
        contextWindow: 32000,
        inputPrice: 0.3,
        outputPrice: 0.9,
        supportsTools: true,
        supportsStreaming: true
      }
    },
    features: {
      streaming: true,
      tools: true,
      images: false,
      reasoning: false,
      caching: false
    },
    pricing: {
      type: 'token_based',
      currency: 'USD'
    },
    documentation: 'https://docs.mistral.ai'
  },

  together: {
    id: 'together',
    name: 'Together AI',
    description: 'Together AI platform with various open models',
    category: 'api',
    authType: 'api_key',
    baseUrl: 'https://api.together.xyz/v1',
    defaultModel: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
    supportedModels: {
      'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo': {
        maxTokens: 8192,
        contextWindow: 131072,
        inputPrice: 0.88,
        outputPrice: 0.88,
        supportsTools: true,
        supportsStreaming: true
      },
      'mistralai/Mixtral-8x7B-Instruct-v0.1': {
        maxTokens: 8192,
        contextWindow: 32768,
        inputPrice: 0.6,
        outputPrice: 0.6,
        supportsTools: true,
        supportsStreaming: true
      }
    },
    features: {
      streaming: true,
      tools: true,
      images: false,
      reasoning: false,
      caching: false
    },
    pricing: {
      type: 'token_based',
      currency: 'USD'
    },
    documentation: 'https://docs.together.ai'
  },

  fireworks: {
    id: 'fireworks',
    name: 'Fireworks AI',
    description: 'Fast inference platform for open-source models',
    category: 'api',
    authType: 'api_key',
    baseUrl: 'https://api.fireworks.ai/inference/v1',
    defaultModel: 'accounts/fireworks/models/llama-v3p1-70b-instruct',
    supportedModels: {
      'accounts/fireworks/models/llama-v3p1-70b-instruct': {
        maxTokens: 8192,
        contextWindow: 131072,
        inputPrice: 0.9,
        outputPrice: 0.9,
        supportsTools: true,
        supportsStreaming: true
      },
      'accounts/fireworks/models/qwen2p5-coder-32b-instruct': {
        maxTokens: 8192,
        contextWindow: 32768,
        inputPrice: 0.9,
        outputPrice: 0.9,
        supportsTools: true,
        supportsStreaming: true
      }
    },
    features: {
      streaming: true,
      tools: true,
      images: false,
      reasoning: false,
      caching: false
    },
    pricing: {
      type: 'token_based',
      currency: 'USD'
    },
    documentation: 'https://docs.fireworks.ai'
  },

  openrouter: {
    id: 'openrouter',
    name: 'OpenRouter',
    description: 'Unified API for accessing multiple AI models',
    category: 'api',
    authType: 'api_key',
    baseUrl: 'https://openrouter.ai/api/v1',
    defaultModel: 'anthropic/claude-3-5-sonnet',
    supportedModels: {
      'anthropic/claude-3-5-sonnet': {
        maxTokens: 8192,
        contextWindow: 200000,
        inputPrice: 3,
        outputPrice: 15,
        supportsImages: true,
        supportsTools: true,
        supportsStreaming: true
      },
      'openai/gpt-4o': {
        maxTokens: 4096,
        contextWindow: 128000,
        inputPrice: 5,
        outputPrice: 15,
        supportsImages: true,
        supportsTools: true,
        supportsStreaming: true
      }
    },
    features: {
      streaming: true,
      tools: true,
      images: true,
      reasoning: false,
      caching: false
    },
    pricing: {
      type: 'token_based',
      currency: 'USD'
    },
    documentation: 'https://openrouter.ai/docs'
  },

  bedrock: {
    id: 'bedrock',
    name: 'AWS Bedrock',
    description: 'Amazon Bedrock managed AI service',
    category: 'cloud',
    authType: 'cloud_credentials',
    baseUrl: 'https://bedrock-runtime.amazonaws.com',
    defaultModel: 'anthropic.claude-3-5-sonnet-20241022-v2:0',
    supportedModels: {
      'anthropic.claude-3-5-sonnet-20241022-v2:0': {
        maxTokens: 8192,
        contextWindow: 200000,
        inputPrice: 3,
        outputPrice: 15,
        supportsImages: true,
        supportsTools: true,
        supportsStreaming: true
      },
      'meta.llama3-1-70b-instruct-v1:0': {
        maxTokens: 8192,
        contextWindow: 128000,
        inputPrice: 2.65,
        outputPrice: 3.5,
        supportsTools: true,
        supportsStreaming: true
      }
    },
    features: {
      streaming: true,
      tools: true,
      images: true,
      reasoning: false,
      caching: false
    },
    pricing: {
      type: 'token_based',
      currency: 'USD'
    },
    documentation: 'https://docs.aws.amazon.com/bedrock/'
  },

  // === ADDITIONAL SPECIALIZED PROVIDERS ===
  huggingface: {
    id: 'huggingface',
    name: 'Hugging Face',
    description: 'Access to thousands of open-source models',
    category: 'api',
    authType: 'api_key',
    baseUrl: 'https://api-inference.huggingface.co',
    defaultModel: 'microsoft/DialoGPT-medium',
    supportedModels: {
      'microsoft/DialoGPT-medium': {
        maxTokens: 1024,
        contextWindow: 1024,
        inputPrice: 0,
        outputPrice: 0,
        supportsStreaming: false
      }
    },
    features: {
      streaming: false,
      tools: false,
      images: false,
      reasoning: false,
      caching: false
    },
    pricing: {
      type: 'free'
    },
    documentation: 'https://huggingface.co/docs/api-inference'
  },

  sambanova: {
    id: 'sambanova',
    name: 'SambaNova',
    description: 'SambaNova Systems AI platform',
    category: 'api',
    authType: 'api_key',
    baseUrl: 'https://api.sambanova.ai/v1',
    defaultModel: 'Meta-Llama-3.1-70B-Instruct',
    supportedModels: {
      'Meta-Llama-3.1-70B-Instruct': {
        maxTokens: 8192,
        contextWindow: 131072,
        inputPrice: 1,
        outputPrice: 1,
        supportsTools: true,
        supportsStreaming: true
      }
    },
    features: {
      streaming: true,
      tools: true,
      images: false,
      reasoning: false,
      caching: false
    },
    pricing: {
      type: 'token_based',
      currency: 'USD'
    },
    documentation: 'https://sambanova.ai/docs'
  },

  cerebras: {
    id: 'cerebras',
    name: 'Cerebras',
    description: 'Ultra-fast inference with Cerebras hardware',
    category: 'api',
    authType: 'api_key',
    baseUrl: 'https://api.cerebras.ai/v1',
    defaultModel: 'llama3.1-70b',
    supportedModels: {
      'llama3.1-70b': {
        maxTokens: 8192,
        contextWindow: 128000,
        inputPrice: 0.6,
        outputPrice: 0.6,
        supportsTools: true,
        supportsStreaming: true
      }
    },
    features: {
      streaming: true,
      tools: true,
      images: false,
      reasoning: false,
      caching: false
    },
    pricing: {
      type: 'token_based',
      currency: 'USD'
    },
    documentation: 'https://inference-docs.cerebras.ai'
  },

  // === CHINESE PROVIDERS ===
  moonshot: {
    id: 'moonshot',
    name: 'Moonshot AI',
    description: 'Chinese AI company with Kimi models',
    category: 'api',
    authType: 'api_key',
    baseUrl: 'https://api.moonshot.cn/v1',
    defaultModel: 'moonshot-v1-8k',
    supportedModels: {
      'moonshot-v1-8k': {
        maxTokens: 8192,
        contextWindow: 8192,
        inputPrice: 1,
        outputPrice: 1,
        supportsTools: true,
        supportsStreaming: true
      },
      'moonshot-v1-32k': {
        maxTokens: 8192,
        contextWindow: 32768,
        inputPrice: 2,
        outputPrice: 2,
        supportsTools: true,
        supportsStreaming: true
      }
    },
    features: {
      streaming: true,
      tools: true,
      images: false,
      reasoning: false,
      caching: false
    },
    pricing: {
      type: 'token_based',
      currency: 'CNY'
    },
    documentation: 'https://platform.moonshot.cn/docs'
  },

  qwen: {
    id: 'qwen',
    name: 'Qwen (Alibaba)',
    description: 'Alibaba Qwen models with coding capabilities',
    category: 'api',
    authType: 'api_key',
    baseUrl: 'https://dashscope.aliyuncs.com/api/v1',
    defaultModel: 'qwen-turbo',
    supportedModels: {
      'qwen-turbo': {
        maxTokens: 8192,
        contextWindow: 131072,
        inputPrice: 0.3,
        outputPrice: 0.6,
        supportsTools: true,
        supportsStreaming: true
      },
      'qwen-plus': {
        maxTokens: 8192,
        contextWindow: 131072,
        inputPrice: 1,
        outputPrice: 2,
        supportsTools: true,
        supportsStreaming: true
      }
    },
    features: {
      streaming: true,
      tools: true,
      images: false,
      reasoning: false,
      caching: false
    },
    pricing: {
      type: 'token_based',
      currency: 'CNY'
    },
    documentation: 'https://help.aliyun.com/zh/dashscope'
  },

  doubao: {
    id: 'doubao',
    name: 'Doubao (ByteDance)',
    description: 'ByteDance Doubao models',
    category: 'api',
    authType: 'api_key',
    baseUrl: 'https://ark.cn-beijing.volces.com/api/v3',
    defaultModel: 'doubao-pro-4k',
    supportedModels: {
      'doubao-pro-4k': {
        maxTokens: 4096,
        contextWindow: 4096,
        inputPrice: 0.8,
        outputPrice: 2,
        supportsTools: true,
        supportsStreaming: true
      },
      'doubao-pro-128k': {
        maxTokens: 4096,
        contextWindow: 128000,
        inputPrice: 5,
        outputPrice: 9,
        supportsTools: true,
        supportsStreaming: true
      }
    },
    features: {
      streaming: true,
      tools: true,
      images: false,
      reasoning: false,
      caching: false
    },
    pricing: {
      type: 'token_based',
      currency: 'CNY'
    },
    documentation: 'https://www.volcengine.com/docs/82379'
  },

  // === DEVELOPMENT/PROXY SERVICES ===
  'vscode-lm': {
    id: 'vscode-lm',
    name: 'VS Code Language Models',
    description: 'Built-in VS Code language model access',
    category: 'cli',
    authType: 'cli',
    defaultModel: 'copilot-gpt-4o',
    supportedModels: {
      'copilot-gpt-4o': {
        maxTokens: 4096,
        contextWindow: 128000,
        inputPrice: 0,
        outputPrice: 0,
        supportsTools: true,
        supportsStreaming: true
      }
    },
    features: {
      streaming: true,
      tools: true,
      images: false,
      reasoning: false,
      caching: false
    },
    pricing: {
      type: 'subscription'
    },
    setupInstructions: 'Enable in VS Code with GitHub Copilot subscription'
  },

  litellm: {
    id: 'litellm',
    name: 'LiteLLM',
    description: 'Unified interface for 100+ LLM APIs',
    category: 'api',
    authType: 'api_key',
    baseUrl: 'http://localhost:4000',
    defaultModel: 'gpt-3.5-turbo',
    supportedModels: {
      'gpt-3.5-turbo': {
        maxTokens: 4096,
        contextWindow: 16385,
        inputPrice: 0.5,
        outputPrice: 1.5,
        supportsTools: true,
        supportsStreaming: true
      }
    },
    features: {
      streaming: true,
      tools: true,
      images: false,
      reasoning: false,
      caching: false
    },
    pricing: {
      type: 'custom'
    },
    setupInstructions: 'Deploy LiteLLM proxy server',
    documentation: 'https://litellm.vercel.app'
  }
}

export type ProviderId = keyof typeof PROVIDERS
export type ModelId = string

export interface ProviderConfig {
  id: ProviderId
  apiKey?: string
  baseUrl?: string
  modelId?: ModelId
  options?: ApiHandlerOptions
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool'
  content: string | Array<{ type: 'text' | 'image'; text?: string; image_url?: string }>
  name?: string
  tool_calls?: any[]
  tool_call_id?: string
}

export interface ChatRequest {
  messages: ChatMessage[]
  model: string
  temperature?: number
  max_tokens?: number
  stream?: boolean
  tools?: any[]
}

export interface ChatResponse {
  id: string
  object: string
  created: number
  model: string
  choices: Array<{
    index: number
    message: ChatMessage
    finish_reason: string
  }>
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export interface StreamChunk {
  type: 'text' | 'reasoning' | 'usage' | 'error'
  content: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}