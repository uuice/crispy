import { Request, Response, NextFunction } from 'express'
import { env } from '../config/env'

// Request logger middleware
// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now()

  // Log request information
  if (env['NODE_ENV'] === 'development') {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
    console.log(`Headers:`, req.headers)
    console.log(`Query Parameters:`, req.query)
    console.log(`Body:`, req.body)
    console.log(`Content-Type:`, req.get('Content-Type'))
    console.log(`User-Agent:`, req.get('User-Agent'))
    console.log(`IP Address:`, req.ip || req.connection.remoteAddress)
  }

  // Log response information after request completes
  res.on('finish', () => {
    const duration = Date.now() - startTime
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`
    )
  })

  next()
}
