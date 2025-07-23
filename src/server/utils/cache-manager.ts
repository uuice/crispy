import { cacheService } from '../services/cacheService'

export interface CacheStats {
  memory: {
    size: number
    keys: string[]
  }
  database: {
    total: number
    active: number
    expired: number
  }
}

export interface CacheInfo {
  hash: string
  url?: string
  size: number
  status: number
  createTime: number
  expiresAt: number
}

/**
 * Cache manager utility for monitoring and managing page cache
 */
export class CacheManager {
  private memoryCache: Map<string, { html: string; expires: number }>

  constructor(memoryCache: Map<string, { html: string; expires: number }>) {
    this.memoryCache = memoryCache
  }

  /**
   * Get comprehensive cache statistics
   */
  async getStats(): Promise<CacheStats> {
    const dbStats = await cacheService.getCacheStats()

    return {
      memory: {
        size: this.memoryCache.size,
        keys: Array.from(this.memoryCache.keys())
      },
      database: dbStats
    }
  }

  /**
   * Get cache information by hash
   */
  async getCacheInfo(hash: string): Promise<CacheInfo | null> {
    const dbCache = await cacheService.getCacheByHash(hash)
    if (!dbCache) return null

    return {
      hash: dbCache.hash,
      size: dbCache.cache_data.length,
      status: dbCache.status,
      createTime: dbCache.create_time,
      expiresAt: dbCache.create_time + Number(process.env['PAGE_CACHE_TTL'] || 60) * 1000
    }
  }

  /**
   * Clear memory cache
   */
  clearMemoryCache(): number {
    const size = this.memoryCache.size
    this.memoryCache.clear()
    return size
  }

  /**
   * Clear expired memory cache entries
   */
  cleanupMemoryCache(): number {
    const now = Date.now()
    let cleaned = 0

    for (const [key, value] of this.memoryCache.entries()) {
      if (value.expires <= now) {
        this.memoryCache.delete(key)
        cleaned++
      }
    }

    return cleaned
  }

  /**
   * Clear expired database cache entries
   */
  async clearExpiredDatabaseCache(): Promise<{ success: boolean; numUpdatedRows: number }> {
    const expireTime = Date.now() - Number(process.env['PAGE_CACHE_TTL'] || 60) * 1000
    return await cacheService.clearExpiredCaches(expireTime)
  }

  /**
   * Delete specific cache by hash
   */
  async deleteCache(hash: string): Promise<{ success: boolean; numUpdatedRows: number }> {
    const cache = await cacheService.getCacheByHash(hash)
    if (!cache) {
      return { success: false, numUpdatedRows: 0 }
    }

    // Remove from memory cache
    this.memoryCache.delete(hash)

    // Delete from database
    return await cacheService.deleteCache(cache.id)
  }

  /**
   * Get memory cache keys
   */
  getMemoryCacheKeys(): string[] {
    return Array.from(this.memoryCache.keys())
  }

  /**
   * Check if key exists in memory cache
   */
  hasInMemoryCache(key: string): boolean {
    return this.memoryCache.has(key)
  }

  /**
   * Get memory cache entry
   */
  getMemoryCacheEntry(key: string): { html: string; expires: number } | undefined {
    return this.memoryCache.get(key)
  }
}
