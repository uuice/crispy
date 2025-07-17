import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, validationError, notFound } from '../../utils/response'
import {
  noticeService,
  CreateNoticeData,
  UpdateNoticeData,
  NoticeFilters
} from '../../services/noticeService'

// Get single notice
export const getNotice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, 'Invalid ID', 400)
      return
    }

    const notice = await noticeService.getNoticeById(id)

    if (!notice) {
      notFound(res, 'Notice not found')
      return
    }

    success(res, notice)
  } catch (err: unknown) {
    console.error('Error fetching notice:', err)
    error(res, 'Internal server error')
  }
}

// Get notices list with pagination
export const getNotices = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query['page'] as string) || 1
    const pageSize = parseInt(req.query['pageSize'] as string) || 10

    const filters = {
      title: req.query['title'] as string | undefined,
      content: req.query['content'] as string | undefined,
      from_user_id:
        req.query['from_user_id'] !== undefined
          ? parseInt(req.query['from_user_id'] as string)
          : undefined,
      tolds: req.query['tolds'] as string | undefined,
      status:
        req.query['status'] !== undefined ? parseInt(req.query['status'] as string) : undefined,
      publish_time:
        req.query['publish_time'] !== undefined
          ? parseInt(req.query['publish_time'] as string)
          : undefined,
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
    const result = await noticeService.getNotices({ page, pageSize }, filters)
    success(res, result)
  } catch (err: unknown) {
    console.error('Error fetching notices:', err)
    error(res, 'Internal server error')
  }
}

// Export all functions as a controller object
export const noticeController = {
  getNotice,
  getNotices
}
