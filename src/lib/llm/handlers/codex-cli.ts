'use client'

import { ApiHandler, LLMMessage, StreamChunk, ApiStream } from '@/types/llm'
import { execAsync, detectCliPath } from '../utils/process'

export class CodexCLIHandler implements ApiHandler {
  private codexPath: string = 'codex'

  constructor(codexPath?: string) {
    if (codexPath) {
      this.codexPath = codexPath
    }
    this.detectAndSetPath()
  }

  private async detectAndSetPath() {
    if (this.codexPath === 'codex') {
      const detectedPath = await detectCliPath('codex')
      if (detectedPath) {
        this.codexPath = detectedPath
      }
    }
  }

  setCodexPath(path: string) {
    this.codexPath = path
  }

  async isConfigured(): Promise<boolean> {
    try {
      const { stdout } = await execAsync(`${this.codexPath} --version`)
      return stdout.includes('codex') || stdout.includes('Codex')
    } catch (error) {
      return false
    }
  }

  async validateApiKey(): Promise<boolean> {
    // Codex CLI uses ChatGPT subscription authentication, not API keys
    return this.isConfigured()
  }

  async checkAuthentication(): Promise<{ authenticated: boolean; subscriptionInfo?: any }> {
    try {
      // Try a simple test command
      const { stdout, stderr } = await execAsync(`${this.codexPath} --version`)
      
      if (!stderr.includes('authentication') && !stderr.includes('login')) {
        return {
          authenticated: true,
          subscriptionInfo: {
            method: 'chatgpt_subscription', 
            provider: 'Codex CLI'
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
      throw new Error('Codex CLI not authenticated. Please run "codex login" first.')
    }

    // Prepare the prompt
    let userMessage = ''
    if (systemPrompt) {
      userMessage += `${systemPrompt}\n\n`
    }
    
    // Get the main user message
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
      yield { content: '🔍 Initializing Codex CLI...', finished: false }
      yield { content: '✅ Codex CLI found, checking authentication...', finished: false }
      
      // Check if codex CLI is available
      const { stdout: versionCheck, stderr: versionError } = await execAsync(`${this.codexPath} --version`)
      
      if (versionError && (versionError.includes('authentication') || versionError.includes('login'))) {
        throw new Error('Codex CLI authentication expired. Please run "codex login" to re-authenticate.')
      }

      yield { content: '🚀 Authentication verified, preparing query...', finished: false }
      yield { content: '🧠 Starting GPT-5 with high reasoning mode...', finished: false }
      yield { content: '⚡ Query sent to OpenAI, waiting for response...', finished: false }

      // Run codex CLI with high reasoning for better analysis
      const command = `${this.codexPath} exec -c "reasoning_effort=high" -c "reasoning_summaries=auto" "${userMessage}"`
      
      yield { content: '🤔 GPT-5 is thinking... (this may take 1-2 minutes for complex queries)', finished: false }
      
      const { stdout, stderr } = await execAsync(command, { timeout: 120000 }) // 2 min timeout
      
      if (stderr && (stderr.includes('authentication') || stderr.includes('login'))) {
        throw new Error('Codex CLI authentication expired. Please run "codex login" to re-authenticate.')
      }

      yield { content: '✅ Response received, processing...', finished: false }
      
      // Extract model info and clean response
      const lines = stdout.split('\n')
      let cleanResponse = []
      let captureResponse = false
      let modelInfo = 'unknown'
      let tokensUsed = null

      for (const line of lines) {
        if (line.includes('model:')) {
          modelInfo = line.split('model:')[1].trim()
        } else if (line.includes('tokens used:')) {
          try {
            tokensUsed = parseInt(line.split('tokens used:')[1].trim())
          } catch (e) {
            // Ignore parsing errors
          }
        } else if (line.includes('] codex')) {
          captureResponse = true
          continue
        } else if (captureResponse && line.strip()) {
          if (!line.startsWith('[20') && !line.startsWith('] tokens used:')) {
            cleanResponse.push(line)
          }
        }
      }

      // Create user-friendly response
      let finalResponse = ''
      
      if (modelInfo !== 'unknown') {
        const reasoningMode = stdout.includes('high') ? 'High reasoning' : 'Standard'
        finalResponse += `🤖 **${modelInfo}** (${reasoningMode})\n`
        if (tokensUsed) {
          finalResponse += `📊 Tokens used: ${tokensUsed}\n\n`
        } else {
          finalResponse += '\n'
        }
      }

      const responseContent = cleanResponse.join('\n').trim()
      if (responseContent) {
        finalResponse += responseContent
      } else {
        finalResponse += `⚠️ Raw response:\n${stdout}`
      }

      yield { content: '📊 Finalizing response with model info...', finished: false }
      yield { content: finalResponse, finished: false }
      
      yield { 
        content: '', 
        finished: true, 
        usage: { 
          promptTokens: 0, 
          completionTokens: tokensUsed || 0, 
          totalTokens: tokensUsed || 0 
        } 
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new Error(`Codex CLI Error: ${errorMessage}`)
    }
  }
}