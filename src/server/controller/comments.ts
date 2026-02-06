import { NextFunction, Request, Response } from 'express'
import { error, handleError, success } from '../utils/response'
import { commentService } from '../services/commentService'
import { CommentFilters } from '@src/types'

// Get single comment
export const getComment = async (
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

    const comment = await commentService.getById(id)

    if (!comment) {
      error(res, '评论不存在', 404)
      return
    }

    success(res, comment)
  } catch (err: unknown) {
    handleError(res, err, 'getComment')
  }
}

// Get comments list with pagination
export const getComments = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await commentService.getComments(req.query as unknown as CommentFilters)
    success(res, result)
  } catch (err: unknown) {
    handleError(res, err, 'getComments')
  }
}

// Create new comment
export const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const comment = await commentService.create(req.body)

    success(res, comment, '评论创建成功')
  } catch (err: unknown) {
    handleError(res, err, 'createComment')
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
      error(res, '无效的ID', 400)
      return
    }

    const result = await commentService.update(id, req.body)
    success(res, result, '评论更新成功')
  } catch (err: unknown) {
    handleError(res, err, 'updateComment')
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
      error(res, '无效的ID', 400)
      return
    }

    const deleted = await commentService.delete(id)
    if (!deleted) {
      error(res, '评论不存在', 404)
      return
    }

    success(res, null, '评论删除成功')
  } catch (err: unknown) {
    handleError(res, err, 'deleteComment')
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
      error(res, '无效的ID数组', 400)
      return
    }

    if (typeof status !== 'number') {
      error(res, '无效的状态值', 400)
      return
    }

    const updatedCount = await commentService.batchUpdateStatus(ids, status)
    success(res, { updatedCount }, `已更新 ${updatedCount} 条评论`)
  } catch (err: unknown) {
    handleError(res, err, 'batchUpdateStatus')
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
      error(res, '无效的ID数组', 400)
      return
    }

    const deletedCount = await commentService.batchDeleteComments(ids)
    success(res, { deletedCount }, `已删除 ${deletedCount} 条评论`)
  } catch (err: unknown) {
    handleError(res, err, 'batchDeleteComments')
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
    handleError(res, err, 'getCommentStats')
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
