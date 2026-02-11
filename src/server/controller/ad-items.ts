import { NextFunction, Request, Response } from 'express'
import { adItemService } from '../services/adItemService'
import { error, handleError, success } from '../utils/response'
import { AdItemFilters } from '@src/types'

// Get single ad item
export const getAdItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, '无效的ID', 400)
      return
    }

    const adItem = await adItemService.getById(id)
    if (!adItem) {
      error(res, '广告项不存在', 404)
      return
    }
    success(res, adItem)
  } catch (err: unknown) {
    handleError(res, err, 'getAdItem')
  }
}

// Get ad items list with pagination
export const getAdItems = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query['page'] as string) || 1
    const pageSize = parseInt(req.query['pageSize'] as string) || 10

    const result = await adItemService.getAdItems(req.query as unknown as AdItemFilters)
    success(res, result)
  } catch (err: unknown) {
    handleError(res, err, 'getAdItems')
  }
}

// Create new ad item
export const createAdItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const adItem = await adItemService.create(req.body)
    success(res, adItem, '广告项创建成功')
  } catch (err: unknown) {
    handleError(res, err, 'createAdItem')
  }
}

// Update ad item
export const updateAdItem = async (
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

    const adItem = await adItemService.update(id, req.body)
    success(res, adItem, '广告项更新成功')
  } catch (err: unknown) {
    handleError(res, err, 'updateAdItem')
  }
}

// Delete ad item (logical delete)
export const deleteAdItem = async (
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

    const deleted = await adItemService.delete(id)
    if (!deleted) {
      error(res, '广告项不存在', 404)
      return
    }
    success(res, null, '广告项删除成功')
  } catch (err: unknown) {
    handleError(res, err, 'deleteAdItem')
  }
}

// Export all functions as a controller object
export const adItemController = {
  getAdItem,
  getAdItems,
  createAdItem,
  updateAdItem,
  deleteAdItem
}
