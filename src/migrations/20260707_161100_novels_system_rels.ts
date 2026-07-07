import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/** Payload system tables for the novels collection (locked docs + post drafts). */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TYPE "public"."enum_payload_query_presets_related_collection" ADD VALUE IF NOT EXISTS 'novels' BEFORE 'gallery-items';
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "novels_id" integer;
    ALTER TABLE "_posts_v" ADD COLUMN IF NOT EXISTS "version_novel_id" integer;

    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_novels_fk"
        FOREIGN KEY ("novels_id") REFERENCES "public"."novels"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_posts_v"
        ADD CONSTRAINT "_posts_v_version_novel_id_novels_id_fk"
        FOREIGN KEY ("version_novel_id") REFERENCES "public"."novels"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_novels_id_idx"
      ON "payload_locked_documents_rels" USING btree ("novels_id");
    CREATE INDEX IF NOT EXISTS "_posts_v_version_version_novel_idx"
      ON "_posts_v" USING btree ("version_novel_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_novels_fk";
    ALTER TABLE "_posts_v" DROP CONSTRAINT IF EXISTS "_posts_v_version_novel_id_novels_id_fk";

    DROP INDEX IF EXISTS "payload_locked_documents_rels_novels_id_idx";
    DROP INDEX IF EXISTS "_posts_v_version_version_novel_idx";

    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "novels_id";
    ALTER TABLE "_posts_v" DROP COLUMN IF EXISTS "version_novel_id";
  `)
}
