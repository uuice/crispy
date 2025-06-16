import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, validationError, notFound } from '../../utils/response'
import {
  voteService,
  CreateVoteData,
  UpdateVoteData,
  VoteFilters
} from '../../services/voteService'

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

// Export all functions as a controller object
export const voteController = {
  getVote,
  getVotes
}
