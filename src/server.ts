import { AngularNodeAppEngine, createNodeRequestHandler, isMainModule } from '@angular/ssr/node'
import express from 'express'
import { join } from 'node:path'
import apiRoutes from './server/routes/api'
import rssRoutes from './server/routes/rss-sitemap'
import { createAngularHandler } from './server/middleware/angular-handler'
import {
  bodyParserErrorHandler,
  jsonParser,
  urlencodedParser
} from './server/middleware/body-parser'
import { corsMiddleware } from './server/middleware/cors'
import { globalErrorHandler, notFoundHandler } from './server/middleware/errorHandler'
import { env } from './server/config/env'

const browserDistFolder = join(import.meta.dirname, '../browser')
const app = express()
const angularApp = new AngularNodeAppEngine()

app.use(express.static(browserDistFolder, { maxAge: '1y', index: false, redirect: false }))
app.use('/uploads', express.static(join(process.cwd(), 'public', 'uploads')))
app.use(corsMiddleware, jsonParser, urlencodedParser, bodyParserErrorHandler)

app.use(env['API_PREFIX'], apiRoutes)
app.use(rssRoutes)

app.get('/doc/admin/docs', (_req, res) => {
  res.send(`<!DOCTYPE html><html><head><title>API Docs</title>
<link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui.css" /></head>
<body><div id="swagger-ui"></div>
<script src="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-bundle.js"></script>
<script>SwaggerUIBundle({ url: '/doc/admin/swagger.json', dom_id: '#swagger-ui' });</script>
</body></html>`)
})

app.get('/doc/content/docs', (_req, res) => {
  res.send(`<!DOCTYPE html><html><head><title>API Docs</title>
<link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui.css" /></head>
<body><div id="swagger-ui"></div>
<script src="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-bundle.js"></script>
<script>SwaggerUIBundle({ url: '/doc/content/swagger.json', dom_id: '#swagger-ui' });</script>
</body></html>`)
})

app.use(createAngularHandler(angularApp))
app.use(notFoundHandler)
app.use(globalErrorHandler)

if (isMainModule(import.meta.url)) {
  app.listen(env['PORT'], () => {
    console.log(`Express server listening on http://localhost:${env['PORT']}`)
  })
}

export const reqHandler = createNodeRequestHandler(app)
