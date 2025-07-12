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


    const filters = {
      title: req.query['title'] as string | undefined,
      count: req.query['count'] ? parseInt(req.query['count'] as string) : undefined,
      is_multiple: req.query['is_multiple']
        ? parseInt(req.query['is_multiple'] as string)
        : undefined,
      status: req.query['status'] ? parseInt(req.query['status'] as string) : undefined,
      vote_items: req.query['vote_items'] as string | undefined,
      is_delete: req.query['is_delete'] ? parseInt(req.query['is_delete'] as string) : undefined,
      update_time: req.query['update_time']
        ? parseInt(req.query['update_time'] as string)
        : undefined,
      create_time: req.query['create_time']
        ? parseInt(req.query['create_time'] as string)
        : undefined,
      start_time: req.query['start_time'] ? parseInt(req.query['start_time'] as string) : undefined,
      end_time: req.query['end_time'] ? parseInt(req.query['end_time'] as string) : undefined
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
