import { Request, Response, NextFunction } from 'express'
import jwt, { SignOptions } from 'jsonwebtoken'
import { env } from '../config/env'

// Define user type
export interface JwtUser {
  id: string
  user_name: string
  real_name: string
  nick_name: string
  avatar_url: string
  // Add other user properties as needed
}

// Extend Express Request type using module augmentation
declare module 'express' {
  interface Request {
    user?: JwtUser
  }
}

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
    // Verify and decode token using environment variable
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtUser

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
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtUser
    req.user = decoded
    next()
  } catch (error) {
    // Continue without user info if token is invalid
    next()
  }
}

/**
 * Generate JWT token for user
 */
export const generateToken = (user: JwtUser): string => {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN
  }
  return jwt.sign(user, env.JWT_SECRET, options)
}
