import { AngularNodeAppEngine, createNodeRequestHandler, isMainModule } from '@angular/ssr/node'
import express from 'express'
import { join } from 'node:path'
import apiRoutes from './server/routes/api'
import { applyMiddleware } from './server/middleware'
import { notFoundHandler } from './server/middleware/not-found'
import { createAngularHandler } from './server/middleware/angular-handler'

const browserDistFolder = join(import.meta.dirname, '../browser')
const app = express()
const angularApp = new AngularNodeAppEngine()

// 1. Apply basic middleware
applyMiddleware(app)

// 2. API routes
app.use('/api', apiRoutes)

// 3. Static file serving
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false
  })
)

// 4. Angular application routes
app.use(createAngularHandler(angularApp))

// 5. 404 handler (must be after all routes)
app.use(notFoundHandler)

// Start server
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`)
  })
}

export const reqHandler = createNodeRequestHandler(app)
