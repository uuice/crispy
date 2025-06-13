import { db } from '@src/libs/db'
import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, validationError, notFound } from '../../utils/response'

// Validation schemas
const createAdSchema = z.object({
  title: z.string().min(1),
  content: z.string().optional(),
  image_url: z.string().optional(),
  link_url: z.string().optional(),
  position: z.string().optional(),
  start_time: z.number().optional(),
  end_time: z.number().optional(),
  status: z.number().default(10),
  sort: z.number().default(0)
})

const updateAdSchema = createAdSchema.partial()

// Get single ad
export const getAd = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, 'Invalid ID', 400)
      return
    }

    const ad = await db
      .selectFrom('ads')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (!ad) {
      notFound(res, 'Ad not found')
      return
    }

    success(res, ad)
  } catch (err: unknown) {
    console.error('Error fetching ad:', err)
    error(res, 'Internal server error')
  }
}

// Get ads list with pagination
export const getAds = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query['page'] as string) || 1
    const pageSize = parseInt(req.query['pageSize'] as string) || 10
    const offset = (page - 1) * pageSize

    const [ads, total] = await Promise.all([
      db
        .selectFrom('ads')
        .selectAll()
        .where('is_delete', '=', 0)
        .limit(pageSize)
        .offset(offset)
        .execute(),
      db
        .selectFrom('ads')
        .select((eb) => [eb.fn.count('id').as('count')])
        .where('is_delete', '=', 0)
        .executeTakeFirst()
    ])

    success(res, {
      data: ads,
      pagination: {
        total: Number(total?.count) || 0,
        page,
        pageSize,
        totalPages: Math.ceil((Number(total?.count) || 0) / pageSize)
      }
    })
  } catch (err: unknown) {
    console.error('Error fetching ads:', err)
    error(res, 'Internal server error')
  }
}

// Create new ad
export const createAd = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = createAdSchema.parse(req.body)

    const now = Date.now()
    const newAd = {
      ...validatedData,
      create_time: now,
      update_time: now,
      is_delete: 0
    }

    const result = await db.insertInto('ads').values(newAd).executeTakeFirst()

    success(
      res,
      {
        id: Number(result.insertId),
        ...newAd
      },
      'Ad created successfully'
    )
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
    }
    console.error('Error creating ad:', err)
    error(res, 'Internal server error')
  }
}

// Update ad
export const updateAd = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, 'Invalid ID', 400)
      return
    }

    const validatedData = updateAdSchema.parse(req.body)

    const updateData = {
      ...validatedData,
      update_time: Date.now()
    }

    const result = await db
      .updateTable('ads')
      .set(updateData)
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
      notFound(res, 'Ad not found')
      return
    }

    success(res, { id, ...updateData }, 'Ad updated successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
    }
    console.error('Error updating ad:', err)
    error(res, 'Internal server error')
  }
}

// Delete ad (logical delete)
export const deleteAd = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, 'Invalid ID', 400)
      return
    }

    const result = await db
      .updateTable('ads')
      .set({
        is_delete: 10,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
      notFound(res, 'Ad not found')
      return
    }

    success(res, null, 'Ad deleted successfully')
  } catch (err: unknown) {
    console.error('Error deleting ad:', err)
    error(res, 'Internal server error')
  }
}
