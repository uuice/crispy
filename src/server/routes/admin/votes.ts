import { db } from '@src/libs/db'
import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, validationError, notFound } from '../../utils/response'

// Validation schemas
const createVoteSchema = z.object({
  title: z.string().min(1),
  is_multiple: z.number().default(-10),
  start_time: z.number(),
  end_time: z.number(),
  status: z.number().default(10),
  vote_items: z.array(z.string()).optional()
})

const updateVoteSchema = createVoteSchema.partial()

// Get single vote
export const getVote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, 'Invalid ID', 400)
      return
    }

    const vote = await db
      .selectFrom('votes')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (!vote) {
      notFound(res, 'Vote not found')
      return
    }

    // Get vote items
    const voteItems = await db
      .selectFrom('vote_items')
      .selectAll()
      .where('vote_id', '=', id)
      .where('is_delete', '=', 0)
      .execute()

    success(res, {
      ...vote,
      items: voteItems
    })
  } catch (err: unknown) {
    console.error('Error fetching vote:', err)
    error(res, 'Internal server error')
  }
}

// Get votes list with pagination
export const getVotes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query['page'] as string) || 1
    const pageSize = parseInt(req.query['pageSize'] as string) || 10
    const offset = (page - 1) * pageSize

    // Get filters from query
    const title = req.query['title'] as string | undefined
    const isMultiple = req.query['is_multiple']
      ? parseInt(req.query['is_multiple'] as string)
      : undefined
    const status = req.query['status'] ? parseInt(req.query['status'] as string) : undefined
    const startTime = req.query['start_time']
      ? parseInt(req.query['start_time'] as string)
      : undefined
    const endTime = req.query['end_time'] ? parseInt(req.query['end_time'] as string) : undefined

    let query = db.selectFrom('votes').selectAll().where('is_delete', '=', 0)

    // Add filters if provided
    if (title) {
      query = query.where('title', 'like', `%${title}%`)
    }
    if (isMultiple !== undefined && !isNaN(isMultiple)) {
      query = query.where('is_multiple', '=', isMultiple)
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

    const [votes, total] = await Promise.all([
      query.limit(pageSize).offset(offset).execute(),
      query.select((eb) => [eb.fn.count('id').as('count')]).executeTakeFirst()
    ])

    // Get vote items for each vote
    const votesWithItems = await Promise.all(
      votes.map(async (vote) => {
        const items = await db
          .selectFrom('vote_items')
          .selectAll()
          .where('vote_id', '=', vote.id)
          .where('is_delete', '=', 0)
          .execute()
        return { ...vote, items }
      })
    )

    success(res, {
      data: votesWithItems,
      pagination: {
        total: Number(total?.count) || 0,
        page,
        pageSize,
        totalPages: Math.ceil((Number(total?.count) || 0) / pageSize)
      }
    })
  } catch (err: unknown) {
    console.error('Error fetching votes:', err)
    error(res, 'Internal server error')
  }
}

// Create new vote
export const createVote = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = createVoteSchema.parse(req.body)

    // Validate time range
    if (validatedData.start_time >= validatedData.end_time) {
      error(res, 'Start time must be before end time', 400)
      return
    }

    const now = Date.now()
    const { vote_items, ...voteData } = validatedData
    const newVote = {
      ...voteData,
      count: 0,
      create_time: now,
      update_time: now,
      is_delete: 0
    }

    // Start a transaction
    const result = await db.transaction().execute(async (trx) => {
      // Insert vote
      const voteResult = await trx.insertInto('votes').values(newVote).executeTakeFirst()
      const voteId = Number(voteResult.insertId)

      // Insert vote items if provided
      if (vote_items && vote_items.length > 0) {
        const voteItems = vote_items.map((title) => ({
          title,
          vote_id: voteId,
          status: 10,
          create_time: now,
          update_time: now,
          is_delete: 0
        }))
        await trx.insertInto('vote_items').values(voteItems).execute()
      }

      return voteResult
    })

    success(
      res,
      {
        id: Number(result.insertId),
        ...newVote
      },
      'Vote created successfully'
    )
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
    }
    console.error('Error creating vote:', err)
    error(res, 'Internal server error')
  }
}

// Update vote
export const updateVote = async (
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

    const validatedData = updateVoteSchema.parse(req.body)

    // Validate time range if both times are provided
    if (validatedData.start_time !== undefined && validatedData.end_time !== undefined) {
      if (validatedData.start_time >= validatedData.end_time) {
        error(res, 'Start time must be before end time', 400)
        return
      }
    }

    const updateData = {
      ...validatedData,
      update_time: Date.now()
    }

    // Remove vote_items from updateData as it's handled separately
    const { vote_items, ...voteUpdateData } = updateData

    // Start a transaction
    const result = await db.transaction().execute(async (trx) => {
      // Update vote
      const voteResult = await trx
        .updateTable('votes')
        .set(voteUpdateData)
        .where('id', '=', id)
        .where('is_delete', '=', 0)
        .executeTakeFirst()

      if (voteResult.numUpdatedRows === 0n) {
        throw new Error('Vote not found')
      }

      // Update vote items if provided
      if (vote_items !== undefined) {
        // Delete existing vote items
        await trx
          .updateTable('vote_items')
          .set({
            is_delete: 10,
            update_time: Date.now()
          })
          .where('vote_id', '=', id)
          .where('is_delete', '=', 0)
          .execute()

        // Insert new vote items
        if (vote_items.length > 0) {
          const voteItems = vote_items.map((title) => ({
            title,
            vote_id: id,
            status: 10,
            create_time: Date.now(),
            update_time: Date.now(),
            is_delete: 0
          }))
          await trx.insertInto('vote_items').values(voteItems).execute()
        }
      }

      return voteResult
    })

    success(res, { id, ...updateData }, 'Vote updated successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
    }
    if (err instanceof Error && err.message === 'Vote not found') {
      notFound(res, 'Vote not found')
      return
    }
    console.error('Error updating vote:', err)
    error(res, 'Internal server error')
  }
}

// Delete vote (logical delete)
export const deleteVote = async (
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

    // Start a transaction
    await db.transaction().execute(async (trx) => {
      // Delete vote
      const voteResult = await trx
        .updateTable('votes')
        .set({
          is_delete: 10,
          update_time: Date.now()
        })
        .where('id', '=', id)
        .where('is_delete', '=', 0)
        .executeTakeFirst()

      if (voteResult.numUpdatedRows === 0n) {
        throw new Error('Vote not found')
      }

      // Delete associated vote items
      await trx
        .updateTable('vote_items')
        .set({
          is_delete: 10,
          update_time: Date.now()
        })
        .where('vote_id', '=', id)
        .where('is_delete', '=', 0)
        .execute()
    })

    success(res, null, 'Vote deleted successfully')
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Vote not found') {
      notFound(res, 'Vote not found')
      return
    }
    console.error('Error deleting vote:', err)
    error(res, 'Internal server error')
  }
}

// Export all functions as a controller object
export const voteController = {
  getVote,
  getVotes,
  createVote,
  updateVote,
  deleteVote
}
