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
    const url = new URL(c.request.url)
    if (url.pathname.startsWith('/api/')) {
      c.set.status = 404
      return {
        error: 'Not Found',
        message: 'The requested API endpoint does not exist'
      }
    }

    // For non-API requests, return 404 page using JSX
    c.set.status = 404
    return (
      <html lang="zh-CN">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>404 - 页面未找到</title>

          {/* Tailwind CSS */}
          <script src="https://cdn.tailwindcss.com"></script>

          <style>{`
            .gradient-text {
              background: linear-gradient(90deg, #3b82f6, #06b6d4);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              animation: gradient 8s ease infinite;
              background-size: 200% 200%;
            }

            @keyframes gradient {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
          `}</style>
        </head>
        <body class="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
          <div class="max-w-2xl mx-auto px-4 text-center">
            <h1 class="text-5xl font-bold mb-6 gradient-text">
              404 - 页面未找到
            </h1>
            <p class="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              您访问的页面不存在或已被移动。<br />
              您可以尝试返回到<code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono">首页</code>。
            </p>
            <a href="/" class="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg">
              返回首页
            </a>
            <div class="w-full h-px bg-gray-200 dark:bg-gray-700 my-8"></div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              <p>Crispy - 基于 Angular SSR 构建</p>
              <p class="mt-2">错误时间: {new Date().toLocaleString('zh-CN')}</p>
            </div>
          </div>
        </body>
      </html>
    )
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
