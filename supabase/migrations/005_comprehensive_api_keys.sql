-- Comprehensive API key management inspired by Continue.dev
-- Drop the old simple table and create a new comprehensive one
DROP TABLE IF EXISTS user_api_keys CASCADE;

-- Create comprehensive API keys table supporting all major providers
CREATE TABLE user_api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN (
    'openai', 'anthropic', 'google', 'azure', 'aws_bedrock', 'cohere',
    'mistral', 'perplexity', 'groq', 'together', 'replicate', 'huggingface',
    'deepseek', 'fireworks', 'anyscale', 'lepton', 'novita', 'sambanova',
    'cerebras', 'vertex_ai', 'watson', 'custom'
  )),
  key_name TEXT NOT NULL,
  encrypted_key TEXT NOT NULL,
  key_preview TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  
  -- Provider-specific configuration
  api_base TEXT, -- Custom endpoints for self-hosted/proxy
  api_version TEXT, -- For Azure, AWS Bedrock versions
  deployment TEXT, -- For Azure deployments
  region TEXT, -- For AWS Bedrock, GCP Vertex AI
  project_id TEXT, -- For GCP, IBM Watson
  account_id TEXT, -- For Cloudflare
  organization_id TEXT, -- For OpenAI orgs
  
  -- Model and rate limit configuration
  default_model TEXT,
  context_length INTEGER,
  max_tokens INTEGER DEFAULT 4096,
  temperature DECIMAL(3,2) DEFAULT 0.7,
  top_p DECIMAL(3,2) DEFAULT 1.0,
  frequency_penalty DECIMAL(3,2) DEFAULT 0.0,
  presence_penalty DECIMAL(3,2) DEFAULT 0.0,
  
  -- Rate limiting and cost controls
  rate_limit_rpm INTEGER DEFAULT 60, -- requests per minute
  rate_limit_rpd INTEGER DEFAULT 1000, -- requests per day
  monthly_budget DECIMAL(10,2), -- USD budget limit
  current_usage DECIMAL(10,2) DEFAULT 0.0, -- Current month usage
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  last_used_at TIMESTAMPTZ,
  
  -- Unique constraint on user + provider + name
  UNIQUE(user_id, provider, key_name)
);

-- Create indexes for performance
CREATE INDEX user_api_keys_user_id_idx ON user_api_keys(user_id);
CREATE INDEX user_api_keys_provider_idx ON user_api_keys(provider);
CREATE INDEX user_api_keys_active_idx ON user_api_keys(active);
CREATE INDEX user_api_keys_last_used_idx ON user_api_keys(last_used_at);

-- Enable RLS
ALTER TABLE user_api_keys ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own API keys" ON user_api_keys
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own API keys" ON user_api_keys
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own API keys" ON user_api_keys
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own API keys" ON user_api_keys
  FOR DELETE USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_api_key_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER update_api_key_timestamp
  BEFORE UPDATE ON user_api_keys
  FOR EACH ROW
  EXECUTE FUNCTION update_api_key_updated_at();

-- Function to reset monthly usage (call this monthly via cron)
CREATE OR REPLACE FUNCTION reset_monthly_api_usage()
RETURNS void AS $$
BEGIN
  UPDATE user_api_keys 
  SET current_usage = 0.0
  WHERE current_usage > 0;
END;
$$ LANGUAGE plpgsql;

