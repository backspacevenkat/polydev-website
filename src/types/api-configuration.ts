export interface ApiConfiguration {
  // Provider Selection
  selectedProvider?: ApiProvider
  
  // API Keys (will be encrypted in storage)
  anthropicApiKey?: string
  openaiApiKey?: string
  geminiApiKey?: string
  openrouterApiKey?: string
  groqApiKey?: string
  perplexityApiKey?: string
  deepseekApiKey?: string
  mistralApiKey?: string
  
  // Provider Settings
  anthropicModel?: string
  openaiModel?: string
  geminiModel?: string
  openrouterModel?: string
  groqModel?: string
  perplexityModel?: string
  deepseekModel?: string
  mistralModel?: string
  
  // Custom Base URLs (for self-hosted)
  openaiBaseUrl?: string
  anthropicBaseUrl?: string
  
  // CLI-based providers (subscription-based access)
  cliProviders?: {
    codexPath?: string
    claudeCodePath?: string
    geminiPath?: string
    enabledProviders?: CliProvider[]
  }
  
  // Other settings
  requestTimeoutMs?: number
}

export type ApiProvider = 
  | 'anthropic'
  | 'openai' 
  | 'gemini'
  | 'openrouter'
  | 'groq'
  | 'perplexity'
  | 'deepseek'
  | 'mistral'

export type CliProvider = 
  | 'codex'
  | 'claude-code'
  | 'gemini-cli'
  | 'github-copilot'

export interface ProviderConfig {
  name: string
  displayName: string
  description: string
  signupUrl: string
  docsUrl: string
  requiresApiKey: boolean
  models?: ModelInfo[]
}

export interface ModelInfo {
  id: string
  name: string
  description?: string
  contextWindow?: number
  maxOutput?: number
  inputPrice?: number  // per 1M tokens
  outputPrice?: number  // per 1M tokens
}

export interface CliProviderConfig {
  name: string
  displayName: string
  description: string
  setupUrl?: string
  docsUrl: string
  requiresSubscription: boolean
  defaultExecutableName: string
  authCommand?: string
}

export const CLI_PROVIDERS: Record<CliProvider, CliProviderConfig> = {
  'codex': {
    name: 'codex',
    displayName: 'Codex CLI',
    description: 'Access GPT-5 with high reasoning through your ChatGPT subscription',
    setupUrl: 'https://openai.com/chatgpt/desktop',
    docsUrl: 'https://openai.com/codex',
    requiresSubscription: true,
    defaultExecutableName: 'codex',
    authCommand: 'codex auth'
  },
  'claude-code': {
    name: 'claude-code',
    displayName: 'Claude Code CLI',
    description: 'Access Claude through your Anthropic subscription',
    setupUrl: 'https://claude.ai/login',
    docsUrl: 'https://docs.anthropic.com/en/docs/claude-code',
    requiresSubscription: true,
    defaultExecutableName: 'claude',
    authCommand: 'claude login'
  },
  'gemini-cli': {
    name: 'gemini-cli',
    displayName: 'Gemini CLI',
    description: 'Access Gemini through Google Cloud authentication',
    setupUrl: 'https://cloud.google.com/ai/generative-ai',
    docsUrl: 'https://cloud.google.com/vertex-ai/docs',
    requiresSubscription: true,
    defaultExecutableName: 'gemini',
    authCommand: 'gcloud auth login'
  },
  'github-copilot': {
    name: 'github-copilot',
    displayName: 'GitHub Copilot',
    description: 'Access Copilot models through your GitHub subscription',
    setupUrl: 'https://github.com/features/copilot',
    docsUrl: 'https://docs.github.com/en/copilot',
    requiresSubscription: true,
    defaultExecutableName: 'vscode', // Uses VS Code LM API
  }
}

export const PROVIDERS: Record<ApiProvider, ProviderConfig> = {
  anthropic: {
    name: 'anthropic',
    displayName: 'Anthropic',
    description: 'Claude models - excellent for reasoning and code',
    signupUrl: 'https://console.anthropic.com/settings/keys',
    docsUrl: 'https://docs.anthropic.com/',
    requiresApiKey: true,
    models: [
      { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet (Latest)', contextWindow: 200000 },
      { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', contextWindow: 200000 },
      { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', contextWindow: 200000 },
    ]
  },
  openai: {
    name: 'openai',
    displayName: 'OpenAI',
    description: 'GPT models - versatile and widely adopted',
    signupUrl: 'https://platform.openai.com/api-keys',
    docsUrl: 'https://platform.openai.com/docs/',
    requiresApiKey: true,
    models: [
      { id: 'gpt-4o', name: 'GPT-4o (Latest)', contextWindow: 128000 },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', contextWindow: 128000 },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', contextWindow: 16385 },
    ]
  },
  gemini: {
    name: 'gemini',
    displayName: 'Google Gemini',
    description: 'Google\'s latest AI models',
    signupUrl: 'https://makersuite.google.com/app/apikey',
    docsUrl: 'https://ai.google.dev/docs',
    requiresApiKey: true,
    models: [
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', contextWindow: 1048576 },
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', contextWindow: 1048576 },
    ]
  },
  openrouter: {
    name: 'openrouter',
    displayName: 'OpenRouter',
    description: 'Access to 100+ models through one API',
    signupUrl: 'https://openrouter.ai/keys',
    docsUrl: 'https://openrouter.ai/docs',
    requiresApiKey: true,
  },
  groq: {
    name: 'groq',
    displayName: 'Groq',
    description: 'Ultra-fast inference for open-source models',
    signupUrl: 'https://console.groq.com/keys',
    docsUrl: 'https://console.groq.com/docs/quickstart',
    requiresApiKey: true,
  },
  perplexity: {
    name: 'perplexity',
    displayName: 'Perplexity',
    description: 'AI search and reasoning models',
    signupUrl: 'https://www.perplexity.ai/settings/api',
    docsUrl: 'https://docs.perplexity.ai/',
    requiresApiKey: true,
  },
  deepseek: {
    name: 'deepseek',
    displayName: 'DeepSeek',
    description: 'Advanced reasoning models',
    signupUrl: 'https://platform.deepseek.com/api_keys',
    docsUrl: 'https://platform.deepseek.com/api-docs',
    requiresApiKey: true,
  },
  mistral: {
    name: 'mistral',
    displayName: 'Mistral AI',
    description: 'European AI models with strong performance',
    signupUrl: 'https://console.mistral.ai/api-keys/',
    docsUrl: 'https://docs.mistral.ai/',
    requiresApiKey: true,
  },
}