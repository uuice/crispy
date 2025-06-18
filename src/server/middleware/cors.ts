import { RequestHandler } from 'express'

// CORS middleware
export const corsMiddleware: RequestHandler = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, App_name, Channel, Cache-control, X-access-token'
  )

  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
    return
  }
  next()
}
