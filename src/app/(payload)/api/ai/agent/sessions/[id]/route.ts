import config from '@payload-config'
import { headers } from 'next/headers'
import { createLocalReq, getPayload } from 'payload'

import { canUseAiAgent } from '@/ai/agent/access'
import { deleteAiChatSession, getAiChatSession } from '@/ai/agent/sessionStore'

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(_request: Request, context: RouteContext): Promise<Response> {
  const { id } = await context.params
  const payload = await getPayload({ config })
  const requestHeaders = await headers()
  const { user } = await payload.auth({ headers: requestHeaders })

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!(await canUseAiAgent(user, payload))) {
    return Response.json({ error: '无权使用 AI 助手' }, { status: 403 })
  }

  const req = await createLocalReq({ user }, payload)
  const session = await getAiChatSession(req, id)

  if (!session) {
    return Response.json({ error: '会话不存在' }, { status: 404 })
  }

  return Response.json({ session })
}

export async function DELETE(_request: Request, context: RouteContext): Promise<Response> {
  const { id } = await context.params
  const payload = await getPayload({ config })
  const requestHeaders = await headers()
  const { user } = await payload.auth({ headers: requestHeaders })

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!(await canUseAiAgent(user, payload))) {
    return Response.json({ error: '无权使用 AI 助手' }, { status: 403 })
  }

  const req = await createLocalReq({ user }, payload)
  const deleted = await deleteAiChatSession(req, id)

  if (!deleted) {
    return Response.json({ error: '会话不存在' }, { status: 404 })
  }

  return Response.json({ ok: true })
}
