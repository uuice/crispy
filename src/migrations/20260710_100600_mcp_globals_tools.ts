import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "header_find" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "header_update" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "footer_find" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "footer_update" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "site_settings_find" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "site_settings_update" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "comment_settings_find" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "comment_settings_update" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "cache_settings_find" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "cache_settings_update" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "ai_settings_find" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "ai_settings_update" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "payload_mcp_tool_list_frontend_cache" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "payload_mcp_tool_purge_frontend_cache" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "payload_mcp_tool_get_cache_settings" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "payload_mcp_tool_update_cache_settings" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "payload_mcp_tool_restore_document" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "payload_mcp_tool_semantic_search" boolean DEFAULT false;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "header_find";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "header_update";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "footer_find";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "footer_update";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "site_settings_find";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "site_settings_update";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "comment_settings_find";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "comment_settings_update";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "cache_settings_find";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "cache_settings_update";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "ai_settings_find";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "ai_settings_update";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "payload_mcp_tool_list_frontend_cache";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "payload_mcp_tool_purge_frontend_cache";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "payload_mcp_tool_get_cache_settings";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "payload_mcp_tool_update_cache_settings";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "payload_mcp_tool_restore_document";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "payload_mcp_tool_semantic_search";
  `)
}
