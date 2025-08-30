import { NextRequest, NextResponse } from 'next/server'

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
const MARKUP_PERCENTAGE = 0.10 // 10% markup

export async function POST(request: NextRequest) {
  if (!OPENROUTER_API_KEY) {
    return NextResponse.json(
      { error: 'OpenRouter API key not configured' },
      { status: 500 }
    )
  }

  try {
    const { task, n = 3, models } = await request.json()

    if (!task) {
      return NextResponse.json(
        { error: 'Task is required' },
        { status: 400 }
      )
    }

    const defaultModels = [
      'openai/gpt-4o',
      'anthropic/claude-3.5-sonnet', 
      'google/gemini-2.5-pro'
    ]

    const selectedModels = models || defaultModels.slice(0, n)

    // Get perspectives from multiple models
    const perspectives = await Promise.allSettled(
      selectedModels.map(async (model: string) => {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'X-Title': 'Polydev Multi-LLM Platform'
          },
          body: JSON.stringify({
            model,
            messages: [
              {
                role: 'user',
                content: task
              }
            ],
            temperature: 0.7,
            max_tokens: 1000
          })
        })

        if (!response.ok) {
          throw new Error(`Model ${model} failed: ${response.statusText}`)
        }

        const data = await response.json()
        const usage = data.usage
        const baseCost = (usage.prompt_tokens * 0.000001) + (usage.completion_tokens * 0.000002)
        const finalCost = baseCost * (1 + MARKUP_PERCENTAGE)

        return {
          model,
          content: data.choices[0]?.message?.content || 'No response',
          tokens_used: usage.total_tokens,
          cost: finalCost,
          provider: 'openrouter'
        }
      })
    )

    // Filter successful responses
    const successfulPerspectives = perspectives
      .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
      .map(result => result.value)

    const failedCount = perspectives.length - successfulPerspectives.length

    return NextResponse.json({
      perspectives: successfulPerspectives,
      total_perspectives: successfulPerspectives.length,
      failed_requests: failedCount,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error getting perspectives:', error)
    return NextResponse.json(
      { error: 'Failed to get perspectives' },
      { status: 500 }
    )
  }
}