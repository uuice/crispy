import { NextFunction, Request, Response } from 'express'
import { userTypeService } from '../services/userTypeService'
import { error, handleError, success } from '../utils/response'
import { UserTypeFilters } from '@src/types'

// Get single user type
export const getUserType = async (
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

    const userType = await userTypeService.getById(id)

    if (!userType) {
      error(res, '用户类型不存在', 404)
      return
    }

    success(res, userType)
  } catch (err: unknown) {
    handleError(res, err, 'getUserType')
  }
}

// Get user types list with pagination
export const getUserTypes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await userTypeService.getUserTypes(req.query as unknown as UserTypeFilters)
    success(res, result)
  } catch (err: unknown) {
    handleError(res, err, 'getUserTypes')
  }
}

// Create new user type
export const createUserType = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userType = await userTypeService.create(req.body)
    success(res, userType, '用户类型创建成功')
  } catch (err: unknown) {
    handleError(res, err, 'createUserType')
  }
}

// Update user type
export const updateUserType = async (
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

    const userType = await userTypeService.update(id, req.body)
    success(res, userType, '用户类型更新成功')
  } catch (err: unknown) {
    handleError(res, err, 'updateUserType')
  }
}

// Delete user type (logical delete)
export const deleteUserType = async (
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

    const deleted = await userTypeService.delete(id)

    if (!deleted) {
      error(res, '用户类型不存在', 404)
      return
    }

    success(res, null, '用户类型删除成功')
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Cannot delete user type that is in use by users') {
      error(res, '无法删除正在使用的用户类型', 400)
      return
    }
    handleError(res, err, 'deleteUserType')
  }
}

// Export all functions as a controller object
export const userTypeController = {
  getUserType,
  getUserTypes,
  createUserType,
  updateUserType,
  deleteUserType
}
