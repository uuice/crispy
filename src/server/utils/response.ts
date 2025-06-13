import { Response } from 'express'

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: any
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
 * Send validation error response
 */
export const validationError = (res: Response, errors: any): void => {
  const response: ApiResponse = {
    success: false,
    message: 'Validation error',
    error: errors
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
