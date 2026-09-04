import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Drop Jobs (招聘) and Novels (小说) product collections for personal-blog.
 * Does NOT touch payload_jobs* (Payload cron queue).
 *
 * Enum values for query-presets related_collection are left in place
 * (Postgres cannot cheaply remove enum members); leftover preset rows deleted.
 * Down cannot recreate dropped data; restore from backup.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- Site settings
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "show_novel_updates_on_home";

    -- Embeddings leftovers
    DELETE FROM "content_embeddings"
      WHERE "collection" IN ('novels', 'novel-chapters', 'jobs');

    -- Search plugin: jobs were related via search_rels.jobs_id (no JSON "doc" column).
    -- _search_v may already be gone after drop_unused_collection_versions.
    DO $search_jobs$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'search_rels' AND column_name = 'jobs_id'
      ) THEN
        DELETE FROM "search"
          WHERE "id" IN (
            SELECT DISTINCT "parent_id" FROM "search_rels" WHERE "jobs_id" IS NOT NULL
          );
        ALTER TABLE "search_rels" DROP CONSTRAINT IF EXISTS "search_rels_jobs_fk";
        DROP INDEX IF EXISTS "search_rels_jobs_id_idx";
        ALTER TABLE "search_rels" DROP COLUMN IF EXISTS "jobs_id";
      END IF;

      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = '_search_v_rels' AND column_name = 'jobs_id'
      ) THEN
        IF EXISTS (
          SELECT 1 FROM information_schema.tables
          WHERE table_schema = 'public' AND table_name = '_search_v'
        ) THEN
          DELETE FROM "_search_v"
            WHERE "id" IN (
              SELECT DISTINCT "parent_id" FROM "_search_v_rels" WHERE "jobs_id" IS NOT NULL
            );
        END IF;
        ALTER TABLE "_search_v_rels" DROP CONSTRAINT IF EXISTS "_search_v_rels_jobs_fk";
        DROP INDEX IF EXISTS "_search_v_rels_jobs_id_idx";
        ALTER TABLE "_search_v_rels" DROP COLUMN IF EXISTS "jobs_id";
      END IF;
    END
    $search_jobs$;

    -- Roles permission matrix
    DELETE FROM "roles_permissions"
      WHERE "value"::text IN ('novels:manage', 'novels:read:all');

    DELETE FROM "payload_query_presets"
      WHERE "related_collection"::text IN (
        'jobs', 'novels', 'novel-chapters', 'novel-categories', 'novel-tags'
      );

    -- MCP API key scopes
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "jobs_find";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "jobs_create";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "jobs_update";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "jobs_delete";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "novels_find";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "novels_create";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "novels_update";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "novels_delete";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "novel_chapters_find";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "novel_chapters_create";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "novel_chapters_update";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "novel_chapters_delete";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "novel_categories_find";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "novel_categories_create";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "novel_categories_update";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "novel_categories_delete";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "novel_tags_find";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "novel_tags_create";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "novel_tags_update";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "novel_tags_delete";

    -- Locked documents + redirects version rels
    ALTER TABLE "payload_locked_documents_rels"
      DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_jobs_fk";
    ALTER TABLE "payload_locked_documents_rels"
      DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_novels_fk";
    ALTER TABLE "payload_locked_documents_rels"
      DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_novel_chapters_fk";
    ALTER TABLE "payload_locked_documents_rels"
      DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_novel_categories_fk";
    ALTER TABLE "payload_locked_documents_rels"
      DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_novel_tags_fk";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_jobs_id_idx";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_novels_id_idx";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_novel_chapters_id_idx";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_novel_categories_id_idx";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_novel_tags_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "jobs_id";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "novels_id";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "novel_chapters_id";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "novel_categories_id";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "novel_tags_id";

    -- redirects version tables may already be gone
    DO $redirects_novel$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = '_redirects_v_rels' AND column_name = 'novel_chapters_id'
      ) THEN
        ALTER TABLE "_redirects_v_rels" DROP COLUMN IF EXISTS "novel_chapters_id";
      END IF;
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'redirects_rels' AND column_name = 'novel_chapters_id'
      ) THEN
        ALTER TABLE "redirects_rels" DROP COLUMN IF EXISTS "novel_chapters_id";
      END IF;
    END
    $redirects_novel$;

    -- Drop product tables (CASCADE clears child/version/rel tables)
    DROP TABLE IF EXISTS "_jobs_v" CASCADE;
    DROP TABLE IF EXISTS "jobs" CASCADE;
    DROP TABLE IF EXISTS "_novel_chapters_v" CASCADE;
    DROP TABLE IF EXISTS "_novel_chapters_v_version_content" CASCADE;
    DROP TABLE IF EXISTS "novel_chapters" CASCADE;
    DROP TABLE IF EXISTS "novels_characters" CASCADE;
    DROP TABLE IF EXISTS "novels_rels" CASCADE;
    DROP TABLE IF EXISTS "novels" CASCADE;
    DROP TABLE IF EXISTS "_novel_categories_v" CASCADE;
    DROP TABLE IF EXISTS "novel_categories" CASCADE;
    DROP TABLE IF EXISTS "_novel_tags_v" CASCADE;
    DROP TABLE IF EXISTS "novel_tags" CASCADE;
  `)
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Data and schema removed; restore from a database backup.
}
