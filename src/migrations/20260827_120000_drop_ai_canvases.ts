import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Drop AI Canvases (React Flow admin view + collection).
 * Query-preset enum value 'ai-canvases' is left in place (Postgres cannot
 * cheaply remove enum members); leftover preset rows are deleted.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
      DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_ai_canvases_fk";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_ai_canvases_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "ai_canvases_id";

    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "ai_canvases_find";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "ai_canvases_create";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "ai_canvases_update";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "ai_canvases_delete";

    DELETE FROM "payload_query_presets" WHERE "related_collection" = 'ai-canvases';

    DROP TABLE IF EXISTS "ai_canvases" CASCADE;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "ai_canvases" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "user_id" integer NOT NULL,
      "graph" jsonb NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "deleted_at" timestamp(3) with time zone
    );

    DO $$ BEGIN
      ALTER TABLE "ai_canvases"
        ADD CONSTRAINT "ai_canvases_user_id_fk"
        FOREIGN KEY ("user_id") REFERENCES "public"."users"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    CREATE INDEX IF NOT EXISTS "ai_canvases_user_idx" ON "ai_canvases" ("user_id");
    CREATE INDEX IF NOT EXISTS "ai_canvases_updated_at_idx" ON "ai_canvases" ("updated_at");
    CREATE INDEX IF NOT EXISTS "ai_canvases_created_at_idx" ON "ai_canvases" ("created_at");
    CREATE INDEX IF NOT EXISTS "ai_canvases_deleted_at_idx" ON "ai_canvases" ("deleted_at");

    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "ai_canvases_find" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "ai_canvases_create" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "ai_canvases_update" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "ai_canvases_delete" boolean DEFAULT false;

    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "ai_canvases_id" integer;

    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_ai_canvases_fk"
        FOREIGN KEY ("ai_canvases_id") REFERENCES "public"."ai_canvases"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_ai_canvases_id_idx"
      ON "payload_locked_documents_rels" ("ai_canvases_id");
  `)
}
