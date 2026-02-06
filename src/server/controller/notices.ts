import { NextFunction, Request, Response } from 'express'
import { error, handleError, success } from '../utils/response'
import { noticeService } from '../services/noticeService'
import { NoticeFilters } from '@src/types'

// Get single notice
export const getNotice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, '无效的ID', 400)
      return
    }

    const notice = await noticeService.getById(id)

    if (!notice) {
      error(res, '通知不存在', 404)
      return
    }

    success(res, notice)
  } catch (err: unknown) {
    handleError(res, err, 'getNotice')
  }
}

// Get notices list with pagination
export const getNotices = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await noticeService.getNotices(req.query as unknown as NoticeFilters)
    success(res, result)
  } catch (err: unknown) {
    handleError(res, err, 'getNotices')
  }
}

// Create new notice
export const createNotice = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const newNotice = await noticeService.create(req.body)
    success(res, newNotice, '通知创建成功')
  } catch (err: unknown) {
    handleError(res, err, 'createNotice')
  }
}

// Update notice
export const updateNotice = async (
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

    const updated = await noticeService.update(id, req.body)

    if (!updated) {
      error(res, '通知不存在', 404)
      return
    }

    success(res, { id, ...req.body }, '通知更新成功')
  } catch (err: unknown) {
    handleError(res, err, 'updateNotice')
  }
}

// Delete notice (logical delete)
export const deleteNotice = async (
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

    const deleted = await noticeService.delete(id)

    if (!deleted) {
      error(res, '通知不存在', 404)
      return
    }

    success(res, null, '通知删除成功')
  } catch (err: unknown) {
    handleError(res, err, 'deleteNotice')
  }
}

// Export all functions as a controller object
export const noticeController = {
  getNotice,
  getNotices,
  createNotice,
  updateNotice,
  deleteNotice
}
