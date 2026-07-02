import { purgeExpiredCacheEntries } from '@/frontend-cache/dbCache'
import { requireEditorSession } from '@/utilities/requireEditorSession'

export async function POST(): Promise<Response> {
  const auth = await requireEditorSession()
  if (!auth.ok) return auth.response

  const deleted = await purgeExpiredCacheEntries()

  return Response.json({
    ok: true,
    deleted,
  })
}
