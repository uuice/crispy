import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * P2 config center: email-transports + email-settings,
 * locked-docs + MCP + query-preset enums.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_email_transports_type" AS ENUM('resend', 'smtp');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum__email_transports_v_version_type" AS ENUM('resend', 'smtp');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    CREATE TABLE IF NOT EXISTS "email_transports" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "type" "enum_email_transports_type" DEFAULT 'resend' NOT NULL,
      "api_key" varchar,
      "smtp_host" varchar,
      "smtp_port" numeric DEFAULT 587,
      "smtp_secure" boolean DEFAULT false,
      "smtp_user" varchar,
      "smtp_pass" varchar,
      "enabled" boolean DEFAULT true,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "deleted_at" timestamp(3) with time zone
    );

    CREATE TABLE IF NOT EXISTS "_email_transports_v" (
      "id" serial PRIMARY KEY NOT NULL,
      "parent_id" integer,
      "version_name" varchar NOT NULL,
      "version_type" "enum__email_transports_v_version_type" DEFAULT 'resend' NOT NULL,
      "version_api_key" varchar,
      "version_smtp_host" varchar,
      "version_smtp_port" numeric DEFAULT 587,
      "version_smtp_secure" boolean DEFAULT false,
      "version_smtp_user" varchar,
      "version_smtp_pass" varchar,
      "version_enabled" boolean DEFAULT true,
      "version_updated_at" timestamp(3) with time zone,
      "version_created_at" timestamp(3) with time zone,
      "version_deleted_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "email_settings" (
      "id" serial PRIMARY KEY NOT NULL,
      "active_transport_id" integer,
      "from_address" varchar,
      "from_name" varchar,
      "form_default_to_email" varchar,
      "override_recipient" varchar,
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );

    DO $$ BEGIN
      ALTER TABLE "_email_transports_v"
        ADD CONSTRAINT "_email_transports_v_parent_id_fk"
        FOREIGN KEY ("parent_id") REFERENCES "public"."email_transports"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "email_settings"
        ADD CONSTRAINT "email_settings_active_transport_id_fk"
        FOREIGN KEY ("active_transport_id") REFERENCES "public"."email_transports"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    CREATE INDEX IF NOT EXISTS "email_transports_updated_at_idx" ON "email_transports" ("updated_at");
    CREATE INDEX IF NOT EXISTS "email_transports_created_at_idx" ON "email_transports" ("created_at");
    CREATE INDEX IF NOT EXISTS "email_transports_deleted_at_idx" ON "email_transports" ("deleted_at");
    CREATE INDEX IF NOT EXISTS "_email_transports_v_parent_idx" ON "_email_transports_v" ("parent_id");
    CREATE INDEX IF NOT EXISTS "_email_transports_v_created_at_idx" ON "_email_transports_v" ("created_at");
    CREATE INDEX IF NOT EXISTS "_email_transports_v_updated_at_idx" ON "_email_transports_v" ("updated_at");
    CREATE INDEX IF NOT EXISTS "email_settings_active_transport_idx" ON "email_settings" ("active_transport_id");

    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "email_transports_find" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "email_transports_create" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "email_transports_update" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "email_transports_delete" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "email_settings_find" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "email_settings_update" boolean DEFAULT false;

    ALTER TYPE "public"."enum_payload_query_presets_related_collection" ADD VALUE IF NOT EXISTS 'email-transports';

    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "email_transports_id" integer;

    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_email_transports_fk"
        FOREIGN KEY ("email_transports_id") REFERENCES "public"."email_transports"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_email_transports_id_idx"
      ON "payload_locked_documents_rels" ("email_transports_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
      DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_email_transports_fk";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_email_transports_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "email_transports_id";

    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "email_transports_find";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "email_transports_create";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "email_transports_update";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "email_transports_delete";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "email_settings_find";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "email_settings_update";

    DROP TABLE IF EXISTS "email_settings" CASCADE;
    DROP TABLE IF EXISTS "_email_transports_v" CASCADE;
    DROP TABLE IF EXISTS "email_transports" CASCADE;

    DROP TYPE IF EXISTS "public"."enum__email_transports_v_version_type";
    DROP TYPE IF EXISTS "public"."enum_email_transports_type";
  `)
}
