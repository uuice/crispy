import { storeRouteHtmlCache } from '@/frontend-cache/dbCache'
import { isValidCrispyCacheInternalRequest } from '@/frontend-cache/internalAuth'

export async function POST(request: Request): Promise<Response> {
  if (!isValidCrispyCacheInternalRequest(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: {
    routePath?: string
    html?: string
    contentType?: string
    statusCode?: number
    ttlSeconds?: number
    cachingEnabled?: boolean
  }

  try {
    body = (await request.json()) as typeof body
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (!body.routePath || typeof body.html !== 'string') {
    return Response.json({ error: 'routePath and html are required' }, { status: 400 })
  }

  await storeRouteHtmlCache({
    routePath: body.routePath,
    html: body.html,
    contentType: body.contentType,
    statusCode: body.statusCode,
    ttlSeconds: body.ttlSeconds ?? 0,
    cachingEnabled: body.cachingEnabled ?? true,
  })

  return Response.json({ ok: true })
}
