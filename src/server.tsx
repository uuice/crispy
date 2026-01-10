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
import { applyStaticPlugin } from './server/plugins/applyStaticPlugin'
import { corsPlugin, requestLoggerPlugin } from './server/plugins'
import { serverTiming } from '@elysiajs/server-timing'
import { html, Html } from '@elysiajs/html'

const app = new Elysia()

const angularApp = new AngularAppEngine()

// Scheduled tasks
import './crons/persistFlexsearchIndex'

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

// !cache ignore, no need
// server timing
app.use(
  serverTiming({
    enabled: true
    // allow: true
  })
)

app.use(html())

// cors plugin
app.use(corsPlugin)

// request logger plugin
app.use(requestLoggerPlugin)

// Apply static file optimization plugin (first for performance)
app.use(applyStaticPlugin)

// Static asset serving endpoint
const browserDistFolder = join(import.meta.dirname, '../browser')
app.use(staticPlugin({ assets: browserDistFolder }))

// Serve uploaded files (early for performance)
app.use(staticPlugin({ prefix: '/uploads', assets: join(process.cwd(), 'public', 'uploads') }))

// Health check endpoint
app.get('/health', 'health')

app.get(
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
	app.get('/jsx', () => (
		<html lang="en">
			<head>
				<title>Hello World</title>
			</head>
			<body>
				<h1>Hello World</h1>
			</body>
		</html>
	))

if (isMainModule(import.meta.url)) {
  const port = env['PORT']

  app.listen(port, () => {
    console.log(`Elysia server listening on http://localhost:${port}`)
    console.log(`Environment: ${env['NODE_ENV']}`)
  })
}

// Universal rendering endpoint
app.get('/*', async (c) => {
  const res = await angularApp.handle(c.request, {
    server: 'elysia'
  })

  if (!res) {
    c.set.status = 404
    return 'Not Found'
  }

  return res
})

/**
 * This is a request handler used by the Angular CLI (dev-server and during build).
 */
export const reqHandler = createRequestHandler(app.fetch)
