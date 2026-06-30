import type { PayloadRequest } from 'payload'

import { buildAgentSystemPrompt } from '@/ai/agent/systemPrompt'
import { AGENT_TOOLS, executeAgentTool } from '@/ai/agent/tools'
import type { AgentChatMessage, AgentStreamEvent } from '@/ai/agent/types'
import {
  deepseekChatCompletionWithTools,
  toDeepseekMessages,
} from '@/ai/providers/deepseekTools'
import { resolveAiSettings } from '@/ai/settings'

const MAX_TOOL_ITERATIONS = 8

function parseToolArgs(raw: string): Record<string, unknown> {
  try {
    return JSON.parse(raw) as Record<string, unknown>
  } catch {
    return { raw }
  }
}

export async function* runAiAgentStream(
  req: PayloadRequest,
  userMessages: AgentChatMessage[],
): AsyncGenerator<AgentStreamEvent, void, undefined> {
  const settings = await resolveAiSettings()

  if (!settings.enabled) {
    yield { type: 'error', error: 'AI 功能未启用，请在 AI 设置中配置 API Key' }
    return
  }

  const conversation: AgentChatMessage[] = [
    { role: 'system', content: buildAgentSystemPrompt() },
    ...userMessages.filter((m) => m.role === 'user' || m.role === 'assistant'),
  ]

  for (let iteration = 0; iteration < MAX_TOOL_ITERATIONS; iteration++) {
    const result = await deepseekChatCompletionWithTools({
      baseUrl: settings.baseUrl,
      apiKey: settings.apiKey,
      model: settings.model,
      messages: toDeepseekMessages(conversation),
      tools: AGENT_TOOLS,
      temperature: settings.temperature,
      maxTokens: settings.maxTokens,
    })

    if (result.toolCalls.length > 0) {
      conversation.push({
        role: 'assistant',
        content: result.content ?? '',
        toolCalls: result.toolCalls,
      })

      for (const toolCall of result.toolCalls) {
        const args = parseToolArgs(toolCall.arguments)
        yield { type: 'tool_start', name: toolCall.name, args }

        try {
          const { content, summary } = await executeAgentTool(req, toolCall)
          yield { type: 'tool_result', name: toolCall.name, result: summary }

          conversation.push({
            role: 'tool',
            content,
            toolCallId: toolCall.id,
            name: toolCall.name,
          })
        } catch (error) {
          const message = error instanceof Error ? error.message : '工具执行失败'
          yield { type: 'tool_result', name: toolCall.name, result: { error: message } }
          conversation.push({
            role: 'tool',
            content: JSON.stringify({ error: message }),
            toolCallId: toolCall.id,
            name: toolCall.name,
          })
        }
      }

      continue
    }

    if (result.content?.trim()) {
      yield { type: 'text', text: result.content }
      yield { type: 'done' }
      return
    }

    yield { type: 'error', error: 'AI 未返回内容' }
    return
  }

  yield { type: 'error', error: '工具调用次数过多，请简化请求后重试' }
}
