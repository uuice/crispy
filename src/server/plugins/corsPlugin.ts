import { Elysia } from 'elysia'

export const corsPlugin = new Elysia({ name: 'cors-plugin' }).onRequest(({ request, set }) => {
  const origin = process.env['NODE_ENV'] === 'production' ? process.env['BASE_URL'] || '*' : '*'
  set.headers['Access-Control-Allow-Origin'] = origin
  set.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
  set.headers['Access-Control-Allow-Headers'] =
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-app-name, x-channel, x-access-token, Cache-control'

  if (request.method === 'OPTIONS') {
    set.status = 200
    return new Response(null, { status: 200 })
  }

  return undefined
})
