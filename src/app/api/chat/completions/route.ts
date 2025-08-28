import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '../../../utils/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { messages, models, temperature = 0.7 } = await request.json()

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 })
    }

    if (!models || !Array.isArray(models) || models.length === 0) {
      return NextResponse.json({ error: 'At least one model must be selected' }, { status: 400 })
    }

    // For now, return simulated responses
    // In production, this would call actual AI APIs (OpenAI, Anthropic, etc.)
    const responses = await Promise.all(
      models.map(async (modelId: string) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 2000))
        
        const lastMessage = messages[messages.length - 1]
        let simulatedResponse = ''
        
        switch (modelId) {
          case 'gpt-4':
            simulatedResponse = `As GPT-4, I can provide a comprehensive analysis of your question: "${lastMessage.content}". This is a detailed response that considers multiple perspectives and provides actionable insights.`
            break
          case 'gpt-3.5-turbo':
            simulatedResponse = `GPT-3.5 Turbo here: "${lastMessage.content}" - I'll provide a concise and efficient response to help you move forward quickly.`
            break
          case 'claude-3-sonnet':
            simulatedResponse = `From Claude 3 Sonnet's perspective: I'll approach "${lastMessage.content}" by breaking it down systematically and providing a thoughtful, nuanced response with clear reasoning.`
            break
          case 'claude-3-haiku':
            simulatedResponse = `Claude 3 Haiku responding: "${lastMessage.content}" - Here's a fast and focused response to your query.`
            break
          case 'gemini-pro':
            simulatedResponse = `Gemini Pro here: Let me analyze "${lastMessage.content}" from multiple angles and provide you with a structured response that covers the key points effectively.`
            break
          case 'llama-2-70b':
            simulatedResponse = `Llama 2 70B response: "${lastMessage.content}" - I'll provide an open-source perspective on this topic with detailed analysis.`
            break
          default:
            simulatedResponse = `Response from ${modelId}: "${lastMessage.content}" - This is a simulated response from the selected model.`
        }

        return {
          model: modelId,
          content: simulatedResponse,
          timestamp: new Date().toISOString(),
          usage: {
            prompt_tokens: Math.floor(Math.random() * 100) + 50,
            completion_tokens: Math.floor(Math.random() * 200) + 100,
            total_tokens: Math.floor(Math.random() * 300) + 150
          }
        }
      })
    )

    // Log the chat interaction for analytics (optional)
    try {
      await supabase
        .from('chat_logs')
        .insert({
          user_id: user.id,
          models_used: models,
          message_count: messages.length,
          created_at: new Date().toISOString()
        })
    } catch (logError) {
      // Don't fail the request if logging fails
      console.warn('Failed to log chat interaction:', logError)
    }

    return NextResponse.json({
      responses,
      usage: {
        total_prompt_tokens: responses.reduce((sum, r) => sum + r.usage.prompt_tokens, 0),
        total_completion_tokens: responses.reduce((sum, r) => sum + r.usage.completion_tokens, 0),
        total_tokens: responses.reduce((sum, r) => sum + r.usage.total_tokens, 0)
      }
    })
    
  } catch (error) {
    console.error('Chat completions error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat completion' },
      { status: 500 }
    )
  }
}