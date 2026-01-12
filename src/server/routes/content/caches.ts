import { NextFunction, Request, Response } from 'express'
import { error, notFound, success } from '../../utils/response'
import { cacheService } from '../../services/cacheService'

// Get single cache
export const getCache = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, 'Invalid ID', 400)
      return
    }

    const cache = await cacheService.getCacheById(id)

    if (!cache) {
      notFound(res, 'Cache not found')
      return
    }

    success(res, cache)
  } catch (err: unknown) {
    console.error('Error fetching cache:', err)
    error(res, 'Internal server error')
  }
}

// Get caches list with pagination
export const getCaches = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query['page'] as string) || 1
    const pageSize = parseInt(req.query['pageSize'] as string) || 10

    const filters = {
      cache_data: req.query['cache_data'] as string | undefined,
      hash: req.query['hash'] as string | undefined,
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
    const result = await cacheService.getCaches(filters, { page, pageSize })
    success(res, result)
  } catch (err: unknown) {
    console.error('Error fetching caches:', err)
    error(res, 'Internal server error')
  }
}

// Export all functions as a controller object
export const cacheController = {
  getCache,
  getCaches
}
