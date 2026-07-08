import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/** S3 storage plugin adds a hidden `prefix` field on media uploads. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "prefix" varchar;
    ALTER TABLE "_media_v" ADD COLUMN IF NOT EXISTS "version_prefix" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "media" DROP COLUMN IF EXISTS "prefix";
    ALTER TABLE "_media_v" DROP COLUMN IF EXISTS "version_prefix";
  `)
}
