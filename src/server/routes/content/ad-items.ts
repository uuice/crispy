import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { adItemService } from '../../services/adItemService'
import { success, error, validationError, notFound } from '../../utils/response'

// Get single ad item
export const getAdItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, 'Invalid ID', 400)
      return
    }

    const adItem = await adItemService.getAdItemById(id)
    success(res, adItem)
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Ad item not found') {
      notFound(res, 'Ad item not found')
      return
    }
    console.error('Error fetching ad item:', err)
    error(res, 'Internal server error')
  }
}

// Get ad items list with pagination
export const getAdItems = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query['page'] as string) || 1
    const pageSize = parseInt(req.query['pageSize'] as string) || 10

    const filters = {
      ad_id: req.query['ad_id'] !== undefined ? parseInt(req.query['ad_id'] as string) : undefined,
      title: req.query['title'] as string | undefined,
      content: req.query['content'] as string | undefined,
      image_url: req.query['image_url'] as string | undefined,
      url: req.query['url'] as string | undefined,
      method: req.query['method'] as string | undefined,
      sort: req.query['sort'] !== undefined ? parseInt(req.query['sort'] as string) : undefined,
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
    const result = await adItemService.getAdItems({ page, pageSize }, filters)
    success(res, result)
  } catch (err: unknown) {
    console.error('Error fetching ad items:', err)
    error(res, 'Internal server error')
  }
}

// Export all functions as a controller object
export const adItemController = {
  getAdItem,
  getAdItems
}
