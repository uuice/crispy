import { resolveCacheEntries } from '@/frontend-cache/registry'
import { purgeDbCacheByRoutePaths } from '@/frontend-cache/dbCache'
import { purgeAllRegisteredCache, purgeCacheEntries } from '@/frontend-cache/purge'
import { requirePermissionSession } from '@/utilities/requirePermissionSession'

type PurgeRequestBody = {
  ids?: string[]
  all?: boolean
  routePaths?: string[]
}

export async function POST(request: Request): Promise<Response> {
  const auth = await requirePermissionSession('cache:manage')
  if (!auth.ok) return auth.response

  let body: PurgeRequestBody
  try {
    body = (await request.json()) as PurgeRequestBody
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (body.all) {
    const deleted = await purgeAllRegisteredCache()

    return Response.json({
      ok: true,
      purged: deleted,
      failed: 0,
      results: [],
    })
  }

  const routePaths = body.routePaths?.filter(Boolean)

  if (routePaths?.length) {
    const deleted = await purgeDbCacheByRoutePaths(routePaths)

    return Response.json({
      ok: true,
      purged: routePaths.length,
      failed: 0,
      deleted,
      results: [],
    })
  }

  const ids = body.ids

  if (!ids?.length) {
    return Response.json({ error: 'Provide ids, routePaths, or set all: true' }, { status: 400 })
  }

  const entries = resolveCacheEntries(ids)

  if (entries.length === 0) {
    return Response.json({ error: 'No valid cache entries' }, { status: 400 })
  }

  const results = await purgeCacheEntries(entries)
  const purged = results.filter((item) => item.success).length
  const failed = results.filter((item) => !item.success).length
  const deleted = results.reduce((sum, item) => sum + (item.deleted ?? 0), 0)

  return Response.json({
    ok: true,
    purged,
    failed,
    deleted,
    results,
  })
}
