import { Request, Response, NextFunction } from 'express'
import { env } from '../config/env'
import { cacheService } from '../services/cacheService'
import crypto from 'crypto'

const PAGE_CACHE_TTL = Number(env['PAGE_CACHE_TTL'] || 60) // seconds

// In-memory cache for frequently accessed pages to reduce database queries
export const memoryCache = new Map<string, { html: string; expires: number; url: string }>()
const MEMORY_CACHE_TTL = 30 // seconds - shorter than database cache

export async function pageCacheMiddleware(req: Request, res: Response, next: NextFunction) {
  if (
    req.method !== 'GET' ||
    req.path.startsWith('/api') ||
    req.path.startsWith('/uploads') ||
    req.path.match(/\.(js|css|png|jpg|ico|svg|json)$/) ||
    req.path.startsWith('/backstage')
  ) {
    return next()
  }

  const cacheKey = req.originalUrl
  const hash = crypto.createHash('md5').update(cacheKey).digest('hex')

  console.log('page cache check', cacheKey)

  // First check memory cache for faster access (now use hash as key)
  const memoryCached = memoryCache.get(hash)
  if (memoryCached && memoryCached.expires > Date.now()) {
    console.log('page cache hit (memory)', cacheKey)
    res.set('X-Page-Cache', 'HIT-MEMORY')
    res.send(memoryCached.html)
    return
  }

  // Check database cache
  try {
    const dbCached = await cacheService.getCacheByHash(hash)
    if (dbCached && dbCached.status === 10) {
      // 10 = active status
      const expires = dbCached.create_time + PAGE_CACHE_TTL * 1000
      if (expires > Date.now()) {
        console.log('page cache hit (database)', cacheKey)
        res.set('X-Page-Cache', 'HIT-DB')
        res.send(dbCached.cache_data)

        // Update memory cache for faster future access (use hash as key)
        memoryCache.set(hash, {
          html: dbCached.cache_data,
          expires: Date.now() + MEMORY_CACHE_TTL * 1000,
          url: cacheKey
        })
        return
      } else {
        // Cache expired, mark as expired in database
        await cacheService.updateCache(dbCached.id, { status: -10 }) // -10 = expired status
      }
    }
  } catch (error) {
    console.error('Error checking database cache:', error)
  }

  // Cache miss - intercept response to cache the result
  const chunks: Buffer[] = []
  const originalWrite = res.write.bind(res)
  const originalEnd = res.end.bind(res)
  const originalSend = res.send.bind(res)

  // Override send method for simple responses
  res.send = (body: any) => {
    if (res.statusCode === 200 && typeof body === 'string') {
      // Cache asynchronously without blocking the response
      cacheResponse(hash, body, cacheKey).catch((error) => {
        console.error('Error caching response in send:', error)
      })
    }
    return originalSend(body)
  }

  // Override write method for streaming responses
  res.write = (chunk: any, ...args: any[]) => {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    return originalWrite(chunk, ...args)
  }

  // Override end method to collect final chunks
  res.end = (chunk: any, ...args: any[]) => {
    if (chunk) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    }

    if (res.statusCode === 200 && chunks.length > 0) {
      const body = Buffer.concat(chunks).toString('utf8')
      if (body) {
        // Cache asynchronously without blocking the response
        cacheResponse(hash, body, cacheKey).catch((error) => {
          console.error('Error caching response in end:', error)
        })
      }
    }

    return originalEnd(chunk, ...args)
  }

  next()
}

/**
 * Cache the response in both memory and database
 */
async function cacheResponse(hash: string, html: string, url: string) {
  try {
    // Cache in memory for faster access (use hash as key)
    memoryCache.set(hash, {
      html,
      expires: Date.now() + MEMORY_CACHE_TTL * 1000,
      url
    })

    // Cache in database for persistence
    // 如果缓存已经存在，则更新
    const cache = await cacheService.getCacheByHash(hash)
    if (cache) {
      await cacheService.updateCache(cache.id, {
        cache_data: html,
        status: 10, // active status
        url // 新增
      })
    } else {
      await cacheService.createCache({
        hash,
        cache_data: html,
        status: 10, // active status
        url // 新增
      })
    }

    console.log('page cache set', hash)
  } catch (error) {
    console.error('Error caching response:', error)
  }
}

/**
 * Clean up expired memory cache entries
 */
export function cleanupMemoryCache() {
  const now = Date.now()
  for (const [key, value] of memoryCache.entries()) {
    if (value.expires <= now) {
      memoryCache.delete(key)
    }
  }
}

// Clean up memory cache every 5 minutes
setInterval(cleanupMemoryCache, 5 * 60 * 1000)
