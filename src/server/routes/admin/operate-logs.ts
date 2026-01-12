import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, validationError, notFound } from '../../utils/response'
import {
  operateLogService,
  CreateOperateLogData,
  UpdateOperateLogData,
  OperateLogFilters
} from '../../services/operateLogService'

// Validation schemas
const createOperateLogSchema = z.object({
  code: z.string().min(1),
  content: z.string().min(1),
  type_id: z.number().default(0),
  user_id: z.number().min(1)
})

const updateOperateLogSchema = createOperateLogSchema.partial()

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

    const filters = {
      code: req.query['code'] as string | undefined,
      content: req.query['content'] as string | undefined,
      type_id:
        req.query['type_id'] !== undefined ? parseInt(req.query['type_id'] as string) : undefined,
      user_id:
        req.query['user_id'] !== undefined ? parseInt(req.query['user_id'] as string) : undefined,
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

    const result = await operateLogService.getOperateLogs({ page, pageSize }, filters)
    success(res, result)
  } catch (err: unknown) {
    console.error('Error fetching operate logs:', err)
    error(res, 'Internal server error')
  }
}

// Create new operate log
export const createOperateLog = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = createOperateLogSchema.parse(req.body) as CreateOperateLogData

    const newLog = await operateLogService.createOperateLog(validatedData)
    success(res, newLog, 'Operate log created successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.issues)
      return
    }
    console.error('Error creating operate log:', err)
    error(res, 'Internal server error')
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
      error(res, 'Invalid ID', 400)
      return
    }

    const validatedData = updateOperateLogSchema.parse(req.body) as UpdateOperateLogData

    const updated = await operateLogService.updateOperateLog(id, validatedData)

    if (!updated) {
      notFound(res, 'Operate log not found')
      return
    }

    success(res, { id, ...validatedData }, 'Operate log updated successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.issues)
      return
    }
    console.error('Error updating operate log:', err)
    error(res, 'Internal server error')
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
      error(res, 'Invalid ID', 400)
      return
    }

    const deleted = await operateLogService.deleteOperateLog(id)

    if (!deleted) {
      notFound(res, 'Operate log not found')
      return
    }

    success(res, null, 'Operate log deleted successfully')
  } catch (err: unknown) {
    console.error('Error deleting operate log:', err)
    error(res, 'Internal server error')
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

import { Elysia } from 'elysia'
const operateLogRouter = new Elysia({
  prefix: '/operate-logs'
})
  .get('/', getOperateLogs)
  .get('/:id', getOperateLog)
  .post('/', createOperateLog)
  .put('/:id', updateOperateLog)
  .delete('/:id', deleteOperateLog)
export default operateLogRouter
