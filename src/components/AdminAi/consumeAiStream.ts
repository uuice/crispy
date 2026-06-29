'use client'

export type AiStreamEvent =
  | { text: string }
  | { done: true; templateId?: string }
  | { error: string }

/** Consume SSE from /api/ai/stream and accumulate full text. */
export async function consumeAiStream(
  response: Response,
  onChunk?: (chunk: string, fullText: string) => void,
): Promise<string> {
  if (!response.ok) {
    let message = `AI 请求失败 (${response.status})`
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
    throw new Error('AI 流式响应为空')
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

        let event: AiStreamEvent
        try {
          event = JSON.parse(payload) as AiStreamEvent
        } catch {
          continue
        }

        if ('error' in event && event.error) {
          throw new Error(event.error)
        }

        if ('text' in event && event.text) {
          fullText += event.text
          onChunk?.(event.text, fullText)
        }
      }
    }
  } finally {
    reader.releaseLock()
  }

  if (!fullText.trim()) {
    throw new Error('AI 未返回内容')
  }

  return fullText
}
