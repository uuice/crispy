import type { ContentEmbeddingRow } from '@/ai/embeddings/store'
import { getPagePath, getPostPath } from '@/utilities/frontendPaths'

export function resolveEmbeddingHitUrl(row: ContentEmbeddingRow): string {
  const slug = row.slug || ''

  if (row.collection === 'posts') {
    return getPostPath(slug)
  }

  return getPagePath(slug)
}

export function formatEmbeddingSearchHit(row: ContentEmbeddingRow) {
  return {
    title: row.title,
    url: resolveEmbeddingHitUrl(row),
    slug: row.slug,
    docId: row.docId,
    excerpt: row.excerpt,
    similarity: row.similarity,
    type: row.collection,
  }
}
