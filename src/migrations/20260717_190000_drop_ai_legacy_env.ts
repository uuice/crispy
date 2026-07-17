import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * - llm-providers.embedding_dimensions (Catalog)
 * - Drop ai-settings legacy provider/model/baseUrl/promptTemplates
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "llm_providers" ADD COLUMN IF NOT EXISTS "embedding_dimensions" numeric DEFAULT 1024;
    ALTER TABLE "_llm_providers_v" ADD COLUMN IF NOT EXISTS "version_embedding_dimensions" numeric DEFAULT 1024;

    UPDATE "llm_providers" SET "embedding_dimensions" = 1024
    WHERE "embedding_dimensions" IS NULL;

    DROP TABLE IF EXISTS "ai_settings_prompt_templates" CASCADE;

    ALTER TABLE "ai_settings" DROP COLUMN IF EXISTS "provider";
    ALTER TABLE "ai_settings" DROP COLUMN IF EXISTS "model";
    ALTER TABLE "ai_settings" DROP COLUMN IF EXISTS "base_url";

    DROP TYPE IF EXISTS "public"."enum_ai_settings_provider";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_ai_settings_provider" AS ENUM('deepseek', 'openai', 'custom');

    ALTER TABLE "ai_settings" ADD COLUMN IF NOT EXISTS "provider" "enum_ai_settings_provider" DEFAULT 'deepseek';
    ALTER TABLE "ai_settings" ADD COLUMN IF NOT EXISTS "model" varchar DEFAULT 'deepseek-chat';
    ALTER TABLE "ai_settings" ADD COLUMN IF NOT EXISTS "base_url" varchar DEFAULT 'https://api.deepseek.com';

    CREATE TABLE IF NOT EXISTS "ai_settings_prompt_templates" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar NOT NULL,
      "action" varchar NOT NULL,
      "output_format" varchar DEFAULT 'text',
      "enabled" boolean DEFAULT true,
      "system_prompt" varchar NOT NULL,
      "user_prompt" varchar NOT NULL
    );

    ALTER TABLE "llm_providers" DROP COLUMN IF EXISTS "embedding_dimensions";
    ALTER TABLE "_llm_providers_v" DROP COLUMN IF EXISTS "version_embedding_dimensions";
  `)
}
