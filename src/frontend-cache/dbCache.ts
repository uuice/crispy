import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { FRONTEND_CACHE_ENTRIES_SLUG } from '@/collections/FrontendCacheEntries'
import type { FrontendCacheEntry as RegistryCacheEntry } from '@/frontend-cache/registry'
import { getExactRegistryRoutePaths } from '@/frontend-cache/registry'
import type { CrispyCacheStatus } from '@/frontend-cache/headers'
import {
  CACHE_EXPIRING_SOON_MS,
  isDynamicRoutePath,
  matchRoutePattern,
} from '@/frontend-cache/routePatterns'
import { routeCachePathname } from '@/frontend-cache/routeCachePath'

type CacheKind = 'route'

export type RouteCachedValue = {
  html: string
  contentType?: string
  statusCode?: number
}

export type RouteCacheLookupResult = {
  status: CrispyCacheStatus
  html?: string
  contentType?: string
  statusCode?: number
}

type FrontendCacheEntryDoc = {
  id: number | string
  cacheKey: string
  kind: CacheKind
  routePath?: string | null
  cachedValue?: unknown
  expiresAt?: string | null
  updatedAt: string
}

function resolveCacheStatus(cachedAtMs: number, ttlSeconds: number): CrispyCacheStatus {
  if (ttlSeconds <= 0) return 'BYPASS'

  const ageSeconds = (Date.now() - cachedAtMs) / 1000

  if (ageSeconds < ttlSeconds) return 'HIT'
  if (ageSeconds < ttlSeconds * 2) return 'STALE'
  return 'MISS'
}

function routeCacheKey(routePath: string): string {
  return `route:${routePath}`
}

async function findEntryByCacheKey(cacheKey: string): Promise<FrontendCacheEntryDoc | null> {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: FRONTEND_CACHE_ENTRIES_SLUG,
    limit: 1,
    pagination: false,
    overrideAccess: true,
    where: {
      cacheKey: { equals: cacheKey },
    },
  })

  return (result.docs[0] as FrontendCacheEntryDoc | undefined) ?? null
}

function serializeCachedValue(value: unknown): Record<string, unknown> | unknown[] | string | number | boolean | null {
  if (value === undefined) return null
  return JSON.parse(JSON.stringify(value)) as Record<string, unknown> | unknown[] | string | number | boolean | null
}

function parseRouteCachedValue(value: unknown): RouteCachedValue | null {
  if (!value || typeof value !== 'object') return null
  const record = value as Record<string, unknown>
  if (typeof record.html !== 'string' || record.html.length === 0) return null
  return {
    html: record.html,
    contentType: typeof record.contentType === 'string' ? record.contentType : undefined,
    statusCode: typeof record.statusCode === 'number' ? record.statusCode : undefined,
  }
}

async function deleteEntryById(id: number | string): Promise<void> {
  const payload = await getPayload({ config: configPromise })
  await payload.delete({
    collection: FRONTEND_CACHE_ENTRIES_SLUG,
    id,
    overrideAccess: true,
  })
}

async function upsertCacheEntry(input: {
  cacheKey: string
  kind: CacheKind
  cachedValue?: unknown
  routePath?: string
  ttlSeconds: number
}): Promise<void> {
  const payload = await getPayload({ config: configPromise })
  const expiresAt = new Date(Date.now() + input.ttlSeconds * 1000).toISOString()
  const data = {
    cacheKey: input.cacheKey,
    kind: input.kind,
    cachedValue:
      input.cachedValue !== undefined ? serializeCachedValue(input.cachedValue) : null,
    routePath: input.routePath ?? null,
    expiresAt,
  }

  const existing = await findEntryByCacheKey(input.cacheKey)

  if (existing) {
    await payload.update({
      collection: FRONTEND_CACHE_ENTRIES_SLUG,
      id: existing.id,
      overrideAccess: true,
      data,
    })
    return
  }

  await payload.create({
    collection: FRONTEND_CACHE_ENTRIES_SLUG,
    overrideAccess: true,
    data,
  })
}

async function touchEntryTimestamp(entry: FrontendCacheEntryDoc, ttlSeconds: number): Promise<void> {
  const payload = await getPayload({ config: configPromise })
  await payload.update({
    collection: FRONTEND_CACHE_ENTRIES_SLUG,
    id: entry.id,
    overrideAccess: true,
    data: {
      expiresAt: new Date(Date.now() + ttlSeconds * 1000).toISOString(),
    },
  })
}

