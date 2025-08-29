'use client'

import { ApiHandler, LLMProvider, LLMMessage, ApiStream } from '@/types/llm'
import { ApiProvider, ApiConfiguration, CliProvider } from '@/types/api-configuration'
import { AnthropicHandler } from './handlers/anthropic'
import { OpenAIHandler } from './handlers/openai'
import { CodexCLIHandler } from './handlers/codex-cli'
import { ClaudeCodeCLIHandler } from './handlers/claude-code-cli'
import { GeminiCLIHandler } from './handlers/gemini-cli'
import { GitHubCopilotHandler } from './handlers/github-copilot'

export class LLMService {
  private handlers: Map<ApiProvider, ApiHandler> = new Map()
  private cliHandlers: Map<CliProvider, ApiHandler> = new Map()
  private config: ApiConfiguration = {}

  constructor() {
    this.initializeHandlers()
    this.initializeCliHandlers()
  }

  private initializeHandlers() {
    this.handlers.set('anthropic', new AnthropicHandler())
    this.handlers.set('openai', new OpenAIHandler())
  }

  private initializeCliHandlers() {
    this.cliHandlers.set('codex', new CodexCLIHandler())
    this.cliHandlers.set('claude-code', new ClaudeCodeCLIHandler())
    this.cliHandlers.set('gemini-cli', new GeminiCLIHandler())
    this.cliHandlers.set('github-copilot', new GitHubCopilotHandler())
  }

  updateConfiguration(config: ApiConfiguration) {
    this.config = config

    // Update handler API keys
    if (config.anthropicApiKey) {
      const anthropicHandler = this.handlers.get('anthropic') as AnthropicHandler
      anthropicHandler?.setApiKey(config.anthropicApiKey)
    }

    if (config.openaiApiKey) {
      const openaiHandler = this.handlers.get('openai') as OpenAIHandler
      openaiHandler?.setApiKey(config.openaiApiKey)
      if (config.openaiBaseUrl) {
        openaiHandler.setBaseUrl(config.openaiBaseUrl)
      }
    }

    // Update CLI handler paths
    if (config.cliProviders) {
      if (config.cliProviders.codexPath) {
        const codexHandler = this.cliHandlers.get('codex') as CodexCLIHandler
        codexHandler?.setCodexPath(config.cliProviders.codexPath)
      }

      if (config.cliProviders.claudeCodePath) {
        const claudeHandler = this.cliHandlers.get('claude-code') as ClaudeCodeCLIHandler
        claudeHandler?.setClaudeCodePath(config.cliProviders.claudeCodePath)
      }

      if (config.cliProviders.geminiPath) {
        const geminiHandler = this.cliHandlers.get('gemini-cli') as GeminiCLIHandler
        geminiHandler?.setGeminiPath(config.cliProviders.geminiPath)
      }
    }
  }

  getProvider(provider: ApiProvider): LLMProvider | null {
    const handler = this.handlers.get(provider)
    if (!handler) return null

    return {
      id: provider,
      name: provider,
      handler,
      requiresApiKey: true
    }
  }

  getCurrentProvider(): LLMProvider | null {
    if (!this.config.selectedProvider) return null
    return this.getProvider(this.config.selectedProvider)
  }

  isProviderConfigured(provider: ApiProvider): boolean {
    const handler = this.handlers.get(provider)
    return handler?.isConfigured() || false
  }

  isCurrentProviderConfigured(): boolean {
    if (!this.config.selectedProvider) return false
    return this.isProviderConfigured(this.config.selectedProvider)
  }

  async validateApiKey(provider: ApiProvider, apiKey: string): Promise<boolean> {
    const handler = this.handlers.get(provider)
    if (!handler) {
      throw new Error(`Provider ${provider} not found`)
    }
    return handler.validateApiKey(apiKey)
  }

  async createMessage(
    systemPrompt: string,
    messages: LLMMessage[],
    options?: {
      temperature?: number
      maxTokens?: number
      provider?: ApiProvider
      model?: string
    }
  ): Promise<ApiStream> {
    const targetProvider = options?.provider || this.config.selectedProvider
    if (!targetProvider) {
      throw new Error('No provider selected')
    }

    const handler = this.handlers.get(targetProvider)
    if (!handler) {
      throw new Error(`Provider ${targetProvider} not found`)
    }

    if (!handler.isConfigured()) {
      throw new Error(`Provider ${targetProvider} is not configured`)
    }

    const model = options?.model || this.getModelForProvider(targetProvider)

    return handler.createMessage(systemPrompt, messages, {
      temperature: options?.temperature,
      maxTokens: options?.maxTokens,
      model
    })
  }

  private getModelForProvider(provider: ApiProvider): string | undefined {
    switch (provider) {
      case 'anthropic':
        return this.config.anthropicModel || 'claude-3-5-sonnet-20241022'
      case 'openai':
        return this.config.openaiModel || 'gpt-4o'
      case 'gemini':
        return this.config.geminiModel || 'gemini-1.5-pro'
      case 'groq':
        return this.config.groqModel
      case 'perplexity':
        return this.config.perplexityModel
      case 'deepseek':
        return this.config.deepseekModel
      case 'mistral':
        return this.config.mistralModel
      case 'openrouter':
        return this.config.openrouterModel
      default:
        return undefined
    }
  }

  // CLI Provider methods
  getCliProvider(provider: CliProvider): LLMProvider | null {
    const handler = this.cliHandlers.get(provider)
    if (!handler) return null

    return {
      id: provider,
      name: provider,
      handler,
      requiresApiKey: false
    }
  }

  isCliProviderConfigured(provider: CliProvider): boolean {
    const handler = this.cliHandlers.get(provider)
    return handler?.isConfigured() || false
  }

  async createCliMessage(
    provider: CliProvider,
    systemPrompt: string,
    messages: LLMMessage[],
    options?: {
      temperature?: number
      maxTokens?: number
      model?: string
    }
  ): Promise<ApiStream> {
    const handler = this.cliHandlers.get(provider)
    if (!handler) {
      throw new Error(`CLI provider ${provider} not found`)
    }

    if (!handler.isConfigured()) {
      throw new Error(`CLI provider ${provider} is not configured`)
    }

    return handler.createMessage(systemPrompt, messages, options)
  }

  getAvailableProviders(): ApiProvider[] {
    return Array.from(this.handlers.keys())
  }

  getAvailableCliProviders(): CliProvider[] {
    return Array.from(this.cliHandlers.keys())
  }

  getConfiguredProviders(): ApiProvider[] {
    return this.getAvailableProviders().filter(provider => 
      this.isProviderConfigured(provider)
    )
  }

  getConfiguredCliProviders(): CliProvider[] {
    return this.getAvailableCliProviders().filter(provider =>
      this.isCliProviderConfigured(provider)
    )
  }

  // Utility method for simple text completion
  async generateText(
    prompt: string,
    options?: {
      systemPrompt?: string
      temperature?: number
      maxTokens?: number
      provider?: ApiProvider
      model?: string
    }
  ): Promise<string> {
    const systemPrompt = options?.systemPrompt || 'You are a helpful AI assistant.'
    const messages: LLMMessage[] = [
      { role: 'user', content: prompt }
    ]

    const stream = await this.createMessage(systemPrompt, messages, options)
    let result = ''

    for await (const chunk of stream) {
      result += chunk.content
      if (chunk.finished) break
    }

    return result.trim()
  }
}

// Export singleton instance
export const llmService = new LLMService()