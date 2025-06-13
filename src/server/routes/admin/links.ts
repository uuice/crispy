import { db } from '@src/libs/db'
import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, validationError, notFound } from '../../utils/response'

// Validation schemas
const createLinkSchema = z.object({
  site_name: z.string().min(1),
  des: z.string().optional(),
  url: z.string().url(),
  logo: z.string().optional(),
  method: z.string().optional(),
  type_id: z.number().default(0),
  sort: z.number().default(0),
  status: z.number().default(10)
})

const updateLinkSchema = createLinkSchema.partial()

// Get single link
export const getLink = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, 'Invalid ID', 400)
      return
    }

    const link = await db
      .selectFrom('links')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (!link) {
      notFound(res, 'Link not found')
      return
    }

    success(res, link)
  } catch (err: unknown) {
    console.error('Error fetching link:', err)
    error(res, 'Internal server error')
  }
}

// Get links list with pagination
export const getLinks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query['page'] as string) || 1
    const pageSize = parseInt(req.query['pageSize'] as string) || 10
    const offset = (page - 1) * pageSize

    // Get filters from query
    const siteName = req.query['site_name'] as string | undefined
    const url = req.query['url'] as string | undefined
    const status = req.query['status'] ? parseInt(req.query['status'] as string) : undefined
    const startTime = req.query['start_time']
      ? parseInt(req.query['start_time'] as string)
      : undefined
    const endTime = req.query['end_time'] ? parseInt(req.query['end_time'] as string) : undefined

    let query = db.selectFrom('links').selectAll().where('is_delete', '=', 0)

    // Add filters if provided
    if (siteName) {
      query = query.where('site_name', 'like', `%${siteName}%`)
    }
    if (url) {
      query = query.where('url', 'like', `%${url}%`)
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

    const [links, total] = await Promise.all([
      query.limit(pageSize).offset(offset).execute(),
      query.select((eb) => [eb.fn.count('id').as('count')]).executeTakeFirst()
    ])

    success(res, {
      data: links,
      pagination: {
        total: Number(total?.count) || 0,
        page,
        pageSize,
        totalPages: Math.ceil((Number(total?.count) || 0) / pageSize)
      }
    })
  } catch (err: unknown) {
    console.error('Error fetching links:', err)
    error(res, 'Internal server error')
  }
}

// Create new link
export const createLink = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = createLinkSchema.parse(req.body)

    const now = Date.now()
    const newLink = {
      ...validatedData,
      create_time: now,
      update_time: now,
      is_delete: 0
    }

    const result = await db.insertInto('links').values(newLink).executeTakeFirst()

    success(
      res,
      {
        id: Number(result.insertId),
        ...newLink
      },
      'Link created successfully'
    )
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
    }
    console.error('Error creating link:', err)
    error(res, 'Internal server error')
  }
}

// Update link
export const updateLink = async (
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

    const validatedData = updateLinkSchema.parse(req.body)

    const updateData = {
      ...validatedData,
      update_time: Date.now()
    }

    const result = await db
      .updateTable('links')
      .set(updateData)
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
      notFound(res, 'Link not found')
      return
    }

    success(res, { id, ...updateData }, 'Link updated successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
    }
    console.error('Error updating link:', err)
    error(res, 'Internal server error')
  }
}

// Delete link (logical delete)
export const deleteLink = async (
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
      .updateTable('links')
      .set({
        is_delete: 10,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
      notFound(res, 'Link not found')
      return
    }

    success(res, null, 'Link deleted successfully')
  } catch (err: unknown) {
    console.error('Error deleting link:', err)
    error(res, 'Internal server error')
  }
}

// Export all functions as a controller object
export const linkController = {
  getLink,
  getLinks,
  createLink,
  updateLink,
  deleteLink
}