export async function resolveRouteCacheFromDb(options: {
  routePath: string
  ttlSeconds: number
  cachingEnabled: boolean
  bypass: boolean
}): Promise<RouteCacheLookupResult> {
  if (options.bypass || !options.cachingEnabled || options.ttlSeconds <= 0) {
    return { status: 'BYPASS' }
  }

  const cacheKey = routeCacheKey(options.routePath)
  const existing = await findEntryByCacheKey(cacheKey)

  if (!existing) {
    return { status: 'MISS' }
  }

  const status = resolveCacheStatus(new Date(existing.updatedAt).getTime(), options.ttlSeconds)

  if (status === 'MISS') {
    await deleteEntryById(existing.id)
    return { status: 'MISS' }
  }

  if (status === 'STALE') {
    await touchEntryTimestamp(existing, options.ttlSeconds)
  }

  const cached = parseRouteCachedValue(existing.cachedValue)
  if (!cached) {
    return { status: 'MISS' }
  }

  return {
    status,
    html: cached.html,
    contentType: cached.contentType ?? 'text/html; charset=utf-8',
    statusCode: cached.statusCode ?? 200,
  }
}

/** @deprecated Use resolveRouteCacheFromDb */
export async function touchRouteCacheEntry(options: {
  routePath: string
  ttlSeconds: number
  cachingEnabled: boolean
  bypass: boolean
}): Promise<CrispyCacheStatus> {
  const result = await resolveRouteCacheFromDb(options)
  return result.status
}

export async function storeRouteHtmlCache(options: {
  routePath: string
  html: string
  contentType?: string
  statusCode?: number
  ttlSeconds: number
  cachingEnabled: boolean
}): Promise<void> {
  if (!options.cachingEnabled || options.ttlSeconds <= 0) return
  if (options.html.length === 0) return
  if (options.statusCode !== undefined && options.statusCode !== 200) return

  await upsertCacheEntry({
    cacheKey: routeCacheKey(options.routePath),
    kind: 'route',
    routePath: options.routePath,
    ttlSeconds: options.ttlSeconds,
    cachedValue: {
      html: options.html,
      contentType: options.contentType ?? 'text/html; charset=utf-8',
      statusCode: options.statusCode ?? 200,
    },
  })
}

export async function purgeExpiredCacheEntries(): Promise<number> {
  const payload = await getPayload({ config: configPromise })
  const now = new Date().toISOString()

  const result = await payload.delete({
    collection: FRONTEND_CACHE_ENTRIES_SLUG,
    overrideAccess: true,
    where: {
      expiresAt: {
        less_than: now,
      },
    },
  })

  return result.docs.length
}

export async function purgeDbCacheByRoutePath(routePath: string): Promise<number> {
  const payload = await getPayload({ config: configPromise })
  const pathname = routeCachePathname(routePath)

  const result = await payload.delete({
    collection: FRONTEND_CACHE_ENTRIES_SLUG,
    overrideAccess: true,
    where: {
      or: [
        { routePath: { equals: routePath } },
        { routePath: { equals: pathname } },
        { cacheKey: { equals: routeCacheKey(routePath) } },
        { cacheKey: { equals: routeCacheKey(pathname) } },
        // Clear paginated / filtered variants: /posts?page=2 when purging /posts
        { routePath: { like: `${pathname}?%` } },
        { cacheKey: { like: `route:${pathname}?%` } },
      ],
    },
  })

  return result.docs.length
}

export async function purgeDbCacheByRoutePattern(pattern: string): Promise<number> {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: FRONTEND_CACHE_ENTRIES_SLUG,
    overrideAccess: true,
    pagination: false,
    limit: 5000,
    depth: 0,
    where: {
      kind: { equals: 'route' },
    },
    select: {
      id: true,
      routePath: true,
    },
  })

  const ids = result.docs
    .filter((doc) => {
      const routePath = (doc as { routePath?: string | null }).routePath
      return routePath ? matchRoutePattern(pattern, routeCachePathname(routePath)) : false
    })
    .map((doc) => doc.id)

  if (ids.length === 0) return 0

  const deleted = await payload.delete({
    collection: FRONTEND_CACHE_ENTRIES_SLUG,
    overrideAccess: true,
    where: {
      id: {
        in: ids,
      },
    },
  })

  return deleted.docs.length
}

