import { Router } from 'express'
import adminRoutes from './admin/routes'
import contentRoutes from './content/routes'

import { adminSpecs, contentSpecs } from '../config/swagger'

// Create API router
const router = Router()

router.get('/admin/swagger.json', (req, res) => {
  res.json(adminSpecs)
})

// Admin Swagger documentation route
router.get('/admin/docs', (req, res) => {
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
          url: '/api/admin/swagger.json',
          dom_id: '#swagger-ui'
        });
      </script>
    </body>
    </html>
  `)
})

router.get('/content/swagger.json', (req, res) => {
  res.json(contentSpecs)
})

router.get('/content/docs', (req, res) => {
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
          url: '/api/content/swagger.json',
          dom_id: '#swagger-ui'
        });
      </script>
    </body>
    </html>
  `)
})

// Mount admin routes
router.use('/admin', adminRoutes)

// Mount content routes
router.use('/content', contentRoutes)

// TODO: Add more API routes here
// router.use('/users', userRoutes)
// router.use('/products', productRoutes)

export default router
