import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { tagService } from '../../services/tagService'
import { success, error, validationError, notFound } from '../../utils/response'

// Get single tag
export const getTag = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, 'Invalid ID', 400)
      return
    }

    const tag = await tagService.getTagById(id)
    success(res, tag)
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Tag not found') {
      notFound(res, 'Tag not found')
      return
    }
    console.error('Error fetching tag:', err)
    error(res, 'Internal server error')
  }
}

// Get tags list with pagination
export const getTags = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query['page'] as string) || 1
    const pageSize = parseInt(req.query['pageSize'] as string) || 10

    const filters = {
      title: req.query['title'] as string | undefined,
      des: req.query['des'] as string | undefined,
      sort: req.query['sort'] ? parseInt(req.query['sort'] as string) : undefined,
      status: req.query['status'] ? parseInt(req.query['status'] as string) : undefined,
      type_id: req.query['type_id'] ? parseInt(req.query['type_id'] as string) : undefined,
      value: req.query['value'] as string | undefined,
      update_time: req.query['update_time']
        ? parseInt(req.query['update_time'] as string)
        : undefined,
      is_delete: req.query['is_delete'] ? parseInt(req.query['is_delete'] as string) : undefined
    }
    const result = await tagService.getTags({ page, pageSize }, filters)
    success(res, result)
  } catch (err: unknown) {
    console.error('Error fetching tags:', err)
    error(res, 'Internal server error')
  }
}

// Export all functions as a controller object
export const tagController = {
  getTag,
  getTags
}
