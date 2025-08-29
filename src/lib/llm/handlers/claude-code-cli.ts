'use client'

import { ApiHandler, LLMMessage, StreamChunk, ApiStream } from '@/types/llm'
import { execAsync, detectCliPath } from '../utils/process'

export class ClaudeCodeCLIHandler implements ApiHandler {
  private claudeCodePath: string = 'claude'

  constructor(claudeCodePath?: string) {
    if (claudeCodePath) {
      this.claudeCodePath = claudeCodePath
    }
    this.detectAndSetPath()
  }

  private async detectAndSetPath() {
    if (this.claudeCodePath === 'claude') {
      const detectedPath = await detectCliPath('claude')
      if (detectedPath) {
        this.claudeCodePath = detectedPath
      }
    }
  }

  setClaudeCodePath(path: string) {
    this.claudeCodePath = path
  }

  async isConfigured(): Promise<boolean> {
    try {
      const { stdout } = await execAsync(`${this.claudeCodePath} --version`)
      return stdout.includes('claude') || stdout.includes('Claude Code')
    } catch (error) {
      return false
    }
  }

  async validateApiKey(): Promise<boolean> {
    // Claude Code CLI doesn't use API keys - it uses subscription authentication
    return this.isConfigured()
  }

  async checkAuthentication(): Promise<{ authenticated: boolean; subscriptionInfo?: any }> {
    try {
      // Try a simple status check
      const { stdout, stderr } = await execAsync(`${this.claudeCodePath} auth status`)
      
      if (stdout.includes('authenticated') || stdout.includes('logged in')) {
        return {
          authenticated: true,
          subscriptionInfo: {
            method: 'claude_subscription',
            provider: 'Claude Code CLI'
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
      throw new Error('Claude Code CLI not authenticated. Please run "claude login" first.')
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
      yield { content: '🔍 Initializing Claude Code CLI...', finished: false }
      
      // Use Claude Code CLI with high reasoning
      const command = `${this.claudeCodePath} exec -c "reasoning_effort=high" -c "reasoning_summaries=auto" "${userMessage}"`
      
      yield { content: '🧠 Starting Claude with high reasoning mode...', finished: false }
      yield { content: '⚡ Query sent to Claude, waiting for response...', finished: false }
      
      const { stdout, stderr } = await execAsync(command, { timeout: 120000 }) // 2 min timeout
      
      if (stderr && stderr.includes('authentication')) {
        throw new Error('Claude Code CLI authentication expired. Please run "claude login" to re-authenticate.')
      }

      yield { content: '✅ Response received, processing...', finished: false }
      
      // Process Claude Code CLI output
      const lines = stdout.split('\n')
      let cleanResponse = []
      let captureResponse = false
      let modelInfo = 'Claude (via subscription)'

      // Extract model info and response
      for (const line of lines) {
        if (line.startsWith('model:') || line.includes('claude')) {
          const modelMatch = line.match(/model:\s*(.+)/) || line.match(/claude[^:]*:\s*(.+)/)
          if (modelMatch) {
            modelInfo = modelMatch[1].trim()
          }
        } else if (line.includes('] claude') || captureResponse) {
          captureResponse = true
          if (!line.startsWith('[20') && !line.startsWith('] tokens used:')) {
            cleanResponse.push(line)
          }
        }
      }

      // Create user-friendly response
      let finalResponse = `🤖 **${modelInfo}** (High reasoning)\n\n`
      
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
      throw new Error(`Claude Code CLI Error: ${errorMessage}`)
    }
  }
}