import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "record_settings_icp_number" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "record_settings_icp_link" varchar DEFAULT 'https://beian.miit.gov.cn/';
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "record_settings_police_number" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "record_settings_police_link" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "record_settings_record_text" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "record_settings_show_record" boolean DEFAULT true;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "record_settings_show_record";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "record_settings_record_text";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "record_settings_police_link";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "record_settings_police_number";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "record_settings_icp_link";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "record_settings_icp_number";
  `)
}
