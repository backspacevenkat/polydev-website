# Apply Database Schema to Fix Polydev Issues

The main issue is that your Supabase database is missing the required tables and columns. You need to apply the schema we created.

## Steps to Fix Database Issues:

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/projects
2. Navigate to **SQL Editor**
3. Copy the entire content from `supabase/schema.sql` 
4. Paste it into the SQL Editor
5. Click **Run** to execute the schema

### Option 2: Using Supabase CLI

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link your project (replace with your project reference)
supabase link --project-ref oxhutuxkthdxvciytwmb

# Apply the schema
supabase db push
```

### Option 3: Manual Table Creation

If you prefer to create tables individually, here are the key missing tables:

#### 1. Add company column to profiles table:
```sql
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company TEXT;
```

#### 2. Create user_api_keys table:
```sql
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
```

#### 3. Enable RLS and create policies:
```sql
ALTER TABLE public.user_api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own api keys" ON public.user_api_keys FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own api keys" ON public.user_api_keys FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own api keys" ON public.user_api_keys FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own api keys" ON public.user_api_keys FOR DELETE USING (auth.uid() = user_id);
```

## Current Errors That Will Be Fixed:

- ❌ `Could not find the table 'public.user_api_keys' in the schema cache`
- ❌ `Could not find the 'company' column of 'profiles' in the schema cache`  
- ❌ `POST https://oxhutuxkthdxvciytwmb.supabase.co/rest/v1/profiles 400 (Bad Request)`
- ❌ `GET https://oxhutuxkthdxvciytwmb.supabase.co/rest/v1/user_api_keys 404 (Not Found)`

## After Applying Schema:

Your website should work properly with:
- ✅ User profiles with company field
- ✅ API key management functionality  
- ✅ Dashboard statistics and data
- ✅ Settings page with all fields working

**⚠️ Important**: You must apply this schema to your Supabase database for the website to work correctly!