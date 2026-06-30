import type { AgentToolDefinition } from '@/ai/agent/tools'
import type { AgentToolCall } from '@/ai/agent/types'

type ChatMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

type ChatCompletionOptions = {
  baseUrl: string
  apiKey: string
  model: string
  messages: ChatMessage[]
  temperature?: number
  maxTokens?: number
  jsonMode?: boolean
}

type ChatCompletionResponse = {
  content: string
  usage?: {
    prompt_tokens?: number
    completion_tokens?: number
    total_tokens?: number
  }
}

export type OpenAiStreamOptions = {
  baseUrl: string
  apiKey: string
  model: string
  messages: ChatMessage[]
  temperature?: number
  maxTokens?: number
}

type ToolChatMessage = {
  role: 'system' | 'user' | 'assistant' | 'tool'
  content: string | null
  tool_calls?: {
    id: string
    type: 'function'
    function: { name: string; arguments: string }
  }[]
  tool_call_id?: string
  name?: string
}

export type OpenAiToolCompletionOptions = {
  baseUrl: string
  apiKey: string
  model: string
  messages: ToolChatMessage[]
  tools: AgentToolDefinition[]
  temperature?: number
  maxTokens?: number
}

export type OpenAiToolCompletionResult = {
  content: string | null
  toolCalls: AgentToolCall[]
  finishReason: string | null
}

/** Accept both https://api.example.com and https://api.example.com/v1 */
export function normalizeOpenAiBaseUrl(baseUrl: string): string {
  return baseUrl.trim().replace(/\/$/, '').replace(/\/v1$/, '')
}

function chatCompletionsUrl(baseUrl: string): string {
  return `${normalizeOpenAiBaseUrl(baseUrl)}/v1/chat/completions`
}

export async function openAiChatCompletion(
  options: ChatCompletionOptions,
): Promise<ChatCompletionResponse> {
  const response = await fetch(chatCompletionsUrl(options.baseUrl), {
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
      ...(options.jsonMode ? { response_format: { type: 'json_object' } } : {}),
    }),
  })

  const data = (await response.json()) as {
    error?: { message?: string }
    choices?: { message?: { content?: string } }[]
    usage?: ChatCompletionResponse['usage']
  }

  if (!response.ok) {
    throw new Error(data.error?.message ?? `LLM API error (${response.status})`)
  }

  const content = data.choices?.[0]?.message?.content?.trim()
  if (!content) {
    throw new Error('LLM returned empty content')
  }

  return { content, usage: data.usage }
}

