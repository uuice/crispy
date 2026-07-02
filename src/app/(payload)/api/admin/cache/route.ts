import {
  FRONTEND_CACHE_GROUP_LABELS,
  getFrontendCacheRegistry,
} from '@/frontend-cache/registry'
import {
  getDbCacheStats,
  getDynamicRouteCacheEntries,
  getRegistryCacheStatuses,
} from '@/frontend-cache/dbCache'
import { getResolvedCacheSettings } from '@/frontend-cache/getCacheSettings'
import { requireEditorSession } from '@/utilities/requireEditorSession'

export async function GET(): Promise<Response> {
  const auth = await requireEditorSession()
  if (!auth.ok) return auth.response

  const registry = getFrontendCacheRegistry()
  const [settings, dbStats, entryStatuses, dynamicRoutes] = await Promise.all([
    getResolvedCacheSettings(),
    getDbCacheStats(),
    getRegistryCacheStatuses(registry),
    getDynamicRouteCacheEntries(),
  ])

  return Response.json({
    settings,
    dbStats,
    entryStatuses,
    dynamicRoutes,
    entries: registry,
    groupLabels: FRONTEND_CACHE_GROUP_LABELS,
  })
}