-- Create usage tracking table for detailed analytics
CREATE TABLE api_key_usage_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID REFERENCES user_api_keys(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Request details
  model_used TEXT NOT NULL,
  tokens_input INTEGER DEFAULT 0,
  tokens_output INTEGER DEFAULT 0,
  tokens_total INTEGER DEFAULT 0,
  
  -- Cost tracking
  cost_input DECIMAL(10,6) DEFAULT 0.0,
  cost_output DECIMAL(10,6) DEFAULT 0.0,
  cost_total DECIMAL(10,6) DEFAULT 0.0,
  
  -- Performance metrics
  latency_ms INTEGER,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  
  -- Request metadata
  endpoint TEXT, -- chat, completion, embedding, etc.
  user_agent TEXT,
  ip_address INET,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for usage log
CREATE INDEX api_key_usage_log_api_key_idx ON api_key_usage_log(api_key_id);
CREATE INDEX api_key_usage_log_user_idx ON api_key_usage_log(user_id);
CREATE INDEX api_key_usage_log_created_idx ON api_key_usage_log(created_at);
CREATE INDEX api_key_usage_log_model_idx ON api_key_usage_log(model_used);

-- RLS for usage log
ALTER TABLE api_key_usage_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own usage logs" ON api_key_usage_log
  FOR SELECT USING (auth.uid() = user_id);

-- Function to log API usage
CREATE OR REPLACE FUNCTION log_api_usage(
  p_api_key_id UUID,
  p_user_id UUID,
  p_model_used TEXT,
  p_tokens_input INTEGER DEFAULT 0,
  p_tokens_output INTEGER DEFAULT 0,
  p_cost_input DECIMAL(10,6) DEFAULT 0.0,
  p_cost_output DECIMAL(10,6) DEFAULT 0.0,
  p_latency_ms INTEGER DEFAULT NULL,
  p_success BOOLEAN DEFAULT true,
  p_error_message TEXT DEFAULT NULL,
  p_endpoint TEXT DEFAULT 'chat'
) RETURNS void AS $$
DECLARE
  total_tokens INTEGER;
  total_cost DECIMAL(10,6);
BEGIN
  total_tokens := COALESCE(p_tokens_input, 0) + COALESCE(p_tokens_output, 0);
  total_cost := COALESCE(p_cost_input, 0.0) + COALESCE(p_cost_output, 0.0);
  
  -- Insert usage log
  INSERT INTO api_key_usage_log (
    api_key_id, user_id, model_used, tokens_input, tokens_output, tokens_total,
    cost_input, cost_output, cost_total, latency_ms, success, error_message, endpoint
  ) VALUES (
    p_api_key_id, p_user_id, p_model_used, p_tokens_input, p_tokens_output, total_tokens,
    p_cost_input, p_cost_output, total_cost, p_latency_ms, p_success, p_error_message, p_endpoint
  );
  
  -- Update current usage in api keys table
  UPDATE user_api_keys 
  SET 
    current_usage = current_usage + total_cost,
    last_used_at = now()
  WHERE id = p_api_key_id;
END;
$$ LANGUAGE plpgsql;

-- Create provider configurations table for dynamic provider setup
CREATE TABLE provider_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  documentation_url TEXT,
  
  -- API configuration
  default_api_base TEXT,
  supports_chat BOOLEAN DEFAULT true,
  supports_completion BOOLEAN DEFAULT true,
  supports_embedding BOOLEAN DEFAULT false,
  supports_function_calling BOOLEAN DEFAULT false,
  supports_vision BOOLEAN DEFAULT false,
  supports_streaming BOOLEAN DEFAULT true,
  
  -- Available models (JSONB array)
  available_models JSONB DEFAULT '[]',
  
  -- Configuration schema for provider-specific fields
  config_schema JSONB DEFAULT '{}',
  
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert comprehensive provider configurations
INSERT INTO provider_configurations (provider, display_name, description, default_api_base, supports_embedding, supports_function_calling, supports_vision, available_models) VALUES
('openai', 'OpenAI', 'GPT models including GPT-4, GPT-3.5, and DALL-E', 'https://api.openai.com/v1/', true, true, true, '["gpt-4", "gpt-4-turbo", "gpt-4o", "gpt-4o-mini", "gpt-3.5-turbo", "gpt-3.5-turbo-16k", "text-embedding-ada-002", "text-embedding-3-small", "text-embedding-3-large"]'),
('anthropic', 'Anthropic', 'Claude models including Claude-3 and Claude-2', 'https://api.anthropic.com/', false, true, true, '["claude-3-5-sonnet-20241022", "claude-3-opus-20240229", "claude-3-sonnet-20240229", "claude-3-haiku-20240307", "claude-2.1", "claude-2.0", "claude-instant-1.2"]'),
('google', 'Google AI', 'Gemini models and PaLM API', 'https://generativelanguage.googleapis.com/v1/', true, true, true, '["gemini-pro", "gemini-pro-vision", "gemini-1.5-pro", "gemini-1.5-flash", "text-embedding-004"]'),
('azure', 'Azure OpenAI', 'OpenAI models hosted on Azure', '', true, true, true, '["gpt-4", "gpt-4-32k", "gpt-4-turbo", "gpt-35-turbo", "gpt-35-turbo-16k", "text-embedding-ada-002"]'),
('aws_bedrock', 'AWS Bedrock', 'Claude, Llama, and other models via AWS Bedrock', '', true, false, false, '["anthropic.claude-3-sonnet-20240229-v1:0", "anthropic.claude-3-haiku-20240307-v1:0", "meta.llama2-70b-chat-v1", "amazon.titan-embed-text-v1"]'),
('cohere', 'Cohere', 'Command and Embed models from Cohere', 'https://api.cohere.ai/v1/', true, false, false, '["command-r-plus", "command-r", "command", "command-light", "embed-english-v3.0", "embed-multilingual-v3.0"]'),
('mistral', 'Mistral AI', 'Mistral and Mixtral models', 'https://api.mistral.ai/v1/', true, true, false, '["mistral-large-latest", "mistral-medium-latest", "mistral-small-latest", "mistral-tiny", "mixtral-8x7b-instruct", "mistral-embed"]'),
('perplexity', 'Perplexity', 'Perplexity online and chat models', 'https://api.perplexity.ai/', false, false, false, '["llama-3.1-sonar-small-128k-online", "llama-3.1-sonar-large-128k-online", "llama-3.1-sonar-huge-128k-online", "llama-3.1-8b-instruct", "llama-3.1-70b-instruct"]'),
('groq', 'Groq', 'Fast inference for Llama, Mixtral, and Gemma models', 'https://api.groq.com/openai/v1/', false, true, false, '["llama-3.1-405b-reasoning", "llama-3.1-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768", "gemma2-9b-it"]'),
('together', 'Together AI', 'Open source models with fast inference', 'https://api.together.xyz/v1/', false, false, false, '["meta-llama/Llama-2-70b-chat-hf", "mistralai/Mixtral-8x7B-Instruct-v0.1", "NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO", "zero-one-ai/Yi-34B-Chat"]'),
('replicate', 'Replicate', 'Run open source models in the cloud', 'https://api.replicate.com/v1/', false, false, true, '["meta/llama-2-70b-chat", "mistralai/mixtral-8x7b-instruct-v0.1", "lucataco/sdxl", "stability-ai/stable-diffusion"]'),
('huggingface', 'Hugging Face', 'Inference API for thousands of models', 'https://api-inference.huggingface.co/', true, false, false, '["microsoft/DialoGPT-medium", "facebook/blenderbot-400M-distill", "sentence-transformers/all-MiniLM-L6-v2"]'),
('deepseek', 'DeepSeek', 'DeepSeek Coder and Chat models', 'https://api.deepseek.com/', false, false, false, '["deepseek-chat", "deepseek-coder"]'),
('fireworks', 'Fireworks AI', 'Fast inference for popular open source models', 'https://api.fireworks.ai/inference/v1/', false, true, false, '["accounts/fireworks/models/llama-v3p1-405b-instruct", "accounts/fireworks/models/mixtral-8x7b-instruct"]'),
('anyscale', 'Anyscale', 'Serverless endpoints for open source models', 'https://api.endpoints.anyscale.com/v1/', false, false, false, '["meta-llama/Llama-2-70b-chat-hf", "codellama/CodeLlama-34b-Instruct-hf"]'),
('lepton', 'Lepton AI', 'Optimized model serving platform', 'https://api.lepton.ai/api/v1/', false, false, false, '["llama2-7b", "llama2-13b", "llama2-70b", "mixtral-8x7b"]'),
('novita', 'Novita AI', 'GPU cloud for AI inference', 'https://api.novita.ai/v3/', false, false, true, '["meta-llama/llama-2-7b-chat", "stabilityai/stable-diffusion-xl-base-1.0"]'),
('sambanova', 'SambaNova', 'Fast inference on SambaNova hardware', 'https://api.sambanova.ai/v1/', false, false, false, '["llama2-70b-chat", "codellama-34b-instruct"]'),
('cerebras', 'Cerebras', 'Ultra-fast LLM inference', 'https://api.cerebras.ai/v1/', false, false, false, '["llama3.1-8b", "llama3.1-70b"]'),
('vertex_ai', 'Google Vertex AI', 'Google Cloud''s unified ML platform', '', true, true, true, '["gemini-pro", "gemini-pro-vision", "text-bison", "chat-bison", "textembedding-gecko"]'),
('watson', 'IBM watsonx', 'IBM''s enterprise AI platform', '', false, false, false, '["meta-llama/llama-2-70b-chat", "ibm/granite-13b-chat-v2"]'),
('custom', 'Custom Provider', 'Custom or self-hosted model endpoint', '', true, true, true, '[]');

-- Function to get provider info
CREATE OR REPLACE FUNCTION get_provider_info(p_provider TEXT)
RETURNS provider_configurations AS $$
DECLARE
  result provider_configurations;
BEGIN
  SELECT * INTO result FROM provider_configurations WHERE provider = p_provider AND active = true;
  RETURN result;
END;
$$ LANGUAGE plpgsql;