import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/** Pages layout blocks: relatedPosts + faq; search plugin jobs/gallery-items; MCP scope columns. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "pages_blocks_related_posts" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "intro_content" jsonb,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "pages_blocks_faq" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "pages_blocks_faq_items" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "question" varchar,
      "answer" jsonb
    );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_related_posts" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "intro_content" jsonb,
      "_uuid" varchar,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_faq" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_uuid" varchar,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_faq_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "question" varchar,
      "answer" jsonb,
      "_uuid" varchar
    );

    DO $$ BEGIN
      ALTER TABLE "pages_blocks_related_posts"
        ADD CONSTRAINT "pages_blocks_related_posts_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "pages_blocks_faq"
        ADD CONSTRAINT "pages_blocks_faq_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "pages_blocks_faq_items"
        ADD CONSTRAINT "pages_blocks_faq_items_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_related_posts"
        ADD CONSTRAINT "_pages_v_blocks_related_posts_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_faq"
        ADD CONSTRAINT "_pages_v_blocks_faq_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_faq_items"
        ADD CONSTRAINT "_pages_v_blocks_faq_items_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    CREATE INDEX IF NOT EXISTS "pages_blocks_related_posts_order_idx"
      ON "pages_blocks_related_posts" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_related_posts_parent_id_idx"
      ON "pages_blocks_related_posts" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_related_posts_path_idx"
      ON "pages_blocks_related_posts" USING btree ("_path");
    CREATE INDEX IF NOT EXISTS "pages_blocks_faq_order_idx"
      ON "pages_blocks_faq" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_faq_parent_id_idx"
      ON "pages_blocks_faq" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_faq_path_idx"
      ON "pages_blocks_faq" USING btree ("_path");
    CREATE INDEX IF NOT EXISTS "pages_blocks_faq_items_order_idx"
      ON "pages_blocks_faq_items" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_faq_items_parent_id_idx"
      ON "pages_blocks_faq_items" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_related_posts_order_idx"
      ON "_pages_v_blocks_related_posts" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_related_posts_parent_id_idx"
      ON "_pages_v_blocks_related_posts" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_related_posts_path_idx"
      ON "_pages_v_blocks_related_posts" USING btree ("_path");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_faq_order_idx"
      ON "_pages_v_blocks_faq" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_faq_parent_id_idx"
      ON "_pages_v_blocks_faq" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_faq_path_idx"
      ON "_pages_v_blocks_faq" USING btree ("_path");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_faq_items_order_idx"
      ON "_pages_v_blocks_faq_items" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_faq_items_parent_id_idx"
      ON "_pages_v_blocks_faq_items" USING btree ("_parent_id");

    ALTER TABLE "search_rels" ADD COLUMN IF NOT EXISTS "jobs_id" integer;
    ALTER TABLE "search_rels" ADD COLUMN IF NOT EXISTS "gallery_items_id" integer;
    ALTER TABLE "_search_v_rels" ADD COLUMN IF NOT EXISTS "jobs_id" integer;
    ALTER TABLE "_search_v_rels" ADD COLUMN IF NOT EXISTS "gallery_items_id" integer;

    DO $$ BEGIN
      ALTER TABLE "search_rels"
        ADD CONSTRAINT "search_rels_jobs_fk"
        FOREIGN KEY ("jobs_id") REFERENCES "public"."jobs"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "search_rels"
        ADD CONSTRAINT "search_rels_gallery_items_fk"
        FOREIGN KEY ("gallery_items_id") REFERENCES "public"."gallery_items"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_search_v_rels"
        ADD CONSTRAINT "_search_v_rels_jobs_fk"
        FOREIGN KEY ("jobs_id") REFERENCES "public"."jobs"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_search_v_rels"
        ADD CONSTRAINT "_search_v_rels_gallery_items_fk"
        FOREIGN KEY ("gallery_items_id") REFERENCES "public"."gallery_items"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    CREATE INDEX IF NOT EXISTS "search_rels_jobs_id_idx" ON "search_rels" USING btree ("jobs_id");
    CREATE INDEX IF NOT EXISTS "search_rels_gallery_items_id_idx" ON "search_rels" USING btree ("gallery_items_id");
    CREATE INDEX IF NOT EXISTS "_search_v_rels_jobs_id_idx" ON "_search_v_rels" USING btree ("jobs_id");
    CREATE INDEX IF NOT EXISTS "_search_v_rels_gallery_items_id_idx" ON "_search_v_rels" USING btree ("gallery_items_id");

    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "novels_find" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "novels_create" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "novels_update" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "novels_delete" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "short_links_find" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "short_links_create" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "short_links_update" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "short_links_delete" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "redirects_find" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "redirects_create" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "redirects_update" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "redirects_delete" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "forms_find" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "forms_create" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "forms_update" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "forms_delete" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "form_submissions_find" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "form_submissions_delete" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "payload_query_presets_find" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "payload_query_presets_create" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "payload_query_presets_update" boolean DEFAULT false;
    ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "payload_query_presets_delete" boolean DEFAULT false;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "pages_blocks_related_posts" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_faq_items" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_faq" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_related_posts" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_faq_items" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_faq" CASCADE;

    ALTER TABLE "search_rels" DROP CONSTRAINT IF EXISTS "search_rels_jobs_fk";
    ALTER TABLE "search_rels" DROP CONSTRAINT IF EXISTS "search_rels_gallery_items_fk";
    ALTER TABLE "_search_v_rels" DROP CONSTRAINT IF EXISTS "_search_v_rels_jobs_fk";
    ALTER TABLE "_search_v_rels" DROP CONSTRAINT IF EXISTS "_search_v_rels_gallery_items_fk";

    DROP INDEX IF EXISTS "search_rels_jobs_id_idx";
    DROP INDEX IF EXISTS "search_rels_gallery_items_id_idx";
    DROP INDEX IF EXISTS "_search_v_rels_jobs_id_idx";
    DROP INDEX IF EXISTS "_search_v_rels_gallery_items_id_idx";

    ALTER TABLE "search_rels" DROP COLUMN IF EXISTS "jobs_id";
    ALTER TABLE "search_rels" DROP COLUMN IF EXISTS "gallery_items_id";
    ALTER TABLE "_search_v_rels" DROP COLUMN IF EXISTS "jobs_id";
    ALTER TABLE "_search_v_rels" DROP COLUMN IF EXISTS "gallery_items_id";

    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "novels_find";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "novels_create";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "novels_update";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "novels_delete";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "short_links_find";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "short_links_create";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "short_links_update";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "short_links_delete";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "redirects_find";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "redirects_create";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "redirects_update";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "redirects_delete";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "forms_find";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "forms_create";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "forms_update";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "forms_delete";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "form_submissions_find";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "form_submissions_delete";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "payload_query_presets_find";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "payload_query_presets_create";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "payload_query_presets_update";
    ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "payload_query_presets_delete";
  `)
}
