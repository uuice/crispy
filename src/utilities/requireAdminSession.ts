import config from '@payload-config'
import { headers } from 'next/headers'
import { getPayload, type TypedUser } from 'payload'

type AdminSessionResult =
  | { ok: true; user: TypedUser }
  | { ok: false; response: Response }

export async function requireAdminSession(): Promise<AdminSessionResult> {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()
  const { user } = await payload.auth({ headers: requestHeaders })

  if (!user) {
    return {
      ok: false,
      response: Response.json({ error: 'Unauthorized' }, { status: 401 }),
    }
  }

  return { ok: true, user }
}

export async function requireAdminSessionFromRequest(
  request: Request,
): Promise<AdminSessionResult> {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: request.headers })

  if (!user) {
    return {
      ok: false,
      response: new Response('Unauthorized', { status: 401 }),
    }
  }

  return { ok: true, user }
}
