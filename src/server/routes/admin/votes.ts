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

    // Build filters from query
    const filters: VoteFilters = {}
    if (req.query['title']) {
      filters.title = req.query['title'] as string
    }
    if (req.query['is_multiple']) {
      filters.is_multiple = parseInt(req.query['is_multiple'] as string)
    }
    if (req.query['status']) {
      filters.status = parseInt(req.query['status'] as string)
    }
    if (req.query['start_time']) {
      filters.startTime = parseInt(req.query['start_time'] as string)
    }
    if (req.query['end_time']) {
      filters.endTime = parseInt(req.query['end_time'] as string)
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
      validationError(res, err.errors)
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
      validationError(res, err.errors)
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

// Export all functions as a controller object
export const voteController = {
  getVote,
  getVotes,
  createVote,
  updateVote,
  deleteVote
}
