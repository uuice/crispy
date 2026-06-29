import { normalizeDeepseekBaseUrl } from '@/ai/providers/deepseek'

type ChatMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export type DeepseekStreamOptions = {
  baseUrl: string
  apiKey: string
  model: string
  messages: ChatMessage[]
  temperature?: number
  maxTokens?: number
}

/** Stream text deltas from DeepSeek chat completions (OpenAI-compatible SSE). */
export async function* deepseekChatCompletionStream(
  options: DeepseekStreamOptions,
): AsyncGenerator<string, void, undefined> {
  const url = `${normalizeDeepseekBaseUrl(options.baseUrl)}/v1/chat/completions`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${options.apiKey}`,
    },
    body: JSON.stringify({
      model: options.model,
      messages: options.messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 1024,
      stream: true,
    }),
  })

  if (!response.ok) {
    let message = `DeepSeek API error (${response.status})`
    try {
      const data = (await response.json()) as { error?: { message?: string } }
      message = data.error?.message ?? message
    } catch {
      // ignore parse errors
    }
    throw new Error(message)
  }

  const reader = response.body?.getReader()
  if (!reader) {
    throw new Error('DeepSeek stream has no response body')
  }

  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed.startsWith('data:')) continue

        const payload = trimmed.slice(5).trim()
        if (!payload || payload === '[DONE]') continue

        try {
          const json = JSON.parse(payload) as {
            choices?: { delta?: { content?: string } }[]
          }
          const delta = json.choices?.[0]?.delta?.content
          if (delta) yield delta
        } catch {
          // skip malformed SSE chunks
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
}
