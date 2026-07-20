import { purgeExpiredCacheEntries } from '@/frontend-cache/dbCache'
import { requirePermissionSession } from '@/utilities/requirePermissionSession'

export async function POST(): Promise<Response> {
  const auth = await requirePermissionSession('cache:manage')
  if (!auth.ok) return auth.response

  const deleted = await purgeExpiredCacheEntries()

  return Response.json({
    ok: true,
    deleted,
  })
}
