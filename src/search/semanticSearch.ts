import type { Payload } from 'payload'

import type { EmbeddableCollection } from '@/ai/embeddings/constants'
import { resolveEmbeddingConfig } from '@/ai/embeddings/config'
import { runSemanticContentSearch } from '@/ai/embeddings/semanticSearch'
import { createLocalReq } from 'payload'

export async function searchContentBySemantics(
  payload: Payload,
  query: string,
  options: {
    collections?: EmbeddableCollection[]
    limit?: number
    status?: string
  } = {},
) {
  const config = await resolveEmbeddingConfig()
  if (!config.enabled || !query.trim()) {
    return []
  }

  const req = await createLocalReq({}, payload)
  return runSemanticContentSearch(req, query, {
    collections: options.collections,
    limit: options.limit ?? 12,
    status: options.status ?? 'published',
    minSimilarity: 0.3,
  })
}
