import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import type { EmbeddableCollection } from '@/ai/embeddings/constants'
import { removeContentEmbedding, syncContentEmbedding } from '@/ai/embeddings/syncContentEmbedding'

export function createSyncContentEmbeddingHook(
  collection: EmbeddableCollection,
): CollectionAfterChangeHook {
  return async ({ doc, req }) => {
    if (req.context?.skipEmbeddingSync) return doc

    try {
      await syncContentEmbedding(req, collection, doc as Record<string, unknown>)
    } catch (error) {
      req.payload.logger.error({
        err: error,
        msg: `Failed to sync embedding for ${collection}:${doc.id}`,
      })
    }
    return doc
  }
}

export function createRemoveContentEmbeddingHook(
  collection: EmbeddableCollection,
): CollectionAfterDeleteHook {
  return async ({ doc, req }) => {
    if (req.context?.skipEmbeddingSync) return doc

    try {
      await removeContentEmbedding(req, collection, doc.id)
    } catch (error) {
      req.payload.logger.error({
        err: error,
        msg: `Failed to remove embedding for ${collection}:${doc.id}`,
      })
    }
    return doc
  }
}
