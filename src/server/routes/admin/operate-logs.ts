import { db } from '@src/libs/db'
import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, validationError, notFound } from '../../utils/response'

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

    const log = await db
      .selectFrom('operate_logs')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

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
    const offset = (page - 1) * pageSize

    // Get filters from query
    const code = req.query['code'] as string | undefined
    const typeId = req.query['type_id'] ? parseInt(req.query['type_id'] as string) : undefined
    const userId = req.query['user_id'] ? parseInt(req.query['user_id'] as string) : undefined
    const startTime = req.query['start_time']
      ? parseInt(req.query['start_time'] as string)
      : undefined
    const endTime = req.query['end_time'] ? parseInt(req.query['end_time'] as string) : undefined

    let query = db.selectFrom('operate_logs').selectAll().where('is_delete', '=', 0)

    // Add filters if provided
    if (code) {
      query = query.where('code', 'like', `%${code}%`)
    }
    if (typeId !== undefined && !isNaN(typeId)) {
      query = query.where('type_id', '=', typeId)
    }
    if (userId !== undefined && !isNaN(userId)) {
      query = query.where('user_id', '=', userId)
    }
    if (startTime) {
      query = query.where('create_time', '>=', startTime)
    }
    if (endTime) {
      query = query.where('create_time', '<=', endTime)
    }

    // Order by create_time desc by default
    query = query.orderBy('create_time', 'desc')

    const [logs, total] = await Promise.all([
      query.limit(pageSize).offset(offset).execute(),
      query.select((eb) => [eb.fn.count('id').as('count')]).executeTakeFirst()
    ])

    success(res, {
      data: logs,
      pagination: {
        total: Number(total?.count) || 0,
        page,
        pageSize,
        totalPages: Math.ceil((Number(total?.count) || 0) / pageSize)
      }
    })
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
    const validatedData = createOperateLogSchema.parse(req.body)

    const now = Date.now()
    const newLog = {
      ...validatedData,
      create_time: now,
      update_time: now,
      is_delete: 0
    }

    const result = await db.insertInto('operate_logs').values(newLog).executeTakeFirst()

    success(
      res,
      {
        id: Number(result.insertId),
        ...newLog
      },
      'Operate log created successfully'
    )
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
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

    const validatedData = updateOperateLogSchema.parse(req.body)

    const updateData = {
      ...validatedData,
      update_time: Date.now()
    }

    const result = await db
      .updateTable('operate_logs')
      .set(updateData)
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
      notFound(res, 'Operate log not found')
      return
    }

    success(res, { id, ...updateData }, 'Operate log updated successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
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

    const result = await db
      .updateTable('operate_logs')
      .set({
        is_delete: 10,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
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
