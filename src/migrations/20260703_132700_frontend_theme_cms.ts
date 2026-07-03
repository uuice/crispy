import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TYPE "public"."enum_site_settings_frontend_theme" ADD VALUE IF NOT EXISTS 'cms';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "site_settings" SET "frontend_theme" = 'blog' WHERE "frontend_theme" = 'cms';
  `)
}
