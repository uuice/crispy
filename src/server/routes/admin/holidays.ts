import { db } from '@src/libs/db'
import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, validationError, notFound } from '../../utils/response'

// Validation schemas
const createHolidaySchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
  sort: z.number().default(0)
})

const updateHolidaySchema = createHolidaySchema.partial()

// Get single holiday
export const getHoliday = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, 'Invalid ID', 400)
      return
    }

    const holiday = await db
      .selectFrom('holidays')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (!holiday) {
      notFound(res, 'Holiday not found')
      return
    }

    success(res, holiday)
  } catch (err: unknown) {
    console.error('Error fetching holiday:', err)
    error(res, 'Internal server error')
  }
}

// Get holidays list with pagination
export const getHolidays = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query['page'] as string) || 1
    const pageSize = parseInt(req.query['pageSize'] as string) || 10
    const offset = (page - 1) * pageSize

    // Get filters from query
    const name = req.query['name'] as string | undefined
    const value = req.query['value'] as string | undefined
    const startTime = req.query['start_time']
      ? parseInt(req.query['start_time'] as string)
      : undefined
    const endTime = req.query['end_time'] ? parseInt(req.query['end_time'] as string) : undefined

    let query = db.selectFrom('holidays').selectAll().where('is_delete', '=', 0)

    // Add filters if provided
    if (name) {
      query = query.where('name', 'like', `%${name}%`)
    }
    if (value) {
      query = query.where('value', 'like', `%${value}%`)
    }
    if (startTime) {
      query = query.where('creat_time', '>=', startTime)
    }
    if (endTime) {
      query = query.where('creat_time', '<=', endTime)
    }

    // Order by creat_time desc by default
    query = query.orderBy('creat_time', 'desc')

    const [holidays, total] = await Promise.all([
      query.limit(pageSize).offset(offset).execute(),
      query.select((eb) => [eb.fn.count('id').as('count')]).executeTakeFirst()
    ])

    success(res, {
      data: holidays,
      pagination: {
        total: Number(total?.count) || 0,
        page,
        pageSize,
        totalPages: Math.ceil((Number(total?.count) || 0) / pageSize)
      }
    })
  } catch (err: unknown) {
    console.error('Error fetching holidays:', err)
    error(res, 'Internal server error')
  }
}

// Create new holiday
export const createHoliday = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = createHolidaySchema.parse(req.body)

    const now = Date.now()
    const newHoliday = {
      ...validatedData,
      creat_time: now,
      update_time: now,
      is_delete: 0
    }

    const result = await db.insertInto('holidays').values(newHoliday).executeTakeFirst()

    success(
      res,
      {
        id: Number(result.insertId),
        ...newHoliday
      },
      'Holiday created successfully'
    )
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
    }
    console.error('Error creating holiday:', err)
    error(res, 'Internal server error')
  }
}

// Update holiday
export const updateHoliday = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, 'Invalid ID', 400)
      return
    }

    const validatedData = updateHolidaySchema.parse(req.body)

    const updateData = {
      ...validatedData,
      update_time: Date.now()
    }

    const result = await db
      .updateTable('holidays')
      .set(updateData)
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
      notFound(res, 'Holiday not found')
      return
    }

    success(res, { id, ...updateData }, 'Holiday updated successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
    }
    console.error('Error updating holiday:', err)
    error(res, 'Internal server error')
  }
}

// Delete holiday (logical delete)
export const deleteHoliday = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, 'Invalid ID', 400)
      return
    }

    const result = await db
      .updateTable('holidays')
      .set({
        is_delete: 10,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
      notFound(res, 'Holiday not found')
      return
    }

    success(res, null, 'Holiday deleted successfully')
  } catch (err: unknown) {
    console.error('Error deleting holiday:', err)
    error(res, 'Internal server error')
  }
}

// Export all functions as a controller object
export const holidayController = {
  getHoliday,
  getHolidays,
  createHoliday,
  updateHoliday,
  deleteHoliday
}
