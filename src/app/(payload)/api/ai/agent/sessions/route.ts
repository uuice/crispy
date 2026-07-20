import config from '@payload-config'
import { headers } from 'next/headers'
import { createLocalReq, getPayload } from 'payload'

import { canUseAiAgent } from '@/ai/agent/access'
import { listAiChatSessions } from '@/ai/agent/sessionStore'

export async function GET(): Promise<Response> {
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
  const sessions = await listAiChatSessions(req)

  return Response.json({ sessions })
}
