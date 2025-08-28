import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export const cache = {
  async get<T>(key: string): Promise<T | null> {
    try {
      return await redis.get(key)
    } catch (error) {
      console.error('Redis GET error:', error)
      return null
    }
  },

  async set(key: string, value: unknown, ttl?: number): Promise<boolean> {
    try {
      if (ttl) {
        await redis.setex(key, ttl, JSON.stringify(value))
      } else {
        await redis.set(key, JSON.stringify(value))
      }
      return true
    } catch (error) {
      console.error('Redis SET error:', error)
      return false
    }
  },

  async delete(key: string): Promise<boolean> {
    try {
      await redis.del(key)
      return true
    } catch (error) {
      console.error('Redis DELETE error:', error)
      return false
    }
  },

  async rateLimit(key: string, limit: number, window: number): Promise<{ allowed: boolean; remaining: number }> {
    try {
      const current = await redis.incr(key)
      if (current === 1) {
        await redis.expire(key, window)
      }
      
      const remaining = Math.max(0, limit - current)
      return {
        allowed: current <= limit,
        remaining
      }
    } catch (error) {
      console.error('Redis rate limit error:', error)
      return { allowed: true, remaining: limit }
    }
  }
}