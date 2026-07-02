import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

import {
  purgeExpiredCacheEntries,
  resolveRouteCacheFromDb,
  storeRouteHtmlCache,
  getDbCacheStats,
  getDynamicRouteCacheEntries,
  purgeDbCacheByRoutePattern,
} from '@/frontend-cache/dbCache'
import { matchRoutePattern } from '@/frontend-cache/routePatterns'

import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload

describe('frontend cache', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  it('stores and serves route HTML from DB cache', async () => {
    const routePath = '/frontend-cache-test-page'
    const html = '<html><body>cached</body></html>'

    await storeRouteHtmlCache({
      routePath,
      html,
      ttlSeconds: 600,
      cachingEnabled: true,
    })

    const hit = await resolveRouteCacheFromDb({
      routePath,
      ttlSeconds: 600,
      cachingEnabled: true,
      bypass: false,
    })

    expect(hit.status).toBe('HIT')
    expect(hit.html).toBe(html)
    expect(hit.contentType).toBe('text/html; charset=utf-8')
  })

  it('purges entries past expiresAt', async () => {
    const routePath = '/frontend-cache-expired-page'

    await storeRouteHtmlCache({
      routePath,
      html: '<html><body>expired</body></html>',
      ttlSeconds: 1,
      cachingEnabled: true,
    })

    const existing = await payload.find({
      collection: 'frontend-cache-entries',
      overrideAccess: true,
      limit: 1,
      where: {
        routePath: { equals: routePath },
      },
    })

    expect(existing.docs[0]?.id).toBeDefined()

    await payload.update({
      collection: 'frontend-cache-entries',
      id: existing.docs[0].id,
      overrideAccess: true,
      data: {
        expiresAt: new Date(Date.now() - 60_000).toISOString(),
      },
    })

    const deleted = await purgeExpiredCacheEntries()
    expect(deleted).toBeGreaterThanOrEqual(1)

    const miss = await resolveRouteCacheFromDb({
      routePath,
      ttlSeconds: 600,
      cachingEnabled: true,
      bypass: false,
    })

    expect(miss.status).toBe('MISS')
  })

  it('reports html vs metadata route stats', async () => {
    await storeRouteHtmlCache({
      routePath: '/posts/stats-test',
      html: '<html><body>stats</body></html>',
      ttlSeconds: 600,
      cachingEnabled: true,
    })

    const stats = await getDbCacheStats()
    expect(stats.routeWithHtml).toBeGreaterThanOrEqual(1)
    expect(stats.data).toBeGreaterThanOrEqual(0)
  })

  it('lists dynamic route cache rows', async () => {
    await storeRouteHtmlCache({
      routePath: '/posts/dynamic-list-test',
      html: '<html><body>dynamic</body></html>',
      ttlSeconds: 600,
      cachingEnabled: true,
    })

    const rows = await getDynamicRouteCacheEntries()
    const match = rows.find((row) => row.routePath === '/posts/dynamic-list-test')
    expect(match?.hasHtml).toBe(true)
    expect(match?.htmlBytes).toBeGreaterThan(0)
  })

  it('purges route entries by pattern', async () => {
    await storeRouteHtmlCache({
      routePath: '/posts/pattern-purge-a',
      html: '<html><body>a</body></html>',
      ttlSeconds: 600,
      cachingEnabled: true,
    })
    await storeRouteHtmlCache({
      routePath: '/posts/pattern-purge-b',
      html: '<html><body>b</body></html>',
      ttlSeconds: 600,
      cachingEnabled: true,
    })

    const deleted = await purgeDbCacheByRoutePattern('/posts/[slug]')
    expect(deleted).toBeGreaterThanOrEqual(2)
  })

  it('matches route patterns without matching exact registry paths', () => {
    expect(matchRoutePattern('/posts/[slug]', '/posts/hello')).toBe(true)
    expect(matchRoutePattern('/posts/[slug]', '/posts')).toBe(false)
    expect(matchRoutePattern('/[slug]', '/about')).toBe(true)
    expect(matchRoutePattern('/[slug]', '/posts/hello')).toBe(false)
  })
})
