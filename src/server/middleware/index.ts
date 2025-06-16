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
  app.use(
    helmet({
      contentSecurityPolicy: {
        // useDefaults: false,
        // prettier-ignore
        directives: {
          // 'default-src': ['\'self\''],
          // 'base-uri': ['\'self\''],
          // 'block-all-mixed-content': [],
          // 'font-src': ['\'self\'', 'https:', 'data:'],
          // 'form-action': ['\'self\''],
          // 'frame-ancestors': ['\'self\''],
          'img-src': ['\'self\'', '*', 'data:', 'https://*', 'http://*'],
          // 'object-src':  ['\'none\''],
          // 'script-src': ['\'self\'', '\'unsafe-inline\''],
          // 'script-src-attr': ['\'none\''],
          // 'worker-src': ['self', 'blob:'],
          // 'style-src': ['\'self\'', 'https:', '\'unsafe-inline\''],
          // 'upgrade-insecure-request': null,

          scriptSrc: ['\'self\'', '\'unsafe-inline\'', 'https://unpkg.com'],
          scriptSrcElem: ['\'self\'', '\'unsafe-inline\'', 'https://unpkg.com'],
          styleSrc: ['\'self\'', 'https:', '\'unsafe-inline\'', 'https://unpkg.com'],
          workerSrc: ['self', 'blob:'],
          upgradeInsecureRequests: null
        }
      }
    })
  )
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
