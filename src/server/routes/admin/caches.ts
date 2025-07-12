import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, validationError, notFound } from '../../utils/response'
import { cacheService } from '../../services/cacheService'

// Validation schemas
const createCacheSchema = z.object({
  hash: z.string().min(1),
  cache_data: z.string().min(1),
  status: z.number().default(10)
})

const updateCacheSchema = createCacheSchema.partial()

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
      status: req.query['status'] ? parseInt(req.query['status'] as string) : undefined,
      is_delete: req.query['is_delete'] ? parseInt(req.query['is_delete'] as string) : undefined,
      update_time: req.query['update_time']
        ? parseInt(req.query['update_time'] as string)
        : undefined,
      create_time: req.query['create_time']
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

// Create new cache
export const createCache = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = createCacheSchema.parse(req.body)

    const result = await cacheService.createCache(validatedData)

    success(res, result, 'Cache created successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
    }
    console.error('Error creating cache:', err)
    error(res, 'Internal server error')
  }
}

// Update cache
export const updateCache = async (
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

    const validatedData = updateCacheSchema.parse(req.body)

    const result = await cacheService.updateCache(id, validatedData)

    if (!result.success) {
      notFound(res, 'Cache not found')
      return
    }

    success(res, { id, ...validatedData }, 'Cache updated successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.errors)
      return
    }
    console.error('Error updating cache:', err)
    error(res, 'Internal server error')
  }
}

// Delete cache (logical delete)
export const deleteCache = async (
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

    const result = await cacheService.deleteCache(id)

    if (!result.success) {
      notFound(res, 'Cache not found')
      return
    }

    success(res, null, 'Cache deleted successfully')
  } catch (err: unknown) {
    console.error('Error deleting cache:', err)
    error(res, 'Internal server error')
  }
}

// Export all functions as a controller object
export const cacheController = {
  getCache,
  getCaches,
  createCache,
  updateCache,
  deleteCache
}
