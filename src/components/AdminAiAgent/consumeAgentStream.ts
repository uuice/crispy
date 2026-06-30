'use client'

import type { AgentStreamEvent } from '@/ai/agent/types'

export type AgentStreamCallbacks = {
  onText?: (chunk: string, fullText: string) => void
  onToolStart?: (name: string, args: Record<string, unknown>) => void
  onToolResult?: (name: string, result: unknown) => void
  onSession?: (sessionId: string | number) => void
}

/** Consume SSE from /api/ai/agent. */
export async function consumeAgentStream(
  response: Response,
  callbacks?: AgentStreamCallbacks,
): Promise<string> {
  if (!response.ok) {
    let message = `AI 助手请求失败 (${response.status})`
    try {
      const data = (await response.json()) as { error?: string }
      message = data.error ?? message
    } catch {
      // ignore
    }
    throw new Error(message)
  }

  const reader = response.body?.getReader()
  if (!reader) {
    throw new Error('AI 助手流式响应为空')
  }

  const decoder = new TextDecoder()
  let buffer = ''
  let fullText = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const parts = buffer.split('\n\n')
      buffer = parts.pop() ?? ''

      for (const part of parts) {
        const line = part.trim()
        if (!line.startsWith('data:')) continue

        const payload = line.slice(5).trim()
        if (!payload) continue

        let event: AgentStreamEvent
        try {
          event = JSON.parse(payload) as AgentStreamEvent
        } catch {
          continue
        }

        if (event.type === 'error') {
          throw new Error(event.error)
        }

        if (event.type === 'session') {
          callbacks?.onSession?.(event.sessionId)
        }

        if (event.type === 'text') {
          fullText += event.text
          callbacks?.onText?.(event.text, fullText)
        }

        if (event.type === 'tool_start') {
          callbacks?.onToolStart?.(event.name, event.args)
        }

        if (event.type === 'tool_result') {
          callbacks?.onToolResult?.(event.name, event.result)
        }
      }
    }
  } finally {
    reader.releaseLock()
  }

  return fullText
}
