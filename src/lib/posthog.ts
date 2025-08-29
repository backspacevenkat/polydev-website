import posthog from 'posthog-js'

let isInitialized = false

export function initPostHog() {
  if (typeof window !== 'undefined' && !isInitialized) {
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
    const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST

    if (posthogKey && posthogHost) {
      try {
        posthog.init(posthogKey, {
          api_host: posthogHost,
          person_profiles: 'identified_only',
          capture_pageview: false,
          capture_pageleave: true,
          loaded: (posthog) => {
            if (process.env.NODE_ENV === 'development') {
              console.log('PostHog loaded successfully')
            }
          },
          // Disable in development to avoid console errors
          disable_session_recording: process.env.NODE_ENV === 'development',
        })
        isInitialized = true
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('PostHog initialization failed:', error)
        }
      }
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.warn('PostHog keys missing - analytics disabled')
      }
    }
  }
}

export const analytics = {
  pageView: () => {
    if (typeof window !== 'undefined' && posthog.__loaded) {
      posthog.capture('$pageview')
    }
  },

  identify: (userId: string, traits?: Record<string, unknown>) => {
    if (typeof window !== 'undefined' && posthog.__loaded) {
      posthog.identify(userId, traits)
    }
  },

  track: (eventName: string, properties?: Record<string, unknown>) => {
    if (typeof window !== 'undefined' && posthog.__loaded) {
      posthog.capture(eventName, properties)
    }
  },

  trackLLMQuery: (model: string, tokens: number, responseTime: number) => {
    analytics.track('llm_query', {
      model,
      tokens,
      response_time: responseTime,
      timestamp: new Date().toISOString(),
    })
  }
}