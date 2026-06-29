import config from '@payload-config'
import { headers } from 'next/headers'
import { createLocalReq, getPayload } from 'payload'

import { assertAiAccess } from '@/ai/access'
import { runAiTextCompletionStream } from '@/ai/runCompletionStream'
import type { AiCompleteRequest } from '@/ai/types'

export async function POST(request: Request): Promise<Response> {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()

  const { user } = await payload.auth({ headers: requestHeaders })

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: AiCompleteRequest
  try {
    body = (await request.json()) as AiCompleteRequest
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!body.action || !body.fieldPath || typeof body.input !== 'string') {
    return Response.json({ error: 'action, fieldPath and input are required' }, { status: 400 })
  }

  try {
    const req = await createLocalReq({ user }, payload)
    await assertAiAccess(req, body.collection, body.docId)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'AI request failed'
    const status = message.includes('未启用') ? 503 : message.includes('无权') ? 403 : 500
    return Response.json({ error: message }, { status: status })
  }

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }

      try {
        const generator = runAiTextCompletionStream(body)

        while (true) {
          const { value, done } = await generator.next()
          if (done) {
            send({ done: true, templateId: value?.templateId ?? body.action })
            break
          }
          send({ text: value })
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'AI stream failed'
        payload.logger.error({ err: error, message: 'AI stream failed' })
        send({ error: message })
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
