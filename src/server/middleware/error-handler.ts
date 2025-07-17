import { Request, Response, NextFunction } from 'express'
import { env } from '../config/env'
// Error handler middleware
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack)
  res.status(500).json({
    error: 'Internal Server Error',
    message: env['NODE_ENV'] === 'development' ? err.message : undefined
  })
}
