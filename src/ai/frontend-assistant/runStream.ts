import type { PayloadRequest } from 'payload'

import { trimAgentMessages } from '@/ai/agent/trimMessages'
import type { AgentChatMessage, AgentStreamEvent } from '@/ai/agent/types'
import {
  openAiChatCompletionWithToolsStream,
  toOpenAiToolMessages,
} from '@/ai/providers/openaiCompatible'
import { getAiDisabledMessage, resolveAiSettings } from '@/ai/settings'
import { resolveEmbeddingConfig } from '@/ai/embeddings/config'

import { buildFrontendAssistantSystemPrompt } from './systemPrompt'
import { FRONTEND_ASSISTANT_TOOLS, executeFrontendAssistantTool } from './tools'

const MAX_TOOL_ITERATIONS = 5

function parseToolArgs(raw: string): Record<string, unknown> {
  try {
    return JSON.parse(raw) as Record<string, unknown>
  } catch {
    return { raw }
  }
}

export async function* runFrontendAssistantStream(
  req: PayloadRequest,
  userMessages: AgentChatMessage[],
  siteName: string,
): AsyncGenerator<AgentStreamEvent, void, undefined> {
  const settings = await resolveAiSettings()

  if (!settings.enabled) {
    yield { type: 'error', error: getAiDisabledMessage(settings.provider) }
    return
  }

  const tools = resolveEmbeddingConfig().enabled
    ? FRONTEND_ASSISTANT_TOOLS
    : FRONTEND_ASSISTANT_TOOLS.filter((tool) => tool.function.name !== 'semantic_search')

  const conversation: AgentChatMessage[] = [
    { role: 'system', content: buildFrontendAssistantSystemPrompt(siteName) },
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
      tools,
      temperature: 0.3,
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
          const { content, summary } = await executeFrontendAssistantTool(req, toolCall)
          yield { type: 'tool_result', id: toolCall.id, name: toolCall.name, result: summary }

          conversation.push({
            role: 'tool',
            content,
            toolCallId: toolCall.id,
            name: toolCall.name,
          })
        } catch (error) {
          const message = error instanceof Error ? error.message : '检索失败'
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

  yield { type: 'error', error: '检索次数过多，请简化问题后重试' }
}
