import { NextFunction, Request, Response } from 'express'
import { tagService } from '../services/tagService'
import { error, handleError, success } from '../utils/response'
import { TagFilters } from '@src/types'

// Get single tag
export const getTag = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, '无效的ID', 400)
      return
    }

    const tag = await tagService.getById(id)

    if (!tag) {
      error(res, '标签不存在', 404)
      return
    }

    success(res, tag)
  } catch (err: unknown) {
    handleError(res, err, 'getTag')
  }
}

// Get tags list with pagination
export const getTags = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await tagService.getTags(req.query as unknown as TagFilters)
    success(res, result)
  } catch (err: unknown) {
    handleError(res, err, 'getTags')
  }
}

// Create new tag
export const createTag = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tag = await tagService.create(req.body)
    success(res, tag, '标签创建成功')
  } catch (err: unknown) {
    handleError(res, err, 'createTag')
  }
}

// Update tag
export const updateTag = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, '无效的ID', 400)
      return
    }

    const tag = await tagService.update(id, req.body)
    success(res, tag, '标签更新成功')
  } catch (err: unknown) {
    handleError(res, err, 'updateTag')
  }
}

// Delete tag (logical delete)
export const deleteTag = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, '无效的ID', 400)
      return
    }

    const deleted = await tagService.delete(id)
    if (!deleted) {
      error(res, '标签不存在', 404)
      return
    }
    success(res, null, '标签删除成功')
  } catch (err: unknown) {
    handleError(res, err, 'deleteTag')
  }
}

export const getTagByValue = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const value = req.params['value']
    const tag = await tagService.getTagByValue(value)
    success(res, tag)
  } catch (err: unknown) {
    console.error('Error fetching tag by value:', err)
    error(res, 'Internal server error')
  }
}

// Export all functions as a controller object
export const tagController = {
  getTag,
  getTags,
  createTag,
  updateTag,
  deleteTag,
  getTagByValue
}
