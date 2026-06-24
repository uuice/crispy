import { NextFunction, Request, Response } from 'express'
import jwt, { SignOptions } from 'jsonwebtoken'
import { env } from '../config/env'

export interface JwtUser {
  id: string
  user_name: string
  real_name: string
  nick_name: string
  avatar_url: string
}

declare module 'express' {
  interface Request {
    user?: JwtUser
  }
}

export const jwtMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    res.status(401).json({ message: 'No token provided' })
    return
  }

  try {
    req.user = jwt.verify(token, env['JWT_SECRET']) as JwtUser
    next()
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}

export const generateToken = (user: JwtUser): string => {
  const options: SignOptions = { expiresIn: env['JWT_EXPIRES_IN'] }
  return jwt.sign(user, env['JWT_SECRET'], options)
}
