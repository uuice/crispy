import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/** MCP custom tool: describe_resource permission column on payload-mcp-api-keys */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "payload_mcp_tool_describe_resource" boolean DEFAULT false;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "payload_mcp_tool_describe_resource";
  `)
}
