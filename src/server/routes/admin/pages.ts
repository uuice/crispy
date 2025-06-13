import { db } from '@src/libs/db'
import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, validationError, notFound } from '../../utils/response'

// Validation schemas
const createPageSchema = z.object({
  title: z.string().min(1),
  alias: z.string().min(1),
  content: z.string().min(1),
  des: z.string().optional(),
  keywords: z.string().optional(),
  cover_image: z.string().optional(),
  sort: z.number().default(0),
  status: z.number().default(10)
})

const updatePageSchema = createPageSchema.partial()

// Get single page
export const getPage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, 'Invalid ID', 400)
      return
    }

    const page = await db
      .selectFrom('pages')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (!page) {
      notFound(res, 'Page not found')
      return
    }

    success(res, page)
  } catch (err: unknown) {
    console.error('Error fetching page:', err)
    error(res, 'Internal server error')
  }
}

// Get pages list with pagination
export const getPages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

    let query = db.selectFrom('pages').selectAll().where('is_delete', '=', 0)

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

    const [pages, total] = await Promise.all([
      query.limit(pageSize).offset(offset).execute(),
      query.select((eb) => [eb.fn.count('id').as('count')]).executeTakeFirst()
    ])

    success(res, {
      data: pages,
      pagination: {
        total: Number(total?.count) || 0,
        page,
        pageSize,
        totalPages: Math.ceil((Number(total?.count) || 0) / pageSize)
      }
    })
  } catch (err: unknown) {
    console.error('Error fetching pages:', err)
    error(res, 'Internal server error')
  }
}

// Create new page
export const createPage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = createPageSchema.parse(req.body)

    const now = Date.now()
    const newPage = {
      ...validatedData,
      create_time: now,
      update_time: now,
      is_delete: 0
    }

    const result = await db.insertInto('pages').values(newPage).executeTakeFirst()

    success(
      res,
      {
        id: Number(result.insertId),
        ...newPage
      },
      'Page created successfully'
    )
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
    }
    console.error('Error creating page:', err)
    error(res, 'Internal server error')
  }
}

// Update page
export const updatePage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, 'Invalid ID', 400)
      return
    }

    const validatedData = updatePageSchema.parse(req.body)

    const updateData = {
      ...validatedData,
      update_time: Date.now()
    }

    const result = await db
      .updateTable('pages')
      .set(updateData)
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
      notFound(res, 'Page not found')
      return
    }

    success(res, { id, ...updateData }, 'Page updated successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
    }
    console.error('Error updating page:', err)
    error(res, 'Internal server error')
  }
}

// Delete page (logical delete)
export const deletePage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, 'Invalid ID', 400)
      return
    }

    const result = await db
      .updateTable('pages')
      .set({
        is_delete: 10,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
      notFound(res, 'Page not found')
      return
    }

    success(res, null, 'Page deleted successfully')
  } catch (err: unknown) {
    console.error('Error deleting page:', err)
    error(res, 'Internal server error')
  }
}

// Export all functions as a controller object
export const pageController = {
  getPage,
  getPages,
  createPage,
  updatePage,
  deletePage
}
