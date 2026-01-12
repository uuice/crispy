import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, validationError, notFound } from '../../utils/response'
import {
  voteService,
  CreateVoteData,
  UpdateVoteData,
  VoteFilters
} from '../../services/voteService'

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

    const vote = await voteService.getVoteById(id)

    if (!vote) {
      notFound(res, 'Vote not found')
      return
    }

    success(res, vote)
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

    const filters = {
      title: req.query['title'] as string | undefined,
      count: req.query['count'] !== undefined ? parseInt(req.query['count'] as string) : undefined,
      is_multiple:
        req.query['is_multiple'] !== undefined
          ? parseInt(req.query['is_multiple'] as string)
          : undefined,
      status:
        req.query['status'] !== undefined ? parseInt(req.query['status'] as string) : undefined,
      vote_items: req.query['vote_items'] as string | undefined,
      is_delete:
        req.query['is_delete'] !== undefined
          ? parseInt(req.query['is_delete'] as string)
          : undefined,
      update_time: req.query['update_time']
        ? parseInt(req.query['update_time'] as string)
        : undefined,
      create_time: req.query['create_time']
        ? parseInt(req.query['create_time'] as string)
        : undefined,
      start_time:
        req.query['start_time'] !== undefined
          ? parseInt(req.query['start_time'] as string)
          : undefined,
      end_time: req.query['end_time'] ? parseInt(req.query['end_time'] as string) : undefined
    }

    const result = await voteService.getVotes({ page, pageSize }, filters)
    success(res, result)
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
    const validatedData = createVoteSchema.parse(req.body) as CreateVoteData

    const newVote = await voteService.createVote(validatedData)
    success(res, newVote, 'Vote created successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.issues)
      return
    }
    if (err instanceof Error && err.message === 'Start time must be before end time') {
      error(res, 'Start time must be before end time', 400)
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

    const validatedData = updateVoteSchema.parse(req.body) as UpdateVoteData

    const updated = await voteService.updateVote(id, validatedData)

    if (!updated) {
      notFound(res, 'Vote not found')
      return
    }

    success(res, { id, ...validatedData }, 'Vote updated successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.issues)
      return
    }
    if (err instanceof Error && err.message === 'Start time must be before end time') {
      error(res, 'Start time must be before end time', 400)
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

    const deleted = await voteService.deleteVote(id)

    if (!deleted) {
      notFound(res, 'Vote not found')
      return
    }

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

import { Elysia } from 'elysia'
const voteRouter = new Elysia({
  prefix: '/votes'
})
  .get('/', getVotes)
  .get('/:id', getVote)
  .post('/', createVote)
  .put('/:id', updateVote)
  .delete('/:id', deleteVote)
export default voteRouter
