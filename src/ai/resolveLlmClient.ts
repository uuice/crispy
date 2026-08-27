import config from '@payload-config'
import { getPayload, type Payload } from 'payload'

import { DEFAULT_AI_TEMPLATES } from '@/ai/defaultTemplates'
import type { AiAction, AiOutputFormat, AiPromptTemplate } from '@/ai/types'

export type LlmPurpose = 'agent' | 'assistant' | 'embedding'

export type ResolveLlmClientArgs = {
  purpose?: LlmPurpose
  /** Explicit catalog id override (API). */
  providerId?: string | number | null
  /** Explicit model override. */
  model?: string | null
  /** Load provider/model/temperature from a prompt-templates doc. */
  promptId?: string | number | null
  /** Resolve template by action when promptId is omitted. */
  action?: string | null
  templateId?: string | null
}

export type ResolvedLlmClient = {
  enabled: boolean
  disabledReason?: string
  providerId?: string | number
  providerName: string
  baseUrl: string
  apiKey: string
  model: string
  temperature: number
  maxTokens: number
  /** Matched prompt template when resolved via action/promptId. */
  template?: AiPromptTemplate & {
    providerId?: string | number
    temperature?: number | null
    maxTokens?: number | null
  }
}

type ProviderDoc = {
  id: string | number
  name: string
  baseUrl: string
  apiKey: string
  defaultModel: string
  enabled?: boolean | null
  capabilities?: ('chat' | 'embedding')[] | null
}

type PromptDoc = {
  id: string | number
  title: string
  slug?: string | null
  action: string
  systemPrompt: string
  userPrompt: string
  outputFormat?: AiOutputFormat | null
  enabled?: boolean | null
  provider?: string | number | ProviderDoc | null
  model?: string | null
  temperature?: number | null
  maxTokens?: number | null
}

function relationId(value: unknown): string | number | undefined {
  if (value == null) return undefined
  if (typeof value === 'object' && value !== null && 'id' in value) {
    return (value as { id: string | number }).id
  }
  if (typeof value === 'string' || typeof value === 'number') return value
  return undefined
}

function disabledClient(
  reason: string,
  partial?: Partial<ResolvedLlmClient>,
): ResolvedLlmClient {
  return {
    enabled: false,
    disabledReason: reason,
    providerName: '',
    baseUrl: '',
    apiKey: '',
    model: '',
    temperature: 0.7,
    maxTokens: 2048,
    ...partial,
  }
}

function promptToTemplate(doc: PromptDoc): AiPromptTemplate & {
  providerId?: string | number
  temperature?: number | null
  maxTokens?: number | null
} {
  return {
    id: doc.slug || String(doc.id),
    label: doc.title,
    action: doc.action as AiAction,
    systemPrompt: doc.systemPrompt,
    userPrompt: doc.userPrompt,
    outputFormat: (doc.outputFormat as AiOutputFormat) || 'text',
    enabled: doc.enabled !== false,
    providerId: relationId(doc.provider),
    temperature: doc.temperature,
    maxTokens: doc.maxTokens,
  }
}

async function loadProvider(
  payload: Payload,
  id: string | number,
): Promise<ProviderDoc | null> {
  try {
    const doc = (await payload.findByID({
      collection: 'llm-providers',
      id,
      depth: 0,
      overrideAccess: true,
      context: { returnSecrets: true },
    })) as unknown as ProviderDoc
    if (doc.enabled === false) return null
    return doc
  } catch {
    return null
  }
}

async function loadPromptById(payload: Payload, id: string | number): Promise<PromptDoc | null> {
  try {
    return (await payload.findByID({
      collection: 'prompt-templates',
      id,
      depth: 0,
      overrideAccess: true,
    })) as unknown as PromptDoc
  } catch {
    return null
  }
}

