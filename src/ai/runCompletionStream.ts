import { renderPromptTemplate } from '@/ai/promptRenderer'
import { openAiChatCompletionStream } from '@/ai/providers/openaiCompatible'
import { findTemplate, getAiDisabledMessage, resolveAiSettings } from '@/ai/settings'
import type { AiCompleteRequest } from '@/ai/types'

export async function* runAiTextCompletionStream(
  body: AiCompleteRequest,
): AsyncGenerator<string, { templateId: string }, undefined> {
  const settings = await resolveAiSettings()

  if (!settings.enabled) {
    throw new Error(getAiDisabledMessage(settings.provider))
  }

  const template = findTemplate(settings, body.action, body.templateId)
  if (!template) {
    throw new Error(`未找到 action=${body.action} 的 Prompt 模板`)
  }

  if (template.outputFormat === 'json') {
    throw new Error('该模板需要 structured 接口')
  }

  if (body.action === 'custom' && !body.customPrompt?.trim()) {
    throw new Error('自定义指令不能为空')
  }

  const variables = {
    field: body.input,
    selection: body.context?.selection,
    instruction: body.customPrompt?.trim() ?? '',
    context: body.context,
  }

  const stream = openAiChatCompletionStream({
    baseUrl: settings.baseUrl,
    apiKey: settings.apiKey,
    model: settings.model,
    temperature: settings.temperature,
    maxTokens: settings.maxTokens,
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
