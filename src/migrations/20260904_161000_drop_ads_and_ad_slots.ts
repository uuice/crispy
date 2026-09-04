import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Drop Ads / AdSlots product collections.
 * Does NOT touch payload_jobs* (Payload cron queue).
 *
 * Enum values for query-presets related_collection are left in place
 * (Postgres cannot cheaply remove enum members); leftover preset rows deleted.
 * Down cannot recreate dropped data; restore from backup.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DELETE FROM "payload_query_presets"
      WHERE "related_collection" IN ('ads', 'ad-slots');

    -- MCP API key scopes
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "ads_find";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "ads_create";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "ads_update";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "ads_delete";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "ad_slots_find";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "ad_slots_create";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "ad_slots_update";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "ad_slots_delete";

    -- Locked documents rels
    ALTER TABLE "payload_locked_documents_rels"
      DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_ads_fk";
    ALTER TABLE "payload_locked_documents_rels"
      DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_ad_slots_fk";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_ads_id_idx";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_ad_slots_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "ads_id";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "ad_slots_id";

    -- Drop product tables (CASCADE clears child/version tables)
    DROP TABLE IF EXISTS "_ads_v" CASCADE;
    DROP TABLE IF EXISTS "ads" CASCADE;
    DROP TABLE IF EXISTS "_ad_slots_v" CASCADE;
    DROP TABLE IF EXISTS "ad_slots" CASCADE;

    DROP TYPE IF EXISTS "public"."enum_ads_format";
    DROP TYPE IF EXISTS "public"."enum__ads_v_version_format";
  `)
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Data and schema removed; restore from a database backup.
}
