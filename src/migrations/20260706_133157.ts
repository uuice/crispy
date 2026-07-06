import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TYPE "public"."enum_site_settings_frontend_theme" ADD VALUE IF NOT EXISTS 'kb';

    DO $$ BEGIN
      ALTER TYPE "public"."enum_payload_query_presets_related_collection" ADD VALUE 'link-groups' BEFORE 'ad-slots';
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    CREATE TABLE IF NOT EXISTS "_link_groups_v" (
      "id" serial PRIMARY KEY NOT NULL,
      "parent_id" integer,
      "version_title" varchar NOT NULL,
      "version_description" varchar,
      "version_sort" numeric DEFAULT 0,
      "version_enabled" boolean DEFAULT true,
      "version_updated_at" timestamp(3) with time zone,
      "version_created_at" timestamp(3) with time zone,
      "version_deleted_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    ALTER TABLE "posts_populated_authors" ADD COLUMN IF NOT EXISTS "bio" varchar;
    ALTER TABLE "_posts_v_version_populated_authors" ADD COLUMN IF NOT EXISTS "bio" varchar;
    ALTER TABLE "_links_v" ADD COLUMN IF NOT EXISTS "version_group_id" integer;
    ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "bio" varchar;
    ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "bio_detail" jsonb;
    ALTER TABLE "_users_v" ADD COLUMN IF NOT EXISTS "version_bio" varchar;
    ALTER TABLE "_users_v" ADD COLUMN IF NOT EXISTS "version_bio_detail" jsonb;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "link_groups_find" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "link_groups_create" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "link_groups_update" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "link_groups_delete" boolean DEFAULT false;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "link_groups_id" integer;

    DO $$ BEGIN
      ALTER TABLE "_link_groups_v"
        ADD CONSTRAINT "_link_groups_v_parent_id_link_groups_id_fk"
        FOREIGN KEY ("parent_id") REFERENCES "public"."link_groups"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    CREATE INDEX IF NOT EXISTS "_link_groups_v_parent_idx" ON "_link_groups_v" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "_link_groups_v_version_version_updated_at_idx" ON "_link_groups_v" USING btree ("version_updated_at");
    CREATE INDEX IF NOT EXISTS "_link_groups_v_version_version_created_at_idx" ON "_link_groups_v" USING btree ("version_created_at");
    CREATE INDEX IF NOT EXISTS "_link_groups_v_version_version_deleted_at_idx" ON "_link_groups_v" USING btree ("version_deleted_at");
    CREATE INDEX IF NOT EXISTS "_link_groups_v_created_at_idx" ON "_link_groups_v" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "_link_groups_v_updated_at_idx" ON "_link_groups_v" USING btree ("updated_at");

    DO $$ BEGIN
      ALTER TABLE "_links_v"
        ADD CONSTRAINT "_links_v_version_group_id_link_groups_id_fk"
        FOREIGN KEY ("version_group_id") REFERENCES "public"."link_groups"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_link_groups_fk"
        FOREIGN KEY ("link_groups_id") REFERENCES "public"."link_groups"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    CREATE INDEX IF NOT EXISTS "_links_v_version_version_group_idx" ON "_links_v" USING btree ("version_group_id");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_link_groups_id_idx" ON "payload_locked_documents_rels" USING btree ("link_groups_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "_link_groups_v" DROP CONSTRAINT IF EXISTS "_link_groups_v_parent_id_link_groups_id_fk";
    ALTER TABLE "_links_v" DROP CONSTRAINT IF EXISTS "_links_v_version_group_id_link_groups_id_fk";
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_link_groups_fk";

    DROP INDEX IF EXISTS "_links_v_version_version_group_idx";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_link_groups_id_idx";
    DROP INDEX IF EXISTS "_link_groups_v_parent_idx";
    DROP INDEX IF EXISTS "_link_groups_v_version_version_updated_at_idx";
    DROP INDEX IF EXISTS "_link_groups_v_version_version_created_at_idx";
    DROP INDEX IF EXISTS "_link_groups_v_version_version_deleted_at_idx";
    DROP INDEX IF EXISTS "_link_groups_v_created_at_idx";
    DROP INDEX IF EXISTS "_link_groups_v_updated_at_idx";

    DROP TABLE IF EXISTS "_link_groups_v" CASCADE;

    ALTER TABLE "posts_populated_authors" DROP COLUMN IF EXISTS "bio";
    ALTER TABLE "_posts_v_version_populated_authors" DROP COLUMN IF EXISTS "bio";
    ALTER TABLE "_links_v" DROP COLUMN IF EXISTS "version_group_id";
    ALTER TABLE "users" DROP COLUMN IF EXISTS "bio";
    ALTER TABLE "users" DROP COLUMN IF EXISTS "bio_detail";
    ALTER TABLE "_users_v" DROP COLUMN IF EXISTS "version_bio";
    ALTER TABLE "_users_v" DROP COLUMN IF EXISTS "version_bio_detail";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "link_groups_find";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "link_groups_create";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "link_groups_update";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "link_groups_delete";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "link_groups_id";
  `)
}
