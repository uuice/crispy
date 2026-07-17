import {
  AI_PROVIDER_PRESETS,
  aiDisabledMessage,
  parseAiProvider,
  type AiProvider,
} from '@/ai/providers/presets'
import { resolveLlmClient } from '@/ai/resolveLlmClient'
import type { AiPromptTemplate, ResolvedAiSettings } from '@/ai/types'

/**
 * Backward-compatible AI settings resolver.
 * Internally uses Catalog + Active + Override via resolveLlmClient.
 */
export async function resolveAiSettings(): Promise<ResolvedAiSettings> {
  const client = await resolveLlmClient({ purpose: 'field' })

  // Infer legacy provider label for UI messages when using catalog.
  let provider: AiProvider = 'custom'
  const name = client.providerName.toLowerCase()
  if (name.includes('deepseek')) provider = 'deepseek'
  else if (name.includes('openai') || name.includes('gpt')) provider = 'openai'

  return {
    enabled: client.enabled,
    provider,
    providerLabel: client.providerName || AI_PROVIDER_PRESETS[provider].label,
    apiKey: client.apiKey,
    baseUrl: client.baseUrl,
    model: client.model,
    temperature: client.temperature,
    maxTokens: client.maxTokens,
    templates: [], // Prefer prompt-templates collection; see findTemplate()
  }
}

export function getAiDisabledMessage(provider: AiProvider = 'deepseek'): string {
  return aiDisabledMessage(provider)
}

export async function findTemplate(
  _settings: ResolvedAiSettings,
  action: string,
  templateId?: string,
): Promise<AiPromptTemplate | undefined> {
  const client = await resolveLlmClient({
    purpose: 'field',
    action,
    templateId,
  })
  return client.template
}
