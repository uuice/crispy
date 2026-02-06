import { NextFunction, Request, Response } from 'express'
import { additionService } from '../services/additionService'
import { error, handleError, success } from '../utils/response'
import { AdditionFilters } from '@src/types'

// Get single addition
export const getAddition = async (
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

    const addition = await additionService.getById(id)
    if (!addition) {
      error(res, '附加信息不存在', 404)
      return
    }
    success(res, addition)
  } catch (err: unknown) {
    handleError(res, err, 'getAddition')
  }
}

// Get additions list with pagination
export const getAdditions = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await additionService.getAdditions(req.query as unknown as AdditionFilters)
    success(res, result)
  } catch (err: unknown) {
    handleError(res, err, 'getAdditions')
  }
}

// Create new addition
export const createAddition = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const addition = await additionService.create(req.body)
    success(res, addition, '附加信息创建成功')
  } catch (err: unknown) {
    handleError(res, err, 'createAddition')
  }
}

// Update addition
export const updateAddition = async (
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

    const addition = await additionService.update(id, req.body)
    success(res, addition, '附加信息更新成功')
  } catch (err: unknown) {
    handleError(res, err, 'updateAddition')
  }
}

// Delete addition (logical delete)
export const deleteAddition = async (
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

    const deleted = await additionService.delete(id)
    if (!deleted) {
      error(res, '附加信息不存在', 404)
      return
    }
    success(res, null, '附加信息删除成功')
  } catch (err: unknown) {
    handleError(res, err, 'deleteAddition')
  }
}

// Export all functions as a controller object
export const additionController = {
  getAddition,
  getAdditions,
  createAddition,
  updateAddition,
  deleteAddition
}
