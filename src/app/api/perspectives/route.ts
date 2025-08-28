import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '../../utils/supabase/server'

interface GetPerspectivesRequest {
  prompt: string
  user_token?: string
  models?: string[]
  mode?: 'managed' | 'user_keys'
  project_memory?: 'none' | 'light' | 'full'
  max_messages?: number
  temperature?: number
  max_tokens?: number
  project_context?: {
    root_path?: string
    includes?: string[]
    excludes?: string[]
  }
}

interface ModelResponse {
  model: string
  content: string
  tokens_used?: number
  latency_ms?: number
  error?: string
}

interface PerspectivesResponse {
  responses: ModelResponse[]
  total_tokens?: number
  total_latency_ms?: number
  cached?: boolean
}

// Default model configurations
const DEFAULT_MODELS = [
  'gpt-4',
  'claude-3-sonnet',
  'gemini-pro'
]

async function callOpenAI(prompt: string, apiKey: string, model: string = 'gpt-4', options: any = {}) {
  const startTime = Date.now()
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 2000
      })
    })

    const data = await response.json()
    const endTime = Date.now()

    if (!response.ok) {
      throw new Error(data.error?.message || 'OpenAI API error')
    }

    return {
      model,
      content: data.choices[0]?.message?.content || '',
      tokens_used: data.usage?.total_tokens,
      latency_ms: endTime - startTime
    }
  } catch (error: any) {
    return {
      model,
      content: '',
      error: error.message,
      latency_ms: Date.now() - startTime
    }
  }
}

async function callAnthropic(prompt: string, apiKey: string, model: string = 'claude-3-sonnet-20240229', options: any = {}) {
  const startTime = Date.now()
  
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model,
        max_tokens: options.max_tokens || 2000,
        temperature: options.temperature || 0.7,
        messages: [{ role: 'user', content: prompt }]
      })
    })

    const data = await response.json()
    const endTime = Date.now()

    if (!response.ok) {
      throw new Error(data.error?.message || 'Anthropic API error')
    }

    return {
      model,
      content: data.content[0]?.text || '',
      tokens_used: data.usage?.input_tokens + data.usage?.output_tokens,
      latency_ms: endTime - startTime
    }
  } catch (error: any) {
    return {
      model,
      content: '',
      error: error.message,
      latency_ms: Date.now() - startTime
    }
  }
}

async function callGemini(prompt: string, apiKey: string, model: string = 'gemini-pro', options: any = {}) {
  const startTime = Date.now()
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: options.temperature || 0.7,
          maxOutputTokens: options.max_tokens || 2000
        }
      })
    })

    const data = await response.json()
    const endTime = Date.now()

    if (!response.ok) {
      throw new Error(data.error?.message || 'Gemini API error')
    }

    return {
      model,
      content: data.candidates[0]?.content?.parts[0]?.text || '',
      tokens_used: data.usageMetadata?.totalTokenCount,
      latency_ms: endTime - startTime
    }
  } catch (error: any) {
    return {
      model,
      content: '',
      error: error.message,
      latency_ms: Date.now() - startTime
    }
  }
}

