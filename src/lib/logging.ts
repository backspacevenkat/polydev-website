interface LogData {
  level: 'info' | 'warn' | 'error' | 'debug'
  message: string
  timestamp: string
  userId?: string
  sessionId?: string
  metadata?: Record<string, unknown>
}

class Logger {
  private send(data: LogData) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${data.level.toUpperCase()}] ${data.message}`, data.metadata || '')
    }
    
    // Send to BetterStack in production
    if (process.env.NODE_ENV === 'production' && process.env.BETTERSTACK_LOGS_TOKEN) {
      fetch('https://in.logs.betterstack.com', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.BETTERSTACK_LOGS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          source: 'polydev-website'
        })
      }).catch(err => console.error('Failed to send log to BetterStack:', err))
    }
  }

  info(message: string, metadata?: Record<string, unknown>, userId?: string) {
    this.send({
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      userId,
      metadata
    })
  }

  warn(message: string, metadata?: Record<string, unknown>, userId?: string) {
    this.send({
      level: 'warn',
      message,
      timestamp: new Date().toISOString(),
      userId,
      metadata
    })
  }

  error(message: string, error?: Error, metadata?: Record<string, unknown>, userId?: string) {
    this.send({
      level: 'error',
      message,
      timestamp: new Date().toISOString(),
      userId,
      metadata: {
        ...metadata,
        error: error ? {
          name: error.name,
          message: error.message,
          stack: error.stack
        } : undefined
      }
    })
  }

  debug(message: string, metadata?: Record<string, unknown>, userId?: string) {
    this.send({
      level: 'debug',
      message,
      timestamp: new Date().toISOString(),
      userId,
      metadata
    })
  }

  trackLLMQuery(model: string, tokens: number, responseTime: number, userId?: string) {
    this.info('LLM query completed', {
      model,
      tokens,
      responseTime,
      type: 'llm_query'
    }, userId)
  }

  trackUserAction(action: string, userId: string, metadata?: Record<string, unknown>) {
    this.info(`User action: ${action}`, {
      ...metadata,
      type: 'user_action'
    }, userId)
  }
}

export const logger = new Logger()