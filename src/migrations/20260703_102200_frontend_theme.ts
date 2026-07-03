import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_site_settings_frontend_theme" AS ENUM('blog');
    ALTER TABLE "site_settings" ADD COLUMN "frontend_theme" "enum_site_settings_frontend_theme" DEFAULT 'blog';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "frontend_theme";
    DROP TYPE IF EXISTS "public"."enum_site_settings_frontend_theme";
  `)
}
