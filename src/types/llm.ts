export interface LLMMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface LLMResponse {
  content: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

export interface StreamChunk {
  content: string
  finished: boolean
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

export type ApiStream = AsyncGenerator<StreamChunk, void, unknown>

export interface ApiHandler {
  createMessage(
    systemPrompt: string,
    messages: LLMMessage[],
    options?: {
      temperature?: number
      maxTokens?: number
      model?: string
    }
  ): Promise<ApiStream>
  
  validateApiKey(apiKey: string): Promise<boolean>
  
  isConfigured(): boolean
}

export interface LLMProvider {
  id: string
  name: string
  handler: ApiHandler
  requiresApiKey: boolean
}