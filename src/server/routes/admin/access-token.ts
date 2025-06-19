import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { AccessTokenService } from '../../services/accessToken.Service'
import { success, error, handleError } from '../../utils/response'
import { generateRandomToken } from '@src/server/utils/token'
// Initialize service
const accessTokenService = new AccessTokenService()

// Validation schemas
const createSchema = z.object({
  app_name: z.string().min(1, 'app_name不能为空'),
  channel: z.string().min(1, 'channel不能为空'),
  user_id: z.number().min(1, 'user_id不能为空'),
  status: z.number().default(10)
})

const updateSchema = createSchema.partial()

// Create new access token
export const createAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = createSchema.parse(req.body)
    const randomToken = generateRandomToken()
    const token = await accessTokenService.create({
      ...validatedData,
      token: randomToken
    })
    success(res, token, '访问令牌创建成功')
  } catch (err: unknown) {
    handleError(res, err, 'createAccessToken')
  }
}

// Get single access token
export const getAccessTokenById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, '无效的ID', 400)
      return
    }

    const token = await accessTokenService.getById(id)
    if (!token) {
      error(res, '访问令牌不存在', 404)
      return
    }
    success(res, token)
  } catch (err: unknown) {
    handleError(res, err, 'getAccessTokenById')
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
      error(res, '无效的ID', 400)
      return
    }

    const validatedData = updateSchema.parse(req.body)
    const token = await accessTokenService.update(id, validatedData)
    if (!token) {
      error(res, '访问令牌不存在', 404)
      return
    }
    success(res, token, '访问令牌更新成功')
  } catch (err: unknown) {
    handleError(res, err, 'updateAccessToken')
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
      error(res, '无效的ID', 400)
      return
    }

    const deleted = await accessTokenService.delete(id)
    if (!deleted) {
      error(res, '访问令牌不存在', 404)
      return
    }
    success(res, null, '访问令牌删除成功')
  } catch (err: unknown) {
    handleError(res, err, 'deleteAccessToken')
  }
}

// Get access tokens list with pagination
export const getAccessTokens = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query['page'] as string) || 1
    const pageSize = parseInt(req.query['pageSize'] as string) || 10
    const app_name = req.query['app_name'] as string
    const channel = req.query['channel'] as string
    const status = req.query['status'] ? parseInt(req.query['status'] as string) : undefined
    const user_id = req.query['user_id'] ? parseInt(req.query['user_id'] as string) : undefined

    const result = await accessTokenService.getAccessTokens({
      page,
      pageSize,
      app_name,
      channel,
      status,
      user_id
    })
    success(res, result)
  } catch (err: unknown) {
    handleError(res, err, 'getAccessTokens')
  }
}

// Export all functions as a controller object
export const accessTokenController = {
  createAccessToken,
  getAccessTokenById,
  updateAccessToken,
  deleteAccessToken,
  getAccessTokens
}
