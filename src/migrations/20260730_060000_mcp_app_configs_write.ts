import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/** MCP plugin enabled app-configs create/update; add ACL columns on payload_mcp_api_keys. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "app_configs_create" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "app_configs_update" boolean DEFAULT false;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "app_configs_update";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "app_configs_create";
  `)
}
