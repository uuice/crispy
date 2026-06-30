import type { PayloadRequest } from 'payload'

import { buildEmbeddableContentText, buildEmbeddingExcerpt } from '@/ai/embeddings/buildContentText'
import type { EmbeddableCollection } from '@/ai/embeddings/constants'
import { resolveEmbeddingConfig } from '@/ai/embeddings/config'
import { embedText } from '@/ai/embeddings/embedText'
import { deleteContentEmbedding, upsertContentEmbedding } from '@/ai/embeddings/store'

type DocLike = Record<string, unknown> & { id?: number | string; title?: string; slug?: string }

export async function syncContentEmbedding(
  req: PayloadRequest,
  collection: EmbeddableCollection,
  doc: DocLike,
): Promise<void> {
  const config = resolveEmbeddingConfig()
  if (!config.enabled) return

  const docId = Number(doc.id)
  if (!Number.isFinite(docId)) return

  const text = buildEmbeddableContentText(collection, doc)
  if (!text) {
    await deleteContentEmbedding(req.payload, collection, docId)
    return
  }

  const embedding = await embedText(text)
  const status = String(doc._status ?? doc.status ?? 'published')
  const title = String(doc.title ?? '').trim()
  const slug = String(doc.slug ?? '').trim()

  await upsertContentEmbedding(req.payload, {
    collection,
    docId,
    title,
    slug,
    status,
    excerpt: buildEmbeddingExcerpt(text),
    embedding,
  })
}

export async function removeContentEmbedding(
  req: PayloadRequest,
  collection: EmbeddableCollection,
  docId: number | string,
): Promise<void> {
  const config = resolveEmbeddingConfig()
  if (!config.enabled) return

  await deleteContentEmbedding(req.payload, collection, Number(docId))
}
