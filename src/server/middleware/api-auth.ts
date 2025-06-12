import { Request, Response, NextFunction } from 'express'
import { jwtMiddleware } from './jwt'

/**
 * API authentication middleware
 * Applies JWT verification to all /api routes except /api/login
 */
export const apiAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Skip JWT verification for login endpoint
  if (req.path === '/api/login' || req.path === '/api/login/') {
    return next()
  }

  // Apply JWT verification for all other /api routes
  return jwtMiddleware(req, res, next)
}
