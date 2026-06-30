import { sql } from '@payloadcms/db-postgres'
import type { Payload, PayloadRequest } from 'payload'

import {
  CONTENT_EMBEDDINGS_TABLE,
  type EmbeddableCollection,
} from '@/ai/embeddings/constants'

export type ContentEmbeddingRow = {
  id: number
  collection: EmbeddableCollection
  docId: number
  title: string | null
  slug: string | null
  status: string | null
  excerpt: string | null
  similarity: number
}

function vectorLiteral(values: number[]): string {
  return `[${values.join(',')}]`
}

export async function upsertContentEmbedding(
  payload: Payload,
  input: {
    collection: EmbeddableCollection
    docId: number
    title: string
    slug: string
    status: string
    excerpt: string
    embedding: number[]
  },
): Promise<void> {
  const vec = vectorLiteral(input.embedding)

  await payload.db.drizzle.execute(sql`
    INSERT INTO ${sql.raw(CONTENT_EMBEDDINGS_TABLE)} (
      collection, doc_id, title, slug, status, excerpt, embedding, updated_at
    ) VALUES (
      ${input.collection},
      ${input.docId},
      ${input.title},
      ${input.slug},
      ${input.status},
      ${input.excerpt},
      ${sql.raw(`'${vec}'::vector`)},
      NOW()
    )
    ON CONFLICT (collection, doc_id) DO UPDATE SET
      title = EXCLUDED.title,
      slug = EXCLUDED.slug,
      status = EXCLUDED.status,
      excerpt = EXCLUDED.excerpt,
      embedding = EXCLUDED.embedding,
      updated_at = NOW()
  `)
}

export async function deleteContentEmbedding(
  payload: Payload,
  collection: EmbeddableCollection,
  docId: number,
): Promise<void> {
  await payload.db.drizzle.execute(sql`
    DELETE FROM ${sql.raw(CONTENT_EMBEDDINGS_TABLE)}
    WHERE collection = ${collection} AND doc_id = ${docId}
  `)
}

export async function semanticSearchContent(
  req: PayloadRequest,
  queryEmbedding: number[],
  options: {
    collections?: EmbeddableCollection[]
    limit?: number
    minSimilarity?: number
    status?: string
  } = {},
): Promise<ContentEmbeddingRow[]> {
  const limit = Math.min(Math.max(options.limit ?? 8, 1), 25)
  const minSimilarity = options.minSimilarity ?? 0.35
  const vec = vectorLiteral(queryEmbedding)

  const statusFilter =
    options.status != null ? sql`AND status = ${options.status}` : sql``

  const result = await req.payload.db.drizzle.execute(sql`
    SELECT
      id,
      collection,
      doc_id AS "docId",
      title,
      slug,
      status,
      excerpt,
      1 - (embedding <=> ${sql.raw(`'${vec}'::vector`)}) AS similarity
    FROM ${sql.raw(CONTENT_EMBEDDINGS_TABLE)}
    WHERE embedding IS NOT NULL
      AND collection IN ('posts', 'pages')
      ${options.collections?.length === 1 ? sql`AND collection = ${options.collections[0]}` : sql``}
      ${statusFilter}
      AND 1 - (embedding <=> ${sql.raw(`'${vec}'::vector`)}) >= ${minSimilarity}
    ORDER BY embedding <=> ${sql.raw(`'${vec}'::vector`)}
    LIMIT ${limit}
  `)

  return (result.rows ?? []) as ContentEmbeddingRow[]
}
