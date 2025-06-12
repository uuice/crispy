import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

// Define user type
export interface JwtUser {
  id: string
  username: string
  // Add other user properties as needed
}

// Extend Express Request type using module augmentation
declare module 'express' {
  interface Request {
    user?: JwtUser
  }
}

// JWT secret key - should be moved to environment variables in production
const JWT_SECRET = process.env['JWT_SECRET'] || 'your-secret-key'

/**
 * JWT middleware to verify and decode JWT tokens
 * Adds decoded user information to request object
 */
export const jwtMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1] // Bearer TOKEN format

  if (!token) {
    res.status(401).json({ message: 'No token provided' })
    return
  }

  try {
    // Verify and decode token
    const decoded = jwt.verify(token, JWT_SECRET) as JwtUser

    // Add user info to request object
    req.user = decoded

    next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: 'Invalid token' })
      return
    }
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: 'Token expired' })
      return
    }
    res.status(500).json({ message: 'Internal server error' })
    return
  }
}

/**
 * Optional JWT middleware that doesn't require token
 * Only adds user info if valid token is provided
 */
export const optionalJwtMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1]

  if (!token) {
    return next()
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtUser
    req.user = decoded
    next()
  } catch (error) {
    // Continue without user info if token is invalid
    next()
  }
}
