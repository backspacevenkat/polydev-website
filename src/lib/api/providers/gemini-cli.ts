import { ApiHandler } from '../index'
import { ApiHandlerOptions } from '../../../types/providers'
import { GoogleTransformer } from '../transform'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export class GeminiCLIHandler implements ApiHandler {
  private transformer = new GoogleTransformer()
  
  async createMessage(options: ApiHandlerOptions): Promise<Response> {
    const { messages, model } = options
    
    try {
      // Check if gcloud CLI is available
      await execAsync('which gcloud')
      
      // Convert messages to a simple prompt format
      const prompt = this.messagesToPrompt(messages || [])
      
      // Execute the gcloud AI command (this is a conceptual implementation)
      const command = `gcloud ai models predict ${model || 'gemini-2.0-flash-exp'} --prompt="${prompt}"`
      const { stdout, stderr } = await execAsync(command, { 
        timeout: 60000, // 60 second timeout
        maxBuffer: 1024 * 1024 * 10 // 10MB buffer
      })
      
      if (stderr) {
        console.warn('Gemini CLI stderr:', stderr)
      }
      
      // Create a mock Response object with the CLI output
      const responseData = {
        candidates: [{
          content: {
            parts: [{
              text: stdout.trim()
            }]
          }
        }],
        usageMetadata: {
          totalTokenCount: Math.floor(stdout.length / 4)
        }
      }
      
      return new Response(JSON.stringify(responseData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
      
    } catch (error) {
      console.error('Gemini CLI error:', error)
      
      if ((error as any).code === 'ENOENT') {
        throw new Error('gcloud CLI not found. Please install Google Cloud SDK and authenticate first.')
      }
      
      throw new Error(`Gemini CLI execution failed: ${(error as any).message}`)
    }
  }
  
  async streamMessage(options: ApiHandlerOptions): Promise<ReadableStream> {
    // Simulate streaming by chunking the response
    const response = await this.createMessage(options)
    const data = await response.json()
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    
    const chunks = this.splitIntoChunks(content, 75)
    
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
            
            setTimeout(sendNext, 70)
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
      const { stdout } = await execAsync('gcloud auth application-default print-access-token', { timeout: 5000 })
      return stdout.trim().length > 0
    } catch (error) {
      return false
    }
  }
}