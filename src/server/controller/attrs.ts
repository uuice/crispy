import { NextFunction, Request, Response } from 'express'
import { error, handleError, success } from '../utils/response'
import { attrService } from '../services/attrService'
import { AttrFilters } from '@src/types'

// Get single attr
export const getAttr = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, '无效的ID', 400)
      return
    }

    const attr = await attrService.getById(id)

    if (!attr) {
      error(res, '属性不存在', 404)
      return
    }

    success(res, attr)
  } catch (err: unknown) {
    handleError(res, err, 'getAttr')
  }
}

// Get attrs list with pagination
export const getAttrs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await attrService.getAttrs(req.query as unknown as AttrFilters)
    success(res, result)
  } catch (err: unknown) {
    handleError(res, err, 'getAttrs')
  }
}

// Create new attr
export const createAttr = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await attrService.create(req.body)

    success(res, result, '属性创建成功')
  } catch (err: unknown) {
    handleError(res, err, 'createAttr')
  }
}

// Update attr
export const updateAttr = async (
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

    const result = await attrService.update(id, req.body)
    success(res, result, '属性更新成功')
  } catch (err: unknown) {
    handleError(res, err, 'updateAttr')
  }
}

// Delete attr (logical delete)
export const deleteAttr = async (
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

    const deleted = await attrService.delete(id)
    if (!deleted) {
      error(res, '属性不存在', 404)
      return
    }

    success(res, null, '属性删除成功')
  } catch (err: unknown) {
    handleError(res, err, 'deleteAttr')
  }
}

// Export all functions as a controller object
export const attrController = {
  getAttr,
  getAttrs,
  createAttr,
  updateAttr,
  deleteAttr
}
