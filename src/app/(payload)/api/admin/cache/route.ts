import {
  FRONTEND_CACHE_GROUP_LABELS,
  FRONTEND_CACHE_REGISTRY,
} from '@/frontend-cache/registry'
import { getResolvedCacheSettings } from '@/frontend-cache/getCacheSettings'
import { getDbCacheStats, getRegistryCacheStatuses } from '@/frontend-cache/dbCache'
import { requireEditorSession } from '@/utilities/requireEditorSession'

export async function GET(): Promise<Response> {
  const auth = await requireEditorSession()
  if (!auth.ok) return auth.response

  const settings = await getResolvedCacheSettings()
  const dbStats = await getDbCacheStats()
  const entryStatuses = await getRegistryCacheStatuses(FRONTEND_CACHE_REGISTRY)

  return Response.json({
    settings,
    dbStats,
    entryStatuses,
    entries: FRONTEND_CACHE_REGISTRY,
    groupLabels: FRONTEND_CACHE_GROUP_LABELS,
  })
}
