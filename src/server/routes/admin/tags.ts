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
      site_name: req.query['site_name'] as string | undefined,
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

// Create new tag
export const createTag = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tag = await tagService.createTag(req.body)
    success(res, tag, 'Tag created successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
    }
    console.error('Error creating tag:', err)
    error(res, 'Internal server error')
  }
}

// Update tag
export const updateTag = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, 'Invalid ID', 400)
      return
    }

    const tag = await tagService.updateTag(id, req.body)
    success(res, tag, 'Tag updated successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
    }
    if (err instanceof Error && err.message === 'Tag not found') {
      notFound(res, 'Tag not found')
      return
    }
    console.error('Error updating tag:', err)
    error(res, 'Internal server error')
  }
}

// Delete tag (logical delete)
export const deleteTag = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, 'Invalid ID', 400)
      return
    }

    await tagService.deleteTag(id)
    success(res, null, 'Tag deleted successfully')
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Tag not found') {
      notFound(res, 'Tag not found')
      return
    }
    console.error('Error deleting tag:', err)
    error(res, 'Internal server error')
  }
}

// Export all functions as a controller object
export const tagController = {
  getTag,
  getTags,
  createTag,
  updateTag,
  deleteTag
}
