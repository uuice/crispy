import express, { Express } from 'express'
export const applyStaticMiddleware = (app: Express) => {
  // Compression and caching for static files
  app.use((req, res, next) => {
    if (req.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
      // Only set headers if they haven't been sent yet
      if (!res.headersSent) {
        res.set('Cache-Control', 'public, max-age=31536000') // 1 year
        res.set('Vary', 'Accept-Encoding')
      }
    }
    next()
  })
}
