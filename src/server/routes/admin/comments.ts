import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, validationError, notFound } from '../../utils/response'
import {
  commentService,
  CreateCommentData,
  UpdateCommentData,
  CommentFilters
} from '../../services/commentService'

// Validation schemas
const createCommentSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  user_id: z.number(),
  parent_id: z.number().optional(),
  status: z.number().default(10),
  good_article: z.number().default(0),
  bad_article: z.number().default(0),
  not_article: z.number().default(0)
})

const updateCommentSchema = createCommentSchema.partial()

// Get single comment
export const getComment = async (
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

    const comment = await commentService.getCommentById(id)

    if (!comment) {
      notFound(res, 'Comment not found')
      return
    }

    success(res, comment)
  } catch (err: unknown) {
    console.error('Error fetching comment:', err)
    error(res, 'Internal server error')
  }
}

// Get comments list with pagination
export const getComments = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query['page'] as string) || 1
    const pageSize = parseInt(req.query['pageSize'] as string) || 10

    // Build filters from query
    const filters: CommentFilters = {}
    if (req.query['content']) {
      filters.content = req.query['content'] as string
    }
    if (req.query['title']) {
      filters.title = req.query['title'] as string
    }
    if (req.query['user_id']) {
      filters.user_id = parseInt(req.query['user_id'] as string)
    }
    if (req.query['parent_id']) {
      const parentId = req.query['parent_id'] as string
      filters.parent_id = parentId === 'null' ? undefined : parseInt(parentId)
    }
    if (req.query['status']) {
      filters.status = parseInt(req.query['status'] as string)
    }
    if (req.query['start_time']) {
      filters.start_time = parseInt(req.query['start_time'] as string)
    }
    if (req.query['end_time']) {
      filters.end_time = parseInt(req.query['end_time'] as string)
    }

    const result = await commentService.getComments({ page, pageSize }, filters)
    success(res, result)
  } catch (err: unknown) {
    console.error('Error fetching comments:', err)
    error(res, 'Internal server error')
  }
}

// Create new comment
export const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validation = createCommentSchema.safeParse(req.body)
    if (!validation.success) {
      validationError(res, validation.error.errors)
      return
    }

    const data: CreateCommentData = validation.data
    const comment = await commentService.createComment(data)

    success(res, comment, 'Comment created successfully')
  } catch (err: unknown) {
    console.error('Error creating comment:', err)
    error(res, 'Internal server error')
  }
}

// Update comment
export const updateComment = async (
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

    const validation = updateCommentSchema.safeParse(req.body)
    if (!validation.success) {
      validationError(res, validation.error.errors)
      return
    }

    const data: UpdateCommentData = validation.data
    const result = await commentService.updateComment(id, data)

    if (!result.success) {
      notFound(res, 'Comment not found')
      return
    }

    success(res, { updatedRows: result.numUpdatedRows }, 'Comment updated successfully')
  } catch (err: unknown) {
    console.error('Error updating comment:', err)
    error(res, 'Internal server error')
  }
}

// Delete comment (logical delete)
export const deleteComment = async (
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

    const result = await commentService.deleteComment(id)

    if (!result.success) {
      notFound(res, 'Comment not found')
      return
    }

    success(res, { deletedRows: result.numUpdatedRows }, 'Comment deleted successfully')
  } catch (err: unknown) {
    console.error('Error deleting comment:', err)
    error(res, 'Internal server error')
  }
}

// Batch update comment status
export const batchUpdateStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { ids, status } = req.body

    if (!Array.isArray(ids) || ids.length === 0) {
      error(res, 'Invalid IDs array', 400)
      return
    }

    if (typeof status !== 'number') {
      error(res, 'Invalid status', 400)
      return
    }

    const updatedCount = await commentService.batchUpdateStatus(ids, status)
    success(res, { updatedCount }, `Updated ${updatedCount} comments`)
  } catch (err: unknown) {
    console.error('Error batch updating comments:', err)
    error(res, 'Internal server error')
  }
}

// Batch delete comments
export const batchDeleteComments = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { ids } = req.body

    if (!Array.isArray(ids) || ids.length === 0) {
      error(res, 'Invalid IDs array', 400)
      return
    }

    const deletedCount = await commentService.batchDeleteComments(ids)
    success(res, { deletedCount }, `Deleted ${deletedCount} comments`)
  } catch (err: unknown) {
    console.error('Error batch deleting comments:', err)
    error(res, 'Internal server error')
  }
}

// Get comment statistics
export const getCommentStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const stats = await commentService.getCommentStats()
    success(res, stats)
  } catch (err: unknown) {
    console.error('Error fetching comment stats:', err)
    error(res, 'Internal server error')
  }
}

// Export all functions as a controller object
export const commentController = {
  getComment,
  getComments,
  createComment,
  updateComment,
  deleteComment,
  batchUpdateStatus,
  batchDeleteComments,
  getCommentStats
}
