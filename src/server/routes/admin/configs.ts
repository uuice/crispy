import { db } from '@src/libs/db'
import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, validationError, notFound } from '../../utils/response'

// Validation schemas
const createConfigSchema = z.object({
  title: z.string().min(1),
  alias: z.string().optional(),
  value: z.string().min(1),
  type_id: z.number().optional(),
  type_ids: z.string().optional(),
  sort: z.number().default(0),
  status: z.number().default(10)
})

const updateConfigSchema = createConfigSchema.partial()

// Get single config
export const getConfig = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, 'Invalid ID', 400)
      return
    }

    const config = await db
      .selectFrom('configs')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (!config) {
      notFound(res, 'Config not found')
      return
    }

    success(res, config)
  } catch (err: unknown) {
    console.error('Error fetching config:', err)
    error(res, 'Internal server error')
  }
}

// Get configs list with pagination
export const getConfigs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query['page'] as string) || 1
    const pageSize = parseInt(req.query['pageSize'] as string) || 10
    const offset = (page - 1) * pageSize

    // Get filters from query
    const title = req.query['title'] as string | undefined
    const alias = req.query['alias'] as string | undefined
    const typeId = req.query['type_id'] ? parseInt(req.query['type_id'] as string) : undefined
    const status = req.query['status'] ? parseInt(req.query['status'] as string) : undefined
    const startTime = req.query['start_time']
      ? parseInt(req.query['start_time'] as string)
      : undefined
    const endTime = req.query['end_time'] ? parseInt(req.query['end_time'] as string) : undefined

    let query = db.selectFrom('configs').selectAll().where('is_delete', '=', 0)

    // Add filters if provided
    if (title) {
      query = query.where('title', 'like', `%${title}%`)
    }
    if (alias) {
      query = query.where('alias', 'like', `%${alias}%`)
    }
    if (typeId !== undefined && !isNaN(typeId)) {
      query = query.where('type_id', '=', typeId)
    }
    if (status !== undefined && !isNaN(status)) {
      query = query.where('status', '=', status)
    }
    if (startTime) {
      query = query.where('create_time', '>=', startTime)
    }
    if (endTime) {
      query = query.where('create_time', '<=', endTime)
    }

    // Order by create_time desc by default
    query = query.orderBy('create_time', 'desc')

    const [configs, total] = await Promise.all([
      query.limit(pageSize).offset(offset).execute(),
      query.select((eb) => [eb.fn.count('id').as('count')]).executeTakeFirst()
    ])

    success(res, {
      data: configs,
      pagination: {
        total: Number(total?.count) || 0,
        page,
        pageSize,
        totalPages: Math.ceil((Number(total?.count) || 0) / pageSize)
      }
    })
  } catch (err: unknown) {
    console.error('Error fetching configs:', err)
    error(res, 'Internal server error')
  }
}

// Create new config
export const createConfig = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = createConfigSchema.parse(req.body)

    const now = Date.now()
    const newConfig = {
      ...validatedData,
      create_time: now,
      update_time: now,
      is_delete: 0
    }

    const result = await db.insertInto('configs').values(newConfig).executeTakeFirst()

    success(
      res,
      {
        id: Number(result.insertId),
        ...newConfig
      },
      'Config created successfully'
    )
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
    }
    console.error('Error creating config:', err)
    error(res, 'Internal server error')
  }
}

// Update config
export const updateConfig = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, 'Invalid ID', 400)
      return
    }

    const validatedData = updateConfigSchema.parse(req.body)

    const updateData = {
      ...validatedData,
      update_time: Date.now()
    }

    const result = await db
      .updateTable('configs')
      .set(updateData)
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
      notFound(res, 'Config not found')
      return
    }

    success(res, { id, ...updateData }, 'Config updated successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
    }
    console.error('Error updating config:', err)
    error(res, 'Internal server error')
  }
}

// Delete config (logical delete)
export const deleteConfig = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, 'Invalid ID', 400)
      return
    }

    const result = await db
      .updateTable('configs')
      .set({
        is_delete: 10,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
      notFound(res, 'Config not found')
      return
    }

    success(res, null, 'Config deleted successfully')
  } catch (err: unknown) {
    console.error('Error deleting config:', err)
    error(res, 'Internal server error')
  }
}

// Export all functions as a controller object
export const configController = {
  getConfig,
  getConfigs,
  createConfig,
  updateConfig,
  deleteConfig
}
