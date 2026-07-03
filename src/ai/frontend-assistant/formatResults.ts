import type { ContentEmbeddingRow } from '@/ai/embeddings/store'
import { getPagePath, getPostPath } from '@/utilities/frontendPaths'

export function formatSemanticSearchHit(row: ContentEmbeddingRow) {
  const slug = row.slug || ''
  const url = row.collection === 'posts' ? getPostPath(slug) : getPagePath(slug)

  return {
    title: row.title,
    url,
    excerpt: row.excerpt,
    similarity: row.similarity,
    type: row.collection,
  }
}
