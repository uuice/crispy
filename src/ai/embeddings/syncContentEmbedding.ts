import type { PayloadRequest } from 'payload'

import { buildEmbeddableContentText, buildEmbeddingExcerpt } from '@/ai/embeddings/buildContentText'
import type { EmbeddableCollection } from '@/ai/embeddings/constants'
import { resolveEmbeddingConfig } from '@/ai/embeddings/config'
import { embedText } from '@/ai/embeddings/embedText'
import { deleteContentEmbedding, upsertContentEmbedding } from '@/ai/embeddings/store'

type DocLike = Record<string, unknown> & { id?: number | string; title?: string; slug?: string }

async function resolveNovelSlug(
  req: PayloadRequest,
  novelRef: unknown,
): Promise<string | null> {
  if (typeof novelRef === 'object' && novelRef && 'slug' in novelRef) {
    const novel = novelRef as { slug?: string | null; enabled?: boolean | null }
    if (novel.enabled === false || !novel.slug) return null
    return novel.slug
  }

  if (novelRef == null || novelRef === '') return null

  const novel = await req.payload.findByID({
    collection: 'novels',
    id: novelRef as number | string,
    depth: 0,
    select: { slug: true, enabled: true },
  })

  if (!novel?.slug || novel.enabled === false) return null
  return novel.slug
}

async function resolveEmbeddingSlug(
  req: PayloadRequest,
  collection: EmbeddableCollection,
  doc: DocLike,
): Promise<string> {
  const baseSlug = String(doc.slug ?? '').trim()
  if (collection !== 'novel-chapters' || !baseSlug || !doc.novel) return baseSlug

  const novelSlug = await resolveNovelSlug(req, doc.novel)
  if (!novelSlug) return baseSlug

  return `${novelSlug}/${baseSlug}`
}

function resolveEmbeddingStatus(collection: EmbeddableCollection, doc: DocLike): string {
  if (collection === 'novels') {
    return doc.enabled === false ? 'draft' : 'published'
  }

  return String(doc._status ?? doc.status ?? 'published')
}

/** Load populated relations for embedding text (hook payloads often carry raw IDs). */
async function loadEmbeddableDoc(
  req: PayloadRequest,
  collection: EmbeddableCollection,
  doc: DocLike,
): Promise<DocLike> {
  if (collection !== 'novels' && collection !== 'novel-chapters') {
    return doc
  }

  const loaded = await req.payload.findByID({
    collection,
    id: doc.id as number | string,
    depth: 1,
    overrideAccess: true,
  })

  return { ...doc, ...(loaded as unknown as Record<string, unknown>) }
}

export async function syncContentEmbedding(
  req: PayloadRequest,
  collection: EmbeddableCollection,
  doc: DocLike,
): Promise<void> {
  const config = resolveEmbeddingConfig()
  if (!config.enabled) return

  const docId = Number(doc.id)
  if (!Number.isFinite(docId)) return

  if (doc.deletedAt) {
    await deleteContentEmbedding(req.payload, collection, docId)
    return
  }

  if (collection === 'novels' && doc.enabled === false) {
    await deleteContentEmbedding(req.payload, collection, docId)
    return
  }

  if (collection === 'novel-chapters') {
    const novelSlug = await resolveNovelSlug(req, doc.novel)
    if (!novelSlug) {
      await deleteContentEmbedding(req.payload, collection, docId)
      return
    }
    if (doc._status !== 'published') {
      await deleteContentEmbedding(req.payload, collection, docId)
      return
    }
  }

  const embedDoc = await loadEmbeddableDoc(req, collection, doc)
  const text = buildEmbeddableContentText(collection, embedDoc)
  if (!text) {
    await deleteContentEmbedding(req.payload, collection, docId)
    return
  }

  const embedding = await embedText(text)
  const status = resolveEmbeddingStatus(collection, embedDoc)
  const title = String(embedDoc.title ?? doc.title ?? '').trim()
  const slug = await resolveEmbeddingSlug(req, collection, embedDoc)

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
