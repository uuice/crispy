import config from '@payload-config'
import { getPayload } from 'payload'

import { DEFAULT_AI_TEMPLATES } from '@/ai/defaultTemplates'
import {
  AI_PROVIDER_PRESETS,
  aiDisabledMessage,
  parseAiProvider,
  resolveApiKeyForProvider,
  type AiProvider,
} from '@/ai/providers/presets'
import type { AiPromptTemplate, ResolvedAiSettings } from '@/ai/types'

function mergeTemplates(stored?: AiPromptTemplate[] | null): AiPromptTemplate[] {
  if (!stored?.length) return DEFAULT_AI_TEMPLATES

  const byId = new Map(DEFAULT_AI_TEMPLATES.map((t) => [t.id, t]))

  for (const item of stored) {
    if (!item?.id) continue
    byId.set(item.id, {
      ...(byId.get(item.id) ?? item),
      ...item,
      enabled: item.enabled !== false,
    })
  }

  return [...byId.values()].filter((t) => t.enabled !== false)
}

export async function resolveAiSettings(): Promise<ResolvedAiSettings> {
  const payload = await getPayload({ config })

  let globalSettings: Record<string, unknown> | null = null

  try {
    globalSettings = (await payload.findGlobal({
      slug: 'ai-settings',
      depth: 0,
      overrideAccess: true,
    })) as unknown as Record<string, unknown>
  } catch {
    globalSettings = null
  }

  const provider = parseAiProvider(globalSettings?.provider)
  const preset = AI_PROVIDER_PRESETS[provider]
  const apiKey = resolveApiKeyForProvider(provider)
  const enabled = globalSettings?.enabled !== false && Boolean(apiKey)

  return {
    enabled,
    provider,
    providerLabel: preset.label,
    apiKey,
    baseUrl:
      (globalSettings?.baseUrl as string | undefined)?.trim() ||
      process.env.LLM_BASE_URL?.trim() ||
      process.env.DEEPSEEK_BASE_URL?.trim() ||
      preset.baseUrl,
    model:
      (globalSettings?.model as string | undefined)?.trim() ||
      process.env.LLM_MODEL?.trim() ||
      process.env.DEEPSEEK_MODEL?.trim() ||
      preset.model,
    temperature: (globalSettings?.temperature as number | undefined) ?? 0.7,
    maxTokens: (globalSettings?.maxTokens as number | undefined) ?? 2048,
    templates: mergeTemplates(
      globalSettings?.promptTemplates as AiPromptTemplate[] | null | undefined,
    ),
  }
}

export function getAiDisabledMessage(provider: AiProvider = 'deepseek'): string {
  return aiDisabledMessage(provider)
}

export function findTemplate(
  settings: ResolvedAiSettings,
  action: string,
  templateId?: string,
): AiPromptTemplate | undefined {
  if (templateId) {
    return settings.templates.find((t) => t.id === templateId && t.enabled !== false)
  }
  return settings.templates.find((t) => t.action === action && t.enabled !== false)
}
