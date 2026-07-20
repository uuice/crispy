import config from '@payload-config'
import { headers } from 'next/headers'
import { createLocalReq, getPayload } from 'payload'

import { canUseAiAgent } from '@/ai/agent/access'
import { runCanvasPromptNode } from '@/ai/canvas/runNode'
import { getAiCanvas, updateAiCanvas } from '@/ai/canvas/store'

type RouteContext = { params: Promise<{ id: string }> }

export async function POST(request: Request, context: RouteContext): Promise<Response> {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()
  const { user } = await payload.auth({ headers: requestHeaders })

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!(await canUseAiAgent(user, payload))) {
    return Response.json({ error: '无权使用 AI 画布' }, { status: 403 })
  }

  const req = await createLocalReq({ user }, payload)
  const { id } = await context.params
  const body = (await request.json()) as { nodeId?: string }
  if (!body.nodeId) {
    return Response.json({ error: '缺少 nodeId' }, { status: 400 })
  }

  const canvas = await getAiCanvas(req, id)
  if (!canvas) {
    return Response.json({ error: '画布不存在' }, { status: 404 })
  }

  try {
    const result = await runCanvasPromptNode({
      graph: canvas.graph,
      nodeId: body.nodeId,
    })

    const saved = await updateAiCanvas(req, id, { graph: result.graph })
    return Response.json({
      canvas: saved,
      output: result.output,
      model: result.model,
      providerName: result.providerName,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : '运行失败'
    return Response.json({ error: message }, { status: 400 })
  }
}
