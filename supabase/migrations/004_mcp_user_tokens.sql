-- Create MCP user tokens table for agent authentication
CREATE TABLE mcp_user_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  token_name TEXT NOT NULL,
  token_hash TEXT NOT NULL,
  token_preview TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  rate_limit_tier TEXT DEFAULT 'standard' CHECK (rate_limit_tier IN ('standard', 'premium', 'enterprise')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  last_used_at TIMESTAMPTZ
);

-- Create unique index on token hash for fast lookups
CREATE UNIQUE INDEX mcp_user_tokens_hash_idx ON mcp_user_tokens(token_hash);

-- Create index for user queries
CREATE INDEX mcp_user_tokens_user_id_idx ON mcp_user_tokens(user_id);

-- Enable RLS
ALTER TABLE mcp_user_tokens ENABLE ROW LEVEL SECURITY;

-- Users can only see their own tokens
CREATE POLICY "Users can view their own MCP tokens" ON mcp_user_tokens
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own MCP tokens" ON mcp_user_tokens
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own MCP tokens" ON mcp_user_tokens
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own MCP tokens" ON mcp_user_tokens
  FOR DELETE USING (auth.uid() = user_id);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_mcp_token_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_mcp_token_timestamp
  BEFORE UPDATE ON mcp_user_tokens
  FOR EACH ROW
  EXECUTE FUNCTION update_mcp_token_updated_at();