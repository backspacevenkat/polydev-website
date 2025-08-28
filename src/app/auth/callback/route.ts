import { NextResponse } from 'next/server'
import { createClient } from '../../utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Always use the site URL from environment or fallback to origin
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || origin
      const redirectUrl = `${siteUrl}${next}`
      
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Return the user to an error page with instructions
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || origin
  return NextResponse.redirect(`${siteUrl}/auth/auth-code-error`)
}