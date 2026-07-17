import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Embedding Active on ai-settings: defaultEmbeddingProvider + defaultEmbeddingModel.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "ai_settings" ADD COLUMN IF NOT EXISTS "default_embedding_provider_id" integer;
    ALTER TABLE "ai_settings" ADD COLUMN IF NOT EXISTS "default_embedding_model" varchar;

    DO $$ BEGIN
      ALTER TABLE "ai_settings"
        ADD CONSTRAINT "ai_settings_default_embedding_provider_id_fk"
        FOREIGN KEY ("default_embedding_provider_id") REFERENCES "public"."llm_providers"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    CREATE INDEX IF NOT EXISTS "ai_settings_default_embedding_provider_idx"
      ON "ai_settings" ("default_embedding_provider_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "ai_settings"
      DROP CONSTRAINT IF EXISTS "ai_settings_default_embedding_provider_id_fk";
    DROP INDEX IF EXISTS "ai_settings_default_embedding_provider_idx";
    ALTER TABLE "ai_settings" DROP COLUMN IF EXISTS "default_embedding_provider_id";
    ALTER TABLE "ai_settings" DROP COLUMN IF EXISTS "default_embedding_model";
  `)
}
