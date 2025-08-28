import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      api_keys: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          key_hash: string
          key_preview: string
          last_used_at: string | null
          name: string
          provider: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          key_hash: string
          key_preview: string
          last_used_at?: string | null
          name: string
          provider: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          key_hash?: string
          key_preview?: string
          last_used_at?: string | null
          name?: string
          provider?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          cost_usd: number | null
          created_at: string | null
          id: string
          role: string
          session_id: string
          tokens: number | null
        }
        Insert: {
          content: string
          cost_usd?: number | null
          created_at?: string | null
          id?: string
          role: string
          session_id: string
          tokens?: number | null
        }
        Update: {
          content?: string
          cost_usd?: number | null
          created_at?: string | null
          id?: string
          role?: string
          session_id?: string
          tokens?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          api_keys_count: number
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          monthly_queries: number
          queries_used: number
          subscription_tier: string
          updated_at: string | null
        }
        Insert: {
          api_keys_count?: number
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          monthly_queries?: number
          queries_used?: number
          subscription_tier?: string
          updated_at?: string | null
        }
        Update: {
          api_keys_count?: number
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          monthly_queries?: number
          queries_used?: number
          subscription_tier?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      queries: {
        Row: {
          completion_tokens: number
          cost_usd: number | null
          created_at: string | null
          error_message: string | null
          id: string
          model: string
          prompt_tokens: number
          provider: string
          response_time_ms: number | null
          status: string
          total_tokens: number
          user_id: string
        }
        Insert: {
          completion_tokens?: number
          cost_usd?: number | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          model: string
          prompt_tokens?: number
          provider: string
          response_time_ms?: number | null
          status?: string
          total_tokens?: number
          user_id: string
        }
        Update: {
          completion_tokens?: number
          cost_usd?: number | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          model?: string
          prompt_tokens?: number
          provider?: string
          response_time_ms?: number | null
          status?: string
          total_tokens?: number
          user_id?: string
        }
        Relationships: []
      }
      sessions: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          last_activity_at: string | null
          message_count: number | null
          model: string
          name: string
          provider: string
          system_prompt: string | null
          total_cost_usd: number | null
          total_tokens: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          last_activity_at?: string | null
          message_count?: number | null
          model: string
          name: string
          provider: string
          system_prompt?: string | null
          total_cost_usd?: number | null
          total_tokens?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          last_activity_at?: string | null
          message_count?: number | null
          model?: string
          name?: string
          provider?: string
          system_prompt?: string | null
          total_cost_usd?: number | null
          total_tokens?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}