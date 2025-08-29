const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://yzowvgajdyomscohebgm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6b3d2Z2FqZHlvbXNjb2hlYmdtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNjk0MzgzNywiZXhwIjoyMDUyNTE5ODM3fQ.iQtCHsxHvFIahtgtLrCLLTGm01CcGpXNyMQnQj7BQOg'

const supabase = createClient(supabaseUrl, supabaseKey)

const providers = [
  {
    provider_name: 'anthropic',
    display_name: 'Anthropic',
    models: [
      {"id": "claude-sonnet-4-20250514:1m", "name": "Claude 4 Sonnet (1M)", "maxTokens": 8192, "contextWindow": 1000000, "inputPrice": 3.0, "outputPrice": 15.0},
      {"id": "claude-sonnet-4-20250514", "name": "Claude 4 Sonnet", "maxTokens": 8192, "contextWindow": 200000, "inputPrice": 3.0, "outputPrice": 15.0},
      {"id": "claude-haiku-4-20250514", "name": "Claude 4 Haiku", "maxTokens": 8192, "contextWindow": 200000, "inputPrice": 0.25, "outputPrice": 1.25},
      {"id": "claude-opus-4-1-20250805", "name": "Claude Opus 4.1", "maxTokens": 8192, "contextWindow": 200000, "inputPrice": 15.0, "outputPrice": 75.0},
      {"id": "claude-3-5-sonnet-20241022", "name": "Claude 3.5 Sonnet (New)", "maxTokens": 8192, "contextWindow": 200000, "inputPrice": 3.0, "outputPrice": 15.0}
    ]
  },
  {
    provider_name: 'claude-code',
    display_name: 'Claude Code',
    models: [
      {"id": "claude-opus-4-1", "name": "Claude Opus 4.1", "maxTokens": 8192, "contextWindow": 200000, "inputPrice": 0, "outputPrice": 0},
      {"id": "claude-sonnet-4", "name": "Claude 4 Sonnet", "maxTokens": 8192, "contextWindow": 200000, "inputPrice": 0, "outputPrice": 0}
    ]
  },
  {
    provider_name: 'openai-native',
    display_name: 'OpenAI (Native)',
    models: [
      {"id": "gpt-5", "name": "GPT-5", "maxTokens": 8192, "contextWindow": 200000, "inputPrice": 10.0, "outputPrice": 30.0},
      {"id": "o1-pro", "name": "o1-pro", "maxTokens": 100000, "contextWindow": 200000, "inputPrice": 60.0, "outputPrice": 240.0},
      {"id": "o1", "name": "o1", "maxTokens": 100000, "contextWindow": 200000, "inputPrice": 15.0, "outputPrice": 60.0},
      {"id": "o1-mini", "name": "o1-mini", "maxTokens": 65536, "contextWindow": 128000, "inputPrice": 3.0, "outputPrice": 12.0},
      {"id": "gpt-4o", "name": "GPT-4o", "maxTokens": 16384, "contextWindow": 128000, "inputPrice": 2.5, "outputPrice": 10.0}
    ]
  },
  {
    provider_name: 'openai',
    display_name: 'OpenAI (API)',
    models: [
      {"id": "gpt-5", "name": "GPT-5", "maxTokens": 8192, "contextWindow": 200000, "inputPrice": 10.0, "outputPrice": 30.0},
      {"id": "o1-pro", "name": "o1-pro", "maxTokens": 100000, "contextWindow": 200000, "inputPrice": 60.0, "outputPrice": 240.0},
      {"id": "o1", "name": "o1", "maxTokens": 100000, "contextWindow": 200000, "inputPrice": 15.0, "outputPrice": 60.0},
      {"id": "o1-mini", "name": "o1-mini", "maxTokens": 65536, "contextWindow": 128000, "inputPrice": 3.0, "outputPrice": 12.0},
      {"id": "gpt-4o", "name": "GPT-4o", "maxTokens": 16384, "contextWindow": 128000, "inputPrice": 2.5, "outputPrice": 10.0}
    ]
  },
  {
    provider_name: 'gemini',
    display_name: 'Google Gemini',
    models: [
      {"id": "gemini-2.0-flash-exp", "name": "Gemini 2.0 Flash Experimental", "maxTokens": 8192, "contextWindow": 1000000, "inputPrice": 0.0, "outputPrice": 0.0},
      {"id": "gemini-1.5-pro-latest", "name": "Gemini 1.5 Pro", "maxTokens": 8192, "contextWindow": 2097152, "inputPrice": 1.25, "outputPrice": 2.5},
      {"id": "gemini-1.5-flash-latest", "name": "Gemini 1.5 Flash", "maxTokens": 8192, "contextWindow": 1000000, "inputPrice": 0.075, "outputPrice": 0.3}
    ]
  }
]

async function updateProviders() {
  try {
    // Clear existing providers
    const { error: deleteError } = await supabase
      .from('provider_configurations')
      .delete()
      .neq('id', 0)

    if (deleteError) {
      console.error('Delete error:', deleteError)
      return
    }

    console.log('Cleared existing providers')

    // Insert first 5 providers
    for (const provider of providers) {
      const { error } = await supabase
        .from('provider_configurations')
        .insert([provider])
      
      if (error) {
        console.error(`Error inserting ${provider.provider_name}:`, error)
      } else {
        console.log(`Inserted ${provider.provider_name}`)
      }
    }

    console.log('Successfully updated first 5 providers')
  } catch (error) {
    console.error('Error:', error)
  }
}

updateProviders()