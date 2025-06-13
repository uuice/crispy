import { db } from '@src/libs/db'
import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, validationError, notFound } from '../../utils/response'

// Validation schemas
const createKeywordSchema = z.object({
  title: z.string().min(1),
  alias: z.string().min(1),
  des: z.string().optional(),
  sort: z.number().default(0),
  status: z.number().default(10)
})

const updateKeywordSchema = createKeywordSchema.partial()

// Get single keyword
export const getKeyword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, 'Invalid ID', 400)
      return
    }

    const keyword = await db
      .selectFrom('keywords')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (!keyword) {
      notFound(res, 'Keyword not found')
      return
    }

    success(res, keyword)
  } catch (err: unknown) {
    console.error('Error fetching keyword:', err)
    error(res, 'Internal server error')
  }
}

// Get keywords list with pagination
export const getKeywords = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query['page'] as string) || 1
    const pageSize = parseInt(req.query['pageSize'] as string) || 10
    const offset = (page - 1) * pageSize

    // Get filters from query
    const title = req.query['title'] as string | undefined
    const alias = req.query['alias'] as string | undefined
    const status = req.query['status'] ? parseInt(req.query['status'] as string) : undefined
    const startTime = req.query['start_time']
      ? parseInt(req.query['start_time'] as string)
      : undefined
    const endTime = req.query['end_time'] ? parseInt(req.query['end_time'] as string) : undefined

    let query = db.selectFrom('keywords').selectAll().where('is_delete', '=', 0)

    // Add filters if provided
    if (title) {
      query = query.where('title', 'like', `%${title}%`)
    }
    if (alias) {
      query = query.where('alias', 'like', `%${alias}%`)
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

    const [keywords, total] = await Promise.all([
      query.limit(pageSize).offset(offset).execute(),
      query.select((eb) => [eb.fn.count('id').as('count')]).executeTakeFirst()
    ])

    success(res, {
      data: keywords,
      pagination: {
        total: Number(total?.count) || 0,
        page,
        pageSize,
        totalPages: Math.ceil((Number(total?.count) || 0) / pageSize)
      }
    })
  } catch (err: unknown) {
    console.error('Error fetching keywords:', err)
    error(res, 'Internal server error')
  }
}

// Create new keyword
export const createKeyword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = createKeywordSchema.parse(req.body)

    const now = Date.now()
    const newKeyword = {
      ...validatedData,
      create_time: now,
      update_time: now,
      is_delete: 0
    }

    const result = await db.insertInto('keywords').values(newKeyword).executeTakeFirst()

    success(
      res,
      {
        id: Number(result.insertId),
        ...newKeyword
      },
      'Keyword created successfully'
    )
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
    }
    console.error('Error creating keyword:', err)
    error(res, 'Internal server error')
  }
}

// Update keyword
export const updateKeyword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, 'Invalid ID', 400)
      return
    }

    const validatedData = updateKeywordSchema.parse(req.body)

    const updateData = {
      ...validatedData,
      update_time: Date.now()
    }

    const result = await db
      .updateTable('keywords')
      .set(updateData)
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
      notFound(res, 'Keyword not found')
      return
    }

    success(res, { id, ...updateData }, 'Keyword updated successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
    }
    console.error('Error updating keyword:', err)
    error(res, 'Internal server error')
  }
}

// Delete keyword (logical delete)
export const deleteKeyword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, 'Invalid ID', 400)
      return
    }

    const result = await db
      .updateTable('keywords')
      .set({
        is_delete: 10,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
      notFound(res, 'Keyword not found')
      return
    }

    success(res, null, 'Keyword deleted successfully')
  } catch (err: unknown) {
    console.error('Error deleting keyword:', err)
    error(res, 'Internal server error')
  }
}

// Export all functions as a controller object
export const keywordController = {
  getKeyword,
  getKeywords,
  createKeyword,
  updateKeyword,
  deleteKeyword
}
