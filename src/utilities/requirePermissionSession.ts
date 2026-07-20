import config from '@payload-config'
import { headers } from 'next/headers'
import { getPayload, type TypedUser } from 'payload'

import { can } from '@/access/can'
import type { Permission } from '@/access/permissions'

type PermissionSessionResult =
  | { ok: true; user: TypedUser }
  | { ok: false; response: Response }

/** Require an authenticated Admin session with the given permission (authz-cache). */
export async function requirePermissionSession(
  permission: Permission,
): Promise<PermissionSessionResult> {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()
  const { user } = await payload.auth({ headers: requestHeaders })

  if (!user) {
    return {
      ok: false,
      response: Response.json({ error: 'Unauthorized' }, { status: 401 }),
    }
  }

  if (!(await can(user, permission, payload))) {
    return {
      ok: false,
      response: Response.json({ error: 'Forbidden' }, { status: 403 }),
    }
  }

  return { ok: true, user }
}
