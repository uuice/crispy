import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Backfill _novel_chapters_v from novel_chapters.
 * Admin list for draft-enabled collections reads the versions table; SQL split migration
 * only copied rows into novel_chapters.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  INSERT INTO "_novel_chapters_v" (
    "parent_id",
    "version_title",
    "version_content",
    "version_novel_id",
    "version_meta_title",
    "version_meta_image_id",
    "version_meta_description",
    "version_published_at",
    "version_generate_slug",
    "version_slug",
    "version_updated_at",
    "version_created_at",
    "version_deleted_at",
    "version__status",
    "created_at",
    "updated_at",
    "latest",
    "autosave"
  )
  SELECT
    nc."id",
    nc."title",
    nc."content",
    nc."novel_id",
    nc."meta_title",
    nc."meta_image_id",
    nc."meta_description",
    nc."published_at",
    nc."generate_slug",
    nc."slug",
    nc."updated_at",
    nc."created_at",
    nc."deleted_at",
    nc."_status"::text::"enum__novel_chapters_v_version_status",
    nc."created_at",
    nc."updated_at",
    true,
    false
  FROM "novel_chapters" nc
  WHERE NOT EXISTS (
    SELECT 1
    FROM "_novel_chapters_v" v
    WHERE v."parent_id" = nc."id" AND v."latest" = true
  );

  INSERT INTO "_novel_chapters_v_rels" (
    "order",
    "parent_id",
    "path",
    "novel_categories_id",
    "novel_tags_id"
  )
  SELECT
    r."order",
    v."id",
    r."path",
    r."novel_categories_id",
    r."novel_tags_id"
  FROM "novel_chapters_rels" r
  INNER JOIN "_novel_chapters_v" v
    ON v."parent_id" = r."parent_id" AND v."latest" = true
  WHERE NOT EXISTS (
    SELECT 1 FROM "_novel_chapters_v_rels" vr WHERE vr."parent_id" = v."id"
  );`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DELETE FROM "_novel_chapters_v_rels"
  WHERE "parent_id" IN (SELECT "id" FROM "_novel_chapters_v" WHERE "latest" = true);

  DELETE FROM "_novel_chapters_v" WHERE "latest" = true;`)
}
