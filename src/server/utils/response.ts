import { Response } from 'express'
import { z } from 'zod'

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: any
}

interface ValidationErrorDetail {
  field: string
  message: string
  code: string
  value?: any
}

interface ValidationErrorResponse {
  success: false
  message: string
  error: {
    type: 'validation'
    details: ValidationErrorDetail[]
    summary: string
  }
}

/**
 * Send success response
 */
export const success = <T>(res: Response, data?: T, message?: string): void => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message
  }
  res.json(response)
}

/**
 * Send error response
 */
export const error = (res: Response, message: string, statusCode = 500, error?: any): void => {
  const response: ApiResponse = {
    success: false,
    message,
    error
  }
  res.status(statusCode).json(response)
}

/**
 * Send validation error response with beautiful formatting
 */
export const validationError = (res: Response, zodErrors: z.core.$ZodIssue[]): void => {
  const details: ValidationErrorDetail[] = zodErrors.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
    code: err.code,
    value: 'received' in err ? err.received : undefined
  }))

  const response: ValidationErrorResponse = {
    success: false,
    message: details.map((d) => d.message).join('; '),
    error: {
      type: 'validation',
      details,
      summary: `发生 ${details.length} 个验证错误`
    }
  }

  res.status(400).json(response)
}

/**
 * Send not found error response
 */
export const notFound = (res: Response, message = 'Resource not found'): void => {
  const response: ApiResponse = {
    success: false,
    message
  }
  res.status(404).json(response)
}

/**
 * Enhanced ZodError handler for direct use
 */
export const handleZodError = (res: Response, error: z.ZodError): void => {
  validationError(res, error.issues)
}

/**
 * Unified error handler for all types of errors
 */
export const handleError = (res: Response, err: unknown, context?: string): void => {
  // Handle Zod validation errors
  if (err instanceof z.ZodError) {
    handleZodError(res, err)
    return
  }

  // Handle business logic errors
  if (err instanceof Error) {
    error(res, err.message, 400)
    return
  }

  // Handle system errors
  console.error(`Error in ${context || 'unknown context'}:`, err)
  error(res, '内部服务器错误')
}
