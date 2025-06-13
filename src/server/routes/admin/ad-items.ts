import { db } from '@src/libs/db'
import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, validationError, notFound } from '../../utils/response'

// Validation schemas
const createAdItemSchema = z.object({
  ad_id: z.number(),
  title: z.string().min(1),
  content: z.string().optional(),
  image_url: z.string().optional(),
  link_url: z.string().optional(),
  sort: z.number().default(0),
  status: z.number().default(10)
})

const updateAdItemSchema = createAdItemSchema.partial()

// Get single ad item
export const getAdItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, 'Invalid ID', 400)
      return
    }

    const adItem = await db
      .selectFrom('ad_items')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (!adItem) {
      notFound(res, 'Ad item not found')
      return
    }

    success(res, adItem)
  } catch (err: unknown) {
    console.error('Error fetching ad item:', err)
    error(res, 'Internal server error')
  }
}

// Get ad items list with pagination
export const getAdItems = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query['page'] as string) || 1
    const pageSize = parseInt(req.query['pageSize'] as string) || 10
    const offset = (page - 1) * pageSize

    // Get ad_id from query if provided
    const adId = req.query['ad_id'] ? parseInt(req.query['ad_id'] as string) : undefined

    let query = db.selectFrom('ad_items').selectAll().where('is_delete', '=', 0)

    // Add ad_id filter if provided
    if (adId !== undefined && !isNaN(adId)) {
      query = query.where('ad_id', '=', adId)
    }

    const [adItems, total] = await Promise.all([
      query.limit(pageSize).offset(offset).execute(),
      query.select((eb) => [eb.fn.count('id').as('count')]).executeTakeFirst()
    ])

    success(res, {
      data: adItems,
      pagination: {
        total: Number(total?.count) || 0,
        page,
        pageSize,
        totalPages: Math.ceil((Number(total?.count) || 0) / pageSize)
      }
    })
  } catch (err: unknown) {
    console.error('Error fetching ad items:', err)
    error(res, 'Internal server error')
  }
}

// Create new ad item
export const createAdItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = createAdItemSchema.parse(req.body)

    // Verify that the ad exists
    const ad = await db
      .selectFrom('ads')
      .select('id')
      .where('id', '=', validatedData.ad_id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (!ad) {
      error(res, 'Ad not found', 400)
      return
    }

    const now = Date.now()
    const newAdItem = {
      ...validatedData,
      create_time: now,
      update_time: now,
      is_delete: 0
    }

    const result = await db.insertInto('ad_items').values(newAdItem).executeTakeFirst()

    success(
      res,
      {
        id: Number(result.insertId),
        ...newAdItem
      },
      'Ad item created successfully'
    )
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
    }
    console.error('Error creating ad item:', err)
    error(res, 'Internal server error')
  }
}

// Update ad item
export const updateAdItem = async (
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

    const validatedData = updateAdItemSchema.parse(req.body)

    // If ad_id is being updated, verify that the new ad exists
    if (validatedData.ad_id !== undefined) {
      const ad = await db
        .selectFrom('ads')
        .select('id')
        .where('id', '=', validatedData.ad_id)
        .where('is_delete', '=', 0)
        .executeTakeFirst()

      if (!ad) {
        error(res, 'Ad not found', 400)
        return
      }
    }

    const updateData = {
      ...validatedData,
      update_time: Date.now()
    }

    const result = await db
      .updateTable('ad_items')
      .set(updateData)
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
      notFound(res, 'Ad item not found')
      return
    }

    success(res, { id, ...updateData }, 'Ad item updated successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
    }
    console.error('Error updating ad item:', err)
    error(res, 'Internal server error')
  }
}

// Delete ad item (logical delete)
export const deleteAdItem = async (
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
      .updateTable('ad_items')
      .set({
        is_delete: 10,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
      notFound(res, 'Ad item not found')
      return
    }

    success(res, null, 'Ad item deleted successfully')
  } catch (err: unknown) {
    console.error('Error deleting ad item:', err)
    error(res, 'Internal server error')
  }
}

// Export all functions as a controller object
export const adItemController = {
  getAdItem,
  getAdItems,
  createAdItem,
  updateAdItem,
  deleteAdItem
}
