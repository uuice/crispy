import config from '@payload-config'
import { getPayload } from 'payload'

import { API_ACCESS_LOG_SLUG } from '@/collections/ApiAccessLogs'

type AccessLogBody = {
  authType?: 'none' | 'session' | 'api-key' | 'bearer'
  durationMs?: number
  ip?: string | null
  method: string
  path: string
  referer?: string | null
  status?: number | null
  userAgent?: string | null
}

function isAuthorized(request: Request): boolean {
  const secret = process.env.ACCESS_LOG_SECRET || process.env.PAYLOAD_SECRET
  if (!secret) return false

  return request.headers.get('x-access-log-secret') === secret
}

export async function POST(request: Request): Promise<Response> {
  if (!isAuthorized(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: AccessLogBody
  try {
    body = (await request.json()) as AccessLogBody
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!body.method || !body.path) {
    return Response.json({ error: 'method and path are required' }, { status: 400 })
  }

  const payload = await getPayload({ config })

  await payload.create({
    collection: API_ACCESS_LOG_SLUG,
    data: {
      method: body.method,
      path: body.path,
      status: body.status ?? undefined,
      durationMs: body.durationMs,
      ip: body.ip ?? undefined,
      userAgent: body.userAgent ?? undefined,
      referer: body.referer ?? undefined,
      authType: body.authType ?? 'none',
    },
    overrideAccess: true,
    context: {
      skipAuditLog: true,
    },
  })

  return Response.json({ ok: true })
}
