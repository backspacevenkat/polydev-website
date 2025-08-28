-- Create user API keys table for BYO mode
CREATE TABLE user_api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('openai', 'anthropic', 'google')),
  encrypted_key TEXT NOT NULL,
  key_name TEXT, -- Optional friendly name
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(user_id, provider, key_name)
);

-- Create index for efficient lookups
CREATE INDEX idx_user_api_keys_user_provider ON user_api_keys(user_id, provider) WHERE active = true;

-- Create I/O logging table for perspectives
CREATE TABLE perspectives_io_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  input_prompt TEXT NOT NULL,
  output_data JSONB NOT NULL,
  tokens_used INTEGER,
  latency_ms INTEGER,
  models_used TEXT[], -- Array of model names
  mode TEXT CHECK (mode IN ('managed', 'byo')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for efficient queries
CREATE INDEX idx_perspectives_io_log_user_id ON perspectives_io_log(user_id);
CREATE INDEX idx_perspectives_io_log_created_at ON perspectives_io_log(created_at DESC);

-- Create project memory table for storing TF-IDF snippets
CREATE TABLE project_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  root_path TEXT NOT NULL,
  file_path TEXT NOT NULL,
  content_snippet TEXT NOT NULL,
  tfidf_vector JSONB, -- Store TF-IDF vector as JSON
  last_updated TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(user_id, project_name, file_path)
);

-- Create indexes for project memory
CREATE INDEX idx_project_memory_user_project ON project_memory(user_id, project_name);
CREATE INDEX idx_project_memory_last_updated ON project_memory(last_updated DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for user_api_keys
CREATE TRIGGER update_user_api_keys_updated_at 
  BEFORE UPDATE ON user_api_keys 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE user_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE perspectives_io_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_memory ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can only see their own API keys" ON user_api_keys
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only see their own I/O logs" ON perspectives_io_log
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only see their own project memory" ON project_memory
  FOR ALL USING (auth.uid() = user_id);