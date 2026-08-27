import {
  AI_PROVIDER_PRESETS,
  aiDisabledMessage,
  type AiProvider,
} from '@/ai/providers/presets'
import { resolveLlmClient } from '@/ai/resolveLlmClient'
import type { ResolvedAiSettings } from '@/ai/types'

/**
 * Backward-compatible AI settings resolver.
 * Internally uses Catalog + Active + Override via resolveLlmClient.
 */
export async function resolveAiSettings(): Promise<ResolvedAiSettings> {
  const client = await resolveLlmClient({ purpose: 'assistant' })

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
    templates: [],
  }
}

export function getAiDisabledMessage(provider: AiProvider = 'deepseek'): string {
  return aiDisabledMessage(provider)
}
