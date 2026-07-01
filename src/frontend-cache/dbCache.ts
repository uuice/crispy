import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { FRONTEND_CACHE_ENTRIES_SLUG } from '@/collections/FrontendCacheEntries'
import type { FrontendCacheEntry as RegistryCacheEntry } from '@/frontend-cache/registry'
import type { CrispyCacheStatus } from '@/frontend-cache/headers'
import { getResolvedCacheSettings } from '@/frontend-cache/getCacheSettings'

type CacheKind = 'data' | 'route'

type FrontendCacheEntryDoc = {
  id: number | string
  cacheKey: string
  kind: CacheKind
  routePath?: string | null
  tags?: { tag: string; id?: string | null }[] | null
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

function toTagRows(tags: string[]) {
  return [...new Set(tags.filter(Boolean))].map((tag) => ({ tag }))
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

async function upsertCacheEntry(input: {
  cacheKey: string
  kind: CacheKind
  tags: string[]
  cachedValue?: unknown
  routePath?: string
  ttlSeconds: number
}): Promise<void> {
  const payload = await getPayload({ config: configPromise })
  const expiresAt = new Date(Date.now() + input.ttlSeconds * 1000).toISOString()
  const data = {
    cacheKey: input.cacheKey,
    kind: input.kind,
    tags: toTagRows(input.tags),
    cachedValue: input.kind === 'data' ? serializeCachedValue(input.cachedValue) : null,
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

export async function touchRouteCacheEntry(options: {
  routePath: string
  ttlSeconds: number
  cachingEnabled: boolean
  bypass: boolean
}): Promise<CrispyCacheStatus> {
  if (options.bypass || !options.cachingEnabled || options.ttlSeconds <= 0) {
    return 'BYPASS'
  }

  const cacheKey = routeCacheKey(options.routePath)
  const existing = await findEntryByCacheKey(cacheKey)

  if (!existing) {
    await upsertCacheEntry({
      cacheKey,
      kind: 'route',
      tags: [`route:${options.routePath}`],
      routePath: options.routePath,
      ttlSeconds: options.ttlSeconds,
    })
    return 'MISS'
  }

  const status = resolveCacheStatus(new Date(existing.updatedAt).getTime(), options.ttlSeconds)

  if (status === 'MISS') {
    await upsertCacheEntry({
      cacheKey,
      kind: 'route',
      tags: [`route:${options.routePath}`],
      routePath: options.routePath,
      ttlSeconds: options.ttlSeconds,
    })
    return 'MISS'
  }

  if (status === 'STALE') {
    await touchEntryTimestamp(existing, options.ttlSeconds)
  }

  return status
}

export async function withDbCache<T>(options: {
  cacheKey: string
  tags: string[]
  ttlSeconds?: number
  fn: () => Promise<T>
}): Promise<{ value: T; status: CrispyCacheStatus }> {
  const settings = await getResolvedCacheSettings()
  const ttlSeconds = options.ttlSeconds ?? settings.dataCacheRevalidateSeconds

  if (!settings.cachingEnabled || ttlSeconds <= 0) {
    return { value: await options.fn(), status: 'BYPASS' }
  }

  const existing = await findEntryByCacheKey(options.cacheKey)

  if (existing?.cachedValue !== undefined && existing.cachedValue !== null) {
    const status = resolveCacheStatus(new Date(existing.updatedAt).getTime(), ttlSeconds)

    if (status === 'HIT' || status === 'STALE') {
      if (status === 'STALE') {
        await touchEntryTimestamp(existing, ttlSeconds)
      }
      return { value: existing.cachedValue as T, status }
    }
  }

  const value = await options.fn()

  await upsertCacheEntry({
    cacheKey: options.cacheKey,
    kind: 'data',
    tags: options.tags,
    cachedValue: value,
    ttlSeconds,
  })

  return { value, status: 'MISS' }
}

export async function purgeDbCacheByTags(tags: string[]): Promise<number> {
  if (tags.length === 0) return 0

  const payload = await getPayload({ config: configPromise })
  const uniqueTags = [...new Set(tags.filter(Boolean))]

  const result = await payload.delete({
    collection: FRONTEND_CACHE_ENTRIES_SLUG,
    overrideAccess: true,
    where: {
      'tags.tag': {
        in: uniqueTags,
      },
    },
  })

  return result.docs.length
}

export async function purgeDbCacheByRoutePath(routePath: string): Promise<number> {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.delete({
    collection: FRONTEND_CACHE_ENTRIES_SLUG,
    overrideAccess: true,
    where: {
      or: [
        { routePath: { equals: routePath } },
        { cacheKey: { equals: routeCacheKey(routePath) } },
      ],
    },
  })

  return result.docs.length
}

export async function purgeAllDbCache(): Promise<number> {
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
  data: number
  route: number
}

export async function getDbCacheStats(): Promise<DbCacheStats> {
  const payload = await getPayload({ config: configPromise })

  const [total, data, route] = await Promise.all([
    payload.count({
      collection: FRONTEND_CACHE_ENTRIES_SLUG,
      overrideAccess: true,
    }),
    payload.count({
      collection: FRONTEND_CACHE_ENTRIES_SLUG,
      overrideAccess: true,
      where: { kind: { equals: 'data' } },
    }),
    payload.count({
      collection: FRONTEND_CACHE_ENTRIES_SLUG,
      overrideAccess: true,
      where: { kind: { equals: 'route' } },
    }),
  ])

  return {
    total: total.totalDocs,
    data: data.totalDocs,
    route: route.totalDocs,
  }
}

export type RegistryCacheStatus = {
  active: boolean
  count: number
}

function entryMatchesRegistryDoc(
  entry: RegistryCacheEntry,
  doc: {
    cacheKey?: string | null
    routePath?: string | null
    tags?: { tag?: string | null }[] | null
  },
): boolean {
  if (entry.kind === 'tag') {
    return doc.tags?.some((row) => row.tag === entry.target) ?? false
  }

  return doc.routePath === entry.target || doc.cacheKey === routeCacheKey(entry.target)
}

/** Map registry entry id → whether matching DB rows exist (single query). */
export async function getRegistryCacheStatuses(
  entries: RegistryCacheEntry[],
): Promise<Record<string, RegistryCacheStatus>> {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: FRONTEND_CACHE_ENTRIES_SLUG,
    overrideAccess: true,
    pagination: false,
    limit: 2000,
    depth: 0,
    select: {
      cacheKey: true,
      routePath: true,
      tags: true,
    },
  })

  const statuses: Record<string, RegistryCacheStatus> = Object.fromEntries(
    entries.map((entry) => [entry.id, { active: false, count: 0 }]),
  )

  for (const doc of result.docs) {
    for (const entry of entries) {
      if (!entryMatchesRegistryDoc(entry, doc)) continue
      const current = statuses[entry.id]
      if (!current) continue
      current.count += 1
      current.active = true
    }
  }

  return statuses
}
