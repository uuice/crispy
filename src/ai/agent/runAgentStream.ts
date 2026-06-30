import type { PayloadRequest } from 'payload'

import { buildAgentSystemPrompt } from '@/ai/agent/systemPrompt'
import { trimAgentMessages } from '@/ai/agent/trimMessages'
import { AGENT_TOOLS, executeAgentTool } from '@/ai/agent/tools'
import type { AgentChatMessage, AgentStreamEvent } from '@/ai/agent/types'
import {
  openAiChatCompletionWithToolsStream,
  toOpenAiToolMessages,
} from '@/ai/providers/openaiCompatible'
import { getAiDisabledMessage, resolveAiSettings } from '@/ai/settings'

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
    yield { type: 'error', error: getAiDisabledMessage(settings.provider) }
    return
  }

  const conversation: AgentChatMessage[] = [
    { role: 'system', content: buildAgentSystemPrompt() },
    ...trimAgentMessages(userMessages),
  ]

  for (let iteration = 0; iteration < MAX_TOOL_ITERATIONS; iteration++) {
    let resultContent: string | null = null
    let resultToolCalls: AgentChatMessage['toolCalls'] = []
    let finishReason: string | null = null

    for await (const event of openAiChatCompletionWithToolsStream({
      baseUrl: settings.baseUrl,
      apiKey: settings.apiKey,
      model: settings.model,
      messages: toOpenAiToolMessages(conversation),
      tools: AGENT_TOOLS,
      temperature: settings.temperature,
      maxTokens: settings.maxTokens,
    })) {
      if (event.kind === 'text') {
        yield { type: 'text', text: event.text }
      }

      if (event.kind === 'complete') {
        resultContent = event.content
        resultToolCalls = event.toolCalls
        finishReason = event.finishReason
      }
    }

    if (resultToolCalls && resultToolCalls.length > 0) {
      conversation.push({
        role: 'assistant',
        content: resultContent ?? '',
        toolCalls: resultToolCalls,
      })

      for (const toolCall of resultToolCalls) {
        const args = parseToolArgs(toolCall.arguments)
        yield { type: 'tool_start', id: toolCall.id, name: toolCall.name, args }

        try {
          const { content, summary } = await executeAgentTool(req, toolCall)
          yield { type: 'tool_result', id: toolCall.id, name: toolCall.name, result: summary }

          conversation.push({
            role: 'tool',
            content,
            toolCallId: toolCall.id,
            name: toolCall.name,
          })
        } catch (error) {
          const message = error instanceof Error ? error.message : '工具执行失败'
          yield { type: 'tool_result', id: toolCall.id, name: toolCall.name, result: { error: message } }
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

    if (resultContent?.trim()) {
      yield { type: 'done' }
      return
    }

    if (finishReason === 'stop') {
      yield { type: 'error', error: 'AI 未返回内容' }
      return
    }

    yield { type: 'error', error: 'AI 未返回内容' }
    return
  }

  yield { type: 'error', error: '工具调用次数过多，请简化请求后重试' }
}
