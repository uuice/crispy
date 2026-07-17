import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Fix: Payload document locks need polymorphic FK columns for new catalogs.
 * Safe if 20260717_141000 already included these (IF NOT EXISTS).
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "llm_providers_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "prompt_templates_id" integer;

    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_llm_providers_fk"
        FOREIGN KEY ("llm_providers_id") REFERENCES "public"."llm_providers"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_prompt_templates_fk"
        FOREIGN KEY ("prompt_templates_id") REFERENCES "public"."prompt_templates"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_llm_providers_id_idx"
      ON "payload_locked_documents_rels" ("llm_providers_id");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_prompt_templates_id_idx"
      ON "payload_locked_documents_rels" ("prompt_templates_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
      DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_llm_providers_fk";
    ALTER TABLE "payload_locked_documents_rels"
      DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_prompt_templates_fk";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_llm_providers_id_idx";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_prompt_templates_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "llm_providers_id";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "prompt_templates_id";
  `)
}
