import helmet from 'helmet'
import { Express } from 'express'
import { jsonParser, urlencodedParser } from './body-parser'
import { requestLogger } from './request-logger'
import { errorHandler } from './error-handler'
import { corsMiddleware } from './cors'

// Apply all middleware
export const applyMiddleware = (app: Express) => {
  // 1. Basic middleware (execute first)
  app.use(requestLogger)
  app.use(corsMiddleware)
  app.use(helmet())
  app.use(jsonParser)
  app.use(urlencodedParser)

  // // 2. API routes (before Angular routes)
  // // Apply API authentication middleware to all /api routes except /api/login
  // app.use('/api', (req, res, next) => {
  //   if (req.path === '/login' || req.path === '/login/') {
  //     return next()
  //   }
  //   return jwtMiddleware(req, res, next)
  // })
  // // app.use('/api', apiRoutes) // Add API routes here if needed

  // 3. Error handler (execute last)
  app.use(errorHandler)
}

// Export all middleware for individual use
export * from './request-logger'
export * from './error-handler'
export * from './cors'
export * from './body-parser'
export * from './not-found'
export * from './angular-handler'
export * from './jwt'
export * from './api-auth'
