import { renderPromptTemplate } from '@/ai/promptRenderer'
import { deepseekChatCompletion } from '@/ai/providers/deepseek'
import { findTemplate, resolveAiSettings } from '@/ai/settings'
import type { AiCompleteRequest, AiContext, AiSuggestTaxonomyResult } from '@/ai/types'

export async function runAiTextCompletion(body: AiCompleteRequest): Promise<{
  text: string
  templateId: string
  usage?: { total_tokens?: number }
}> {
  const settings = await resolveAiSettings()

  if (!settings.enabled) {
    throw new Error('AI 未启用：请在 .env 设置 DEEPSEEK_API_KEY')
  }

  const template = findTemplate(settings, body.action, body.templateId)
  if (!template) {
    throw new Error(`未找到 action=${body.action} 的 Prompt 模板`)
  }

  if (template.outputFormat === 'json') {
    throw new Error('该模板需要 structured 接口')
  }

  const variables = { field: body.input, selection: body.context?.selection, context: body.context }

  const result = await deepseekChatCompletion({
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
    throw new Error('AI 未启用：请在 .env 设置 DEEPSEEK_API_KEY')
  }

  const template = findTemplate(settings, 'suggest_taxonomy')
  if (!template) {
    throw new Error('未配置 suggest_taxonomy 模板')
  }

  const variables = { field: context.contentPlain ?? '', context }

  const result = await deepseekChatCompletion({
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
