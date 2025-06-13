import { db } from '@src/libs/db'
import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, validationError, notFound } from '../../utils/response'
import { sql } from 'kysely'

// Validation schemas
const createAdditionSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().min(0),
  type: z.number().default(1), // 1: 必选, 2: 可选
  status: z.number().default(10),
  sort: z.number().default(0)
})

const updateAdditionSchema = createAdditionSchema.partial()

// Get single addition
export const getAddition = async (
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

    const addition = await db
      .selectFrom('additions')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (!addition) {
      notFound(res, 'Addition not found')
      return
    }

    success(res, addition)
  } catch (err: unknown) {
    console.error('Error fetching addition:', err)
    error(res, 'Internal server error')
  }
}

// Get additions list with pagination
export const getAdditions = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query['page'] as string) || 1
    const pageSize = parseInt(req.query['pageSize'] as string) || 10
    const offset = (page - 1) * pageSize

    // Get type from query if provided
    const type = req.query['type'] ? parseInt(req.query['type'] as string) : undefined

    let query = db.selectFrom('additions').selectAll().where('is_delete', '=', 0)

    // Add type filter if provided
    if (type !== undefined && !isNaN(type)) {
      query = query.where(sql.ref('type'), '=', type)
    }

    const [additions, total] = await Promise.all([
      query.limit(pageSize).offset(offset).execute(),
      query.select((eb) => [eb.fn.count('id').as('count')]).executeTakeFirst()
    ])

    success(res, {
      data: additions,
      pagination: {
        total: Number(total?.count) || 0,
        page,
        pageSize,
        totalPages: Math.ceil((Number(total?.count) || 0) / pageSize)
      }
    })
  } catch (err: unknown) {
    console.error('Error fetching additions:', err)
    error(res, 'Internal server error')
  }
}

// Create new addition
export const createAddition = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = createAdditionSchema.parse(req.body)

    const now = Date.now()
    const newAddition = {
      ...validatedData,
      create_time: now,
      update_time: now,
      is_delete: 0,
      fields_json: '{}' // Add default empty JSON object
    }

    const result = await db.insertInto('additions').values(newAddition).executeTakeFirst()

    success(
      res,
      {
        id: Number(result.insertId),
        ...newAddition
      },
      'Addition created successfully'
    )
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
    }
    console.error('Error creating addition:', err)
    error(res, 'Internal server error')
  }
}

// Update addition
export const updateAddition = async (
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

    const validatedData = updateAdditionSchema.parse(req.body)

    const updateData = {
      ...validatedData,
      update_time: Date.now()
    }

    const result = await db
      .updateTable('additions')
      .set(updateData)
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
      notFound(res, 'Addition not found')
      return
    }

    success(res, { id, ...updateData }, 'Addition updated successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
    }
    console.error('Error updating addition:', err)
    error(res, 'Internal server error')
  }
}

// Delete addition (logical delete)
export const deleteAddition = async (
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
      .updateTable('additions')
      .set({
        is_delete: 10,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
      notFound(res, 'Addition not found')
      return
    }

    success(res, null, 'Addition deleted successfully')
  } catch (err: unknown) {
    console.error('Error deleting addition:', err)
    error(res, 'Internal server error')
  }
}

// Export all functions as a controller object
export const additionController = {
  getAddition,
  getAdditions,
  createAddition,
  updateAddition,
  deleteAddition
}
