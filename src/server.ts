import { AngularNodeAppEngine, createNodeRequestHandler, isMainModule } from '@angular/ssr/node'
import express from 'express'
import { join } from 'node:path'
import fs from 'fs'
import apiRoutes from './server/routes/api'
import blogRoutes from './server/routes/blog'
import {
  applyMiddleware,
  applyStaticMiddleware,
  performanceMonitor,
  optimizeRoutePerformance,
  memoryMonitor
} from './server/middleware'
import { notFoundHandler, globalErrorHandler } from './server/middleware/errorHandler'
import { createAngularHandler } from './server/middleware/angular-handler'
import { env } from './server/config/env'
import { testDbConnection } from './libs/db'
import { adminSpecs, contentSpecs } from './server/config/swagger'
import { configureNunjucks } from './server/config/nunjucks'
// import { pageCacheMiddleware } from './server/middleware'
import { flexsearchService } from './server/services/flexsearch-index.service'
import { articleService } from './server/services/articleService'
import { pageService } from './server/services/pageService'
import { cacheService } from './server/services/cacheService'
import { memoryCacheService } from './server/services/memoryCacheService'

// 线上重启服务时，清理所有缓存
if (env['NODE_ENV'] === 'production' || env['NODE_ENV'] === 'development') {
  ;(async () => {
    await cacheService.clearAllCaches()
    memoryCacheService.clear()
    console.log('All caches cleared on server start.')
  })()
}

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

// 1. Apply static file optimization middleware (first for performance)
applyStaticMiddleware(app)

// 2. Static file serving (early for performance)
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false
  })
)

// 3. Serve uploaded files (early for performance)
app.use('/uploads', express.static(join(process.cwd(), 'public', 'uploads')))

// 4. Serve static generated pages from temp directory (early for performance)
app.use(
  '/static',
  express.static(join(process.cwd(), 'temp', 'static'), {
    maxAge: '1y',
    index: false,
    redirect: false
  })
)

// 5. Apply performance monitoring middleware (before static handling to avoid header conflicts)
app.use(performanceMonitor)
app.use(memoryMonitor)

if (env['NODE_ENV'] === 'production') {
  // 6. Static page handler - serve static HTML files from temp directory (highest priority for HTML caching)
  app.get('*path', (req, res, next) => {
    // Skip API routes, admin routes, and other non-page routes
    if (
      req.path.startsWith('/api') ||
      req.path.startsWith('/admin') ||
      req.path.startsWith('/backstage') ||
      req.path.startsWith('/uploads') ||
      req.path.startsWith('/doc') ||
      req.path.startsWith('/static') ||
      req.path.match(/\.(js|css|png|jpg|ico|svg|json|woff|woff2)$/)
    ) {
      return next()
    }

    // Check if static file exists in temp directory
    const staticPath = join(process.cwd(), 'temp', 'static', req.path, 'index.html')

    if (fs.existsSync(staticPath)) {
      console.log(`📄 Serving static file: ${req.path}`)
      res.set('X-Page-Cache', 'HIT-STATIC')
      return res.sendFile(staticPath)
    }

    // If no static file, continue to Angular SSR
    next()
  })
}

// 7. Apply basic middleware (after static files for better performance)
applyMiddleware(app)

// 8. Apply route-specific performance optimization
app.use(optimizeRoutePerformance)

// 10. Configure Nunjucks template engine
configureNunjucks(app)

// 11. API routes (after static handling for better performance)
app.use(env['API_PREFIX'], apiRoutes)

// 12. Blog routes
app.use(blogRoutes)

// 13. Error reporting endpoint
app.post('/api/error-report', express.json(), (req, res) => {
  console.error('Client error report:', req.body)
  res.status(200).json({ received: true })
})

// 14. Swagger documentation routes
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

// The whole site is static, so this is not needed
// Angular application routes (with conditional page cache)
// if (env['NODE_ENV'] === 'production') {
//   app.use(pageCacheMiddleware)
// }
app.use(createAngularHandler(angularApp))

// 16. 404 handler (must be after all routes)
app.use(notFoundHandler)

// 17. Global error handler (must be last)
app.use(globalErrorHandler)

// Start server
// if (isMainModule(import.meta.url)) {
const port = env['PORT']
app.listen(port, () => {
  console.log(`Express server listening on http://localhost:${port}`)
  console.log(`Environment: ${env['NODE_ENV']}`)
})
// }

export const reqHandler = createNodeRequestHandler(app)
