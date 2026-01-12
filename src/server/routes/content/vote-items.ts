import { NextFunction, Request, Response } from 'express'
import { error, notFound, success } from '../../utils/response'
import { voteItemService } from '../../services/voteItemService'

// Get single vote item
export const getVoteItem = async (
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

    const voteItem = await voteItemService.getVoteItemById(id)

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
export const getVoteItems = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query['page'] as string) || 1
    const pageSize = parseInt(req.query['pageSize'] as string) || 10

    const filters = {
      title: req.query['title'] as string | undefined,
      vote_id:
        req.query['vote_id'] !== undefined ? parseInt(req.query['vote_id'] as string) : undefined,
      status:
        req.query['status'] !== undefined ? parseInt(req.query['status'] as string) : undefined,
      is_delete:
        req.query['is_delete'] !== undefined
          ? parseInt(req.query['is_delete'] as string)
          : undefined,
      update_time:
        req.query['update_time'] !== undefined
          ? parseInt(req.query['update_time'] as string)
          : undefined,
      create_time:
        req.query['create_time'] !== undefined
          ? parseInt(req.query['create_time'] as string)
          : undefined
    }
    const result = await voteItemService.getVoteItems({ page, pageSize }, filters)
    success(res, result)
  } catch (err: unknown) {
    console.error('Error fetching vote items:', err)
    error(res, 'Internal server error')
  }
}

// Export all functions as a controller object
export const voteItemController = {
  getVoteItem,
  getVoteItems
}
