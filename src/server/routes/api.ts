import adminRouter from './admin/admin-router'
import contentRouter from './content/index'

// Create API router
import { Elysia, t } from 'elysia'
const apiRouter = new Elysia({
  prefix: '/api',
  detail: {
    tags: ['API']
  }
})
  .use(adminRouter)
  .use(contentRouter)

export default apiRouter