async function callOpenAICompatible(prompt: string, apiKey: string, model: string, baseUrl: string, options: any = {}) {
  const startTime = Date.now()
  
  try {
    const response = await fetch(`${baseUrl}chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 2000
      })
    })

    const data = await response.json()
    const endTime = Date.now()

    if (!response.ok) {
      throw new Error(data.error?.message || `API error from ${baseUrl}`)
    }

    return {
      model,
      content: data.choices[0]?.message?.content || '',
      tokens_used: data.usage?.total_tokens,
      latency_ms: endTime - startTime
    }
  } catch (error: any) {
    return {
      model,
      content: '',
      error: error.message,
      latency_ms: Date.now() - startTime
    }
  }
}

async function getPolynDevManagedKeys() {
  // Polydev manages all API keys - fallback to environment variables
  return {
    openai: process.env.OPENAI_API_KEY,
    anthropic: process.env.ANTHROPIC_API_KEY,
    google: process.env.GOOGLE_API_KEY
  }
}

async function getUserApiKeys(userId: string): Promise<Record<string, { key: string, config: any }>> {
  const supabase = await createClient()
  
  const { data: keys, error } = await supabase
    .from('user_api_keys')
    .select('*')
    .eq('user_id', userId)
    .eq('active', true)
  
  if (error || !keys) {
    return {}
  }
  
  const userKeys: Record<string, { key: string, config: any }> = {}
  
  keys.forEach(key => {
    // Decrypt the key (simple base64 for now - use proper encryption in production)
    const decryptedKey = Buffer.from(key.encrypted_key, 'base64').toString('utf-8')
    
    userKeys[key.provider] = {
      key: decryptedKey,
      config: {
        api_base: key.api_base,
        api_version: key.api_version,
        deployment: key.deployment,
        region: key.region,
        project_id: key.project_id,
        default_model: key.default_model,
        temperature: key.temperature,
        max_tokens: key.max_tokens,
        top_p: key.top_p
      }
    }
  })
  
  return userKeys
}

async function validateUserToken(userToken: string) {
  const supabase = await createClient()
  
  // Verify the MCP user token
  const { data, error } = await supabase
    .from('mcp_user_tokens')
    .select('user_id, active, rate_limit_tier')
    .eq('token_hash', hashToken(userToken))
    .eq('active', true)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

function hashToken(token: string): string {
  // Simple hash for demo - use proper crypto in production
  return Buffer.from(token).toString('base64')
}

async function logIOToDatabase(userId: string, input: string, output: PerspectivesResponse) {
  const supabase = await createClient()
  
  try {
    await supabase
      .from('perspectives_io_log')
      .insert({
        user_id: userId,
        input_prompt: input,
        output_data: output,
        created_at: new Date().toISOString()
      })
  } catch (error) {
    console.error('Failed to log I/O:', error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: GetPerspectivesRequest = await request.json()
    const { 
      prompt,
      user_token,
      models = DEFAULT_MODELS, 
      mode = 'user_keys',
      project_memory = 'none',
      max_messages = 10,
      temperature = 0.7,
      max_tokens = 2000,
      project_context = {}
    } = body

    if (!prompt?.trim()) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    let userId: string | null = null
    let availableKeys: Record<string, any> = {}

    if (mode === 'user_keys') {
      // User must be authenticated to use their own keys
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return NextResponse.json({ 
          error: 'Authentication required for user_keys mode. Please sign in.' 
        }, { status: 401 })
      }
      
      userId = user.id
      const userKeys = await getUserApiKeys(userId)
      
      // Convert user keys to simple format for compatibility
      Object.keys(userKeys).forEach(provider => {
        availableKeys[provider] = userKeys[provider].key
      })
      
      if (Object.keys(availableKeys).length === 0) {
        return NextResponse.json({ 
          error: 'No API keys configured. Please add API keys in your dashboard at: https://polydev.ai/dashboard/api-keys' 
        }, { status: 400 })
      }
    } else {
      // Managed mode - validate MCP token if provided
      if (user_token) {
        const tokenData = await validateUserToken(user_token)
        if (!tokenData) {
          return NextResponse.json({ 
            error: 'Invalid token. Generate a new one at: https://polydev.ai/dashboard/mcp-tools' 
          }, { status: 401 })
        }
        userId = tokenData.user_id
      }
      
      // Use Polydev managed API keys
      const managedKeys = await getPolynDevManagedKeys()
      availableKeys = managedKeys
    }

    // Build the enhanced prompt with project context
    let enhancedPrompt = prompt
    if (project_memory !== 'none' && project_context.root_path) {
      // TODO: Implement TF-IDF snippet selection
      enhancedPrompt = `Context: [Project context would be added here based on ${project_memory} mode]\n\nPrompt: ${prompt}`
    }

    // Fan out to multiple models in parallel
    const modelCalls: Promise<ModelResponse>[] = []
    
    models.forEach(model => {
      // OpenAI models
      if (model.startsWith('gpt-') && availableKeys.openai) {
        modelCalls.push(callOpenAI(enhancedPrompt, availableKeys.openai, model, { temperature, max_tokens }))
      }
      // Anthropic models 
      else if (model.startsWith('claude-') && availableKeys.anthropic) {
        modelCalls.push(callAnthropic(enhancedPrompt, availableKeys.anthropic, model, { temperature, max_tokens }))
      }
      // Google models
      else if (model.startsWith('gemini-') && availableKeys.google) {
        modelCalls.push(callGemini(enhancedPrompt, availableKeys.google, model, { temperature, max_tokens }))
      }
      // Groq models (OpenAI-compatible)
      else if ((model.includes('llama') || model.includes('mixtral') || model.includes('gemma')) && availableKeys.groq) {
        modelCalls.push(callOpenAICompatible(enhancedPrompt, availableKeys.groq, model, 'https://api.groq.com/openai/v1/', { temperature, max_tokens }))
      }
      // Together AI models (OpenAI-compatible)
      else if (availableKeys.together && model.includes('/')) {
        modelCalls.push(callOpenAICompatible(enhancedPrompt, availableKeys.together, model, 'https://api.together.xyz/v1/', { temperature, max_tokens }))
      }
      // Perplexity models (OpenAI-compatible)
      else if (model.includes('sonar') && availableKeys.perplexity) {
        modelCalls.push(callOpenAICompatible(enhancedPrompt, availableKeys.perplexity, model, 'https://api.perplexity.ai/', { temperature, max_tokens }))
      }
    })

    if (modelCalls.length === 0) {
      return NextResponse.json({ 
        error: 'No valid models/API keys available for the requested models' 
      }, { status: 400 })
    }

    const startTime = Date.now()
    const responses = await Promise.all(modelCalls)
    const totalLatency = Date.now() - startTime

    const result: PerspectivesResponse = {
      responses,
      total_tokens: responses.reduce((sum, r) => sum + (r.tokens_used || 0), 0),
      total_latency_ms: totalLatency,
      cached: false
    }

    // Log I/O for persistence
    if (userId) {
      await logIOToDatabase(userId, prompt, result)
    }

    return NextResponse.json(result)
    
  } catch (error: any) {
    console.error('Perspectives API error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 })
  }
}