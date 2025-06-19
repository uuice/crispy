import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { AccessTokenService } from '../../services/accessToken.Service'
import { success, error, validationError, notFound } from '../../utils/response'

// Initialize service
const accessTokenService = new AccessTokenService()

// Validation schemas
const checkTokenSchema = z.object({
  app_name: z.string(),
  channel: z.string(),
  token: z.string()
})

const listQuerySchema = z.object({
  page: z.string().transform(Number).default('1'),
  pageSize: z.string().transform(Number).default('10'),
  app_name: z.string().optional(),
  channel: z.string().optional(),
  token: z.string().optional(),
  status: z.string().transform(Number).optional(),
  user_id: z.string().transform(Number).optional()
})

// Check access token validity
export const checkAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = checkTokenSchema.parse(req.body)
    const { app_name, channel, token } = validatedData

    const isValid = await accessTokenService.checkToken(app_name, channel, token)
    if (!isValid) {
      error(res, 'Invalid access token', 401)
      return
    }
    success(res, { valid: true }, 'Access token is valid')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
    }
    console.error('Error checking access token:', err)
    error(res, 'Internal server error')
  }
}

// Get single access token
export const getAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, 'Invalid ID', 400)
      return
    }

    const token = await accessTokenService.getById(id)
    if (!token) {
      notFound(res, 'Access token not found')
      return
    }
    success(res, token)
  } catch (err: unknown) {
    console.error('Error fetching access token:', err)
    error(res, 'Internal server error')
  }
}

// Get access tokens list with pagination
export const getAccessTokens = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedQuery = listQuerySchema.parse(req.query)
    const { page, pageSize, ...filters } = validatedQuery

    const result = await accessTokenService.getAccessTokens({
      page,
      pageSize,
      ...filters
    })
    success(res, result)
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
    }
    console.error('Error fetching access tokens:', err)
    error(res, 'Internal server error')
  }
}

// Export all functions as a controller object
export const accessTokenController = {
  getAccessToken,
  getAccessTokens,
  checkAccessToken
}
