import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * P1 config center: storage-targets + storage-settings,
 * integration-credentials + integration-settings,
 * locked-docs + MCP + query-preset enums.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_storage_settings_mode" AS ENUM('local', 's3');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_integration_credentials_type" AS ENUM('unsplash');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum__integration_credentials_v_version_type" AS ENUM('unsplash');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    CREATE TABLE IF NOT EXISTS "storage_targets" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "bucket" varchar NOT NULL,
      "region" varchar DEFAULT 'us-east-1',
      "prefix" varchar DEFAULT 'media',
      "endpoint" varchar,
      "access_key_id" varchar NOT NULL,
      "secret_access_key" varchar NOT NULL,
      "force_path_style" boolean DEFAULT true,
      "public_base_url" varchar,
      "virtual_sizes" boolean DEFAULT true,
      "enabled" boolean DEFAULT true,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "deleted_at" timestamp(3) with time zone
    );

    CREATE TABLE IF NOT EXISTS "_storage_targets_v" (
      "id" serial PRIMARY KEY NOT NULL,
      "parent_id" integer,
      "version_name" varchar NOT NULL,
      "version_bucket" varchar NOT NULL,
      "version_region" varchar DEFAULT 'us-east-1',
      "version_prefix" varchar DEFAULT 'media',
      "version_endpoint" varchar,
      "version_access_key_id" varchar NOT NULL,
      "version_secret_access_key" varchar NOT NULL,
      "version_force_path_style" boolean DEFAULT true,
      "version_public_base_url" varchar,
      "version_virtual_sizes" boolean DEFAULT true,
      "version_enabled" boolean DEFAULT true,
      "version_updated_at" timestamp(3) with time zone,
      "version_created_at" timestamp(3) with time zone,
      "version_deleted_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "integration_credentials" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "type" "enum_integration_credentials_type" DEFAULT 'unsplash' NOT NULL,
      "api_key" varchar NOT NULL,
      "enabled" boolean DEFAULT true,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "deleted_at" timestamp(3) with time zone
    );

    CREATE TABLE IF NOT EXISTS "_integration_credentials_v" (
      "id" serial PRIMARY KEY NOT NULL,
      "parent_id" integer,
      "version_name" varchar NOT NULL,
      "version_type" "enum__integration_credentials_v_version_type" DEFAULT 'unsplash' NOT NULL,
      "version_api_key" varchar NOT NULL,
      "version_enabled" boolean DEFAULT true,
      "version_updated_at" timestamp(3) with time zone,
      "version_created_at" timestamp(3) with time zone,
      "version_deleted_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "storage_settings" (
      "id" serial PRIMARY KEY NOT NULL,
      "mode" "enum_storage_settings_mode" DEFAULT 'local' NOT NULL,
      "active_target_id" integer,
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );

    CREATE TABLE IF NOT EXISTS "integration_settings" (
      "id" serial PRIMARY KEY NOT NULL,
      "active_unsplash_id" integer,
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );

    DO $$ BEGIN
      ALTER TABLE "_storage_targets_v"
        ADD CONSTRAINT "_storage_targets_v_parent_id_fk"
        FOREIGN KEY ("parent_id") REFERENCES "public"."storage_targets"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "_integration_credentials_v"
        ADD CONSTRAINT "_integration_credentials_v_parent_id_fk"
        FOREIGN KEY ("parent_id") REFERENCES "public"."integration_credentials"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "storage_settings"
        ADD CONSTRAINT "storage_settings_active_target_id_fk"
        FOREIGN KEY ("active_target_id") REFERENCES "public"."storage_targets"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "integration_settings"
        ADD CONSTRAINT "integration_settings_active_unsplash_id_fk"
        FOREIGN KEY ("active_unsplash_id") REFERENCES "public"."integration_credentials"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    CREATE INDEX IF NOT EXISTS "storage_targets_updated_at_idx" ON "storage_targets" ("updated_at");
    CREATE INDEX IF NOT EXISTS "storage_targets_created_at_idx" ON "storage_targets" ("created_at");
    CREATE INDEX IF NOT EXISTS "storage_targets_deleted_at_idx" ON "storage_targets" ("deleted_at");
    CREATE INDEX IF NOT EXISTS "_storage_targets_v_parent_idx" ON "_storage_targets_v" ("parent_id");
    CREATE INDEX IF NOT EXISTS "_storage_targets_v_created_at_idx" ON "_storage_targets_v" ("created_at");
    CREATE INDEX IF NOT EXISTS "_storage_targets_v_updated_at_idx" ON "_storage_targets_v" ("updated_at");

    CREATE INDEX IF NOT EXISTS "integration_credentials_updated_at_idx" ON "integration_credentials" ("updated_at");
    CREATE INDEX IF NOT EXISTS "integration_credentials_created_at_idx" ON "integration_credentials" ("created_at");
    CREATE INDEX IF NOT EXISTS "integration_credentials_deleted_at_idx" ON "integration_credentials" ("deleted_at");
    CREATE INDEX IF NOT EXISTS "_integration_credentials_v_parent_idx" ON "_integration_credentials_v" ("parent_id");
    CREATE INDEX IF NOT EXISTS "_integration_credentials_v_created_at_idx" ON "_integration_credentials_v" ("created_at");
    CREATE INDEX IF NOT EXISTS "_integration_credentials_v_updated_at_idx" ON "_integration_credentials_v" ("updated_at");

    CREATE INDEX IF NOT EXISTS "storage_settings_active_target_idx" ON "storage_settings" ("active_target_id");
    CREATE INDEX IF NOT EXISTS "integration_settings_active_unsplash_idx" ON "integration_settings" ("active_unsplash_id");

    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "storage_targets_find" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "storage_targets_create" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "storage_targets_update" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "storage_targets_delete" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "integration_credentials_find" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "integration_credentials_create" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "integration_credentials_update" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "integration_credentials_delete" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "storage_settings_find" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "storage_settings_update" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "integration_settings_find" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "integration_settings_update" boolean DEFAULT false;

    ALTER TYPE "public"."enum_payload_query_presets_related_collection" ADD VALUE IF NOT EXISTS 'storage-targets';
    ALTER TYPE "public"."enum_payload_query_presets_related_collection" ADD VALUE IF NOT EXISTS 'integration-credentials';

    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "storage_targets_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "integration_credentials_id" integer;

    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_storage_targets_fk"
        FOREIGN KEY ("storage_targets_id") REFERENCES "public"."storage_targets"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_integration_credentials_fk"
        FOREIGN KEY ("integration_credentials_id") REFERENCES "public"."integration_credentials"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_storage_targets_id_idx"
      ON "payload_locked_documents_rels" ("storage_targets_id");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_integration_credentials_id_idx"
      ON "payload_locked_documents_rels" ("integration_credentials_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
      DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_storage_targets_fk";
    ALTER TABLE "payload_locked_documents_rels"
      DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_integration_credentials_fk";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_storage_targets_id_idx";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_integration_credentials_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "storage_targets_id";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "integration_credentials_id";

    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "storage_targets_find";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "storage_targets_create";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "storage_targets_update";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "storage_targets_delete";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "integration_credentials_find";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "integration_credentials_create";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "integration_credentials_update";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "integration_credentials_delete";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "storage_settings_find";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "storage_settings_update";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "integration_settings_find";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "integration_settings_update";

    DROP TABLE IF EXISTS "integration_settings" CASCADE;
    DROP TABLE IF EXISTS "storage_settings" CASCADE;
    DROP TABLE IF EXISTS "_integration_credentials_v" CASCADE;
    DROP TABLE IF EXISTS "integration_credentials" CASCADE;
    DROP TABLE IF EXISTS "_storage_targets_v" CASCADE;
    DROP TABLE IF EXISTS "storage_targets" CASCADE;

    DROP TYPE IF EXISTS "public"."enum__integration_credentials_v_version_type";
    DROP TYPE IF EXISTS "public"."enum_integration_credentials_type";
    DROP TYPE IF EXISTS "public"."enum_storage_settings_mode";
  `)
}
