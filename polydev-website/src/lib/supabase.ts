import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          subscription_tier: 'free' | 'pro' | 'enterprise'
          monthly_queries: number
          queries_used: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_tier?: 'free' | 'pro' | 'enterprise'
          monthly_queries?: number
          queries_used?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_tier?: 'free' | 'pro' | 'enterprise'
          monthly_queries?: number
          queries_used?: number
          updated_at?: string
        }
      }
      api_keys: {
        Row: {
          id: string
          user_id: string
          name: string
          key_preview: string
          key_hash: string
          provider: 'openrouter' | 'openai' | 'anthropic' | 'google'
          created_at: string
          last_used: string | null
          is_active: boolean
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          key_preview: string
          key_hash: string
          provider: 'openrouter' | 'openai' | 'anthropic' | 'google'
          created_at?: string
          last_used?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          key_preview?: string
          key_hash?: string
          provider?: 'openrouter' | 'openai' | 'anthropic' | 'google'
          last_used?: string | null
          is_active?: boolean
        }
      }
      usage_analytics: {
        Row: {
          id: string
          user_id: string
          model: string
          provider: string
          tokens_used: number
          cost: number
          query_time: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          model: string
          provider: string
          tokens_used: number
          cost: number
          query_time: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          model?: string
          provider?: string
          tokens_used?: number
          cost?: number
          query_time?: number
        }
      }
    }
  }
}