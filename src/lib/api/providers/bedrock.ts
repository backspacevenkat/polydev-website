import { ApiHandler } from '../index'
import { ApiHandlerOptions } from '../../../types/providers'
import { AnthropicTransformer } from '../transform'

export class BedrockHandler implements ApiHandler {
  private transformer = new AnthropicTransformer()
  
  async createMessage(options: ApiHandlerOptions): Promise<Response> {
    throw new Error('AWS Bedrock integration requires AWS SDK and credentials setup')
  }
  
  async streamMessage(options: ApiHandlerOptions): Promise<ReadableStream> {
    throw new Error('AWS Bedrock streaming requires AWS SDK and credentials setup')
  }
  
  async validateApiKey(): Promise<boolean> {
    return true // AWS uses IAM credentials, not API keys
  }
}