async function findPromptByAction(
  payload: Payload,
  action: string,
  templateId?: string | null,
): Promise<PromptDoc | null> {
  if (templateId) {
    const bySlug = await payload.find({
      collection: 'prompt-templates',
      where: {
        and: [{ slug: { equals: templateId } }, { enabled: { equals: true } }],
      },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    if (bySlug.docs[0]) return bySlug.docs[0] as unknown as PromptDoc
  }

  const byAction = await payload.find({
    collection: 'prompt-templates',
    where: {
      and: [{ action: { equals: action } }, { enabled: { equals: true } }],
    },
    sort: 'sort',
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  return (byAction.docs[0] as unknown as PromptDoc) ?? null
}

async function loadAiGlobal(payload: Payload): Promise<Record<string, unknown> | null> {
  try {
    return (await payload.findGlobal({
      slug: 'ai-settings',
      depth: 0,
      overrideAccess: true,
    })) as unknown as Record<string, unknown>
  } catch {
    return null
  }
}

/**
 * Unified LLM resolution for agent / assistant / embedding.
 * Override chain: explicit args → prompt binding → ai-settings default.
 * No .env fallback — configure llm-providers + ai-settings in Admin.
 */
export async function resolveLlmClient(args: ResolveLlmClientArgs = {}): Promise<ResolvedLlmClient> {
  const payload = await getPayload({ config })
  const globalSettings = await loadAiGlobal(payload)

  if (globalSettings?.enabled === false) {
    return disabledClient('AI 已在后台关闭')
  }

  let template: ReturnType<typeof promptToTemplate> | undefined
  let promptProviderId = args.providerId ?? undefined
  let promptModel = args.model ?? undefined
  let temperatureOverride: number | null | undefined
  let maxTokensOverride: number | null | undefined

  if (args.promptId != null && args.promptId !== '') {
    const prompt = await loadPromptById(payload, args.promptId)
    if (prompt && prompt.enabled !== false) {
      template = promptToTemplate(prompt)
      promptProviderId = promptProviderId ?? template.providerId
      promptModel = promptModel ?? prompt.model ?? undefined
      temperatureOverride = prompt.temperature
      maxTokensOverride = prompt.maxTokens
    }
  } else if (args.action) {
    const prompt = await findPromptByAction(payload, args.action, args.templateId)
    if (prompt) {
      template = promptToTemplate(prompt)
      promptProviderId = promptProviderId ?? template.providerId
      promptModel = promptModel ?? prompt.model ?? undefined
      temperatureOverride = prompt.temperature
      maxTokensOverride = prompt.maxTokens
    } else {
      const hit = args.templateId
        ? DEFAULT_AI_TEMPLATES.find((t) => t.id === args.templateId && t.enabled !== false)
        : DEFAULT_AI_TEMPLATES.find((t) => t.action === args.action && t.enabled !== false)
      if (hit) template = { ...hit }
    }
  }

  const defaultProviderId = relationId(globalSettings?.defaultProvider)
  const resolvedProviderId = promptProviderId ?? defaultProviderId

  if (resolvedProviderId == null) {
    return disabledClient('AI 未启用：请在「LLM 提供商」添加端点，并在「AI 设置」选择默认提供商', {
      template,
    })
  }

  const provider = await loadProvider(payload, resolvedProviderId)
  if (!provider?.apiKey || !provider.baseUrl) {
    return disabledClient('AI 未启用：所选 LLM 提供商无效或缺少密钥', { template })
  }

  const model =
    (typeof promptModel === 'string' && promptModel.trim()) ||
    (globalSettings?.defaultModel as string | undefined)?.trim() ||
    provider.defaultModel

  return {
    enabled: true,
    providerId: provider.id,
    providerName: provider.name,
    baseUrl: provider.baseUrl.replace(/\/$/, ''),
    apiKey: provider.apiKey,
    model,
    temperature: temperatureOverride ?? (globalSettings?.temperature as number | undefined) ?? 0.7,
    maxTokens: maxTokensOverride ?? (globalSettings?.maxTokens as number | undefined) ?? 2048,
    template,
  }
}
