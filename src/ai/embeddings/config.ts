import config from '@payload-config'
import { getPayload, type Payload } from 'payload'

import { resolveDatabaseDriver } from '@/database/adapter'
import { isPgvectorEnabled } from '@/database/pgvector'

import { DEFAULT_EMBEDDING_DIMENSIONS } from './constants'

export type ResolvedEmbeddingConfig = {
  enabled: boolean
  apiKey: string
  baseUrl: string
  model: string
  dimensions: number
  supportsDimensions: boolean
  providerId?: string | number
  providerName?: string
  source: 'catalog' | 'none'
}

/** Models that accept an optional `dimensions` request field (OpenAI v3, Qwen3-Embedding, etc.). */
export function embeddingModelSupportsDimensions(model: string): boolean {
  return /text-embedding-3|text-embedding-v3|Qwen3-Embedding/i.test(model)
}

export function isEmbeddingsSupported(): boolean {
  return resolveDatabaseDriver() === 'postgres' && isPgvectorEnabled()
}

function relationId(value: unknown): string | number | undefined {
  if (value == null) return undefined
  if (typeof value === 'object' && value !== null && 'id' in value) {
    return (value as { id: string | number }).id
  }
  if (typeof value === 'string' || typeof value === 'number') return value
  return undefined
}

type ProviderDoc = {
  id: string | number
  name: string
  baseUrl: string
  apiKey: string
  defaultModel: string
  embeddingDimensions?: number | null
  enabled?: boolean | null
  capabilities?: ('chat' | 'embedding')[] | null
}

function disabledConfig(partial?: Partial<ResolvedEmbeddingConfig>): ResolvedEmbeddingConfig {
  return {
    enabled: false,
    apiKey: '',
    baseUrl: '',
    model: '',
    dimensions: DEFAULT_EMBEDDING_DIMENSIONS,
    supportsDimensions: false,
    source: 'none',
    ...partial,
  }
}

async function loadEmbeddingProvider(
  payload: Payload,
  id: string | number,
): Promise<ProviderDoc | null> {
  try {
    const doc = await payload.findByID({
      collection: 'llm-providers',
      id,
      depth: 0,
      overrideAccess: true,
      context: { returnSecrets: true },
    })
    if (!doc || doc.enabled === false) return null
    const capabilities = Array.isArray(doc.capabilities) ? doc.capabilities : []
    if (!capabilities.includes('embedding')) return null
    if (!doc.apiKey || !doc.baseUrl) return null
    return doc as ProviderDoc
  } catch {
    return null
  }
}

/**
 * Resolve embedding from Admin Catalog + Active only (no .env fallback).
 * Requires Postgres + pgvector for enabled=true.
 */
export async function resolveEmbeddingConfig(): Promise<ResolvedEmbeddingConfig> {
  if (!isEmbeddingsSupported()) {
    return disabledConfig()
  }

  try {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({
      slug: 'ai-settings',
      depth: 0,
      overrideAccess: true,
    })

    const providerId = relationId(settings?.defaultEmbeddingProvider)
    if (providerId == null) {
      return disabledConfig()
    }

    const provider = await loadEmbeddingProvider(payload, providerId)
    if (!provider) {
      return disabledConfig()
    }

    const model =
      (typeof settings?.defaultEmbeddingModel === 'string' &&
        settings.defaultEmbeddingModel.trim()) ||
      provider.defaultModel
    const dimensions =
      typeof provider.embeddingDimensions === 'number' && provider.embeddingDimensions > 0
        ? provider.embeddingDimensions
        : DEFAULT_EMBEDDING_DIMENSIONS

    return {
      enabled: true,
      apiKey: provider.apiKey,
      baseUrl: provider.baseUrl.replace(/\/$/, ''),
      model,
      dimensions,
      supportsDimensions: embeddingModelSupportsDimensions(model),
      providerId: provider.id,
      providerName: provider.name,
      source: 'catalog',
    }
  } catch {
    return disabledConfig()
  }
}
