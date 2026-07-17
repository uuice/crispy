import config from '@payload-config'
import { headers } from 'next/headers'
import { createLocalReq, getPayload } from 'payload'

import { canUseAiAgent } from '@/ai/agent/access'
import { createAiCanvas, listAiCanvases } from '@/ai/canvas/store'

async function authCanvasReq() {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()
  const { user } = await payload.auth({ headers: requestHeaders })

  if (!user) {
    return { error: Response.json({ error: 'Unauthorized' }, { status: 401 }) }
  }
  if (!canUseAiAgent(user)) {
    return { error: Response.json({ error: '无权使用 AI 画布' }, { status: 403 }) }
  }

  const req = await createLocalReq({ user }, payload)
  return { req }
}

export async function GET(): Promise<Response> {
  const auth = await authCanvasReq()
  if ('error' in auth && auth.error) return auth.error

  const canvases = await listAiCanvases(auth.req!)
  return Response.json({ canvases })
}

export async function POST(request: Request): Promise<Response> {
  const auth = await authCanvasReq()
  if ('error' in auth && auth.error) return auth.error

  let title: string | undefined
  try {
    const body = (await request.json()) as { title?: string }
    title = body.title
  } catch {
    // empty body ok
  }

  const canvas = await createAiCanvas(auth.req!, title)
  return Response.json({ canvas }, { status: 201 })
}
