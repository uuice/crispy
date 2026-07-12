import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "redirects_rels" ADD COLUMN IF NOT EXISTS "novel_chapters_id" integer;

  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_novel_chapters_fk"
    FOREIGN KEY ("novel_chapters_id") REFERENCES "public"."novel_chapters"("id")
    ON DELETE cascade ON UPDATE no action;

  CREATE INDEX IF NOT EXISTS "redirects_rels_novel_chapters_id_idx"
    ON "redirects_rels" USING btree ("novel_chapters_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "redirects_rels" DROP CONSTRAINT IF EXISTS "redirects_rels_novel_chapters_fk";
  DROP INDEX IF EXISTS "redirects_rels_novel_chapters_id_idx";
  ALTER TABLE "redirects_rels" DROP COLUMN IF EXISTS "novel_chapters_id";`)
}
