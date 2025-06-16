import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { AccessTokenService } from '../../services/accessToken.Service'
import { success, error, validationError, notFound } from '../../utils/response'

// Initialize service
const accessTokenService = new AccessTokenService()

// Validation schemas
const createSchema = z.object({
  app_name: z.string(),
  channel: z.string(),
  user_id: z.number(),
  status: z.number().default(10),
  token: z.string(),
  create_time: z.number().default(() => Date.now()),
  update_time: z.number().default(() => Date.now()),
  is_delete: z.number().default(0)
})

const updateSchema = createSchema.partial()

const listQuerySchema = z.object({
  page: z.string().transform(Number).default('1'),
  pageSize: z.string().transform(Number).default('10'),
  app_name: z.string().optional(),
  channel: z.string().optional(),
  status: z.string().transform(Number).optional(),
  user_id: z.string().transform(Number).optional()
})

// Create new access token
export const createAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = createSchema.parse(req.body)
    const token = await accessTokenService.create(validatedData)
    success(res, token, 'Access token created successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
    }
    console.error('Error creating access token:', err)
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

// Update access token
export const updateAccessToken = async (
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

    const validatedData = updateSchema.parse(req.body)
    const token = await accessTokenService.update(id, validatedData)
    if (!token) {
      notFound(res, 'Access token not found')
      return
    }
    success(res, token, 'Access token updated successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
    }
    console.error('Error updating access token:', err)
    error(res, 'Internal server error')
  }
}

// Delete access token (logical delete)
export const deleteAccessToken = async (
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

    const deleted = await accessTokenService.delete(id)
    if (!deleted) {
      notFound(res, 'Access token not found')
      return
    }
    success(res, null, 'Access token deleted successfully')
  } catch (err: unknown) {
    console.error('Error deleting access token:', err)
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

    const result = await accessTokenService.list(page, pageSize, filters)
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
  createAccessToken,
  getAccessToken,
  updateAccessToken,
  deleteAccessToken,
  getAccessTokens
}
