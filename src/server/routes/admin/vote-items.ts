import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, validationError, notFound } from '../../utils/response'
import {
  voteItemService,
  CreateVoteItemData,
  UpdateVoteItemData,
  VoteItemFilters
} from '../../services/voteItemService'

// Validation schemas
const createVoteItemSchema = z.object({
  title: z.string().min(1),
  vote_id: z.number(),
  status: z.number().default(10)
})

const updateVoteItemSchema = createVoteItemSchema.partial()

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
      update_time: req.query['update_time']
        ? parseInt(req.query['update_time'] as string)
        : undefined,
      create_time: req.query['create_time']
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

// Create new vote item
export const createVoteItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = createVoteItemSchema.parse(req.body) as CreateVoteItemData

    const newVoteItem = await voteItemService.createVoteItem(validatedData)
    success(res, newVoteItem, 'Vote item created successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.issues)
      return
    }
    if (err instanceof Error && err.message === 'Vote not found') {
      error(res, 'Vote not found', 400)
      return
    }
    console.error('Error creating vote item:', err)
    error(res, 'Internal server error')
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
      error(res, 'Invalid ID', 400)
      return
    }

    const validatedData = updateVoteItemSchema.parse(req.body) as UpdateVoteItemData

    const updated = await voteItemService.updateVoteItem(id, validatedData)

    if (!updated) {
      notFound(res, 'Vote item not found')
      return
    }

    success(res, { id, ...validatedData }, 'Vote item updated successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.issues)
      return
    }
    if (err instanceof Error && err.message === 'Vote not found') {
      error(res, 'Vote not found', 400)
      return
    }
    console.error('Error updating vote item:', err)
    error(res, 'Internal server error')
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
      error(res, 'Invalid ID', 400)
      return
    }

    const deleted = await voteItemService.deleteVoteItem(id)

    if (!deleted) {
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

import { Elysia } from 'elysia'
const voteItemRouter = new Elysia({
  prefix: '/vote-items'
})
  .get('/', getVoteItems)
  .get('/:id', getVoteItem)
  .post('/', createVoteItem)
  .put('/:id', updateVoteItem)
  .delete('/:id', deleteVoteItem)
export default voteItemRouter
