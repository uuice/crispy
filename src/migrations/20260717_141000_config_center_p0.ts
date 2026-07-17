import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * P0 config center: llm-providers + prompt-templates catalogs,
 * ai-settings.default_provider / default_model, MCP find flags.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_llm_providers_capabilities" AS ENUM('chat', 'embedding');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_prompt_templates_action" AS ENUM(
        'polish', 'expand', 'shorten', 'custom', 'seo_title', 'seo_description', 'rewrite', 'suggest_taxonomy'
      );
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_prompt_templates_output_format" AS ENUM('text', 'json');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum__llm_providers_v_version_capabilities" AS ENUM('chat', 'embedding');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum__prompt_templates_v_version_action" AS ENUM(
        'polish', 'expand', 'shorten', 'custom', 'seo_title', 'seo_description', 'rewrite', 'suggest_taxonomy'
      );
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum__prompt_templates_v_version_output_format" AS ENUM('text', 'json');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    CREATE TABLE IF NOT EXISTS "llm_providers" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "base_url" varchar NOT NULL,
      "api_key" varchar NOT NULL,
      "default_model" varchar NOT NULL,
      "enabled" boolean DEFAULT true,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "deleted_at" timestamp(3) with time zone
    );

    CREATE TABLE IF NOT EXISTS "llm_providers_models" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "model_id" varchar NOT NULL,
      "label" varchar
    );

    CREATE TABLE IF NOT EXISTS "llm_providers_capabilities" (
      "order" integer NOT NULL,
      "parent_id" integer NOT NULL,
      "value" "enum_llm_providers_capabilities",
      "id" serial PRIMARY KEY NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "_llm_providers_v" (
      "id" serial PRIMARY KEY NOT NULL,
      "parent_id" integer,
      "version_name" varchar NOT NULL,
      "version_base_url" varchar NOT NULL,
      "version_api_key" varchar NOT NULL,
      "version_default_model" varchar NOT NULL,
      "version_enabled" boolean DEFAULT true,
      "version_updated_at" timestamp(3) with time zone,
      "version_created_at" timestamp(3) with time zone,
      "version_deleted_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "_llm_providers_v_version_models" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "model_id" varchar NOT NULL,
      "label" varchar,
      "_uuid" varchar
    );

    CREATE TABLE IF NOT EXISTS "_llm_providers_v_version_capabilities" (
      "order" integer NOT NULL,
      "parent_id" integer NOT NULL,
      "value" "enum__llm_providers_v_version_capabilities",
      "id" serial PRIMARY KEY NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "prompt_templates" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "generate_slug" boolean DEFAULT true,
      "slug" varchar,
      "action" "enum_prompt_templates_action" NOT NULL,
      "output_format" "enum_prompt_templates_output_format" DEFAULT 'text',
      "enabled" boolean DEFAULT true,
      "sort" numeric DEFAULT 0,
      "provider_id" integer,
      "model" varchar,
      "temperature" numeric,
      "max_tokens" numeric,
      "system_prompt" varchar NOT NULL,
      "user_prompt" varchar NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "deleted_at" timestamp(3) with time zone
    );

    CREATE TABLE IF NOT EXISTS "_prompt_templates_v" (
      "id" serial PRIMARY KEY NOT NULL,
      "parent_id" integer,
      "version_title" varchar NOT NULL,
      "version_generate_slug" boolean DEFAULT true,
      "version_slug" varchar,
      "version_action" "enum__prompt_templates_v_version_action" NOT NULL,
      "version_output_format" "enum__prompt_templates_v_version_output_format" DEFAULT 'text',
      "version_enabled" boolean DEFAULT true,
      "version_sort" numeric DEFAULT 0,
      "version_provider_id" integer,
      "version_model" varchar,
      "version_temperature" numeric,
      "version_max_tokens" numeric,
      "version_system_prompt" varchar NOT NULL,
      "version_user_prompt" varchar NOT NULL,
      "version_updated_at" timestamp(3) with time zone,
      "version_created_at" timestamp(3) with time zone,
      "version_deleted_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    ALTER TABLE "ai_settings" ADD COLUMN IF NOT EXISTS "default_provider_id" integer;
    ALTER TABLE "ai_settings" ADD COLUMN IF NOT EXISTS "default_model" varchar;

    DO $$ BEGIN
      ALTER TABLE "llm_providers_models"
        ADD CONSTRAINT "llm_providers_models_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."llm_providers"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "llm_providers_capabilities"
        ADD CONSTRAINT "llm_providers_capabilities_parent_fk"
        FOREIGN KEY ("parent_id") REFERENCES "public"."llm_providers"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "_llm_providers_v"
        ADD CONSTRAINT "_llm_providers_v_parent_id_fk"
        FOREIGN KEY ("parent_id") REFERENCES "public"."llm_providers"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "_llm_providers_v_version_models"
        ADD CONSTRAINT "_llm_providers_v_version_models_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."_llm_providers_v"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "_llm_providers_v_version_capabilities"
        ADD CONSTRAINT "_llm_providers_v_version_capabilities_parent_fk"
        FOREIGN KEY ("parent_id") REFERENCES "public"."_llm_providers_v"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "prompt_templates"
        ADD CONSTRAINT "prompt_templates_provider_id_llm_providers_id_fk"
        FOREIGN KEY ("provider_id") REFERENCES "public"."llm_providers"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "_prompt_templates_v"
        ADD CONSTRAINT "_prompt_templates_v_parent_id_fk"
        FOREIGN KEY ("parent_id") REFERENCES "public"."prompt_templates"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "_prompt_templates_v"
        ADD CONSTRAINT "_prompt_templates_v_version_provider_id_llm_providers_id_fk"
        FOREIGN KEY ("version_provider_id") REFERENCES "public"."llm_providers"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "ai_settings"
        ADD CONSTRAINT "ai_settings_default_provider_id_llm_providers_id_fk"
        FOREIGN KEY ("default_provider_id") REFERENCES "public"."llm_providers"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    CREATE INDEX IF NOT EXISTS "llm_providers_updated_at_idx" ON "llm_providers" ("updated_at");
    CREATE INDEX IF NOT EXISTS "llm_providers_created_at_idx" ON "llm_providers" ("created_at");
    CREATE INDEX IF NOT EXISTS "llm_providers_deleted_at_idx" ON "llm_providers" ("deleted_at");
    CREATE INDEX IF NOT EXISTS "llm_providers_models_order_idx" ON "llm_providers_models" ("_order");
    CREATE INDEX IF NOT EXISTS "llm_providers_models_parent_id_idx" ON "llm_providers_models" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "llm_providers_capabilities_order_idx" ON "llm_providers_capabilities" ("order");
    CREATE INDEX IF NOT EXISTS "llm_providers_capabilities_parent_idx" ON "llm_providers_capabilities" ("parent_id");
    CREATE INDEX IF NOT EXISTS "_llm_providers_v_parent_idx" ON "_llm_providers_v" ("parent_id");
    CREATE INDEX IF NOT EXISTS "_llm_providers_v_created_at_idx" ON "_llm_providers_v" ("created_at");
    CREATE INDEX IF NOT EXISTS "_llm_providers_v_updated_at_idx" ON "_llm_providers_v" ("updated_at");
    CREATE INDEX IF NOT EXISTS "prompt_templates_slug_idx" ON "prompt_templates" ("slug");
    CREATE INDEX IF NOT EXISTS "prompt_templates_provider_idx" ON "prompt_templates" ("provider_id");
    CREATE INDEX IF NOT EXISTS "prompt_templates_updated_at_idx" ON "prompt_templates" ("updated_at");
    CREATE INDEX IF NOT EXISTS "prompt_templates_created_at_idx" ON "prompt_templates" ("created_at");
    CREATE INDEX IF NOT EXISTS "prompt_templates_deleted_at_idx" ON "prompt_templates" ("deleted_at");
    CREATE INDEX IF NOT EXISTS "_prompt_templates_v_parent_idx" ON "_prompt_templates_v" ("parent_id");
    CREATE INDEX IF NOT EXISTS "ai_settings_default_provider_idx" ON "ai_settings" ("default_provider_id");

    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "llm_providers_find" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "llm_providers_create" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "llm_providers_update" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "llm_providers_delete" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "prompt_templates_find" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "prompt_templates_create" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "prompt_templates_update" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "prompt_templates_delete" boolean DEFAULT false;

    ALTER TYPE "public"."enum_payload_query_presets_related_collection" ADD VALUE IF NOT EXISTS 'llm-providers';
    ALTER TYPE "public"."enum_payload_query_presets_related_collection" ADD VALUE IF NOT EXISTS 'prompt-templates';

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

    ALTER TABLE "ai_settings" DROP CONSTRAINT IF EXISTS "ai_settings_default_provider_id_llm_providers_id_fk";
    ALTER TABLE "ai_settings" DROP COLUMN IF EXISTS "default_provider_id";
    ALTER TABLE "ai_settings" DROP COLUMN IF EXISTS "default_model";

    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "llm_providers_find";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "llm_providers_create";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "llm_providers_update";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "llm_providers_delete";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "prompt_templates_find";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "prompt_templates_create";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "prompt_templates_update";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "prompt_templates_delete";

    DROP TABLE IF EXISTS "_prompt_templates_v" CASCADE;
    DROP TABLE IF EXISTS "prompt_templates" CASCADE;
    DROP TABLE IF EXISTS "_llm_providers_v_version_capabilities" CASCADE;
    DROP TABLE IF EXISTS "_llm_providers_v_version_models" CASCADE;
    DROP TABLE IF EXISTS "_llm_providers_v" CASCADE;
    DROP TABLE IF EXISTS "llm_providers_capabilities" CASCADE;
    DROP TABLE IF EXISTS "llm_providers_models" CASCADE;
    DROP TABLE IF EXISTS "llm_providers" CASCADE;

    DROP TYPE IF EXISTS "public"."enum__prompt_templates_v_version_output_format";
    DROP TYPE IF EXISTS "public"."enum__prompt_templates_v_version_action";
    DROP TYPE IF EXISTS "public"."enum_prompt_templates_output_format";
    DROP TYPE IF EXISTS "public"."enum_prompt_templates_action";
    DROP TYPE IF EXISTS "public"."enum__llm_providers_v_version_capabilities";
    DROP TYPE IF EXISTS "public"."enum_llm_providers_capabilities";
  `)
}
