import { NextFunction, Request, Response } from 'express'
import { error, handleError, success } from '../utils/response'
import { apiLogService } from '../services/apiLogService'
import { ApiLogFilters } from '@src/types'

// Get single api log
export const getApiLog = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, '无效的ID', 400)
      return
    }

    const apiLog = await apiLogService.getById(id)

    if (!apiLog) {
      error(res, 'API日志不存在', 404)
      return
    }

    success(res, apiLog)
  } catch (err: unknown) {
    handleError(res, err, 'getApiLog')
  }
}

// Get api logs list with pagination
export const getApiLogs = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await apiLogService.getApiLogs(req.query as unknown as ApiLogFilters)
    success(res, result)
  } catch (err: unknown) {
    handleError(res, err, 'getApiLogs')
  }
}

// Create new api log
export const createApiLog = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await apiLogService.create(req.body)

    success(res, result, 'API日志创建成功')
  } catch (err: unknown) {
    handleError(res, err, 'createApiLog')
  }
}

// Update api log
export const updateApiLog = async (
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

    const result = await apiLogService.update(id, req.body)
    success(res, result, 'API日志更新成功')
  } catch (err: unknown) {
    handleError(res, err, 'updateApiLog')
  }
}

// Delete api log (logical delete)
export const deleteApiLog = async (
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

    const deleted = await apiLogService.delete(id)
    if (!deleted) {
      error(res, 'API日志不存在', 404)
      return
    }

    success(res, null, 'API日志删除成功')
  } catch (err: unknown) {
    handleError(res, err, 'deleteApiLog')
  }
}

// Export all functions as a controller object
export const apiLogController = {
  getApiLog,
  getApiLogs,
  createApiLog,
  updateApiLog,
  deleteApiLog
}
