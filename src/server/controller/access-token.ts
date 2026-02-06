import { NextFunction, Request, Response } from 'express'
import { error, handleError, success } from '../utils/response'
import { generateRandomToken } from '@src/server/utils/token'
import { accessTokenService } from '../services/accessToken.Service'
import { AccessTokenFilters } from '@src/types'

// Create new access token
export const createAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const randomToken = generateRandomToken()
    const token = await accessTokenService.create({
      ...req.body,
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

    const token = await accessTokenService.update(id, req.body)
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
    const result = await accessTokenService.getAccessTokens(
      req.query as unknown as AccessTokenFilters
    )
    success(res, result)
  } catch (err: unknown) {
    handleError(res, err, 'getAccessTokens')
  }
}

// Check access token validity
export const checkAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const isValid = await accessTokenService.checkToken(req.body)
    if (!isValid) {
      error(res, 'Invalid access token', 401)
      return
    }
    success(res, { valid: true }, 'Access token is valid')
  } catch (err: unknown) {
    handleError(res, err, 'checkAccessToken')
  }
}

// Export all functions as a controller object
export const accessTokenController = {
  createAccessToken,
  getAccessTokenById,
  updateAccessToken,
  deleteAccessToken,
  getAccessTokens,
  checkAccessToken
}
