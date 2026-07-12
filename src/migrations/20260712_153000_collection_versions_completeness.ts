import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Complete version-table coverage for novel-related collections:
 * - _redirects_v_rels.novel_chapters_id (redirects plugin novel-chapters target)
 * - Initial _novel_categories_v / _novel_tags_v rows for SQL-seeded taxonomy docs
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "_redirects_v_rels" ADD COLUMN IF NOT EXISTS "novel_chapters_id" integer;

  DO $$ BEGIN
    ALTER TABLE "_redirects_v_rels"
      ADD CONSTRAINT "_redirects_v_rels_novel_chapters_fk"
      FOREIGN KEY ("novel_chapters_id") REFERENCES "public"."novel_chapters"("id")
      ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  CREATE INDEX IF NOT EXISTS "_redirects_v_rels_novel_chapters_id_idx"
    ON "_redirects_v_rels" USING btree ("novel_chapters_id");

  INSERT INTO "_novel_categories_v" (
    "parent_id",
    "version_title",
    "version_generate_slug",
    "version_slug",
    "version_updated_at",
    "version_created_at",
    "version_deleted_at",
    "created_at",
    "updated_at"
  )
  SELECT
    nc."id",
    nc."title",
    nc."generate_slug",
    nc."slug",
    nc."updated_at",
    nc."created_at",
    nc."deleted_at",
    nc."created_at",
    nc."updated_at"
  FROM "novel_categories" nc
  WHERE NOT EXISTS (
    SELECT 1 FROM "_novel_categories_v" v WHERE v."parent_id" = nc."id"
  );

  INSERT INTO "_novel_tags_v" (
    "parent_id",
    "version_title",
    "version_description",
    "version_generate_slug",
    "version_slug",
    "version_updated_at",
    "version_created_at",
    "version_deleted_at",
    "created_at",
    "updated_at"
  )
  SELECT
    nt."id",
    nt."title",
    nt."description",
    nt."generate_slug",
    nt."slug",
    nt."updated_at",
    nt."created_at",
    nt."deleted_at",
    nt."created_at",
    nt."updated_at"
  FROM "novel_tags" nt
  WHERE NOT EXISTS (
    SELECT 1 FROM "_novel_tags_v" v WHERE v."parent_id" = nt."id"
  );`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DELETE FROM "_novel_tags_v"
  WHERE "parent_id" IN (SELECT "id" FROM "novel_tags");

  DELETE FROM "_novel_categories_v"
  WHERE "parent_id" IN (SELECT "id" FROM "novel_categories");

  ALTER TABLE "_redirects_v_rels" DROP CONSTRAINT IF EXISTS "_redirects_v_rels_novel_chapters_fk";
  DROP INDEX IF EXISTS "_redirects_v_rels_novel_chapters_id_idx";
  ALTER TABLE "_redirects_v_rels" DROP COLUMN IF EXISTS "novel_chapters_id";`)
}
