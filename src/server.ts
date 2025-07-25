import { AngularNodeAppEngine, createNodeRequestHandler, isMainModule } from '@angular/ssr/node'
import express from 'express'
import { join } from 'node:path'
import apiRoutes from './server/routes/api'
import blogRoutes from './server/routes/blog'
import { applyMiddleware } from './server/middleware'
import { notFoundHandler, globalErrorHandler } from './server/middleware/errorHandler'
import { createAngularHandler } from './server/middleware/angular-handler'
import { env } from './server/config/env'
import { testDbConnection } from './libs/db'
import { adminSpecs, contentSpecs } from './server/config/swagger'
import { configureNunjucks } from './server/config/nunjucks'
import { pageCacheMiddleware } from './server/middleware'
import { flexsearchService } from './server/services/flexsearch-index.service'
import { articleService } from './server/services/articleService'
import { pageService } from './server/services/pageService'

// 定时清理内存和数据库缓存
import './crons/cleanupMemoryCache'
import './crons/cleanupDatabaseCache'
import './crons/persistFlexsearchIndex'

// test flexsearch
if (env['NODE_ENV'] === 'development') {
  ;(async () => {
    const articles = await articleService.getArticles({}, { page: 1, pageSize: 1000 })
    const pages = await pageService.getPages({ page: 1, pageSize: 1000 }, {})
    await flexsearchService.buildIndexes(articles.dataList, pages.dataList)
    await flexsearchService.persistAll()
  })()
}

// test db connection
testDbConnection()

const browserDistFolder = join(import.meta.dirname, '../browser')
const app = express()
const angularApp = new AngularNodeAppEngine()

// 1. Apply basic middleware
applyMiddleware(app)

// 2. Configure Nunjucks template engine
configureNunjucks(app)

// 2. API routes
app.use(env['API_PREFIX'], apiRoutes)

// Blog routes
app.use(blogRoutes)

// Error reporting endpoint
app.post('/api/error-report', express.json(), (req, res) => {
  console.error('Client error report:', req.body)
  res.status(200).json({ received: true })
})

app.get('/doc/admin/swagger.json', (req, res) => {
  res.json(adminSpecs)
})

// Admin Swagger documentation route
app.get('/doc/admin/docs', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>API Docs</title>
      <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui.css" />
    </head>
    <body>
      <div id="swagger-ui"></div>
      <script src="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-bundle.js"></script>
      <script>
        SwaggerUIBundle({
          url: '/doc/admin/swagger.json',
          dom_id: '#swagger-ui'
        });
      </script>
    </body>
    </html>
  `)
})

app.get('/doc/content/swagger.json', (req, res) => {
  res.json(contentSpecs)
})

app.get('/doc/content/docs', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>API Docs</title>
      <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui.css" />
    </head>
    <body>
      <div id="swagger-ui"></div>
      <script src="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-bundle.js"></script>
      <script>
        SwaggerUIBundle({
          url: '/doc/content/swagger.json',
          dom_id: '#swagger-ui'
        });
      </script>
    </body>
    </html>
  `)
})

// 3. Static file serving
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false
  })
)

// Serve uploaded files
app.use('/uploads', express.static(join(process.cwd(), 'public', 'uploads')))

// 4. Angular application routes
app.use(pageCacheMiddleware)
app.use(createAngularHandler(angularApp))

// 5. 404 handler (must be after all routes)
app.use(notFoundHandler)

// 6. Global error handler (must be last)
app.use(globalErrorHandler)

// Start server
if (isMainModule(import.meta.url)) {
  const port = env['PORT']
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`)
    console.log(`Environment: ${env['NODE_ENV']}`)
  })
}

export const reqHandler = createNodeRequestHandler(app)
