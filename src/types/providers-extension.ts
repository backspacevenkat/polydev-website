// Extension to providers.ts for unified provider configuration
import { 
  anthropicModels,
  openAiNativeModels,
  geminiModels,
  groqModels,
  deepSeekModels,
  mistralModels,
  xaiModels,
  ModelInfo
} from './providers'

export type ProviderTag = 'core' | 'fast-inference' | 'enterprise' | 'open-source' | 'reasoning' | 'vision' | 'coding' | 'experimental' | 'cli' | 'local'

export interface ProviderConfiguration {
  id: string
  name: string
  category: 'api' | 'cli' | 'local' | 'cloud'
  authType: 'api-key' | 'cli' | 'local' | 'oauth'
  tags?: ProviderTag[]
  tier: 'free' | 'premium' | 'enterprise' | 'community'
  baseUrl?: string
  defaultModel: string
  supportedModels: Record<string, ModelInfo>
  features: {
    streaming: boolean
    tools: boolean
    images: boolean
    reasoning: boolean
  }
}

export const PROVIDERS: Record<string, ProviderConfiguration> = {
  anthropic: {
    id: 'anthropic',
    name: 'Anthropic',
    category: 'api',
    authType: 'api-key',
    tags: ['core', 'reasoning', 'coding'],
    tier: 'premium',
    defaultModel: 'claude-sonnet-4-20250514',
    supportedModels: anthropicModels,
    features: {
      streaming: true,
      tools: true,
      images: true,
      reasoning: true,
    }
  },
  'claude-code': {
    id: 'claude-code',
    name: 'Claude Code CLI',
    category: 'cli',
    authType: 'cli',
    tags: ['core', 'cli', 'coding', 'reasoning'],
    tier: 'premium',
    defaultModel: 'claude-sonnet-4-20250514',
    supportedModels: anthropicModels,
    features: {
      streaming: true,
      tools: true,
      images: true,
      reasoning: true,
    }
  },
  openai: {
    id: 'openai',
    name: 'OpenAI',
    category: 'api',
    authType: 'api-key',
    tags: ['core', 'reasoning', 'coding', 'vision'],
    tier: 'premium',
    defaultModel: 'gpt-4o',
    supportedModels: openAiNativeModels,
    features: {
      streaming: true,
      tools: true,
      images: true,
      reasoning: true,
    }
  },
  codex: {
    id: 'codex',
    name: 'Codex CLI',
    category: 'cli',
    authType: 'cli',
    tags: ['core', 'cli', 'coding'],
    tier: 'premium',
    defaultModel: 'gpt-4o',
    supportedModels: openAiNativeModels,
    features: {
      streaming: true,
      tools: true,
      images: true,
      reasoning: true,
    }
  },
  gemini: {
    id: 'gemini',
    name: 'Google Gemini',
    category: 'api',
    authType: 'api-key',
    tags: ['core', 'vision', 'coding'],
    tier: 'premium',
    defaultModel: 'gemini-2.0-flash-exp',
    supportedModels: geminiModels,
    features: {
      streaming: true,
      tools: true,
      images: true,
      reasoning: false,
    }
  },
  'gemini-cli': {
    id: 'gemini-cli',
    name: 'Gemini CLI',
    category: 'cli',
    authType: 'cli',
    tags: ['core', 'cli', 'vision'],
    tier: 'premium',
    defaultModel: 'gemini-2.0-flash-exp',
    supportedModels: geminiModels,
    features: {
      streaming: true,
      tools: true,
      images: true,
      reasoning: false,
    }
  },
  groq: {
    id: 'groq',
    name: 'Groq',
    category: 'api',
    authType: 'api-key',
    tags: ['fast-inference', 'open-source'],
    tier: 'community',
    defaultModel: 'llama-3.3-70b-versatile',
    supportedModels: groqModels,
    features: {
      streaming: true,
      tools: true,
      images: false,
      reasoning: false,
    }
  },
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek',
    category: 'api',
    authType: 'api-key',
    tags: ['reasoning', 'coding'],
    tier: 'premium',
    defaultModel: 'deepseek-reasoner',
    supportedModels: deepSeekModels,
    features: {
      streaming: true,
      tools: true,
      images: false,
      reasoning: true,
    }
  },
  xai: {
    id: 'xai',
    name: 'xAI',
    category: 'api',
    authType: 'api-key',
    tags: ['reasoning', 'coding'],
    tier: 'premium',
    defaultModel: 'grok-2-1212',
    supportedModels: xaiModels,
    features: {
      streaming: true,
      tools: true,
      images: true,
      reasoning: true,
    }
  },
  mistral: {
    id: 'mistral',
    name: 'Mistral AI',
    category: 'api',
    authType: 'api-key',
    tags: ['enterprise', 'coding'],
    tier: 'premium',
    defaultModel: 'mistral-large-2411',
    supportedModels: mistralModels,
    features: {
      streaming: true,
      tools: true,
      images: true,
      reasoning: false,
    }
  }
}