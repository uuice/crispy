import { db } from '@src/libs/db'
import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, validationError, notFound } from '../../utils/response'

// Validation schemas
const createAttrSchema = z.object({
  title: z.string().min(1),
  alias: z.string().optional(),
  sort: z.number().default(0),
  status: z.number().default(10)
})

const updateAttrSchema = createAttrSchema.partial()

// Get single attr
export const getAttr = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, 'Invalid ID', 400)
      return
    }

    const attr = await db
      .selectFrom('attrs')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (!attr) {
      notFound(res, 'Attribute not found')
      return
    }

    success(res, attr)
  } catch (err: unknown) {
    console.error('Error fetching attribute:', err)
    error(res, 'Internal server error')
  }
}

// Get attrs list with pagination
export const getAttrs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query['page'] as string) || 1
    const pageSize = parseInt(req.query['pageSize'] as string) || 10
    const offset = (page - 1) * pageSize

    // Get filters from query
    const title = req.query['title'] as string | undefined
    const status = req.query['status'] ? parseInt(req.query['status'] as string) : undefined
    const startTime = req.query['start_time']
      ? parseInt(req.query['start_time'] as string)
      : undefined
    const endTime = req.query['end_time'] ? parseInt(req.query['end_time'] as string) : undefined

    let query = db.selectFrom('attrs').selectAll().where('is_delete', '=', 0)

    // Add filters if provided
    if (title) {
      query = query.where('title', 'like', `%${title}%`)
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

    const [attrs, total] = await Promise.all([
      query.limit(pageSize).offset(offset).execute(),
      query.select((eb) => [eb.fn.count('id').as('count')]).executeTakeFirst()
    ])

    success(res, {
      data: attrs,
      pagination: {
        total: Number(total?.count) || 0,
        page,
        pageSize,
        totalPages: Math.ceil((Number(total?.count) || 0) / pageSize)
      }
    })
  } catch (err: unknown) {
    console.error('Error fetching attributes:', err)
    error(res, 'Internal server error')
  }
}

// Create new attr
export const createAttr = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = createAttrSchema.parse(req.body)

    const now = Date.now()
    const newAttr = {
      ...validatedData,
      create_time: now,
      update_time: now,
      is_delete: 0
    }

    const result = await db.insertInto('attrs').values(newAttr).executeTakeFirst()

    success(
      res,
      {
        id: Number(result.insertId),
        ...newAttr
      },
      'Attribute created successfully'
    )
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
    }
    console.error('Error creating attribute:', err)
    error(res, 'Internal server error')
  }
}

// Update attr
export const updateAttr = async (
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

    const validatedData = updateAttrSchema.parse(req.body)

    const updateData = {
      ...validatedData,
      update_time: Date.now()
    }

    const result = await db
      .updateTable('attrs')
      .set(updateData)
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
      notFound(res, 'Attribute not found')
      return
    }

    success(res, { id, ...updateData }, 'Attribute updated successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
    }
    console.error('Error updating attribute:', err)
    error(res, 'Internal server error')
  }
}

// Delete attr (logical delete)
export const deleteAttr = async (
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
      .updateTable('attrs')
      .set({
        is_delete: 10,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
      notFound(res, 'Attribute not found')
      return
    }

    success(res, null, 'Attribute deleted successfully')
  } catch (err: unknown) {
    console.error('Error deleting attribute:', err)
    error(res, 'Internal server error')
  }
}

// Export all functions as a controller object
export const attrController = {
  getAttr,
  getAttrs,
  createAttr,
  updateAttr,
  deleteAttr
}
