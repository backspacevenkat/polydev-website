import { ApiHandler } from '../index'
import { ApiHandlerOptions } from '../../../types/providers'
import { OpenAITransformer } from '../transform'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export class GitHubCopilotHandler implements ApiHandler {
  private transformer = new OpenAITransformer()
  
  async createMessage(options: ApiHandlerOptions): Promise<Response> {
    const { messages } = options
    
    try {
      // Check if GitHub CLI is available
      await execAsync('which gh')
      
      // Convert messages to a simple prompt format
      const prompt = this.messagesToPrompt(messages)
      
      // Execute the GitHub Copilot CLI command
      const command = `gh copilot suggest "${prompt}"`
      const { stdout, stderr } = await execAsync(command, { 
        timeout: 30000, // 30 second timeout
        maxBuffer: 1024 * 1024 * 5 // 5MB buffer
      })
      
      if (stderr && !stderr.includes('suggestion')) {
        console.warn('GitHub Copilot CLI stderr:', stderr)
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
      console.error('GitHub Copilot CLI error:', error)
      
      if ((error as any).code === 'ENOENT') {
        throw new Error('GitHub CLI not found. Please install GitHub CLI and authenticate first.')
      }
      
      throw new Error(`GitHub Copilot CLI execution failed: ${(error as any).message}`)
    }
  }
  
  async streamMessage(options: ApiHandlerOptions): Promise<ReadableStream> {
    // Simulate streaming by chunking the response
    const response = await this.createMessage(options)
    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ''
    
    const chunks = this.splitIntoChunks(content, 40)
    
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
            
            setTimeout(sendNext, 60)
          } else {
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
      .filter(msg => msg.role !== 'system')
      .map(msg => {
        const content = typeof msg.content === 'string' ? msg.content : 
          msg.content.map((c: any) => c.type === 'text' ? c.text : '[Image]').join('')
        return content
      })
      .join(' ')
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
      const { stdout } = await execAsync('gh auth status', { timeout: 5000 })
      return stdout.includes('Logged in') || stdout.includes('✓')
    } catch (error) {
      return false
    }
  }
}