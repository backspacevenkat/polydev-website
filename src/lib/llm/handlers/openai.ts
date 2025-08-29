'use client'

import { ApiHandler, LLMMessage, StreamChunk, ApiStream } from '@/types/llm'

export class OpenAIHandler implements ApiHandler {
  private apiKey: string | null = null
  private baseUrl: string = 'https://api.openai.com/v1'

  constructor(apiKey?: string, baseUrl?: string) {
    this.apiKey = apiKey || null
    if (baseUrl) {
      this.baseUrl = baseUrl
    }
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey
  }

  setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  isConfigured(): boolean {
    return !!this.apiKey && this.apiKey.length > 0
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      })

      return response.status === 200
    } catch (error) {
      console.error('OpenAI API key validation failed:', error)
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
      throw new Error('OpenAI API key not configured')
    }

    const {
      temperature = 0,
      maxTokens = 4000,
      model = 'gpt-4o'
    } = options

    // Convert messages to OpenAI format
    const openaiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ]

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model,
          messages: openaiMessages,
          temperature,
          max_tokens: maxTokens,
          stream: true
        })
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`OpenAI API error: ${response.status} ${error}`)
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
                
                if (parsed.choices?.[0]?.delta?.content) {
                  yield { content: parsed.choices[0].delta.content, finished: false }
                }
                
                if (parsed.usage) {
                  totalUsage = {
                    promptTokens: parsed.usage.prompt_tokens || 0,
                    completionTokens: parsed.usage.completion_tokens || 0,
                    totalTokens: parsed.usage.total_tokens || 0
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
      console.error('OpenAI API request failed:', error)
      throw error
    }
  }
}