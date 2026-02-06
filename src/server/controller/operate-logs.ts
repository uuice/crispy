import { NextFunction, Request, Response } from 'express'
import { error, handleError, success } from '../utils/response'
import { operateLogService } from '../services/operateLogService'
import { OperateLogFilters } from '@src/types'

// Get single operate log
export const getOperateLog = async (
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

    const log = await operateLogService.getById(id)

    if (!log) {
      error(res, '操作日志不存在', 404)
      return
    }

    success(res, log)
  } catch (err: unknown) {
    handleError(res, err, 'getOperateLog')
  }
}

// Get operate logs list with pagination
export const getOperateLogs = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await operateLogService.getOperateLogs(req.query as unknown as OperateLogFilters)
    success(res, result)
  } catch (err: unknown) {
    handleError(res, err, 'getOperateLogs')
  }
}

// Create new operate log
export const createOperateLog = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const newLog = await operateLogService.create(req.body)
    success(res, newLog, '操作日志创建成功')
  } catch (err: unknown) {
    handleError(res, err, 'createOperateLog')
  }
}

// Update operate log
export const updateOperateLog = async (
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

    const updated = await operateLogService.update(id, req.body)

    if (!updated) {
      error(res, '操作日志不存在', 404)
      return
    }

    success(res, { id, ...req.body }, '操作日志更新成功')
  } catch (err: unknown) {
    handleError(res, err, 'updateOperateLog')
  }
}

// Delete operate log (logical delete)
export const deleteOperateLog = async (
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

    const deleted = await operateLogService.delete(id)

    if (!deleted) {
      error(res, '操作日志不存在', 404)
      return
    }

    success(res, null, '操作日志删除成功')
  } catch (err: unknown) {
    handleError(res, err, 'deleteOperateLog')
  }
}

// Export all functions as a controller object
export const operateLogController = {
  getOperateLog,
  getOperateLogs,
  createOperateLog,
  updateOperateLog,
  deleteOperateLog
}
