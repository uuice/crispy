import { RequestHandler } from 'express'

// CORS middleware
export const corsMiddleware: RequestHandler = (req, res, next) => {
  const origin = process.env['NODE_ENV'] === 'production' ? process.env['BASE_URL'] || '*' : '*'
  res.header('Access-Control-Allow-Origin', origin)
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-app-name, x-channel, x-access-token, Cache-control'
  )

  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
    return
  }
  next()
}
