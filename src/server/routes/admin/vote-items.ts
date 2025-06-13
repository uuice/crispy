import { db } from '@src/libs/db'
import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, validationError, notFound } from '../../utils/response'

// Validation schemas
const createVoteItemSchema = z.object({
  title: z.string().min(1),
  vote_id: z.number(),
  status: z.number().default(10)
})

const updateVoteItemSchema = createVoteItemSchema.partial()

// Get single vote item
export const getVoteItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, 'Invalid ID', 400)
      return
    }

    const voteItem = await db
      .selectFrom('vote_items')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (!voteItem) {
      notFound(res, 'Vote item not found')
      return
    }

    success(res, voteItem)
  } catch (err: unknown) {
    console.error('Error fetching vote item:', err)
    error(res, 'Internal server error')
  }
}

// Get vote items list with pagination
export const getVoteItems = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query['page'] as string) || 1
    const pageSize = parseInt(req.query['pageSize'] as string) || 10
    const offset = (page - 1) * pageSize

    // Get filters from query
    const title = req.query['title'] as string | undefined
    const voteId = req.query['vote_id'] ? parseInt(req.query['vote_id'] as string) : undefined
    const status = req.query['status'] ? parseInt(req.query['status'] as string) : undefined
    const startTime = req.query['start_time'] ? parseInt(req.query['start_time'] as string) : undefined
    const endTime = req.query['end_time'] ? parseInt(req.query['end_time'] as string) : undefined

    let query = db.selectFrom('vote_items').selectAll().where('is_delete', '=', 0)

    // Add filters if provided
    if (title) {
      query = query.where('title', 'like', `%${title}%`)
    }
    if (voteId !== undefined && !isNaN(voteId)) {
      query = query.where('vote_id', '=', voteId)
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

    const [voteItems, total] = await Promise.all([
      query.limit(pageSize).offset(offset).execute(),
      query.select((eb) => [eb.fn.count('id').as('count')]).executeTakeFirst()
    ])

    success(res, {
      data: voteItems,
      pagination: {
        total: Number(total?.count) || 0,
        page,
        pageSize,
        totalPages: Math.ceil((Number(total?.count) || 0) / pageSize)
      }
    })
  } catch (err: unknown) {
    console.error('Error fetching vote items:', err)
    error(res, 'Internal server error')
  }
}

// Create new vote item
export const createVoteItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = createVoteItemSchema.parse(req.body)

    // Verify that the vote exists
    const vote = await db
      .selectFrom('votes')
      .select('id')
      .where('id', '=', validatedData.vote_id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (!vote) {
      error(res, 'Vote not found', 400)
      return
    }

    const now = Date.now()
    const newVoteItem = {
      ...validatedData,
      create_time: now,
      update_time: now,
      is_delete: 0
    }

    const result = await db.insertInto('vote_items').values(newVoteItem).executeTakeFirst()

    success(
      res,
      {
        id: Number(result.insertId),
        ...newVoteItem
      },
      'Vote item created successfully'
    )
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
    }
    console.error('Error creating vote item:', err)
    error(res, 'Internal server error')
  }
}

// Update vote item
export const updateVoteItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, 'Invalid ID', 400)
      return
    }

    const validatedData = updateVoteItemSchema.parse(req.body)

    // If vote_id is being updated, verify that the new vote exists
    if (validatedData.vote_id !== undefined) {
      const vote = await db
        .selectFrom('votes')
        .select('id')
        .where('id', '=', validatedData.vote_id)
        .where('is_delete', '=', 0)
        .executeTakeFirst()

      if (!vote) {
        error(res, 'Vote not found', 400)
        return
      }
    }

    const updateData = {
      ...validatedData,
      update_time: Date.now()
    }

    const result = await db
      .updateTable('vote_items')
      .set(updateData)
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
      notFound(res, 'Vote item not found')
      return
    }

    success(res, { id, ...updateData }, 'Vote item updated successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
    }
    console.error('Error updating vote item:', err)
    error(res, 'Internal server error')
  }
}

// Delete vote item (logical delete)
export const deleteVoteItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, 'Invalid ID', 400)
      return
    }

    const result = await db
      .updateTable('vote_items')
      .set({
        is_delete: 10,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
      notFound(res, 'Vote item not found')
      return
    }

    success(res, null, 'Vote item deleted successfully')
  } catch (err: unknown) {
    console.error('Error deleting vote item:', err)
    error(res, 'Internal server error')
  }
}

// Export all functions as a controller object
export const voteItemController = {
  getVoteItem,
  getVoteItems,
  createVoteItem,
  updateVoteItem,
  deleteVoteItem
}
