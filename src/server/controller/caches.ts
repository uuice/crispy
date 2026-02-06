import { NextFunction, Request, Response } from 'express'
import { error, handleError, success } from '../utils/response'
import { cacheService } from '../services/cacheService'
import { memoryCacheService } from '../services/memoryCacheService'
import { CacheFilters } from '@src/types'

// Get single cache
export const getCache = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, '无效的ID', 400)
      return
    }

    const cache = await cacheService.getById(id)

    if (!cache) {
      error(res, '缓存不存在', 404)
      return
    }

    success(res, cache)
  } catch (err: unknown) {
    handleError(res, err, 'getCache')
  }
}

// Get caches list with pagination
export const getCaches = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await cacheService.getCaches(req.query as unknown as CacheFilters)
    success(res, result)
  } catch (err: unknown) {
    handleError(res, err, 'getCaches')
  }
}

// Create new cache
export const createCache = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await cacheService.create(req.body)

    success(res, result, '缓存创建成功')
  } catch (err: unknown) {
    handleError(res, err, 'createCache')
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
      error(res, '无效的ID', 400)
      return
    }

    const result = await cacheService.update(id, req.body)
    success(res, result, '缓存更新成功')
  } catch (err: unknown) {
    handleError(res, err, 'updateCache')
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
      error(res, '无效的ID', 400)
      return
    }

    const deleted = await cacheService.delete(id)
    if (!deleted) {
      error(res, '缓存不存在', 404)
      return
    }

    success(res, null, '缓存删除成功')
  } catch (err: unknown) {
    handleError(res, err, 'deleteCache')
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
    handleError(res, err, 'getCacheStats')
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
  } catch (err: unknown) {
    handleError(res, err, 'getMemoryCacheList')
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
    success(res, { deleted }, deleted ? '内存缓存已删除' : '未找到')
  } catch (err: unknown) {
    handleError(res, err, 'deleteMemoryCache')
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
      error(res, 'Hash参数必填', 400)
      return
    }
    const entry = memoryCacheService.get(hash)
    if (!entry) {
      error(res, '内存缓存不存在', 404)
      return
    }
    success(res, { hash, ...entry })
  } catch (err: unknown) {
    handleError(res, err, 'getMemoryCacheInfo')
  }
}

export const cleanupMemoryCache = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const cleanedCount = memoryCacheService.clear()
    success(res, { cleanedCount }, `已清理 ${cleanedCount} 条过期内存缓存`)
  } catch (err: unknown) {
    handleError(res, err, 'cleanupMemoryCache')
  }
}

// Database cache routes
export const getDatabaseCacheList = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await cacheService.getCaches(req.query as unknown as CacheFilters)
    success(res, result)
  } catch (err: unknown) {
    handleError(res, err, 'getDatabaseCacheList')
  }
}

export const clearExpiredDatabaseCache = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await cacheService.clearExpiredCaches()
    success(res, result, `已清理过期数据库缓存`)
  } catch (err: unknown) {
    handleError(res, err, 'clearExpiredDatabaseCache')
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
      error(res, '数据库缓存不存在', 404)
      return
    }
    const deleted = await cacheService.delete(cache.id)

    success(res, { deleted }, '数据库缓存已删除')
  } catch (err: unknown) {
    handleError(res, err, 'deleteDatabaseCache')
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
      error(res, 'Hash参数必填', 400)
      return
    }
    const dbCache = await cacheService.getCacheByHash(hash)
    if (!dbCache) {
      error(res, '数据库缓存不存在', 404)
      return
    }
    success(res, dbCache)
  } catch (err: unknown) {
    handleError(res, err, 'getDatabaseCacheInfo')
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
