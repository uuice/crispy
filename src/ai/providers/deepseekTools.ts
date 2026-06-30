import { normalizeDeepseekBaseUrl } from '@/ai/providers/deepseek'
import type { AgentToolDefinition } from '@/ai/agent/tools'
import type { AgentToolCall } from '@/ai/agent/types'

type ChatMessage = {
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

export type DeepseekToolCompletionOptions = {
  baseUrl: string
  apiKey: string
  model: string
  messages: ChatMessage[]
  tools: AgentToolDefinition[]
  temperature?: number
  maxTokens?: number
}

export type DeepseekToolCompletionResult = {
  content: string | null
  toolCalls: AgentToolCall[]
  finishReason: string | null
}

export async function deepseekChatCompletionWithTools(
  options: DeepseekToolCompletionOptions,
): Promise<DeepseekToolCompletionResult> {
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
    throw new Error(data.error?.message ?? `DeepSeek API error (${response.status})`)
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

/** Convert agent chat messages to DeepSeek API format. */
export function toDeepseekMessages(
  messages: {
    role: string
    content: string
    toolCalls?: AgentToolCall[]
    toolCallId?: string
    name?: string
  }[],
): ChatMessage[] {
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
