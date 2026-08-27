import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Drop Unsplash integration: integration-credentials, integration-settings,
 * MCP/lock columns. Query-preset enum value 'integration-credentials' is left
 * in place (Postgres cannot cheaply remove enum members).
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
      DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_integration_credentials_fk";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_integration_credentials_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "integration_credentials_id";

    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "integration_credentials_find";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "integration_credentials_create";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "integration_credentials_update";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "integration_credentials_delete";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "integration_settings_find";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "integration_settings_update";

    DELETE FROM "payload_query_presets" WHERE "related_collection" = 'integration-credentials';

    DROP TABLE IF EXISTS "integration_settings" CASCADE;
    DROP TABLE IF EXISTS "_integration_credentials_v" CASCADE;
    DROP TABLE IF EXISTS "integration_credentials" CASCADE;

    DROP TYPE IF EXISTS "public"."enum__integration_credentials_v_version_type";
    DROP TYPE IF EXISTS "public"."enum_integration_credentials_type";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_integration_credentials_type" AS ENUM('unsplash');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    CREATE TABLE IF NOT EXISTS "integration_credentials" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "type" "enum_integration_credentials_type" DEFAULT 'unsplash' NOT NULL,
      "api_key" varchar,
      "enabled" boolean DEFAULT true,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "deleted_at" timestamp(3) with time zone
    );

    CREATE TABLE IF NOT EXISTS "integration_settings" (
      "id" serial PRIMARY KEY NOT NULL,
      "active_unsplash_id" integer,
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );

    DO $$ BEGIN
      ALTER TABLE "integration_settings"
        ADD CONSTRAINT "integration_settings_active_unsplash_id_fk"
        FOREIGN KEY ("active_unsplash_id") REFERENCES "public"."integration_credentials"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    CREATE INDEX IF NOT EXISTS "integration_credentials_updated_at_idx" ON "integration_credentials" ("updated_at");
    CREATE INDEX IF NOT EXISTS "integration_credentials_created_at_idx" ON "integration_credentials" ("created_at");
    CREATE INDEX IF NOT EXISTS "integration_credentials_deleted_at_idx" ON "integration_credentials" ("deleted_at");
    CREATE INDEX IF NOT EXISTS "integration_settings_active_unsplash_idx" ON "integration_settings" ("active_unsplash_id");

    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "integration_credentials_find" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "integration_credentials_create" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "integration_credentials_update" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "integration_credentials_delete" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "integration_settings_find" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "integration_settings_update" boolean DEFAULT false;

    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "integration_credentials_id" integer;

    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_integration_credentials_fk"
        FOREIGN KEY ("integration_credentials_id") REFERENCES "public"."integration_credentials"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_integration_credentials_id_idx"
      ON "payload_locked_documents_rels" ("integration_credentials_id");
  `)
}
