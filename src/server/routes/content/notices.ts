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

    // Build filters from query
    const filters: NoticeFilters = {}
    if (req.query['title']) {
      filters.title = req.query['title'] as string
    }
    if (req.query['status']) {
      filters.status = parseInt(req.query['status'] as string)
    }
    if (req.query['start_time']) {
      filters.startTime = parseInt(req.query['start_time'] as string)
    }
    if (req.query['end_time']) {
      filters.endTime = parseInt(req.query['end_time'] as string)
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
