import { Elysia } from 'elysia'

export const applyStaticPlugin = new Elysia({ name: 'static-plugin' }).onRequest(
  ({ request, set }) => {
    // Extract pathname from request URL
    const url = new URL(request.url)
    const path = url.pathname

    // Compression and caching for static files
    if (path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
      // Set cache headers for static assets
      set.headers['Cache-Control'] = 'public, max-age=31536000' // 1 year
      set.headers['Vary'] = 'Accept-Encoding'
    }
  }
)
