import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_ai_settings_provider" AS ENUM('deepseek', 'openai', 'custom');
   ALTER TABLE "ai_settings" ADD COLUMN "provider" "enum_ai_settings_provider" DEFAULT 'deepseek';`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "ai_settings" DROP COLUMN "provider";
   DROP TYPE "public"."enum_ai_settings_provider";`)
}
