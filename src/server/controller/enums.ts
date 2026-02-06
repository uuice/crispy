import { NextFunction, Request, Response } from 'express'
import { error, handleError, success } from '../utils/response'
import { enumService } from '../services/enumService'
import { EnumFilters } from '@src/types'

// Get single enum
export const getEnum = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, '无效的ID', 400)
      return
    }

    const enumItem = await enumService.getById(id)

    if (!enumItem) {
      error(res, '枚举不存在', 404)
      return
    }

    success(res, enumItem)
  } catch (err: unknown) {
    handleError(res, err, 'getEnum')
  }
}

// Get enums list with pagination
export const getEnums = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await enumService.getEnums(req.query as unknown as EnumFilters)
    success(res, result)
  } catch (err: unknown) {
    handleError(res, err, 'getEnums')
  }
}

// Create new enum
export const createEnum = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await enumService.create(req.body)

    success(res, result, '枚举创建成功')
  } catch (err: unknown) {
    handleError(res, err, 'createEnum')
  }
}

// Update enum
export const updateEnum = async (
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

    const result = await enumService.update(id, req.body)
    success(res, result, '枚举更新成功')
  } catch (err: unknown) {
    handleError(res, err, 'updateEnum')
  }
}

// Delete enum (logical delete)
export const deleteEnum = async (
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

    const deleted = await enumService.delete(id)
    if (!deleted) {
      error(res, '枚举不存在', 404)
      return
    }

    success(res, null, '枚举删除成功')
  } catch (err: unknown) {
    handleError(res, err, 'deleteEnum')
  }
}

// Export all functions as a controller object
export const enumController = {
  getEnum,
  getEnums,
  createEnum,
  updateEnum,
  deleteEnum
}
