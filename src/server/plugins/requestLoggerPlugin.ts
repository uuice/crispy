import { Elysia } from 'elysia'
import { env } from '../config/env'

export const requestLoggerPlugin = new Elysia({ name: 'request-logger-plugin' }).onRequest(
  ({ request, set }) => {
    // Log request information
    if (env['NODE_ENV'] === 'development') {
      const url = new URL(request.url)
      console.log(`[${new Date().toISOString()}] ${request.method} ${url.pathname}`)
      console.log(`Headers:`, request.headers)
      console.log(`Query Parameters:`, url.search)
      console.log(`Content-Type:`, request.headers.get('Content-Type'))
      console.log(`User-Agent:`, request.headers.get('User-Agent'))
    }
  }
)