/** Delete all cached frontend HTML pages (kind=route). */
export async function purgeAllRouteCache(): Promise<number> {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.delete({
    collection: FRONTEND_CACHE_ENTRIES_SLUG,
    overrideAccess: true,
    where: {
      kind: { equals: 'route' },
    },
  })

  return result.docs.length
}

export async function purgeDbCacheByRoutePaths(routePaths: string[]): Promise<number> {
  if (routePaths.length === 0) return 0

  let deleted = 0
  for (const routePath of [...new Set(routePaths.filter(Boolean))]) {
    deleted += await purgeDbCacheByRoutePath(routePath)
  }
  return deleted
}

/** Delete all frontend cache entries (route HTML + any legacy rows). */
export async function purgeAllFrontendCacheEntries(): Promise<number> {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.delete({
    collection: FRONTEND_CACHE_ENTRIES_SLUG,
    overrideAccess: true,
    where: {
      id: {
        exists: true,
      },
    },
  })

  return result.docs.length
}

export type DbCacheStats = {
  total: number
  routeWithHtml: number
  routeMetadataOnly: number
  expiredPending: number
  expiringSoon: number
}

export type RouteCacheExpiryStatus = 'valid' | 'expiringSoon' | 'expired'

export type DynamicRouteCacheRow = {
  id: number | string
  routePath: string
  hasHtml: boolean
  htmlBytes: number | null
  expiresAt: string | null
  updatedAt: string
  expiryStatus: RouteCacheExpiryStatus
}

function resolveExpiryStatus(expiresAt: string | null | undefined, nowMs: number): RouteCacheExpiryStatus {
  if (!expiresAt) return 'valid'
  const expiresMs = new Date(expiresAt).getTime()
  if (expiresMs <= nowMs) return 'expired'
  if (expiresMs <= nowMs + CACHE_EXPIRING_SOON_MS) return 'expiringSoon'
  return 'valid'
}

function countRouteHtmlFromDocs(docs: { cachedValue?: unknown }[]): {
  routeWithHtml: number
  routeMetadataOnly: number
} {
  let routeWithHtml = 0

  for (const doc of docs) {
    if (parseRouteCachedValue(doc.cachedValue)) {
      routeWithHtml += 1
    }
  }

  return {
    routeWithHtml,
    routeMetadataOnly: docs.length - routeWithHtml,
  }
}

export async function getDbCacheStats(): Promise<DbCacheStats> {
  const payload = await getPayload({ config: configPromise })
  const nowMs = Date.now()
  const nowIso = new Date(nowMs).toISOString()
  const soonIso = new Date(nowMs + CACHE_EXPIRING_SOON_MS).toISOString()

  const [total, expiredPending, expiringSoon, routeDocsResult] = await Promise.all([
    payload.count({
      collection: FRONTEND_CACHE_ENTRIES_SLUG,
      overrideAccess: true,
    }),
    payload.count({
      collection: FRONTEND_CACHE_ENTRIES_SLUG,
      overrideAccess: true,
      where: {
        expiresAt: {
          less_than: nowIso,
        },
      },
    }),
    payload.count({
      collection: FRONTEND_CACHE_ENTRIES_SLUG,
      overrideAccess: true,
      where: {
        and: [
          {
            expiresAt: {
              greater_than_equal: nowIso,
            },
          },
          {
            expiresAt: {
              less_than_equal: soonIso,
            },
          },
        ],
      },
    }),
    payload.find({
      collection: FRONTEND_CACHE_ENTRIES_SLUG,
      overrideAccess: true,
      pagination: false,
      limit: 5000,
      depth: 0,
      where: { kind: { equals: 'route' } },
      select: {
        cachedValue: true,
      },
    }),
  ])

  const { routeWithHtml, routeMetadataOnly } = countRouteHtmlFromDocs(routeDocsResult.docs)

  return {
    total: total.totalDocs,
    routeWithHtml,
    routeMetadataOnly,
    expiredPending: expiredPending.totalDocs,
    expiringSoon: expiringSoon.totalDocs,
  }
}

