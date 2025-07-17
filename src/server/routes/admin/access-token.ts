import { Request, Response, NextFunction } from 'express'
import { success, error, handleError } from '../../utils/response'
import { generateRandomToken } from '@src/server/utils/token'
import { accessTokenService } from '../../services/accessToken.Service'
import {
  createAccessTokenSchema,
  updateAccessTokenSchema
} from '../../services/accessToken.Service'

// Create new access token
export const createAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = createAccessTokenSchema.parse(req.body)
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

    const validatedData = updateAccessTokenSchema.parse(req.body)
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
    const filters = {
      app_name: req.query['app_name'] as string | undefined,
      channel: req.query['channel'] as string | undefined,
      token: req.query['token'] as string | undefined,
      status:
        req.query['status'] !== undefined ? parseInt(req.query['status'] as string) : undefined,
      user_id:
        req.query['user_id'] !== undefined ? parseInt(req.query['user_id'] as string) : undefined,
      is_delete:
        req.query['is_delete'] !== undefined
          ? parseInt(req.query['is_delete'] as string)
          : undefined,
      update_time:
        req.query['update_time'] !== undefined
          ? parseInt(req.query['update_time'] as string)
          : undefined,
      create_time:
        req.query['create_time'] !== undefined
          ? parseInt(req.query['create_time'] as string)
          : undefined
    }
    const result = await accessTokenService.getAccessTokens(filters, { page, pageSize })
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
