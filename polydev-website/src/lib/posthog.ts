'use client'

import posthog from 'posthog-js'

export function initPostHog() {
  if (typeof window !== 'undefined' && !posthog.__loaded) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
      person_profiles: 'identified_only', // Only create person profiles when users are identified
      capture_pageview: false, // We'll handle this manually
      capture_pageleave: true,
      
      // Privacy settings
      respect_dnt: true,
      opt_out_capturing_by_default: false,
      
      // Performance settings
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('PostHog loaded')
        }
      }
    })
  }
}

// Analytics utility functions
export const analytics = {
  // Track page views
  pageView: () => {
    if (typeof window !== 'undefined') {
      posthog.capture('$pageview')
    }
  },

  // Track user events
  track: (event: string, properties?: Record<string, any>) => {
    if (typeof window !== 'undefined') {
      posthog.capture(event, properties)
    }
  },

  // Identify users
  identify: (userId: string, properties?: Record<string, any>) => {
    if (typeof window !== 'undefined') {
      posthog.identify(userId, properties)
    }
  },

  // Reset user identity (on logout)
  reset: () => {
    if (typeof window !== 'undefined') {
      posthog.reset()
    }
  },

  // Set user properties
  setPersonProperties: (properties: Record<string, any>) => {
    if (typeof window !== 'undefined') {
      posthog.setPersonProperties(properties)
    }
  },

  // Track sign up
  signUp: (method?: string, properties?: Record<string, any>) => {
    analytics.track('user_signed_up', {
      method,
      ...properties
    })
  },

  // Track sign in
  signIn: (method?: string, properties?: Record<string, any>) => {
    analytics.track('user_signed_in', {
      method,
      ...properties
    })
  },

  // Track query submission
  querySubmitted: (model: string, provider: string, properties?: Record<string, any>) => {
    analytics.track('query_submitted', {
      model,
      provider,
      ...properties
    })
  },

  // Track query completion
  queryCompleted: (model: string, provider: string, responseTime: number, tokens: number, cost: number) => {
    analytics.track('query_completed', {
      model,
      provider,
      response_time_ms: responseTime,
      tokens,
      cost_usd: cost
    })
  },

  // Track API key added
  apiKeyAdded: (provider: string) => {
    analytics.track('api_key_added', {
      provider
    })
  },

  // Track subscription changes
  subscriptionChanged: (from: string, to: string) => {
    analytics.track('subscription_changed', {
      from_tier: from,
      to_tier: to
    })
  },

  // Track feature usage
  featureUsed: (feature: string, properties?: Record<string, any>) => {
    analytics.track('feature_used', {
      feature_name: feature,
      ...properties
    })
  },

  // Track errors
  error: (error: string, context?: Record<string, any>) => {
    analytics.track('error_occurred', {
      error_message: error,
      ...context
    })
  },

  // Track performance metrics
  performance: (metric: string, value: number, properties?: Record<string, any>) => {
    analytics.track('performance_metric', {
      metric_name: metric,
      value,
      ...properties
    })
  }
}

export { posthog }