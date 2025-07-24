import { Request, Response, NextFunction } from 'express'
import { ZodObject, ZodError } from 'zod'

/**
 * Middleware to validate request data using zod schemas
 * @param schemas Object containing validation schemas for different parts of the request
 * @returns Express middleware function
 */
export const validateRequest = (schemas: {
  body?: ZodObject<any>
  query?: ZodObject<any>
  params?: ZodObject<any>
}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body)
      }
      if (schemas.query) {
        req.query = (await schemas.query.parseAsync(req.query)) as any
      }
      if (schemas.params) {
        req.params = (await schemas.params.parseAsync(req.params)) as any
      }
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          code: 400,
          message: '请求参数验证失败',
          errors: error.issues
        })
      } else {
        next(error)
      }
    }
  }
}
