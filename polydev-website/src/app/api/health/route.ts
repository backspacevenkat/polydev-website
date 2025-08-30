import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logging'
import { redis } from '@/lib/redis'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const start = Date.now()
  const requestId = request.headers.get('x-request-id') || 'health-check'
  
  try {
    const checks = await Promise.allSettled([
      // Database health check
      supabase.from('profiles').select('count', { count: 'exact', head: true }).limit(1),
      
      // Redis health check
      redis.ping(),
      
      // Memory usage
      Promise.resolve({
        used: process.memoryUsage().heapUsed,
        total: process.memoryUsage().heapTotal,
        external: process.memoryUsage().external
      })
    ])

    const [dbCheck, redisCheck, memoryCheck] = checks
    
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: memoryCheck.status === 'fulfilled' ? memoryCheck.value : null,
      services: {
        database: dbCheck.status === 'fulfilled' ? 'healthy' : 'unhealthy',
        redis: redisCheck.status === 'fulfilled' ? 'healthy' : 'unhealthy'
      },
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    }

    // Log any unhealthy services
    if (dbCheck.status === 'rejected') {
      logger.error('Database health check failed', {
        error: dbCheck.reason?.message || 'Unknown database error'
      }, { requestId })
      health.status = 'degraded'
    }

    if (redisCheck.status === 'rejected') {
      logger.error('Redis health check failed', {
        error: redisCheck.reason?.message || 'Unknown Redis error'
      }, { requestId })
      health.status = 'degraded'
    }

    const duration = Date.now() - start
    logger.info('Health check completed', {
      status: health.status,
      duration_ms: duration,
      services: health.services
    }, { requestId })

    const statusCode = health.status === 'healthy' ? 200 : 503
    
    return NextResponse.json(health, { 
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })

  } catch (error) {
    const duration = Date.now() - start
    logger.error('Health check endpoint error', {
      error_message: error instanceof Error ? error.message : 'Unknown error',
      duration_ms: duration
    }, { requestId })

    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed'
    }, { 
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
  }
}