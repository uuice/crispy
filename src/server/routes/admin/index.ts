import { Elysia, t } from 'elysia'

const adminRouter = new Elysia({
  prefix: '/admin',
  detail: {
    tags: ['admin-api'],
    security: [
      {
        bearerAuth: []
      }
    ]
  }
}).get('/test', () => {
  return { message: 'Admin API is working!' }
})

export default adminRouter
