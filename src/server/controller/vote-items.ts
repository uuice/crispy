import { NextFunction, Request, Response } from 'express'
import { error, handleError, success } from '../utils/response'
import { voteItemService } from '../services/voteItemService'
import { VoteItemFilters } from '@src/types'

// Get single vote item
export const getVoteItem = async (
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

    const voteItem = await voteItemService.getById(id)

    if (!voteItem) {
      error(res, '投票选项不存在', 404)
      return
    }

    success(res, voteItem)
  } catch (err: unknown) {
    handleError(res, err, 'getVoteItem')
  }
}

// Get vote items list with pagination
export const getVoteItems = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await voteItemService.getVoteItems(req.query as unknown as VoteItemFilters)
    success(res, result)
  } catch (err: unknown) {
    handleError(res, err, 'getVoteItems')
  }
}

// Create new vote item
export const createVoteItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const newVoteItem = await voteItemService.create(req.body)
    success(res, newVoteItem, '投票选项创建成功')
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Vote not found') {
      error(res, '投票不存在', 400)
      return
    }
    handleError(res, err, 'createVoteItem')
  }
}

// Update vote item
export const updateVoteItem = async (
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

    const updated = await voteItemService.update(id, req.body)

    if (!updated) {
      error(res, '投票选项不存在', 404)
      return
    }

    success(res, { id, ...req.body }, '投票选项更新成功')
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Vote not found') {
      error(res, '投票不存在', 400)
      return
    }
    handleError(res, err, 'updateVoteItem')
  }
}

// Delete vote item (logical delete)
export const deleteVoteItem = async (
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

    const deleted = await voteItemService.delete(id)

    if (!deleted) {
      error(res, '投票选项不存在', 404)
      return
    }

    success(res, null, '投票选项删除成功')
  } catch (err: unknown) {
    handleError(res, err, 'deleteVoteItem')
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
