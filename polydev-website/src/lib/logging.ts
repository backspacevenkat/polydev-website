interface LogLevel {
  ERROR: 'error'
  WARN: 'warn'
  INFO: 'info'
  DEBUG: 'debug'
}

interface LogEntry {
  message: string
  level: keyof LogLevel
  timestamp?: string
  meta?: Record<string, unknown>
  userId?: string
  sessionId?: string
  requestId?: string
}

class BetterStackLogger {
  private token: string
  private host: string
  private isClient: boolean

  constructor() {
    this.token = process.env.BETTER_STACK_TOKEN || ''
    this.host = process.env.BETTER_STACK_HOST || ''
    this.isClient = typeof window !== 'undefined'
  }

  private async sendLog(entry: LogEntry): Promise<void> {
    if (!this.token || !this.host || this.isClient) {
      console.log('[BetterStack]', entry)
      return
    }

    try {
      const logData = {
        message: entry.message,
        level: entry.level,
        dt: entry.timestamp || new Date().toISOString(),
        service: 'polydev-website',
        ...entry.meta,
        ...(entry.userId && { user_id: entry.userId }),
        ...(entry.sessionId && { session_id: entry.sessionId }),
        ...(entry.requestId && { request_id: entry.requestId })
      }

      const response = await fetch(`https://${this.host}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(logData)
      })

      if (!response.ok && response.status !== 202) {
        console.error('Failed to send log to BetterStack:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Error sending log to BetterStack:', error)
    }
  }

  error(message: string, meta?: Record<string, unknown>, context?: { userId?: string, sessionId?: string, requestId?: string }): void {
    this.sendLog({
      message,
      level: 'ERROR',
      meta,
      ...context
    })
  }

  warn(message: string, meta?: Record<string, unknown>, context?: { userId?: string, sessionId?: string, requestId?: string }): void {
    this.sendLog({
      message,
      level: 'WARN',
      meta,
      ...context
    })
  }

  info(message: string, meta?: Record<string, unknown>, context?: { userId?: string, sessionId?: string, requestId?: string }): void {
    this.sendLog({
      message,
      level: 'INFO',
      meta,
      ...context
    })
  }

  debug(message: string, meta?: Record<string, unknown>, context?: { userId?: string, sessionId?: string, requestId?: string }): void {
    this.sendLog({
      message,
      level: 'DEBUG',
      meta,
      ...context
    })
  }

  userAction(action: string, userId: string, meta?: Record<string, unknown>): void {
    this.info(`User action: ${action}`, {
      action_type: 'user_action',
      ...meta
    }, { userId })
  }

  apiRequest(method: string, endpoint: string, statusCode: number, duration: number, context?: { userId?: string, sessionId?: string, requestId?: string }): void {
    this.info(`API ${method} ${endpoint} - ${statusCode} (${duration}ms)`, {
      method,
      endpoint,
      status_code: statusCode,
      duration_ms: duration,
      request_type: 'api'
    }, context)
  }

  performanceMetric(metric: string, value: number, unit: string, meta?: Record<string, unknown>): void {
    this.info(`Performance: ${metric} = ${value}${unit}`, {
      metric_name: metric,
      metric_value: value,
      metric_unit: unit,
      metric_type: 'performance',
      ...meta
    })
  }

  authEvent(event: string, userId?: string, meta?: Record<string, unknown>): void {
    this.info(`Auth event: ${event}`, {
      event_type: 'auth',
      ...meta
    }, { userId })
  }

  llmQuery(model: string, provider: string, tokens: number, cost: number, duration: number, userId?: string): void {
    this.info(`LLM Query: ${provider}/${model}`, {
      model,
      provider,
      tokens_used: tokens,
      cost_usd: cost,
      duration_ms: duration,
      query_type: 'llm'
    }, { userId })
  }
}

export const logger = new BetterStackLogger()

export const loggerUtils = {
  withContext: (userId?: string, sessionId?: string, requestId?: string) => ({
    error: (message: string, meta?: Record<string, unknown>) => logger.error(message, meta, { userId, sessionId, requestId }),
    warn: (message: string, meta?: Record<string, unknown>) => logger.warn(message, meta, { userId, sessionId, requestId }),
    info: (message: string, meta?: Record<string, unknown>) => logger.info(message, meta, { userId, sessionId, requestId }),
    debug: (message: string, meta?: Record<string, unknown>) => logger.debug(message, meta, { userId, sessionId, requestId })
  }),

  generateRequestId: (): string => {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  },

  measurePerformance: <T>(fn: () => Promise<T>, name: string): Promise<T> => {
    const start = Date.now()
    return fn().then(result => {
      const duration = Date.now() - start
      logger.performanceMetric(name, duration, 'ms')
      return result
    }).catch(error => {
      const duration = Date.now() - start
      logger.error(`Performance measurement failed for ${name}`, {
        duration_ms: duration,
        error: error.message
      })
      throw error
    })
  }
}