import { NextFunction, Request, Response } from 'express'
import { error, handleError, success } from '../utils/response'
import { linkService } from '../services/linkService'
import { LinkFilters } from '@src/types'

// Get single link
export const getLink = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, '无效的ID', 400)
      return
    }

    const link = await linkService.getById(id)

    if (!link) {
      error(res, '链接不存在', 404)
      return
    }

    success(res, link)
  } catch (err: unknown) {
    handleError(res, err, 'getLink')
  }
}

// Get links list with pagination
export const getLinks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await linkService.getLinks(req.query as unknown as LinkFilters)
    success(res, result)
  } catch (err: unknown) {
    handleError(res, err, 'getLinks')
  }
}

// Create new link
export const createLink = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const newLink = await linkService.create(req.body)
    success(res, newLink, '链接创建成功')
  } catch (err: unknown) {
    handleError(res, err, 'createLink')
  }
}

// Update link
export const updateLink = async (
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

    const updated = await linkService.update(id, req.body)

    if (!updated) {
      error(res, '链接不存在', 404)
      return
    }

    success(res, { id, ...req.body }, '链接更新成功')
  } catch (err: unknown) {
    handleError(res, err, 'updateLink')
  }
}

// Delete link (logical delete)
export const deleteLink = async (
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

    const deleted = await linkService.delete(id)

    if (!deleted) {
      error(res, '链接不存在', 404)
      return
    }

    success(res, null, '链接删除成功')
  } catch (err: unknown) {
    handleError(res, err, 'deleteLink')
  }
}

// Export all functions as a controller object
export const linkController = {
  getLink,
  getLinks,
  createLink,
  updateLink,
  deleteLink
}
