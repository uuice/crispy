import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, validationError, notFound } from '../../utils/response'
import { voteItemService, CreateVoteItemData, UpdateVoteItemData, VoteItemFilters } from '../../services/voteItemService'

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
export const getVoteItems = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query['page'] as string) || 1
    const pageSize = parseInt(req.query['pageSize'] as string) || 10

    // Build filters from query
    const filters: VoteItemFilters = {}
    if (req.query['title']) {
      filters.title = req.query['title'] as string
    }
    if (req.query['vote_id']) {
      filters.vote_id = parseInt(req.query['vote_id'] as string)
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

    const result = await voteItemService.getVoteItems({ page, pageSize }, filters)
    success(res, result)
  } catch (err: unknown) {
    console.error('Error fetching vote items:', err)
    error(res, 'Internal server error')
  }
}

// Create new vote item
export const createVoteItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = createVoteItemSchema.parse(req.body) as CreateVoteItemData

    const newVoteItem = await voteItemService.createVoteItem(validatedData)
    success(res, newVoteItem, 'Vote item created successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
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
export const updateVoteItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
      validationError(res, err.errors)
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
export const deleteVoteItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
