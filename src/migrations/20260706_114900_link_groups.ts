import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "link_groups" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "description" varchar,
      "sort" numeric DEFAULT 0,
      "enabled" boolean DEFAULT true,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "deleted_at" timestamp(3) with time zone
    );

    CREATE INDEX IF NOT EXISTS "link_groups_sort_idx" ON "link_groups" ("sort");
    CREATE INDEX IF NOT EXISTS "link_groups_enabled_idx" ON "link_groups" ("enabled");
    CREATE INDEX IF NOT EXISTS "link_groups_updated_at_idx" ON "link_groups" ("updated_at");
    CREATE INDEX IF NOT EXISTS "link_groups_created_at_idx" ON "link_groups" ("created_at");
    CREATE INDEX IF NOT EXISTS "link_groups_deleted_at_idx" ON "link_groups" ("deleted_at");

    ALTER TABLE "links" ADD COLUMN IF NOT EXISTS "group_id" integer;
    DO $$ BEGIN
      ALTER TABLE "links"
        ADD CONSTRAINT "links_group_id_link_groups_id_fk"
        FOREIGN KEY ("group_id") REFERENCES "link_groups"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    CREATE INDEX IF NOT EXISTS "links_group_idx" ON "links" ("group_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "links" DROP CONSTRAINT IF EXISTS "links_group_id_link_groups_id_fk";
    ALTER TABLE "links" DROP COLUMN IF EXISTS "group_id";
    DROP TABLE IF EXISTS "link_groups" CASCADE;
  `)
}
