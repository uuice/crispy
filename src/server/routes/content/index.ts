import { Elysia, t } from 'elysia'
import accessTokenRouter from './access-token'

const contentRouter = new Elysia({
  prefix: '/content',
  detail: {
    tags: ['content api'],
    security: [
      {
        bearerAuth: []
      }
    ]
  }
}).use(accessTokenRouter)

export default contentRouter
