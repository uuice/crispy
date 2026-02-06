import { cacheService } from './cacheService'

export interface MemoryCacheEntry {
  html: string
  expires: number
  url: string
}

export interface MemoryCacheStats {
  size: number
  keys: string[]
}

class MemoryCacheService {
  private memoryCache: Map<string, MemoryCacheEntry> = new Map()

  // 基本操作
  get(key: string) {
    return this.memoryCache.get(key)
  }

  set(key: string, value: MemoryCacheEntry) {
    this.memoryCache.set(key, value)
  }

  delete(key: string) {
    return this.memoryCache.delete(key)
  }

  clear() {
    const size = this.memoryCache.size
    this.memoryCache.clear()
    return size
  }

  cleanup() {
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

  keys() {
    return Array.from(this.memoryCache.keys())
  }

  entries() {
    return Array.from(this.memoryCache.entries())
  }

  size() {
    return this.memoryCache.size
  }

  // 统计信息
  getStats(): MemoryCacheStats {
    return {
      size: this.memoryCache.size,
      keys: Array.from(this.memoryCache.keys())
    }
  }

  // 兼容原有接口
  getMemoryCacheMap() {
    return this.memoryCache
  }

  async deletePageCache(hash: string) {
    const cache = await cacheService.getCacheByHash(hash)
    if (!cache) {
      return { success: false, numUpdatedRows: 0 }
    }
    return await cacheService.delete(cache.id)
  }

  async getCacheInfo(hash: string) {
    const dbCache = await cacheService.getCacheByHash(hash)
    if (!dbCache) return null
    return {
      hash: dbCache.hash,
      html: dbCache.cache_data,
      url: dbCache.url,
      size: dbCache.cache_data.length,
      status: dbCache.status,
      createTime: dbCache.create_time,
      expiresAt: dbCache.create_time + Number(process.env['PAGE_CACHE_TTL'] || 60) * 1000
    }
  }
}

export const memoryCacheService = new MemoryCacheService()
