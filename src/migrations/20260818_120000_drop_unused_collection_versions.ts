import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Drop version tables that are no longer in the Payload schema:
 * - Catalog secrets (llm-providers, prompt-templates, storage-targets,
 *   integration-credentials, email-transports) — versions disabled so old keys
 *   are not retained in `_v` history.
 * - Collections that only had versions via enableTrashAndVersionsPlugin.
 *
 * Keep draft version tables: posts, pages, novel-chapters.
 *
 * Down cannot recreate dropped history; restore from a database backup.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(`
    DO $drop_unused_versions$
    DECLARE
      r RECORD;
    BEGIN
      FOR r IN
        SELECT c.relname AS tablename
        FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE n.nspname = 'public'
          AND c.relkind = 'r'
          AND c.relname ~ '^_.*_v(_|$)'
          AND c.relname !~ '^(_posts_v|_pages_v|_novel_chapters_v)'
      LOOP
        EXECUTE format('DROP TABLE IF EXISTS public.%I CASCADE', r.tablename);
      END LOOP;

      FOR r IN
        SELECT t.typname
        FROM pg_type t
        JOIN pg_namespace n ON n.oid = t.typnamespace
        WHERE n.nspname = 'public'
          AND t.typtype = 'e'
          AND t.typname ~ '^enum__.*_v_'
          AND t.typname !~ '^enum__(posts_v|pages_v|novel_chapters_v)'
      LOOP
        EXECUTE format('DROP TYPE IF EXISTS public.%I CASCADE', r.typname);
      END LOOP;
    END
    $drop_unused_versions$;
  `))
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Version rows are gone; do not recreate empty `_v` tables.
}
