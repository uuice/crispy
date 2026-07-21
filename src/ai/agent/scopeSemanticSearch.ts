import type { PayloadRequest } from 'payload'

import { assertAgentCollectionAccess } from '@/ai/agent/access'
import {
  EMBEDDING_COLLECTIONS,
  type EmbeddableCollection,
} from '@/ai/embeddings/constants'
import { formatEmbeddingSearchHit } from '@/ai/embeddings/formatEmbeddingSearchHit'
import { runSemanticContentSearch } from '@/ai/embeddings/semanticSearch'
import type { ContentEmbeddingRow } from '@/ai/embeddings/store'

function isEmbeddableCollection(value: string): value is EmbeddableCollection {
  return (EMBEDDING_COLLECTIONS as readonly string[]).includes(value)
}

/** Keep only embeddable collections the user may read at collection scope. */
export async function resolveEmbeddableCollectionsForAgent(
  req: PayloadRequest,
  collections?: EmbeddableCollection[],
): Promise<EmbeddableCollection[]> {
  const candidates = collections?.length
    ? collections.filter(isEmbeddableCollection)
    : [...EMBEDDING_COLLECTIONS]

  const allowed: EmbeddableCollection[] = []
  for (const collection of candidates) {
    try {
      await assertAgentCollectionAccess(req, collection, 'read')
      allowed.push(collection)
    } catch {
      // User cannot list this collection via Agent — skip it entirely.
    }
  }
  return allowed
}

/**
 * Drop hits the user cannot read (permission + posts ownership).
 * Call after over-fetching so filtered results can still fill `limit`.
 */
export async function scopeSemanticSearchHits(
  req: PayloadRequest,
  rows: ContentEmbeddingRow[],
  limit: number,
): Promise<ContentEmbeddingRow[]> {
  const scoped: ContentEmbeddingRow[] = []
  for (const row of rows) {
    try {
      await assertAgentCollectionAccess(req, row.collection, 'read', row.docId)
    } catch {
      continue
    }
    scoped.push(row)
    if (scoped.length >= limit) break
  }
  return scoped
}

/** Semantic search with Agent/MCP ACL: collection allowlist + per-hit assert. */
export async function runScopedSemanticContentSearch(
  req: PayloadRequest,
  options: {
    query: string
    collections?: EmbeddableCollection[]
    limit?: number
    status?: string
  },
) {
  const limit = Math.min(Math.max(options.limit ?? 8, 1), 25)
  const allowed = await resolveEmbeddableCollectionsForAgent(req, options.collections)
  if (allowed.length === 0) {
    return []
  }

  const rows = await runSemanticContentSearch(req, options.query, {
    collections: allowed,
    limit: limit * 3,
    status: options.status,
  })

  const scoped = await scopeSemanticSearchHits(req, rows, limit)
  return scoped.map(formatEmbeddingSearchHit)
}
