import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, validationError, notFound } from '../../utils/response'
import {
  operateLogService,
  CreateOperateLogData,
  UpdateOperateLogData,
  OperateLogFilters
} from '../../services/operateLogService'

// Get single operate log
export const getOperateLog = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, 'Invalid ID', 400)
      return
    }

    const log = await operateLogService.getOperateLogById(id)

    if (!log) {
      notFound(res, 'Operate log not found')
      return
    }

    success(res, log)
  } catch (err: unknown) {
    console.error('Error fetching operate log:', err)
    error(res, 'Internal server error')
  }
}

// Get operate logs list with pagination
export const getOperateLogs = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query['page'] as string) || 1
    const pageSize = parseInt(req.query['pageSize'] as string) || 10

    // Build filters from query
    const filters: OperateLogFilters = {}
    if (req.query['code']) {
      filters.code = req.query['code'] as string
    }
    if (req.query['type_id']) {
      filters.typeId = parseInt(req.query['type_id'] as string)
    }
    if (req.query['user_id']) {
      filters.userId = parseInt(req.query['user_id'] as string)
    }
    if (req.query['start_time']) {
      filters.startTime = parseInt(req.query['start_time'] as string)
    }
    if (req.query['end_time']) {
      filters.endTime = parseInt(req.query['end_time'] as string)
    }

    const result = await operateLogService.getOperateLogs({ page, pageSize }, filters)
    success(res, result)
  } catch (err: unknown) {
    console.error('Error fetching operate logs:', err)
    error(res, 'Internal server error')
  }
}

// Export all functions as a controller object
export const operateLogController = {
  getOperateLog,
  getOperateLogs
}
