import { ApiHandler } from '../index'
import { ApiHandlerOptions } from '../../../types/providers'
import { AnthropicTransformer } from '../transform'
import { exec } from 'child_process'
import { promisify } from 'util'
import { writeFileSync, unlinkSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'

const execAsync = promisify(exec)

export class ClaudeCodeHandler implements ApiHandler {
  private transformer = new AnthropicTransformer()
  
  async createMessage(options: ApiHandlerOptions): Promise<Response> {
    const { messages, model, maxTokens, temperature } = options
    
    try {
      // Check if claude CLI is available
      await execAsync('which claude')
      
      // Create a temporary file with the conversation
      const tempFile = join(tmpdir(), `claude-prompt-${Date.now()}.txt`)
      const prompt = this.messagesToPrompt(messages)
      writeFileSync(tempFile, prompt)
      
      try {
        // Execute the claude CLI command
        const command = `claude -f "${tempFile}" --model="${model || 'claude-opus-4-1-20250805'}" --max-tokens=${maxTokens || 8192} --temperature=${temperature || 0.7}`
        const { stdout, stderr } = await execAsync(command, { 
          timeout: 120000, // 2 minute timeout for Claude
          maxBuffer: 1024 * 1024 * 20 // 20MB buffer
        })
        
        if (stderr) {
          console.warn('Claude CLI stderr:', stderr)
        }
        
        // Create a mock Response object with the CLI output
        const responseData = {
          content: [{
            type: 'text',
            text: stdout.trim()
          }],
          usage: {
            input_tokens: Math.floor(prompt.length / 4),
            output_tokens: Math.floor(stdout.length / 4)
          }
        }
        
        return new Response(JSON.stringify(responseData), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
        
      } finally {
        // Clean up temp file
        try {
          unlinkSync(tempFile)
        } catch (e) {
          console.warn('Failed to clean up temp file:', e)
        }
      }
      
    } catch (error) {
      console.error('Claude CLI error:', error)
      
      if ((error as any).code === 'ENOENT') {
        throw new Error('Claude CLI not found. Please install Claude Code CLI first.')
      }
      
      throw new Error(`Claude CLI execution failed: ${(error as any).message}`)
    }
  }
  
  async streamMessage(options: ApiHandlerOptions): Promise<ReadableStream> {
    // For CLI-based providers, we'll simulate streaming by chunking the response
    const response = await this.createMessage(options)
    const data = await response.json()
    const content = data.content?.[0]?.text || ''
    
    const chunks = this.splitIntoChunks(content, 100) // Split into ~100 char chunks
    
    return new ReadableStream({
      start(controller) {
        let index = 0
        
        const sendNext = () => {
          if (index < chunks.length) {
            const chunk = {
              type: 'content',
              content: chunks[index]
            }
            controller.enqueue(new TextEncoder().encode(JSON.stringify(chunk) + '\n'))
            index++
            
            // Add small delay to simulate streaming
            setTimeout(sendNext, 75)
          } else {
            // Send done signal
            const doneChunk = { type: 'done' }
            controller.enqueue(new TextEncoder().encode(JSON.stringify(doneChunk) + '\n'))
            controller.close()
          }
        }
        
        sendNext()
      }
    })
  }
  
  private messagesToPrompt(messages: any[]): string {
    let prompt = ''
    
    for (const msg of messages) {
      const content = typeof msg.content === 'string' ? msg.content : 
        msg.content.map((c: any) => c.type === 'text' ? c.text : '[Image]').join('')
      
      if (msg.role === 'system') {
        prompt += `System: ${content}\n\n`
      } else if (msg.role === 'user') {
        prompt += `Human: ${content}\n\n`
      } else if (msg.role === 'assistant') {
        prompt += `Assistant: ${content}\n\n`
      }
    }
    
    return prompt.trim()
  }
  
  private splitIntoChunks(text: string, maxChunkSize: number): string[] {
    const chunks: string[] = []
    let currentChunk = ''
    
    const words = text.split(' ')
    
    for (const word of words) {
      if (currentChunk.length + word.length + 1 > maxChunkSize && currentChunk.length > 0) {
        chunks.push(currentChunk)
        currentChunk = word
      } else {
        currentChunk += (currentChunk ? ' ' : '') + word
      }
    }
    
    if (currentChunk) {
      chunks.push(currentChunk)
    }
    
    return chunks
  }
  
  async validateApiKey(): Promise<boolean> {
    try {
      // Check if claude CLI is installed and authenticated
      const { stdout } = await execAsync('claude --version', { timeout: 5000 })
      return stdout.includes('claude') || stdout.includes('Claude')
    } catch (error) {
      return false
    }
  }
}