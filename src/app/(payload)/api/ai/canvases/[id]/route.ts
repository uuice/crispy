import config from '@payload-config'
import { headers } from 'next/headers'
import { createLocalReq, getPayload } from 'payload'

import { canUseAiAgent } from '@/ai/agent/access'
import { isCanvasGraph } from '@/ai/canvas/types'
import { deleteAiCanvas, getAiCanvas, updateAiCanvas } from '@/ai/canvas/store'

type RouteContext = { params: Promise<{ id: string }> }

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

export async function GET(_request: Request, context: RouteContext): Promise<Response> {
  const auth = await authCanvasReq()
  if ('error' in auth && auth.error) return auth.error

  const { id } = await context.params
  const canvas = await getAiCanvas(auth.req!, id)
  if (!canvas) return Response.json({ error: '画布不存在' }, { status: 404 })
  return Response.json({ canvas })
}

export async function PATCH(request: Request, context: RouteContext): Promise<Response> {
  const auth = await authCanvasReq()
  if ('error' in auth && auth.error) return auth.error

  const { id } = await context.params
  const body = (await request.json()) as { title?: string; graph?: unknown }

  if (body.graph != null && !isCanvasGraph(body.graph)) {
    return Response.json({ error: 'graph 格式无效' }, { status: 400 })
  }

  const canvas = await updateAiCanvas(auth.req!, id, {
    title: body.title,
    graph: body.graph && isCanvasGraph(body.graph) ? body.graph : undefined,
  })
  if (!canvas) return Response.json({ error: '画布不存在' }, { status: 404 })
  return Response.json({ canvas })
}

export async function DELETE(_request: Request, context: RouteContext): Promise<Response> {
  const auth = await authCanvasReq()
  if ('error' in auth && auth.error) return auth.error

  const { id } = await context.params
  const ok = await deleteAiCanvas(auth.req!, id)
  if (!ok) return Response.json({ error: '画布不存在' }, { status: 404 })
  return Response.json({ ok: true })
}
