import { Elysia } from 'elysia'
import { env } from '../config/env'

export const requestLoggerPlugin = new Elysia({ name: 'request-logger-plugin' })
  .onRequest(({ request, set }) => {
    const startTime = Date.now()

    // Log request information
    if (env['NODE_ENV'] === 'development') {
      const url = new URL(request.url)
      console.log(`[${new Date().toISOString()}] ${request.method} ${url.pathname}`)
      console.log(`Headers:`, request.headers)
      console.log(`Query Parameters:`, url.search)
      console.log(`Content-Type:`, request.headers.get('Content-Type'))
      console.log(`User-Agent:`, request.headers.get('User-Agent'))
    }

    set.headers['X-Request-Time'] = `${startTime}ms`
  })
  .onAfterHandle(({ request, set }) => {
    const duration =
      Date.now() -
      (set.headers['X-Request-Time']
        ? parseInt(set.headers['X-Request-Time'] as string)
        : Date.now())

    // Add response time header
    set.headers['X-Response-Time'] = `${duration}ms`

    // Log response information in development
    if (env['NODE_ENV'] === 'development') {
      const url = new URL(request.url)
      console.log(`[${new Date().toISOString()}] ${request.method} ${url.pathname} - ${duration}ms`)
    }
  })
