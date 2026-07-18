import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Galleries as parent albums; gallery-items belong to a gallery (1:N).
 * Backfills existing items into a default "示例图库".
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TYPE "public"."enum_payload_query_presets_related_collection"
        ADD VALUE IF NOT EXISTS 'galleries' BEFORE 'gallery-items';
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    CREATE TABLE IF NOT EXISTS "galleries" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "generate_slug" boolean DEFAULT true,
      "slug" varchar,
      "description" varchar,
      "cover_id" integer,
      "sort" numeric DEFAULT 0,
      "enabled" boolean DEFAULT true,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "deleted_at" timestamp(3) with time zone
    );

    CREATE TABLE IF NOT EXISTS "_galleries_v" (
      "id" serial PRIMARY KEY NOT NULL,
      "parent_id" integer,
      "version_title" varchar NOT NULL,
      "version_generate_slug" boolean DEFAULT true,
      "version_slug" varchar,
      "version_description" varchar,
      "version_cover_id" integer,
      "version_sort" numeric DEFAULT 0,
      "version_enabled" boolean DEFAULT true,
      "version_updated_at" timestamp(3) with time zone,
      "version_created_at" timestamp(3) with time zone,
      "version_deleted_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    DO $$ BEGIN
      ALTER TABLE "galleries"
        ADD CONSTRAINT "galleries_cover_id_media_id_fk"
        FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_galleries_v"
        ADD CONSTRAINT "_galleries_v_parent_id_galleries_id_fk"
        FOREIGN KEY ("parent_id") REFERENCES "public"."galleries"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_galleries_v"
        ADD CONSTRAINT "_galleries_v_version_cover_id_media_id_fk"
        FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    CREATE UNIQUE INDEX IF NOT EXISTS "galleries_slug_idx" ON "galleries" USING btree ("slug");
    CREATE INDEX IF NOT EXISTS "galleries_cover_idx" ON "galleries" USING btree ("cover_id");
    CREATE INDEX IF NOT EXISTS "galleries_sort_idx" ON "galleries" USING btree ("sort");
    CREATE INDEX IF NOT EXISTS "galleries_enabled_idx" ON "galleries" USING btree ("enabled");
    CREATE INDEX IF NOT EXISTS "galleries_updated_at_idx" ON "galleries" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "galleries_created_at_idx" ON "galleries" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "galleries_deleted_at_idx" ON "galleries" USING btree ("deleted_at");
    CREATE INDEX IF NOT EXISTS "_galleries_v_parent_idx" ON "_galleries_v" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "_galleries_v_version_version_slug_idx" ON "_galleries_v" USING btree ("version_slug");
    CREATE INDEX IF NOT EXISTS "_galleries_v_version_version_cover_idx" ON "_galleries_v" USING btree ("version_cover_id");
    CREATE INDEX IF NOT EXISTS "_galleries_v_version_version_updated_at_idx" ON "_galleries_v" USING btree ("version_updated_at");
    CREATE INDEX IF NOT EXISTS "_galleries_v_version_version_created_at_idx" ON "_galleries_v" USING btree ("version_created_at");
    CREATE INDEX IF NOT EXISTS "_galleries_v_version_version_deleted_at_idx" ON "_galleries_v" USING btree ("version_deleted_at");
    CREATE INDEX IF NOT EXISTS "_galleries_v_created_at_idx" ON "_galleries_v" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "_galleries_v_updated_at_idx" ON "_galleries_v" USING btree ("updated_at");

    ALTER TABLE "gallery_items" ADD COLUMN IF NOT EXISTS "gallery_id" integer;
    ALTER TABLE "_gallery_items_v" ADD COLUMN IF NOT EXISTS "version_gallery_id" integer;

    DO $$ BEGIN
      ALTER TABLE "gallery_items"
        ADD CONSTRAINT "gallery_items_gallery_id_galleries_id_fk"
        FOREIGN KEY ("gallery_id") REFERENCES "public"."galleries"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_gallery_items_v"
        ADD CONSTRAINT "_gallery_items_v_version_gallery_id_galleries_id_fk"
        FOREIGN KEY ("version_gallery_id") REFERENCES "public"."galleries"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    CREATE INDEX IF NOT EXISTS "gallery_items_gallery_idx" ON "gallery_items" USING btree ("gallery_id");
    CREATE INDEX IF NOT EXISTS "_gallery_items_v_version_version_gallery_idx"
      ON "_gallery_items_v" USING btree ("version_gallery_id");

    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "galleries_id" integer;
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_galleries_fk"
        FOREIGN KEY ("galleries_id") REFERENCES "public"."galleries"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_galleries_id_idx"
      ON "payload_locked_documents_rels" USING btree ("galleries_id");

    ALTER TABLE "search_rels" ADD COLUMN IF NOT EXISTS "galleries_id" integer;
    DO $$ BEGIN
      ALTER TABLE "search_rels"
        ADD CONSTRAINT "search_rels_galleries_fk"
        FOREIGN KEY ("galleries_id") REFERENCES "public"."galleries"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
    CREATE INDEX IF NOT EXISTS "search_rels_galleries_id_idx" ON "search_rels" USING btree ("galleries_id");

    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "galleries_find" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "galleries_create" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "galleries_update" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "galleries_delete" boolean DEFAULT false;

    INSERT INTO "galleries" (
      "title", "generate_slug", "slug", "description", "sort", "enabled", "updated_at", "created_at"
    )
    SELECT
      '示例图库', true, 'demo-gallery', '从旧版扁平图库条目迁移的默认相册', 0, true, now(), now()
    WHERE NOT EXISTS (SELECT 1 FROM "galleries" WHERE "slug" = 'demo-gallery');

    UPDATE "gallery_items"
    SET "gallery_id" = (SELECT "id" FROM "galleries" WHERE "slug" = 'demo-gallery' LIMIT 1)
    WHERE "gallery_id" IS NULL;

    UPDATE "_gallery_items_v"
    SET "version_gallery_id" = (SELECT "id" FROM "galleries" WHERE "slug" = 'demo-gallery' LIMIT 1)
    WHERE "version_gallery_id" IS NULL
      AND EXISTS (SELECT 1 FROM "galleries" WHERE "slug" = 'demo-gallery');
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "gallery_items" DROP CONSTRAINT IF EXISTS "gallery_items_gallery_id_galleries_id_fk";
    ALTER TABLE "_gallery_items_v" DROP CONSTRAINT IF EXISTS "_gallery_items_v_version_gallery_id_galleries_id_fk";
    DROP INDEX IF EXISTS "gallery_items_gallery_idx";
    DROP INDEX IF EXISTS "_gallery_items_v_version_version_gallery_idx";
    ALTER TABLE "gallery_items" DROP COLUMN IF EXISTS "gallery_id";
    ALTER TABLE "_gallery_items_v" DROP COLUMN IF EXISTS "version_gallery_id";

    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_galleries_fk";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_galleries_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "galleries_id";

    ALTER TABLE "search_rels" DROP CONSTRAINT IF EXISTS "search_rels_galleries_fk";
    DROP INDEX IF EXISTS "search_rels_galleries_id_idx";
    ALTER TABLE "search_rels" DROP COLUMN IF EXISTS "galleries_id";

    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "galleries_find";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "galleries_create";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "galleries_update";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "galleries_delete";

    DROP TABLE IF EXISTS "_galleries_v" CASCADE;
    DROP TABLE IF EXISTS "galleries" CASCADE;
  `)
}
