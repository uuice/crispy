import config from '@payload-config'
import { headers } from 'next/headers'
import { getPayload, type TypedUser } from 'payload'

import { hasRole } from '@/access/roles'

type EditorSessionResult =
  | { ok: true; user: TypedUser }
  | { ok: false; response: Response }

export async function requireEditorSession(): Promise<EditorSessionResult> {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()
  const { user } = await payload.auth({ headers: requestHeaders })

  if (!user) {
    return {
      ok: false,
      response: Response.json({ error: 'Unauthorized' }, { status: 401 }),
    }
  }

  if (!hasRole(user, ['super-admin', 'editor'])) {
    return {
      ok: false,
      response: Response.json({ error: 'Forbidden' }, { status: 403 }),
    }
  }

  return { ok: true, user }
}
