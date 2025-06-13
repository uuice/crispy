import { db } from '@src/libs/db'
import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, validationError, notFound } from '../../utils/response'
import { sql } from 'kysely'

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

    const apiLog = await db
      .selectFrom('api_logs')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

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
    const offset = (page - 1) * pageSize

    // Get filters from query
    const userId = req.query['user_id'] ? parseInt(req.query['user_id'] as string) : undefined
    const method = req.query['method'] as string | undefined
    const path = req.query['path'] as string | undefined
    const statusCode = req.query['status_code']
      ? parseInt(req.query['status_code'] as string)
      : undefined
    const startTime = req.query['start_time']
      ? parseInt(req.query['start_time'] as string)
      : undefined
    const endTime = req.query['end_time'] ? parseInt(req.query['end_time'] as string) : undefined

    let query = db.selectFrom('api_logs').selectAll().where('is_delete', '=', 0)

    // Add filters if provided
    if (userId !== undefined && !isNaN(userId)) {
      query = query.where(sql.ref('user_id'), '=', userId)
    }
    if (method) {
      query = query.where(sql.ref('method'), '=', method)
    }
    if (path) {
      query = query.where(sql.ref('path'), 'like', `%${path}%`)
    }
    if (statusCode !== undefined && !isNaN(statusCode)) {
      query = query.where(sql.ref('status_code'), '=', statusCode)
    }
    if (startTime) {
      query = query.where(sql.ref('create_time'), '>=', startTime)
    }
    if (endTime) {
      query = query.where(sql.ref('create_time'), '<=', endTime)
    }

    // Order by create_time desc by default
    query = query.orderBy('create_time', 'desc')

    const [apiLogs, total] = await Promise.all([
      query.limit(pageSize).offset(offset).execute(),
      query.select((eb) => [eb.fn.count('id').as('count')]).executeTakeFirst()
    ])

    success(res, {
      data: apiLogs,
      pagination: {
        total: Number(total?.count) || 0,
        page,
        pageSize,
        totalPages: Math.ceil((Number(total?.count) || 0) / pageSize)
      }
    })
  } catch (err: unknown) {
    console.error('Error fetching API logs:', err)
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

    const now = Date.now()
    const newApiLog = {
      ...validatedData,
      create_time: now,
      update_time: now,
      is_delete: 0,
      query: '',
      body: ''
    }

    const result = await db.insertInto('api_logs').values(newApiLog).executeTakeFirst()

    success(
      res,
      {
        id: Number(result.insertId),
        ...newApiLog
      },
      'API log created successfully'
    )
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
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

    const updateData = {
      ...validatedData,
      update_time: Date.now()
    }

    const result = await db
      .updateTable('api_logs')
      .set(updateData)
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
      notFound(res, 'API log not found')
      return
    }

    success(res, { id, ...updateData }, 'API log updated successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
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

    const result = await db
      .updateTable('api_logs')
      .set({
        is_delete: 10,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
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
