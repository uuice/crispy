import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/** Resize embedding column for providers that output 1024 dims (e.g. Aliyun text-embedding-v3). */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "content_embeddings_embedding_idx";
    DELETE FROM "content_embeddings";
    ALTER TABLE "content_embeddings"
      ALTER COLUMN "embedding" TYPE vector(1024);

    CREATE INDEX IF NOT EXISTS "content_embeddings_embedding_idx"
      ON "content_embeddings" USING ivfflat ("embedding" vector_cosine_ops)
      WITH (lists = 100);
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "content_embeddings_embedding_idx";
    DELETE FROM "content_embeddings";
    ALTER TABLE "content_embeddings"
      ALTER COLUMN "embedding" TYPE vector(1536);

    CREATE INDEX IF NOT EXISTS "content_embeddings_embedding_idx"
      ON "content_embeddings" USING ivfflat ("embedding" vector_cosine_ops)
      WITH (lists = 100);
  `)
}
