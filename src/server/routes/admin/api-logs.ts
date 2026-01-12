import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, validationError, notFound } from '../../utils/response'
import { apiLogService } from '../../services/apiLogService'

// Validation schemas
const createApiLogSchema = z.object({
  user_id: z.number().optional(),
  method: z.string(),
  path: z.string(),
  request_body: z.string().optional(),
  response_body: z.string().optional(),
  status_code: z.number(),
  ip: z.string().optional(),
  user_agent: z.string().optional(),
  duration: z.number().optional(),
  status: z.number().default(10)
})

const updateApiLogSchema = createApiLogSchema.partial()

// Get single api log
export const getApiLog = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, 'Invalid ID', 400)
      return
    }

    const apiLog = await apiLogService.getApiLogById(id)

    if (!apiLog) {
      notFound(res, 'API log not found')
      return
    }

    success(res, apiLog)
  } catch (err: unknown) {
    console.error('Error fetching API log:', err)
    error(res, 'Internal server error')
  }
}

// Get api logs list with pagination
export const getApiLogs = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query['page'] as string) || 1
    const pageSize = parseInt(req.query['pageSize'] as string) || 10

    const filters = {
      body: req.query['body'] as string | undefined,
      query: req.query['query'] as string | undefined,
      ip: req.query['ip'] as string | undefined,
      method: req.query['method'] as string | undefined,
      user_id:
        req.query['user_id'] !== undefined ? parseInt(req.query['user_id'] as string) : undefined,
      status:
        req.query['status'] !== undefined ? parseInt(req.query['status'] as string) : undefined,
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

    const result = await apiLogService.getApiLogs(filters, { page, pageSize })
    success(res, result)
  } catch (err: unknown) {
    console.error('Error fetching api logs:', err)
    error(res, 'Internal server error')
  }
}

// Create new api log
export const createApiLog = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = createApiLogSchema.parse(req.body)

    const result = await apiLogService.createApiLog(validatedData)

    success(res, result, 'API log created successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.issues)
      return
    }
    console.error('Error creating API log:', err)
    error(res, 'Internal server error')
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
      error(res, 'Invalid ID', 400)
      return
    }

    const validatedData = updateApiLogSchema.parse(req.body)

    const result = await apiLogService.updateApiLog(id, validatedData)

    if (!result.success) {
      notFound(res, 'API log not found')
      return
    }

    success(res, { id, ...validatedData }, 'API log updated successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.issues)
      return
    }
    console.error('Error updating API log:', err)
    error(res, 'Internal server error')
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
      error(res, 'Invalid ID', 400)
      return
    }

    const result = await apiLogService.deleteApiLog(id)

    if (!result.success) {
      notFound(res, 'API log not found')
      return
    }

    success(res, null, 'API log deleted successfully')
  } catch (err: unknown) {
    console.error('Error deleting API log:', err)
    error(res, 'Internal server error')
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

import { Elysia } from 'elysia'
const apiLogRouter = new Elysia({
  prefix: '/api-logs'
})
  .get('/', getApiLogs)
  .get('/:id', getApiLog)
  .post('/', createApiLog)
  .put('/:id', updateApiLog)
  .delete('/:id', deleteApiLog)
export default apiLogRouter
