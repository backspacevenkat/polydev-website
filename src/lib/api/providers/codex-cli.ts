import { ApiHandler } from '../index'
import { ApiHandlerOptions } from '../../../types/providers'
import { OpenAITransformer } from '../transform'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export class CodexCLIHandler implements ApiHandler {
  private transformer = new OpenAITransformer()
  
  async createMessage(options: ApiHandlerOptions): Promise<Response> {
    const { messages, model, maxTokens, temperature } = options
    
    // Convert messages to a simple prompt format
    const prompt = this.messagesToPrompt(messages || [])
    
    try {
      // Check if codex CLI is available
      await execAsync('which codex')
      
      // Execute the codex CLI command
      const command = `codex "${prompt}" --model="${model || 'gpt-4o'}" --max-tokens=${maxTokens || 4096} --temperature=${temperature || 0.7}`
      const { stdout, stderr } = await execAsync(command, { 
        timeout: 60000, // 60 second timeout
        maxBuffer: 1024 * 1024 * 10 // 10MB buffer
      })
      
      if (stderr) {
        console.warn('Codex CLI stderr:', stderr)
      }
      
      // Create a mock Response object with the CLI output
      const responseData = {
        choices: [{
          message: {
            role: 'assistant',
            content: stdout.trim()
          }
        }],
        usage: {
          total_tokens: Math.floor(stdout.length / 4) // Rough estimate
        }
      }
      
      return new Response(JSON.stringify(responseData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
      
    } catch (error) {
      console.error('Codex CLI error:', error)
      
      if ((error as any).code === 'ENOENT') {
        throw new Error('Codex CLI not found. Please install and authenticate with codex CLI first.')
      }
      
      throw new Error(`Codex CLI execution failed: ${(error as any).message}`)
    }
  }
  
  async streamMessage(options: ApiHandlerOptions): Promise<ReadableStream> {
    // For CLI-based providers, we'll simulate streaming by chunking the response
    const response = await this.createMessage(options)
    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ''
    
    const chunks = this.splitIntoChunks(content, 50) // Split into ~50 char chunks
    
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
            setTimeout(sendNext, 50)
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
    return messages
      .filter(msg => msg.role !== 'system') // System messages handled separately
      .map(msg => {
        const content = typeof msg.content === 'string' ? msg.content : 
          msg.content.map((c: any) => c.type === 'text' ? c.text : '[Image]').join('')
        return `${msg.role === 'user' ? 'User' : 'Assistant'}: ${content}`
      })
      .join('\n\n')
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
      // Check if codex CLI is installed and authenticated
      const { stdout } = await execAsync('codex --version', { timeout: 5000 })
      return stdout.includes('codex')
    } catch (error) {
      return false
    }
  }
}