import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/** Drop leftover enums from removed ai_settings.promptTemplates array. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DROP TYPE IF EXISTS "public"."enum_ai_settings_prompt_templates_action";
    DROP TYPE IF EXISTS "public"."enum_ai_settings_prompt_templates_output_format";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_ai_settings_prompt_templates_action" AS ENUM(
        'polish', 'expand', 'shorten', 'custom', 'seo_title', 'seo_description', 'rewrite', 'suggest_taxonomy'
      );
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_ai_settings_prompt_templates_output_format" AS ENUM('text', 'json');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `)
}