export async function getDynamicRouteCacheEntries(limit = 500): Promise<DynamicRouteCacheRow[]> {
  const payload = await getPayload({ config: configPromise })
  const exactRegistryPaths = getExactRegistryRoutePaths()
  const nowMs = Date.now()

  const result = await payload.find({
    collection: FRONTEND_CACHE_ENTRIES_SLUG,
    overrideAccess: true,
    pagination: false,
    limit,
    depth: 0,
    sort: '-updatedAt',
    where: {
      kind: { equals: 'route' },
    },
    select: {
      routePath: true,
      cachedValue: true,
      expiresAt: true,
      updatedAt: true,
    },
  })

  const rows: DynamicRouteCacheRow[] = []

  for (const doc of result.docs) {
    const entry = doc as FrontendCacheEntryDoc
    const routePath = entry.routePath
    if (!routePath || !isDynamicRoutePath(routeCachePathname(routePath), exactRegistryPaths)) continue

    const cached = parseRouteCachedValue(entry.cachedValue)

    rows.push({
      id: entry.id,
      routePath,
      hasHtml: Boolean(cached),
      htmlBytes: cached ? new TextEncoder().encode(cached.html).length : null,
      expiresAt: entry.expiresAt ?? null,
      updatedAt: entry.updatedAt,
      expiryStatus: resolveExpiryStatus(entry.expiresAt, nowMs),
    })
  }

  return rows
}

export type RegistryCacheStatus = {
  active: boolean
  count: number
  /** Aggregate expiry across all DB rows matching this registry entry. */
  expiryStatus: RouteCacheExpiryStatus | 'none'
  expiringSoonCount: number
  expiredCount: number
}

function resolveRegistryExpiryStatus(counts: {
  count: number
  expiringSoonCount: number
  expiredCount: number
}): RouteCacheExpiryStatus | 'none' {
  if (counts.count === 0) return 'none'
  if (counts.expiredCount > 0) return 'expired'
  if (counts.expiringSoonCount > 0) return 'expiringSoon'
  return 'valid'
}

function entryMatchesRegistryDoc(
  entry: RegistryCacheEntry,
  doc: {
    cacheKey?: string | null
    routePath?: string | null
  },
  exactRegistryPaths: ReadonlySet<string>,
): boolean {
  const routePath = doc.routePath
  if (!routePath) {
    return doc.cacheKey === routeCacheKey(entry.target)
  }

  if ((entry.pathMatch ?? 'exact') === 'pattern') {
    const pathname = routeCachePathname(routePath)
    if (exactRegistryPaths.has(pathname)) return false
    return matchRoutePattern(entry.target, pathname)
  }

  const pathname = routeCachePathname(routePath)
  return (
    pathname === entry.target ||
    routePath === entry.target ||
    doc.cacheKey === routeCacheKey(entry.target)
  )
}

/** Map registry entry id → whether matching DB rows exist (single query). */
export async function getRegistryCacheStatuses(
  entries: RegistryCacheEntry[],
): Promise<Record<string, RegistryCacheStatus>> {
  const payload = await getPayload({ config: configPromise })
  const nowMs = Date.now()

  const result = await payload.find({
    collection: FRONTEND_CACHE_ENTRIES_SLUG,
    overrideAccess: true,
    pagination: false,
    limit: 2000,
    depth: 0,
    where: {
      kind: { equals: 'route' },
    },
    select: {
      cacheKey: true,
      routePath: true,
      expiresAt: true,
    },
  })

  const exactRegistryPaths = getExactRegistryRoutePaths()

  const statuses: Record<string, RegistryCacheStatus> = Object.fromEntries(
    entries.map((entry) => [
      entry.id,
      {
        active: false,
        count: 0,
        expiryStatus: 'none' as const,
        expiringSoonCount: 0,
        expiredCount: 0,
      },
    ]),
  )

  for (const doc of result.docs) {
    for (const entry of entries) {
      if (!entryMatchesRegistryDoc(entry, doc, exactRegistryPaths)) continue
      const current = statuses[entry.id]
      if (!current) continue

      current.count += 1
      current.active = true

      const docExpiry = resolveExpiryStatus(doc.expiresAt, nowMs)
      if (docExpiry === 'expired') {
        current.expiredCount += 1
      } else if (docExpiry === 'expiringSoon') {
        current.expiringSoonCount += 1
      }
    }
  }

  for (const current of Object.values(statuses)) {
    current.expiryStatus = resolveRegistryExpiryStatus(current)
  }

  return statuses
}
