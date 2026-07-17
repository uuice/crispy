import type { PayloadRequest } from 'payload'

import type { EmbeddableCollection } from '@/ai/embeddings/constants'
import { resolveEmbeddingConfig } from '@/ai/embeddings/config'
import { embedText } from '@/ai/embeddings/embedText'
import { semanticSearchContent } from '@/ai/embeddings/store'

export async function runSemanticContentSearch(
  req: PayloadRequest,
  query: string,
  options: {
    collections?: EmbeddableCollection[]
    limit?: number
    minSimilarity?: number
    status?: string
  } = {},
) {
  const config = await resolveEmbeddingConfig()
  if (!config.enabled) {
    throw new Error('语义搜索未启用：需要 PostgreSQL + pgvector 及 Embedding API Key')
  }

  const trimmed = query.trim()
  if (!trimmed) {
    throw new Error('query 不能为空')
  }

  const queryEmbedding = await embedText(trimmed)
  return semanticSearchContent(req, queryEmbedding, options)
}
