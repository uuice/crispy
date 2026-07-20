import config from '@payload-config'
import { headers } from 'next/headers'
import { createLocalReq, getPayload } from 'payload'

import { runAiAgentStream } from '@/ai/agent/runAgentStream'
import {
  appendAssistantMessageToSession,
  appendUserMessageToSession,
  createAiChatSession,
} from '@/ai/agent/sessionStore'
import type { StoredAgentToolActivity } from '@/ai/agent/sessionTypes'
import { trimAgentMessages } from '@/ai/agent/trimMessages'
import type { AgentChatMessage, AgentChatRequest } from '@/ai/agent/types'
import { canUseAiAgent } from '@/ai/agent/access'

export async function POST(request: Request): Promise<Response> {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()
  const { user } = await payload.auth({ headers: requestHeaders })

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!(await canUseAiAgent(user, payload))) {
    return Response.json({ error: '无权使用 AI 助手' }, { status: 403 })
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

  const req = await createLocalReq({ user }, payload)
  const encoder = new TextEncoder()

  let sessionId = body.sessionId
  const userContent = lastMessage.content.trim()

  try {
    if (sessionId) {
      await appendUserMessageToSession(req, sessionId, userContent)
    } else {
      const session = await createAiChatSession(req, userContent)
      sessionId = session.id
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : '会话保存失败'
    return Response.json({ error: message }, { status: 400 })
  }

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }

      send({ type: 'session', sessionId })

      let assistantContent = ''
      const tools: StoredAgentToolActivity[] = []

      try {
        for await (const event of runAiAgentStream(req, sanitizedMessages)) {
          send(event)

          if (event.type === 'text') {
            assistantContent += event.text
          }

          if (event.type === 'tool_start') {
            tools.push({ id: event.id, name: event.name, status: 'running', args: event.args })
          }

          if (event.type === 'tool_result') {
            const idx = tools.findIndex((t) => t.id === event.id && t.status === 'running')
            const hasError = Boolean(
              event.result &&
                typeof event.result === 'object' &&
                'error' in (event.result as Record<string, unknown>),
            )
            if (idx >= 0) {
              tools[idx] = {
                ...tools[idx],
                status: hasError ? 'error' : 'done',
                result: event.result,
              }
            } else {
              tools.push({
                id: event.id,
                name: event.name,
                status: hasError ? 'error' : 'done',
                result: event.result,
              })
            }
          }

          if (event.type === 'error') {
            assistantContent = assistantContent || event.error
          }

          if (event.type === 'done' || event.type === 'error') break
        }

        if (sessionId && assistantContent.trim()) {
          await appendAssistantMessageToSession(
            req,
            sessionId,
            assistantContent,
            tools.filter((t) => t.status !== 'running'),
          )
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'AI agent failed'
        payload.logger.error({ err: error, message: 'AI agent failed' })
        send({ type: 'error', error: message })

        if (sessionId) {
          try {
            await appendAssistantMessageToSession(req, sessionId, message, tools)
          } catch {
            // ignore persistence errors on failure path
          }
        }
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
