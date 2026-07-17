import { renderPromptTemplate } from '@/ai/promptRenderer'
import { openAiChatCompletionStream } from '@/ai/providers/openaiCompatible'
import { resolveLlmClient } from '@/ai/resolveLlmClient'
import type { AiCompleteRequest } from '@/ai/types'

export async function* runAiTextCompletionStream(
  body: AiCompleteRequest,
): AsyncGenerator<string, { templateId: string }, undefined> {
  if (body.action === 'custom' && !body.customPrompt?.trim()) {
    throw new Error('自定义指令不能为空')
  }

  const client = await resolveLlmClient({
    purpose: 'field',
    action: body.action,
    templateId: body.templateId,
  })

  if (!client.enabled) {
    throw new Error(client.disabledReason ?? 'AI 未启用')
  }

  const template = client.template
  if (!template) {
    throw new Error(`未找到 action=${body.action} 的 Prompt 模板`)
  }

  if (template.outputFormat === 'json') {
    throw new Error('该模板需要 structured 接口')
  }

  const variables = {
    field: body.input,
    selection: body.context?.selection,
    instruction: body.customPrompt?.trim() ?? '',
    context: body.context,
  }

  const stream = openAiChatCompletionStream({
    baseUrl: client.baseUrl,
    apiKey: client.apiKey,
    model: client.model,
    temperature: client.temperature,
    maxTokens: client.maxTokens,
    messages: [
      { role: 'system', content: renderPromptTemplate(template.systemPrompt, variables) },
      { role: 'user', content: renderPromptTemplate(template.userPrompt, variables) },
    ],
  })

  for await (const chunk of stream) {
    yield chunk
  }

  return { templateId: template.id }
}
