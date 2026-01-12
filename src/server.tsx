import { Elysia } from 'elysia'
import { env } from './server/config/env'
import { AngularAppEngine, createRequestHandler } from '@angular/ssr'
import { isMainModule } from '@angular/ssr/node'
import { join } from 'node:path'
import { staticPlugin } from '@elysiajs/static'
import { flexsearchService } from './server/services/flexsearch-index.service'
import { articleService } from './server/services/articleService'
import { pageService } from './server/services/pageService'
import { testDbConnection } from './libs/db'
import { html, Html } from '@elysiajs/html'
import { serverTiming } from '@elysiajs/server-timing'
import { openapi } from '@elysiajs/openapi'

// test db connection
testDbConnection()

if (env['ENABLE_JS_ARTICLE_GENERATION'] === 'true') {
  const jsArticleInterval = parseInt(env['JS_ARTICLE_GENERATION_INTERVAL'] || '7200000', 10) // 默认2小时
  console.log(
    `[JS Article Generator] Enabled with interval: ${jsArticleInterval}ms (${
      jsArticleInterval / 1000 / 60
    } minutes)`
  )
  import('./crons/generateJSArticles')
    .then(({ generateAndSaveArticle }) => {
      // 立即执行一次
      generateAndSaveArticle()
      // 设置定时执行
      setInterval(generateAndSaveArticle, jsArticleInterval)
    })
    .catch((error) => {
      console.error('[JS Article Generator] Failed to load:', error)
    })
} else {
  console.log(
    '[JS Article Generator] Disabled by environment variable ENABLE_JS_ARTICLE_GENERATION'
  )
}

// test flexsearch
if (env['NODE_ENV'] === 'development' || env['NODE_ENV'] === 'production') {
  ;(async () => {
    const articles = await articleService.getArticles({}, { page: 1, pageSize: 1000 })
    const pages = await pageService.getPages({ page: 1, pageSize: 1000 }, {})
    await flexsearchService.buildIndexes(articles.dataList, pages.dataList)
    await flexsearchService.persistAll()
  })()
}
const angularApp = new AngularAppEngine()

// Scheduled tasks
import './crons/persistFlexsearchIndex'
import { applyStaticPlugin } from './server/plugins/applyStaticPlugin'
import { corsPlugin, requestLoggerPlugin } from './server/plugins'
import apiRouter from './server/routes/api'



const app = new Elysia()
  .use(openapi({
    documentation: {
      info: {
          title: 'Elysia Documentation',
          version: '1.0.1'
      }
  }
}))

.use(html())

//Adding it causes the HTML plugin to stop working; I don't know why.
// .use(serverTiming())

// cors plugin
.use(corsPlugin)

// request logger plugin
.use(requestLoggerPlugin)

// Apply static file optimization plugin (first for performance)
.use(applyStaticPlugin)

// Static asset serving endpoint

.use(staticPlugin({ assets: join(import.meta.dirname, '../browser') }))

// Serve uploaded files (early for performance)
.use(staticPlugin({ prefix: '/uploads', assets: join(process.cwd(), 'public', 'uploads') }))

// Health check endpoint
.get('/health', 'health')


.get(
  '/html',
  () => `
          <html lang='en'>
              <head>
                  <title>Hello World</title>
              </head>
              <body>
                  <h1>Hello World</h1>
              </body>
          </html>`
)

.get('/jsx', () => (
  <html lang="en">
    <head>
      <title>Hello World</title>
    </head>
    <body>
      <h1>Hello World</h1>
    </body>
  </html>
))

// 挂载api
.use(apiRouter)



// Universal rendering endpoint
.get('/*', async (c) => {
  const res = await angularApp.handle(c.request, {
    server: 'elysia'
  })

  if (!res) {
    c.set.status = 404
    return 'Not Found'
  }

  return res
})

if (isMainModule(import.meta.url)) {
  const port = env['PORT']

  app.listen(port, () => {
    console.log(`Elysia server listening on http://localhost:${port}`)
    console.log(`Environment: ${env['NODE_ENV']}`)
  })
}

export type App = typeof app

/**
 * This is a request handler used by the Angular CLI (dev-server and during build).
 */
export const reqHandler = createRequestHandler(app.fetch)
