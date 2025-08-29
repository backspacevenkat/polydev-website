-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table with company column
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    company TEXT, -- Added company column
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_api_keys table
CREATE TABLE IF NOT EXISTS public.user_api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    provider TEXT NOT NULL,
    key_name TEXT NOT NULL,
    encrypted_key TEXT NOT NULL,
    key_preview TEXT NOT NULL,
    api_base TEXT,
    default_model TEXT,
    monthly_budget NUMERIC(10,2),
    current_usage NUMERIC(10,2) DEFAULT 0,
    rate_limit_rpm INTEGER DEFAULT 60,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_used_at TIMESTAMPTZ
);

-- Create provider_configurations table
CREATE TABLE IF NOT EXISTS public.provider_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    description TEXT,
    icon_url TEXT,
    default_api_base TEXT,
    supports_chat BOOLEAN DEFAULT true,
    supports_completion BOOLEAN DEFAULT true,
    supports_embedding BOOLEAN DEFAULT false,
    supports_function_calling BOOLEAN DEFAULT false,
    supports_vision BOOLEAN DEFAULT false,
    available_models TEXT[] DEFAULT '{}',
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default provider configurations
INSERT INTO public.provider_configurations (
    provider, display_name, description, default_api_base, 
    supports_chat, supports_completion, supports_embedding, 
    supports_function_calling, supports_vision, available_models
) VALUES 
    ('openai', 'OpenAI', 'GPT models - versatile and widely adopted', 'https://api.openai.com/v1', 
     true, true, true, true, true, 
     ARRAY['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo', 'text-embedding-3-large']),
    
    ('anthropic', 'Anthropic', 'Claude models - excellent for reasoning and code', 'https://api.anthropic.com', 
     true, true, false, true, true, 
     ARRAY['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022', 'claude-3-opus-20240229']),
     
    ('gemini', 'Google Gemini', 'Google''s latest AI models with large context windows', 'https://generativelanguage.googleapis.com/v1beta', 
     true, true, true, true, true, 
     ARRAY['gemini-1.5-pro', 'gemini-1.5-flash', 'text-embedding-004']),
     
    ('openrouter', 'OpenRouter', 'Access to 100+ models through one API', 'https://openrouter.ai/api/v1', 
     true, true, false, true, false, 
     ARRAY['meta-llama/llama-3.2-90b-vision-instruct', 'anthropic/claude-3.5-sonnet', 'openai/gpt-4o']),
     
    ('groq', 'Groq', 'Ultra-fast inference for open-source models', 'https://api.groq.com/openai/v1', 
     true, true, false, true, false, 
     ARRAY['llama-3.1-70b-versatile', 'mixtral-8x7b-32768', 'gemma2-9b-it']),
     
    ('perplexity', 'Perplexity', 'AI search and reasoning models', 'https://api.perplexity.ai', 
     true, true, false, false, false, 
     ARRAY['llama-3.1-sonar-large-128k-online', 'llama-3.1-sonar-small-128k-online']),
     
    ('deepseek', 'DeepSeek', 'Advanced reasoning models', 'https://api.deepseek.com', 
     true, true, false, false, false, 
     ARRAY['deepseek-chat', 'deepseek-coder']),
     
    ('mistral', 'Mistral AI', 'European AI models with strong performance', 'https://api.mistral.ai/v1', 
     true, true, true, true, false, 
     ARRAY['mistral-large-latest', 'mistral-medium-latest', 'mistral-embed'])
ON CONFLICT (provider) DO NOTHING;

-- Create CLI provider configurations table
CREATE TABLE IF NOT EXISTS public.cli_provider_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    provider TEXT NOT NULL,
    custom_path TEXT,
    enabled BOOLEAN DEFAULT false,
    last_checked_at TIMESTAMPTZ,
    status TEXT DEFAULT 'unchecked', -- unchecked, available, unavailable
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, provider)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_api_keys_user_id ON public.user_api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_user_api_keys_provider ON public.user_api_keys(provider);
CREATE INDEX IF NOT EXISTS idx_cli_provider_configurations_user_id ON public.cli_provider_configurations(user_id);

-- Create function to handle updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER user_api_keys_updated_at
    BEFORE UPDATE ON public.user_api_keys
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER provider_configurations_updated_at
    BEFORE UPDATE ON public.provider_configurations
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER cli_provider_configurations_updated_at
    BEFORE UPDATE ON public.cli_provider_configurations
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Row Level Security (RLS) policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cli_provider_configurations ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- User API keys policies  
CREATE POLICY "Users can view own api keys" ON public.user_api_keys FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own api keys" ON public.user_api_keys FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own api keys" ON public.user_api_keys FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own api keys" ON public.user_api_keys FOR DELETE USING (auth.uid() = user_id);

-- CLI provider configurations policies
CREATE POLICY "Users can view own cli configs" ON public.cli_provider_configurations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own cli configs" ON public.cli_provider_configurations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cli configs" ON public.cli_provider_configurations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own cli configs" ON public.cli_provider_configurations FOR DELETE USING (auth.uid() = user_id);

-- Provider configurations is public read-only
CREATE POLICY "Anyone can view provider configurations" ON public.provider_configurations FOR SELECT TO public USING (active = true);

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id, 
        NEW.email, 
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();