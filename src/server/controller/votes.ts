import { NextFunction, Request, Response } from 'express'
import { error, handleError, success } from '../utils/response'
import { voteService } from '../services/voteService'
import { VoteFilters } from '@src/types'

// Get single vote
export const getVote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, '无效的ID', 400)
      return
    }

    const vote = await voteService.getById(id)

    if (!vote) {
      error(res, '投票不存在', 404)
      return
    }

    success(res, vote)
  } catch (err: unknown) {
    handleError(res, err, 'getVote')
  }
}

// Get votes list with pagination
export const getVotes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await voteService.getVotes(req.query as unknown as VoteFilters)
    success(res, result)
  } catch (err: unknown) {
    handleError(res, err, 'getVotes')
  }
}

// Create new vote
export const createVote = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const newVote = await voteService.create(req.body)
    success(res, newVote, '投票创建成功')
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Start time must be before end time') {
      error(res, '开始时间必须早于结束时间', 400)
      return
    }
    handleError(res, err, 'createVote')
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
      error(res, '无效的ID', 400)
      return
    }

    const updated = await voteService.update(id, req.body)

    if (!updated) {
      error(res, '投票不存在', 404)
      return
    }

    success(res, { id, ...req.body }, '投票更新成功')
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Start time must be before end time') {
      error(res, '开始时间必须早于结束时间', 400)
      return
    }
    handleError(res, err, 'updateVote')
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
      error(res, '无效的ID', 400)
      return
    }

    const deleted = await voteService.delete(id)

    if (!deleted) {
      error(res, '投票不存在', 404)
      return
    }

    success(res, null, '投票删除成功')
  } catch (err: unknown) {
    handleError(res, err, 'deleteVote')
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
