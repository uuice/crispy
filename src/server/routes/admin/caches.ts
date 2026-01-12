import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
import { error, notFound, success, validationError } from '../../utils/response'
import { cacheService } from '../../services/cacheService'
import { memoryCacheService } from '../../services/memoryCacheService'

// Validation schemas
const createCacheSchema = z.object({
  hash: z.string().min(1),
  url: z.string().default(''),
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
      validationError(res, err.issues)
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
      validationError(res, err.issues)
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

// Memory cache routes
export const getCacheStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const momentCacheStats = memoryCacheService.getStats()
    const cacheStats = await cacheService.getCacheStats()
    success(res, { memory: momentCacheStats, database: cacheStats })
  } catch (err: unknown) {
    console.error('Error getting page cache stats:', err)
    error(res, 'Internal server error')
  }
}

export const getMemoryCacheList = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const list = memoryCacheService.entries().map(([hash, value]: [string, any]) => ({
      hash,
      url: value.url,
      expires: value.expires
    }))
    success(res, { list, count: list.length })
  } catch (err) {
    error(res, 'Internal server error')
  }
}

export const deleteMemoryCache = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { hash } = req.params
    const deleted = memoryCacheService.delete(hash)
    success(res, { deleted }, deleted ? 'Memory cache deleted' : 'Not found')
  } catch (err: unknown) {
    console.error('Error deleting memory cache:', err)
    error(res, 'Internal server error')
  }
}

export const getMemoryCacheInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { hash } = req.params
    if (!hash) {
      error(res, 'Hash is required', 400)
      return
    }
    const entry = memoryCacheService.get(hash)
    if (!entry) {
      notFound(res, 'Memory cache not found')
      return
    }
    success(res, { hash, ...entry })
  } catch (err: unknown) {
    console.error('Error getting memory cache info:', err)
    error(res, 'Internal server error')
  }
}

export const cleanupMemoryCache = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const cleanedCount = memoryCacheService.clear()
    success(res, { cleanedCount }, `Cleaned up ${cleanedCount} expired memory cache entries`)
  } catch (err: unknown) {
    console.error('Error cleaning up memory cache:', err)
    error(res, 'Internal server error')
  }
}

// Database cache routes
export const getDatabaseCacheList = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query['page'] as string) || 1
    const pageSize = parseInt(req.query['pageSize'] as string) || 10
    const result = await cacheService.getCaches({}, { page, pageSize })
    success(res, result)
  } catch (err: unknown) {
    console.error('Error fetching database caches:', err)
    error(res, 'Internal server error')
  }
}

export const clearExpiredDatabaseCache = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await cacheService.clearExpiredCaches()
    success(res, result, `Cleaned up ${result.numUpdatedRows} expired database cache entries`)
  } catch (err: unknown) {
    console.error('Error clearing expired database cache:', err)
    error(res, 'Internal server error')
  }
}

export const deleteDatabaseCache = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { hash } = req.params
    const cache = await cacheService.getCacheByHash(hash)
    if (!cache) {
      notFound(res, 'Database cache not found')
      return
    }
    const result = await cacheService.deleteCache(cache.id)

    success(res, { success: result.success }, 'Database cache deleted')
  } catch (err: unknown) {
    console.error('Error deleting database cache:', err)
    error(res, 'Internal server error')
  }
}

export const getDatabaseCacheInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { hash } = req.params
    if (!hash) {
      error(res, 'Hash is required', 400)
      return
    }
    const dbCache = await cacheService.getCacheByHash(hash)
    if (!dbCache) {
      notFound(res, 'Database cache not found')
      return
    }
    success(res, dbCache)
  } catch (err: unknown) {
    console.error('Error getting database cache info:', err)
    error(res, 'Internal server error')
  }
}

// Export all functions as a controller object
export const cacheController = {
  getCache,
  getCaches,
  createCache,
  updateCache,
  deleteCache,
  // Page cache management
  getCacheStats,
  getMemoryCacheList,
  deleteMemoryCache,
  getMemoryCacheInfo,
  cleanupMemoryCache,
  getDatabaseCacheList,
  clearExpiredDatabaseCache,
  deleteDatabaseCache,
  getDatabaseCacheInfo
}
