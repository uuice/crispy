import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE EXTENSION IF NOT EXISTS vector;

   CREATE TABLE IF NOT EXISTS "content_embeddings" (
   	"id" serial PRIMARY KEY NOT NULL,
   	"collection" varchar NOT NULL,
   	"doc_id" numeric NOT NULL,
   	"title" varchar,
   	"slug" varchar,
   	"status" varchar,
   	"excerpt" varchar,
   	"embedding" vector(1536),
   	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
   );

   CREATE UNIQUE INDEX IF NOT EXISTS "content_embeddings_collection_doc_id_idx"
    ON "content_embeddings" USING btree ("collection", "doc_id");

   CREATE INDEX IF NOT EXISTS "content_embeddings_embedding_hnsw_idx"
    ON "content_embeddings" USING hnsw ("embedding" vector_cosine_ops);`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX IF EXISTS "content_embeddings_embedding_hnsw_idx";
   DROP INDEX IF EXISTS "content_embeddings_collection_doc_id_idx";
   DROP TABLE IF EXISTS "content_embeddings";`)
}
