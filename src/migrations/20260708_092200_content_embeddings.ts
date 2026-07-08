import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/** Semantic search vectors for posts/pages (pgvector). Dimensions match LLM_EMBEDDING_DIMENSIONS default (1536). */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`CREATE EXTENSION IF NOT EXISTS vector`)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "content_embeddings" (
      "id" serial PRIMARY KEY,
      "collection" varchar NOT NULL,
      "doc_id" integer NOT NULL,
      "title" text,
      "slug" text,
      "status" text,
      "excerpt" text,
      "embedding" vector(1536),
      "updated_at" timestamptz DEFAULT now() NOT NULL
    );

    CREATE UNIQUE INDEX IF NOT EXISTS "content_embeddings_collection_doc_id_idx"
      ON "content_embeddings" ("collection", "doc_id");

    CREATE INDEX IF NOT EXISTS "content_embeddings_embedding_idx"
      ON "content_embeddings" USING ivfflat ("embedding" vector_cosine_ops)
      WITH (lists = 100);
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "content_embeddings_embedding_idx";
    DROP INDEX IF EXISTS "content_embeddings_collection_doc_id_idx";
    DROP TABLE IF EXISTS "content_embeddings";
  `)
}
