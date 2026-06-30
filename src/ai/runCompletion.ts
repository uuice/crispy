import { renderPromptTemplate } from '@/ai/promptRenderer'
import { openAiChatCompletion } from '@/ai/providers/openaiCompatible'
import { findTemplate, getAiDisabledMessage, resolveAiSettings } from '@/ai/settings'
import type { AiCompleteRequest, AiContext, AiSuggestTaxonomyResult } from '@/ai/types'

export async function runAiTextCompletion(body: AiCompleteRequest): Promise<{
  text: string
  templateId: string
  usage?: { total_tokens?: number }
}> {
  const settings = await resolveAiSettings()

  if (!settings.enabled) {
    throw new Error(getAiDisabledMessage(settings.provider))
  }

  if (body.action === 'custom' && !body.customPrompt?.trim()) {
    throw new Error('自定义指令不能为空')
  }

  const template = findTemplate(settings, body.action, body.templateId)
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

  const result = await openAiChatCompletion({
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

  return {
    text: result.content,
    templateId: template.id,
    usage: result.usage,
  }
}

export async function runAiSuggestTaxonomy(context: AiContext): Promise<AiSuggestTaxonomyResult> {
  const settings = await resolveAiSettings()

  if (!settings.enabled) {
    throw new Error(getAiDisabledMessage(settings.provider))
  }

  const template = findTemplate(settings, 'suggest_taxonomy')
  if (!template) {
    throw new Error('未配置 suggest_taxonomy 模板')
  }

  const variables = { field: context.contentPlain ?? '', context }

  const result = await openAiChatCompletion({
    baseUrl: settings.baseUrl,
    apiKey: settings.apiKey,
    model: settings.model,
    temperature: settings.temperature,
    maxTokens: settings.maxTokens,
    jsonMode: true,
    messages: [
      { role: 'system', content: renderPromptTemplate(template.systemPrompt, variables) },
      { role: 'user', content: renderPromptTemplate(template.userPrompt, variables) },
    ],
  })

  try {
    return JSON.parse(result.content) as AiSuggestTaxonomyResult
  } catch {
    throw new Error('AI 返回的 JSON 无法解析')
  }
}
