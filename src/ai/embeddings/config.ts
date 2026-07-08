import { resolveApiKeyForProvider, parseAiProvider } from '@/ai/providers/presets'
import { resolveDatabaseDriver } from '@/database/adapter'
import { isPgvectorEnabled } from '@/database/pgvector'

import { EMBEDDING_DIMENSIONS } from './constants'

/** Models that accept an optional `dimensions` request field (OpenAI v3, Qwen3-Embedding, etc.). */
export function embeddingModelSupportsDimensions(model: string): boolean {
  return /text-embedding-3|text-embedding-v3|Qwen3-Embedding/i.test(model)
}

export function isEmbeddingsSupported(): boolean {
  return resolveDatabaseDriver() === 'postgres' && isPgvectorEnabled()
}

export function resolveEmbeddingConfig(): {
  enabled: boolean
  apiKey: string
  baseUrl: string
  model: string
  dimensions: number
  supportsDimensions: boolean
} {
  const apiKey =
    process.env.LLM_EMBEDDING_API_KEY?.trim() ||
    process.env.OPENAI_API_KEY?.trim() ||
    resolveApiKeyForProvider(parseAiProvider(undefined))

  const baseUrl = (
    process.env.LLM_EMBEDDING_BASE_URL?.trim() ||
    process.env.OPENAI_BASE_URL?.trim() ||
    process.env.LLM_BASE_URL?.trim() ||
    'https://api.openai.com'
  ).replace(/\/$/, '')

  const model =
    process.env.LLM_EMBEDDING_MODEL?.trim() ||
    process.env.OPENAI_EMBEDDING_MODEL?.trim() ||
    'text-embedding-3-small'

  return {
    enabled: isEmbeddingsSupported() && Boolean(apiKey),
    apiKey,
    baseUrl,
    model,
    dimensions: EMBEDDING_DIMENSIONS,
    supportsDimensions: embeddingModelSupportsDimensions(model),
  }
}
