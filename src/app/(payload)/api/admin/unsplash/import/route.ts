import config from '@payload-config'
import { createLocalReq, getPayload } from 'payload'

import { isUnsplashEnabled } from '@/unsplash/isEnabled'
import { importUnsplashPhoto } from '@/unsplash/server/importPhoto'
import type { UnsplashImportRequest } from '@/unsplash/types'
import { requireAuthorSessionFromRequest } from '@/utilities/requireAuthorSession'

function isValidImportBody(body: unknown): body is UnsplashImportRequest {
  if (!body || typeof body !== 'object') return false
  const value = body as Record<string, unknown>
  return (
    typeof value.photoId === 'string' &&
    value.photoId.length > 0 &&
    typeof value.downloadLocation === 'string' &&
    value.downloadLocation.startsWith('https://')
  )
}

export async function POST(request: Request): Promise<Response> {
  const auth = await requireAuthorSessionFromRequest(request)
  if (!auth.ok) return auth.response

  if (!(await isUnsplashEnabled())) {
    return Response.json({ error: 'Unsplash is not configured' }, { status: 503 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (!isValidImportBody(body)) {
    return Response.json({ error: 'Invalid import payload' }, { status: 400 })
  }

  try {
    const payload = await getPayload({ config })
    const req = await createLocalReq({ user: auth.user }, payload)
    const doc = await importUnsplashPhoto({ payload, req, input: body })

    return Response.json({ doc })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unsplash import failed'
    return Response.json({ error: message }, { status: 502 })
  }
}
