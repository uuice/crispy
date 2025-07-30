import { Request, Response, NextFunction } from 'express'
import { env } from '../config/env'

// Performance monitoring middleware
export const performanceMonitor = (req: Request, res: Response, next: NextFunction) => {
  const startTime = process.hrtime.bigint()

  // Add performance headers early (before response is sent)
  res.set('X-Response-Time', '0ms') // Placeholder, will be updated

  // Monitor response completion
  res.on('finish', () => {
    const endTime = process.hrtime.bigint()
    const duration = Number(endTime - startTime) / 1000000 // Convert to milliseconds

    // Log slow requests in development
    if (env['NODE_ENV'] === 'development' && duration > 1000) {
      console.warn(`🐌 Slow request: ${req.method} ${req.path} - ${duration.toFixed(2)}ms`)
    }

    // Log performance metrics in production
    if (env['NODE_ENV'] === 'production' && duration > 5000) {
      console.error(`🚨 Very slow request: ${req.method} ${req.path} - ${duration.toFixed(2)}ms`)
    }
  })

  // Update response time header before sending response
  const originalSend = res.send.bind(res)
  res.send = function (body: any) {
    const endTime = process.hrtime.bigint()
    const duration = Number(endTime - startTime) / 1000000
    res.set('X-Response-Time', `${duration.toFixed(2)}ms`)
    return originalSend(body)
  }

  next()
}

// Route-specific performance optimization
export const optimizeRoutePerformance = (req: Request, res: Response, next: NextFunction) => {
  // Only set headers if they haven't been sent yet
  if (res.headersSent) {
    return next()
  }

  // Optimize for static files
  if (req.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
    res.set('Cache-Control', 'public, max-age=31536000, immutable')
    res.set('Vary', 'Accept-Encoding')
  }

  // Optimize for API responses
  if (req.path.startsWith('/api/')) {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.set('Pragma', 'no-cache')
    res.set('Expires', '0')
  }

  // Optimize for HTML pages
  if (req.path.match(/\.html$/) || (!req.path.includes('.') && !req.path.startsWith('/api/'))) {
    res.set('Cache-Control', 'public, max-age=300') // 5 minutes for HTML pages
  }

  next()
}

// Memory usage monitoring
export const memoryMonitor = (req: Request, res: Response, next: NextFunction) => {
  const memUsage = process.memoryUsage()

  // Log memory usage if it's high
  if (memUsage.heapUsed > 100 * 1024 * 1024) {
    // 100MB
    console.warn(`⚠️ High memory usage: ${(memUsage.heapUsed / 1024 / 1024).toFixed(2)}MB`)
  }

  // Add memory info to response headers in development (only if headers not sent)
  if (env['NODE_ENV'] === 'development' && !res.headersSent) {
    res.set('X-Memory-Usage', `${(memUsage.heapUsed / 1024 / 1024).toFixed(2)}MB`)
  }

  next()
}
