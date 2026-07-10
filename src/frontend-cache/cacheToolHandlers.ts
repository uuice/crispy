import {
  getDbCacheStats,
  getDynamicRouteCacheEntries,
  getRegistryCacheStatuses,
  purgeDbCacheByRoutePaths,
  purgeExpiredCacheEntries,
} from '@/frontend-cache/dbCache'
import {
  getResolvedCacheSettings,
  normalizeCacheSettings,
  resetResolvedCacheSettingsCache,
} from '@/frontend-cache/getCacheSettings'
import { purgeAllRegisteredCache, purgeCacheEntries } from '@/frontend-cache/purge'
import {
  FRONTEND_CACHE_GROUP_LABELS,
  getFrontendCacheRegistry,
  type FrontendCacheGroup,
  resolveCacheEntries,
} from '@/frontend-cache/registry'
import type { PayloadRequest } from 'payload'

const CACHE_SETTINGS_FIELDS = [
  'cachingEnabled',
  'pageRevalidateSeconds',
  'exposeCacheHeaders',
] as const

export type CacheSettingsUpdate = {
  cachingEnabled?: boolean
  pageRevalidateSeconds?: number
  exposeCacheHeaders?: boolean
}

export function parseCacheSettingsUpdate(args: Record<string, unknown>): CacheSettingsUpdate {
  const data: CacheSettingsUpdate = {}

  for (const field of CACHE_SETTINGS_FIELDS) {
    if (args[field] === undefined) continue

    if (field === 'cachingEnabled' || field === 'exposeCacheHeaders') {
      if (typeof args[field] !== 'boolean') {
        throw new Error(`${field} 必须是布尔值`)
      }
      data[field] = args[field]
      continue
    }

    const value = Number(args[field])
    if (!Number.isFinite(value) || value < 0) {
      throw new Error(`${field} 必须是非负数字`)
    }
    data[field] = value
  }

  if (Object.keys(data).length === 0) {
    throw new Error('至少提供一个 cache-settings 字段')
  }

  return data
}

export async function updateFrontendCacheSettings(
  req: PayloadRequest,
  args: Record<string, unknown>,
) {
  const data = parseCacheSettingsUpdate(args)
  const updated = await req.payload.updateGlobal({
    slug: 'cache-settings',
    data,
    overrideAccess: false,
    user: req.user,
  })
  resetResolvedCacheSettingsCache()
  return normalizeCacheSettings({
    cachingEnabled: updated.cachingEnabled ?? undefined,
    pageRevalidateSeconds: updated.pageRevalidateSeconds ?? undefined,
    exposeCacheHeaders: updated.exposeCacheHeaders ?? undefined,
  })
}

export type ListFrontendCacheArgs = {
  group?: string
  dynamicLimit?: number
}

export type PurgeFrontendCacheArgs = {
  all?: boolean
  expired?: boolean
  routePaths?: string[]
  ids?: string[]
}

export async function listFrontendCache(args: ListFrontendCacheArgs = {}) {
  const group = args.group ? String(args.group) : undefined
  const registry = getFrontendCacheRegistry()
  const entries = group ? registry.filter((entry) => entry.group === group) : registry

  if (group && entries.length === 0) {
    throw new Error(`未知的缓存分组：${group}`)
  }

  const includeDynamicRoutes = !group || group === 'dynamic'
  const dynamicLimit = includeDynamicRoutes
    ? Math.min(Math.max(Number(args.dynamicLimit) || 100, 1), 500)
    : 0

  const [settings, dbStats, entryStatuses, dynamicRoutes] = await Promise.all([
    getResolvedCacheSettings(),
    getDbCacheStats(),
    getRegistryCacheStatuses(entries),
    includeDynamicRoutes ? getDynamicRouteCacheEntries(dynamicLimit) : Promise.resolve([]),
  ])

  return {
    settings,
    dbStats,
    groupLabels: FRONTEND_CACHE_GROUP_LABELS,
    entries: entries.map((entry) => ({
      id: entry.id,
      label: entry.label,
      description: entry.description,
      group: entry.group,
      groupLabel: FRONTEND_CACHE_GROUP_LABELS[entry.group as FrontendCacheGroup],
      kind: entry.kind,
      target: entry.target,
      pathMatch: entry.pathMatch,
      status: entryStatuses[entry.id] ?? {
        active: false,
        count: 0,
        expiryStatus: 'none',
        expiringSoonCount: 0,
        expiredCount: 0,
      },
    })),
    ...(includeDynamicRoutes
      ? {
          dynamicRoutes,
          dynamicRoutesNote:
            '内容发布后缓存不会自动清除。单条动态 path 用 purge_frontend_cache(routePaths=[...])；按 pattern 聚合清除用 ids（如 auto-s-slug）',
        }
      : {}),
  }
}

export async function purgeFrontendCache(args: PurgeFrontendCacheArgs) {
  if (args.all === true) {
    const deleted = await purgeAllRegisteredCache()
    return {
      ok: true,
      purged: deleted,
      failed: 0,
      scope: 'all',
    }
  }

  if (args.expired === true) {
    const deleted = await purgeExpiredCacheEntries()
    return {
      ok: true,
      deleted,
      scope: 'expired',
    }
  }

  const routePaths = Array.isArray(args.routePaths)
    ? args.routePaths.map(String).filter(Boolean)
    : []
  if (routePaths.length > 0) {
    const deleted = await purgeDbCacheByRoutePaths(routePaths)
    return {
      ok: true,
      purged: routePaths.length,
      failed: 0,
      deleted,
      scope: 'routePaths',
      routePaths,
    }
  }

  const ids = Array.isArray(args.ids) ? args.ids.map(String) : []
  if (ids.length === 0) {
    throw new Error('请提供 ids、routePaths、expired: true 或 all: true')
  }

  const cacheEntries = resolveCacheEntries(ids)
  if (cacheEntries.length === 0) {
    throw new Error('未找到有效的缓存条目 id')
  }

  const results = await purgeCacheEntries(cacheEntries)
  const purged = results.filter((item) => item.success).length
  const failed = results.filter((item) => !item.success).length
  const deleted = results.reduce((sum, item) => sum + (item.deleted ?? 0), 0)

  return {
    ok: failed === 0,
    purged,
    failed,
    deleted,
    results,
  }
}

export async function getFrontendCacheSettings() {
  return getResolvedCacheSettings()
}
