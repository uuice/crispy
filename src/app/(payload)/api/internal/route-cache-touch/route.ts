import { resolveRouteCacheStatusFromDb } from '@/frontend-cache/routeCacheStatus'

export async function POST(request: Request): Promise<Response> {
  let body: {
    routePath?: string
    ttlSeconds?: number
    cachingEnabled?: boolean
    bypass?: boolean
  }

  try {
    body = (await request.json()) as typeof body
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (!body.routePath) {
    return Response.json({ error: 'routePath is required' }, { status: 400 })
  }

  const status = await resolveRouteCacheStatusFromDb({
    routePath: body.routePath,
    ttlSeconds: body.ttlSeconds ?? 0,
    cachingEnabled: body.cachingEnabled ?? true,
    bypass: body.bypass ?? false,
  })

  return Response.json({ status })
}
