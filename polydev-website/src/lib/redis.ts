import { Redis } from '@upstash/redis'

// Initialize Redis client
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Cache utility functions
export const cache = {
  // Store data with optional expiration (in seconds)
  async set(key: string, value: unknown, ttl?: number) {
    if (ttl) {
      return await redis.setex(key, ttl, JSON.stringify(value))
    }
    return await redis.set(key, JSON.stringify(value))
  },

  // Retrieve data from cache
  async get(key: string) {
    const value = await redis.get(key)
    if (!value) return null
    try {
      return JSON.parse(value as string)
    } catch {
      return value
    }
  },

  // Delete from cache
  async del(key: string) {
    return await redis.del(key)
  },

  // Check if key exists
  async exists(key: string) {
    return await redis.exists(key)
  },

  // Set expiration on existing key
  async expire(key: string, seconds: number) {
    return await redis.expire(key, seconds)
  },

  // Increment counter
  async incr(key: string) {
    return await redis.incr(key)
  },

  // Get multiple keys
  async mget(...keys: string[]) {
    return await redis.mget(...keys)
  },
}

// Session management utilities
export const sessions = {
  // Create/update session
  async set(sessionId: string, data: unknown, ttl = 3600) { // 1 hour default
    const key = `session:${sessionId}`
    return await cache.set(key, data, ttl)
  },

  // Get session data
  async get(sessionId: string) {
    const key = `session:${sessionId}`
    return await cache.get(key)
  },

  // Delete session
  async destroy(sessionId: string) {
    const key = `session:${sessionId}`
    return await cache.del(key)
  },

  // Extend session TTL
  async touch(sessionId: string, ttl = 3600) {
    const key = `session:${sessionId}`
    return await cache.expire(key, ttl)
  },
}

// Query caching utilities
export const queryCache = {
  // Cache query results
  async set(queryHash: string, result: unknown, ttl = 300) { // 5 minutes default
    const key = `query:${queryHash}`
    return await cache.set(key, result, ttl)
  },

  // Get cached query result
  async get(queryHash: string) {
    const key = `query:${queryHash}`
    return await cache.get(key)
  },

  // Delete cached query
  async invalidate(queryHash: string) {
    const key = `query:${queryHash}`
    return await cache.del(key)
  },
}

// Rate limiting utilities
export const rateLimiting = {
  // Check and increment rate limit counter
  async check(identifier: string, limit: number, window: number) {
    const key = `rate_limit:${identifier}:${Math.floor(Date.now() / (window * 1000))}`
    const current = await cache.incr(key)
    
    if (current === 1) {
      await cache.expire(key, window)
    }
    
    return {
      count: current,
      remaining: Math.max(0, limit - current),
      exceeded: current > limit,
    }
  },
}

// Usage analytics caching
export const analytics = {
  // Cache user usage stats
  async setUserStats(userId: string, stats: unknown, ttl = 600) { // 10 minutes
    const key = `user_stats:${userId}`
    return await cache.set(key, stats, ttl)
  },

  // Get cached user stats
  async getUserStats(userId: string) {
    const key = `user_stats:${userId}`
    return await cache.get(key)
  },

  // Increment usage counter
  async incrementUsage(userId: string, model: string) {
    const key = `usage:${userId}:${model}:${new Date().toISOString().slice(0, 10)}`
    return await cache.incr(key)
  },
}