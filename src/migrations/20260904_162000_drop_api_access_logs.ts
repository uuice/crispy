import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Drop API access logs collection (unused / high volume).
 * Enum value on payload_query_presets.related_collection is left in place.
 * Down cannot recreate dropped data; restore from backup.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DELETE FROM "payload_query_presets"
      WHERE "related_collection" = 'api-access-logs';

    ALTER TABLE "payload_locked_documents_rels"
      DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_api_access_logs_fk";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_api_access_logs_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "api_access_logs_id";

    DROP TABLE IF EXISTS "api_access_logs" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_api_access_logs_auth_type";
  `)
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Data and schema removed; restore from a database backup.
}
