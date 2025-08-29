-- Add provider categorization support
ALTER TABLE provider_configurations ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE provider_configurations ADD COLUMN IF NOT EXISTS tier TEXT CHECK (tier IN ('premium', 'standard', 'community'));
ALTER TABLE provider_configurations ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'api' CHECK (category IN ('api', 'cli', 'local', 'cloud'));
ALTER TABLE provider_configurations ADD COLUMN IF NOT EXISTS auth_type TEXT DEFAULT 'api_key' CHECK (auth_type IN ('api_key', 'oauth', 'cli', 'local', 'cloud_credentials'));

-- Create index for tag-based filtering
CREATE INDEX IF NOT EXISTS idx_provider_configurations_tags ON provider_configurations USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_provider_configurations_tier ON provider_configurations(tier);
CREATE INDEX IF NOT EXISTS idx_provider_configurations_category ON provider_configurations(category);

-- Update existing providers with categorization
UPDATE provider_configurations SET 
  tags = ARRAY['core', 'reasoning', 'vision', 'coding']::text[],
  tier = 'premium',
  category = 'api',
  auth_type = 'api_key'
WHERE provider = 'anthropic';

UPDATE provider_configurations SET 
  tags = ARRAY['core', 'reasoning', 'vision', 'coding']::text[],
  tier = 'premium',
  category = 'api',
  auth_type = 'api_key'
WHERE provider IN ('openai', 'openai-native');

UPDATE provider_configurations SET 
  tags = ARRAY['core', 'vision', 'experimental']::text[],
  tier = 'standard',
  category = 'api',
  auth_type = 'api_key'
WHERE provider IN ('gemini', 'google');

UPDATE provider_configurations SET 
  tags = ARRAY['enterprise', 'cloud', 'vision']::text[],
  tier = 'standard',
  category = 'cloud',
  auth_type = 'cloud_credentials'
WHERE provider = 'vertex';

UPDATE provider_configurations SET 
  tags = ARRAY['fast-inference', 'open-source']::text[],
  tier = 'standard',
  category = 'api',
  auth_type = 'api_key'
WHERE provider = 'groq';

UPDATE provider_configurations SET 
  tags = ARRAY['reasoning', 'coding']::text[],
  tier = 'standard',
  category = 'api',
  auth_type = 'api_key'
WHERE provider = 'deepseek';

UPDATE provider_configurations SET 
  tags = ARRAY['experimental', 'reasoning']::text[],
  tier = 'standard',
  category = 'api',
  auth_type = 'api_key'
WHERE provider = 'xai';

UPDATE provider_configurations SET 
  tags = ARRAY['local', 'open-source', 'privacy']::text[],
  tier = 'community',
  category = 'local',
  auth_type = 'local'
WHERE provider = 'ollama';

UPDATE provider_configurations SET 
  tags = ARRAY['local', 'privacy']::text[],
  tier = 'community',
  category = 'local',
  auth_type = 'local'
WHERE provider = 'lmstudio';

UPDATE provider_configurations SET 
  tags = ARRAY['core', 'coding']::text[],
  tier = 'standard',
  category = 'api',
  auth_type = 'api_key'
WHERE provider = 'mistral';

UPDATE provider_configurations SET 
  tags = ARRAY['core', 'cli', 'coding', 'reasoning']::text[],
  tier = 'premium',
  category = 'cli',
  auth_type = 'cli'
WHERE provider = 'claude-code';

-- Add commonly requested provider configurations
INSERT INTO provider_configurations (
  provider, display_name, description, category, auth_type, tags, tier,
  default_api_base, supports_chat, supports_completion, supports_embedding, 
  supports_function_calling, supports_vision, available_models, active
) VALUES
  ('perplexity', 'Perplexity AI', 'AI search and reasoning models', 'api', 'api_key', 
   ARRAY['reasoning', 'search']::text[], 'standard', 'https://api.perplexity.ai',
   true, true, false, false, false, 
   ARRAY['llama-3.1-sonar-large-128k-online', 'llama-3.1-sonar-small-128k-online'], true),
   
  ('together', 'Together AI', 'Together AI platform with various open models', 'api', 'api_key',
   ARRAY['open-source', 'fast-inference']::text[], 'standard', 'https://api.together.xyz/v1',
   true, true, false, true, false,
   ARRAY['meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo', 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo'], true),
   
  ('fireworks', 'Fireworks AI', 'Fast inference platform for open-source models', 'api', 'api_key',
   ARRAY['fast-inference', 'open-source']::text[], 'standard', 'https://api.fireworks.ai/inference/v1',
   true, true, false, true, false,
   ARRAY['accounts/fireworks/models/llama-v3p1-70b-instruct'], true),
   
  ('cerebras', 'Cerebras', 'Ultra-fast inference with Cerebras hardware', 'api', 'api_key',
   ARRAY['fast-inference']::text[], 'standard', 'https://api.cerebras.ai/v1',
   true, true, false, false, false,
   ARRAY['llama3.1-70b'], true),
   
  ('bedrock', 'AWS Bedrock', 'Amazon Bedrock managed AI service', 'cloud', 'cloud_credentials',
   ARRAY['enterprise', 'cloud']::text[], 'standard', 'https://bedrock-runtime.amazonaws.com',
   true, true, false, true, true,
   ARRAY['anthropic.claude-3-5-sonnet-20241022-v2:0', 'amazon.nova-pro-v1:0'], true)
   
ON CONFLICT (provider) DO UPDATE SET
  tags = EXCLUDED.tags,
  tier = EXCLUDED.tier,
  category = EXCLUDED.category,
  auth_type = EXCLUDED.auth_type;