/** Stream text deltas from OpenAI-compatible chat completions (SSE). */
export async function* openAiChatCompletionStream(
  options: OpenAiStreamOptions,
): AsyncGenerator<string, void, undefined> {
  const response = await fetch(chatCompletionsUrl(options.baseUrl), {
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
    let message = `LLM API error (${response.status})`
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
    throw new Error('LLM stream has no response body')
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

export type OpenAiToolStreamEvent =
  | { kind: 'text'; text: string }
  | {
      kind: 'complete'
      content: string | null
      toolCalls: AgentToolCall[]
      finishReason: string | null
    }

type AccumulatedToolCall = {
  id: string
  name: string
  arguments: string
}

/** Stream text deltas; emit tool calls when the SSE stream finishes. */
export async function* openAiChatCompletionWithToolsStream(
  options: OpenAiToolCompletionOptions,
): AsyncGenerator<OpenAiToolStreamEvent, void, undefined> {
  const response = await fetch(chatCompletionsUrl(options.baseUrl), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${options.apiKey}`,
    },
    body: JSON.stringify({
      model: options.model,
      messages: options.messages,
      tools: options.tools,
      tool_choice: 'auto',
      temperature: options.temperature ?? 0.3,
      max_tokens: options.maxTokens ?? 4096,
      stream: true,
    }),
  })

  if (!response.ok) {
    let message = `LLM API error (${response.status})`
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
    throw new Error('LLM stream has no response body')
  }

  const decoder = new TextDecoder()
  let buffer = ''
  let content = ''
  let finishReason: string | null = null
  const toolCallsByIndex = new Map<number, AccumulatedToolCall>()

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
            choices?: {
              finish_reason?: string | null
              delta?: {
                content?: string | null
                tool_calls?: {
                  index: number
                  id?: string
                  type?: 'function'
                  function?: { name?: string; arguments?: string }
                }[]
              }
            }[]
          }

          const choice = json.choices?.[0]
          if (choice?.finish_reason) {
            finishReason = choice.finish_reason
          }

          const delta = choice?.delta
          if (delta?.content) {
            content += delta.content
            yield { kind: 'text', text: delta.content }
          }

          for (const toolDelta of delta?.tool_calls ?? []) {
            const existing = toolCallsByIndex.get(toolDelta.index) ?? {
              id: '',
              name: '',
              arguments: '',
            }

            if (toolDelta.id) existing.id = toolDelta.id
            if (toolDelta.function?.name) existing.name = toolDelta.function.name
            if (toolDelta.function?.arguments) {
              existing.arguments += toolDelta.function.arguments
            }

            toolCallsByIndex.set(toolDelta.index, existing)
          }
        } catch {
          // skip malformed SSE chunks
        }
      }
    }
  } finally {
    reader.releaseLock()
  }

  const toolCalls: AgentToolCall[] = [...toolCallsByIndex.entries()]
    .sort(([a], [b]) => a - b)
    .map(([, tc]) => ({ id: tc.id, name: tc.name, arguments: tc.arguments }))
    .filter((tc) => tc.id && tc.name)

  yield {
    kind: 'complete',
    content: content.trim() || null,
    toolCalls,
    finishReason,
  }
}

export async function openAiChatCompletionWithTools(
  options: OpenAiToolCompletionOptions,
): Promise<OpenAiToolCompletionResult> {
  const response = await fetch(chatCompletionsUrl(options.baseUrl), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${options.apiKey}`,
    },
    body: JSON.stringify({
      model: options.model,
      messages: options.messages,
      tools: options.tools,
      tool_choice: 'auto',
      temperature: options.temperature ?? 0.3,
      max_tokens: options.maxTokens ?? 4096,
    }),
  })

  const data = (await response.json()) as {
    error?: { message?: string }
    choices?: {
      finish_reason?: string
      message?: {
        content?: string | null
        tool_calls?: {
          id: string
          type: 'function'
          function: { name: string; arguments: string }
        }[]
      }
    }[]
  }

  if (!response.ok) {
    throw new Error(data.error?.message ?? `LLM API error (${response.status})`)
  }

  const choice = data.choices?.[0]
  const message = choice?.message
  const toolCalls: AgentToolCall[] = (message?.tool_calls ?? []).map((tc) => ({
    id: tc.id,
    name: tc.function.name,
    arguments: tc.function.arguments,
  }))

  return {
    content: message?.content ?? null,
    toolCalls,
    finishReason: choice?.finish_reason ?? null,
  }
}

export function toOpenAiToolMessages(
  messages: {
    role: string
    content: string
    toolCalls?: AgentToolCall[]
    toolCallId?: string
    name?: string
  }[],
): ToolChatMessage[] {
  return messages.map((msg) => {
    if (msg.role === 'assistant' && msg.toolCalls?.length) {
      return {
        role: 'assistant' as const,
        content: msg.content || null,
        tool_calls: msg.toolCalls.map((tc) => ({
          id: tc.id,
          type: 'function' as const,
          function: { name: tc.name, arguments: tc.arguments },
        })),
      }
    }
    if (msg.role === 'tool') {
      return {
        role: 'tool' as const,
        content: msg.content,
        tool_call_id: msg.toolCallId!,
        name: msg.name,
      }
    }
    return {
      role: msg.role as 'system' | 'user' | 'assistant',
      content: msg.content,
    }
  })
}
