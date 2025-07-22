import { Request, Response, NextFunction } from 'express'
import { env } from '../config/env'

const pageCache = new Map<string, { html: string; expires: number }>()
const PAGE_CACHE_TTL = Number(env['PAGE_CACHE_TTL'] || 60) // 秒

export function pageCacheMiddleware(req: Request, res: Response, next: NextFunction) {
  if (
    req.method !== 'GET' ||
    req.path.startsWith('/api') ||
    req.path.startsWith('/uploads') ||
    req.path.match(/\.(js|css|png|jpg|ico|svg|json)$/)
  ) {
    return next()
  }
  console.log('page cache miss', req.originalUrl)
  const cacheKey = req.originalUrl
  const cached = pageCache.get(cacheKey)
  if (cached && cached.expires > Date.now()) {
    console.log('page cache hit', cacheKey)
    res.set('X-Page-Cache', 'HIT')
    res.send(cached.html)
    return
  }
  // Keep the original send method
  const originalSend = res.send.bind(res)
  res.send = (body: any) => {
    console.log('page cache set (send)', cacheKey)
    if (res.statusCode === 200 && typeof body === 'string') {
      pageCache.set(cacheKey, { html: body, expires: Date.now() + PAGE_CACHE_TTL * 1000 })
    }
    return originalSend(body)
  }

  // Collect all output chunks for stream-based responses
  const chunks: any[] = []
  const originalWrite = res.write.bind(res)
  res.write = (chunk: any, ...args: any[]) => {
    // Collect all written chunks
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    return originalWrite(chunk, ...args)
  }

  const originalEnd = res.end.bind(res)
  res.end = (chunk: any, ...args: any[]) => {
    // Collect the final chunk if present
    if (chunk) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    }
    // Combine all chunks into a single string
    const body = Buffer.concat(chunks).toString('utf8')
    console.log('page cache end', cacheKey)
    if (res.statusCode === 200 && typeof body === 'string' && body) {
      pageCache.set(cacheKey, { html: body, expires: Date.now() + PAGE_CACHE_TTL * 1000 })
    }
    return originalEnd(chunk, ...args)
  }
  next()
}
