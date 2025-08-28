import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { logger, loggerUtils } from '@/lib/logging'

export async function middleware(request: NextRequest) {
  const requestId = loggerUtils.generateRequestId()
  const start = Date.now()
  
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      logger.warn('Auth error in middleware', { 
        error: error.message,
        path: request.nextUrl.pathname 
      }, { requestId })
    }

    const isAuthPage = request.nextUrl.pathname.startsWith('/auth')
    const isProtectedPage = request.nextUrl.pathname.startsWith('/dashboard') || 
                           request.nextUrl.pathname.startsWith('/api/protected')

    if (isProtectedPage && !user) {
      logger.info('Redirecting unauthenticated user', {
        from: request.nextUrl.pathname,
        to: '/auth/signin'
      }, { requestId })
      
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }

    if (isAuthPage && user) {
      logger.info('Redirecting authenticated user away from auth page', {
        from: request.nextUrl.pathname,
        to: '/dashboard'
      }, { userId: user.id, requestId })
      
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    const duration = Date.now() - start
    logger.apiRequest(
      request.method,
      request.nextUrl.pathname,
      response.status,
      duration,
      { userId: user?.id, requestId }
    )

  } catch (error) {
    const duration = Date.now() - start
    logger.error('Middleware error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      path: request.nextUrl.pathname,
      duration_ms: duration
    }, { requestId })
  }

  response.headers.set('x-request-id', requestId)
  
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}