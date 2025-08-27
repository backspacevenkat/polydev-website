import { createBrowserClient, createServerClient } from './supabase'
import { redirect } from 'next/navigation'

export async function signInWithEmail(email: string, password: string) {
  const supabase = createBrowserClient()
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data
}

export async function signUpWithEmail(email: string, password: string, fullName: string) {
  const supabase = createBrowserClient()
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data
}

export async function signInWithGithub() {
  const supabase = createBrowserClient()
  
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${location.origin}/auth/callback`,
    },
  })
  
  if (error) {
    throw new Error(error.message)
  }
}

export async function signInWithGoogle() {
  const supabase = createBrowserClient()
  
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${location.origin}/auth/callback`,
    },
  })
  
  if (error) {
    throw new Error(error.message)
  }
}

export async function signOut() {
  const supabase = createBrowserClient()
  
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    throw new Error(error.message)
  }
}

export async function getUser() {
  const supabase = createServerClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error) {
    return null
  }
  
  return user
}

export async function requireAuth() {
  const user = await getUser()
  
  if (!user) {
    redirect('/auth')
  }
  
  return user
}

export async function createUserProfile(userId: string, email: string, fullName?: string) {
  const supabase = createServerClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      email,
      full_name: fullName || null,
      subscription_tier: 'free',
      monthly_queries: 50,
      queries_used: 0,
    })
    .select()
    .single()
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data
}

export async function getUserProfile(userId: string) {
  const supabase = createServerClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) {
    return null
  }
  
  return data
}