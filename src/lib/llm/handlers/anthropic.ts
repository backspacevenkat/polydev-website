'use client'

import { ApiHandler, LLMMessage, StreamChunk, ApiStream } from '@/types/llm'

export class AnthropicHandler implements ApiHandler {
  private apiKey: string | null = null

  constructor(apiKey?: string) {
    this.apiKey = apiKey || null
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey
  }

  isConfigured(): boolean {
    return !!this.apiKey && this.apiKey.length > 0
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 10,
          messages: [{ role: 'user', content: 'Hi' }]
        })
      })

      return response.status === 200 || response.status === 400 // 400 means valid key but bad request
    } catch (error) {
      console.error('Anthropic API key validation failed:', error)
      return false
    }
  }

  async *createMessage(
    systemPrompt: string,
    messages: LLMMessage[],
    options: {
      temperature?: number
      maxTokens?: number
      model?: string
    } = {}
  ): Promise<ApiStream> {
    if (!this.apiKey) {
      throw new Error('Anthropic API key not configured')
    }

    const {
      temperature = 0,
      maxTokens = 4000,
      model = 'claude-3-5-sonnet-20241022'
    } = options

    // Convert messages to Anthropic format
    const anthropicMessages = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content
    }))

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model,
          max_tokens: maxTokens,
          temperature,
          system: systemPrompt,
          messages: anthropicMessages,
          stream: true
        })
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Anthropic API error: ${response.status} ${error}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('Failed to get response stream reader')
      }

      const decoder = new TextDecoder()
      let buffer = ''
      let totalUsage = { promptTokens: 0, completionTokens: 0, totalTokens: 0 }

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6).trim()
              if (data === '[DONE]') {
                yield { content: '', finished: true, usage: totalUsage }
                return
              }

              try {
                const parsed = JSON.parse(data)
                
                if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                  yield { content: parsed.delta.text, finished: false }
                } else if (parsed.type === 'message_delta' && parsed.usage) {
                  totalUsage = {
                    promptTokens: parsed.usage.input_tokens || 0,
                    completionTokens: parsed.usage.output_tokens || 0,
                    totalTokens: (parsed.usage.input_tokens || 0) + (parsed.usage.output_tokens || 0)
                  }
                }
              } catch (parseError) {
                console.warn('Failed to parse streaming response:', parseError)
              }
            }
          }
        }
      } finally {
        reader.releaseLock()
      }

      yield { content: '', finished: true, usage: totalUsage }
      
    } catch (error) {
      console.error('Anthropic API request failed:', error)
      throw error
    }
  }
}