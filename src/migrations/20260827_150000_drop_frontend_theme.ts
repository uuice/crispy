import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Drop unused frontend theme switching: site-settings.frontendTheme
 * (blog / cms / kb). The blog skin remains hardcoded.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "frontend_theme";
    DROP TYPE IF EXISTS "public"."enum_site_settings_frontend_theme";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_site_settings_frontend_theme" AS ENUM('blog', 'cms', 'kb');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    ALTER TABLE "site_settings"
      ADD COLUMN IF NOT EXISTS "frontend_theme" "enum_site_settings_frontend_theme" DEFAULT 'blog';
  `)
}
