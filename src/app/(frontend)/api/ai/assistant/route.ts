import config from '@payload-config'
import { createLocalReq, getPayload } from 'payload'

import { resolveEmbeddingConfig } from '@/ai/embeddings/config'
import { runFrontendAssistantStream } from '@/ai/frontend-assistant/runStream'
import { trimAgentMessages } from '@/ai/agent/trimMessages'
import type { AgentChatMessage, AgentChatRequest } from '@/ai/agent/types'
import { resolveAiSettings } from '@/ai/settings'
import { getCachedSiteSettings } from '@/utilities/getSiteSettings'

export async function GET(): Promise<Response> {
  const settings = await resolveAiSettings()
  const embedding = resolveEmbeddingConfig()

  return Response.json({
    available: settings.enabled,
    semanticSearch: embedding.enabled,
  })
}

export async function POST(request: Request): Promise<Response> {
  const settings = await resolveAiSettings()
  if (!settings.enabled) {
    return Response.json({ error: 'AI 助手暂未开启' }, { status: 503 })
  }

  let body: AgentChatRequest
  try {
    body = (await request.json()) as AgentChatRequest
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return Response.json({ error: 'messages 不能为空' }, { status: 400 })
  }

  const lastMessage = body.messages[body.messages.length - 1]
  if (lastMessage?.role !== 'user' || !lastMessage.content?.trim()) {
    return Response.json({ error: '最后一条消息必须是用户消息' }, { status: 400 })
  }

  const sanitizedMessages: AgentChatMessage[] = trimAgentMessages(
    body.messages
      .filter((m) => (m.role === 'user' || m.role === 'assistant') && m.content?.trim())
      .map((m) => ({ role: m.role, content: m.content.trim() })),
  )

  const payload = await getPayload({ config })
  const req = await createLocalReq({}, payload)
  const siteSettings = await getCachedSiteSettings()()
  const siteName = siteSettings.siteName || '本站'
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }

      try {
        for await (const event of runFrontendAssistantStream(req, sanitizedMessages, siteName)) {
          send(event)
          if (event.type === 'done' || event.type === 'error') break
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'AI 助手请求失败'
        payload.logger.error({ err: error, message: 'Frontend AI assistant failed' })
        send({ type: 'error', error: message })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  })
}
