'use client'

import { ApiHandler, LLMMessage, StreamChunk, ApiStream } from '@/types/llm'
import { execAsync, detectCliPath } from '../utils/process'

export class GeminiCLIHandler implements ApiHandler {
  private geminiPath: string = 'gemini'

  constructor(geminiPath?: string) {
    if (geminiPath) {
      this.geminiPath = geminiPath
    }
    this.detectAndSetPath()
  }

  private async detectAndSetPath() {
    if (this.geminiPath === 'gemini') {
      const detectedPath = await detectCliPath('gemini')
      if (detectedPath) {
        this.geminiPath = detectedPath
      }
    }
  }

  setGeminiPath(path: string) {
    this.geminiPath = path
  }

  async isConfigured(): Promise<boolean> {
    try {
      const { stdout } = await execAsync(`${this.geminiPath} --version`)
      return stdout.includes('gemini') || stdout.includes('Gemini')
    } catch (error) {
      return false
    }
  }

  async validateApiKey(): Promise<boolean> {
    // Gemini CLI uses Google Cloud authentication, not direct API keys
    return this.isConfigured()
  }

  async checkAuthentication(): Promise<{ authenticated: boolean; subscriptionInfo?: any }> {
    try {
      // Try a simple auth check - this would need to be updated based on actual Gemini CLI
      const { stdout, stderr } = await execAsync(`${this.geminiPath} auth status`)
      
      if (stdout.includes('authenticated') || stdout.includes('logged in')) {
        return {
          authenticated: true,
          subscriptionInfo: {
            method: 'google_cloud_auth',
            provider: 'Gemini CLI'
          }
        }
      }
      
      return { authenticated: false }
    } catch (error) {
      return { authenticated: false }
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
    const authStatus = await this.checkAuthentication()
    
    if (!authStatus.authenticated) {
      throw new Error('Gemini CLI not authenticated. Please run "gcloud auth login" first.')
    }

    // Get the main user message
    let userMessage = ''
    if (systemPrompt) {
      userMessage += `${systemPrompt}\n\n`
    }
    
    for (const msg of messages) {
      if (msg.role === 'user') {
        userMessage += msg.content
        break
      }
    }

    if (!userMessage.trim()) {
      throw new Error('No message to send')
    }

    try {
      yield { content: '🔍 Initializing Gemini CLI...', finished: false }
      
      // Use Gemini CLI - this would need to be updated based on actual CLI commands
      const command = `${this.geminiPath} chat "${userMessage}"`
      
      yield { content: '🧠 Starting Gemini with advanced reasoning...', finished: false }
      yield { content: '⚡ Query sent to Google AI, waiting for response...', finished: false }
      
      const { stdout, stderr } = await execAsync(command, { timeout: 120000 })
      
      if (stderr && stderr.includes('authentication')) {
        throw new Error('Gemini CLI authentication expired. Please run "gcloud auth login" to re-authenticate.')
      }

      yield { content: '✅ Response received, processing...', finished: false }
      
      // Process Gemini CLI output (this would need to be adapted based on actual output format)
      const lines = stdout.split('\n')
      let cleanResponse = []
      let captureResponse = false
      let modelInfo = 'Gemini (via Google Cloud)'

      for (const line of lines) {
        if (line.startsWith('model:') || line.includes('gemini')) {
          const modelMatch = line.match(/model:\s*(.+)/) || line.match(/gemini[^:]*:\s*(.+)/)
          if (modelMatch) {
            modelInfo = modelMatch[1].trim()
          }
        } else if (line.includes('] gemini') || captureResponse) {
          captureResponse = true
          if (!line.startsWith('[20') && !line.startsWith('] tokens used:')) {
            cleanResponse.push(line)
          }
        }
      }

      // Create user-friendly response
      let finalResponse = `🤖 **${modelInfo}** (Advanced reasoning)\n\n`
      
      const responseContent = cleanResponse.join('\n').trim()
      if (responseContent) {
        finalResponse += responseContent
      } else {
        finalResponse += `⚠️ Raw response:\n${stdout}`
      }

      yield { content: finalResponse, finished: false }
      yield { content: '', finished: true, usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 } }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new Error(`Gemini CLI Error: ${errorMessage}`)
    }
  }
}