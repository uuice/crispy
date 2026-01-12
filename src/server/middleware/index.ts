import { Express } from 'express'
import { env } from '../config/env'
import { bodyParserErrorHandler, jsonParser, urlencodedParser } from './body-parser'
import { requestLogger } from './request-logger'
import { corsMiddleware } from './cors'

// Optimized middleware application with better performance and security
export const applyMiddleware = (app: Express) => {
  // 1. Security middleware (first line of defense)
  app.use(corsMiddleware)
  // if (env.isProduction()) {
  //   app.use(helmet())
  // }
  // app.use(
  //   helmet({
  //     contentSecurityPolicy: {
  //       // useDefaults: false,
  //       // prettier-ignore
  //       directives: {
  //         // 'default-src': ['\'self\''],
  //         // 'base-uri': ['\'self\''],
  //         // 'block-all-mixed-content': [],
  //         // 'font-src': ['\'self\'', 'https:', 'data:'],
  //         // 'form-action': ['\'self\''],
  //         // 'frame-ancestors': ['\'self\''],
  //         'img-src': ['\'self\'', '*', 'data:', 'https://*', 'http://*'],
  //         // 'object-src':  ['\'none\''],
  //         // 'script-src': ['\'self\'', '\'unsafe-inline\''],
  //         // 'script-src-attr': ['\'none\''],
  //         // 'worker-src': ['self', 'blob:'],
  //         // 'style-src': ['\'self\'', 'https:', '\'unsafe-inline\''],
  //         // 'upgrade-insecure-request': null,

  //         scriptSrc: ['\'self\'', '\'unsafe-inline\'', 'https://unpkg.com'],
  //         scriptSrcElem: ['\'self\'', '\'unsafe-inline\'', 'https://unpkg.com'],
  //         styleSrc: ['\'self\'', 'https:', '\'unsafe-inline\'', 'https://unpkg.com'],
  //         workerSrc: ['self', 'blob:'],
  //         upgradeInsecureRequests: null
  //       }
  //     }
  //   })
  // )
  app.use(jsonParser)
  app.use(urlencodedParser)
  app.use(bodyParserErrorHandler)

  // 3. Request logging (after body parsing to avoid logging raw bodies)
  app.use(requestLogger)

  // Note: Error handler should be applied at the end of the middleware chain
  // and will be applied separately in server.ts
}

// Static file optimization middleware

// Export all middleware for individual use
export * from './request-logger'
export * from './error-handler'
export * from './cors'
export * from './body-parser'
export * from './not-found'
export * from './angular-handler'
export * from './jwt'
export * from './page-cache'
export * from './performance'
export * from './applyStaticMiddleware'
