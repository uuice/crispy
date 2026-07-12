import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "novel_categories" (
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar NOT NULL,
    "generate_slug" boolean DEFAULT true,
    "slug" varchar NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp(3) with time zone
  );

  CREATE TABLE IF NOT EXISTS "novel_tags" (
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar NOT NULL,
    "description" varchar,
    "generate_slug" boolean DEFAULT true,
    "slug" varchar NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "deleted_at" timestamp(3) with time zone
  );

  CREATE TABLE IF NOT EXISTS "novels_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "novel_categories_id" integer,
    "novel_tags_id" integer
  );

  CREATE TABLE IF NOT EXISTS "novel_chapters_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "novel_categories_id" integer,
    "novel_tags_id" integer
  );

  ALTER TABLE "novels" DROP CONSTRAINT IF EXISTS "novels_chapter_category_id_categories_id_fk";
  ALTER TABLE "novels" DROP CONSTRAINT IF EXISTS "novels_chapter_tag_id_tags_id_fk";
  DROP INDEX IF EXISTS "novels_chapter_category_idx";
  DROP INDEX IF EXISTS "novels_chapter_tag_idx";
  ALTER TABLE "novels" DROP COLUMN IF EXISTS "chapter_category_id";
  ALTER TABLE "novels" DROP COLUMN IF EXISTS "chapter_tag_id";

  ALTER TABLE "novels" ADD COLUMN IF NOT EXISTS "default_chapter_category_id" integer;
  ALTER TABLE "novels" ADD COLUMN IF NOT EXISTS "default_chapter_tag_id" integer;

  DO $$ BEGIN
    ALTER TYPE "public"."enum_payload_query_presets_related_collection" ADD VALUE 'novel-categories' BEFORE 'novel-chapters';
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TYPE "public"."enum_payload_query_presets_related_collection" ADD VALUE 'novel-tags' BEFORE 'novel-chapters';
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "novel_categories_find" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "novel_categories_create" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "novel_categories_update" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "novel_categories_delete" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "novel_tags_find" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "novel_tags_create" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "novel_tags_update" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "novel_tags_delete" boolean DEFAULT false;

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "novel_categories_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "novel_tags_id" integer;

  ALTER TABLE "novels_rels" ADD CONSTRAINT "novels_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."novels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "novels_rels" ADD CONSTRAINT "novels_rels_novel_categories_fk" FOREIGN KEY ("novel_categories_id") REFERENCES "public"."novel_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "novels_rels" ADD CONSTRAINT "novels_rels_novel_tags_fk" FOREIGN KEY ("novel_tags_id") REFERENCES "public"."novel_tags"("id") ON DELETE cascade ON UPDATE no action;

  ALTER TABLE "novel_chapters_rels" ADD CONSTRAINT "novel_chapters_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."novel_chapters"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "novel_chapters_rels" ADD CONSTRAINT "novel_chapters_rels_novel_categories_fk" FOREIGN KEY ("novel_categories_id") REFERENCES "public"."novel_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "novel_chapters_rels" ADD CONSTRAINT "novel_chapters_rels_novel_tags_fk" FOREIGN KEY ("novel_tags_id") REFERENCES "public"."novel_tags"("id") ON DELETE cascade ON UPDATE no action;

  ALTER TABLE "novels" ADD CONSTRAINT "novels_default_chapter_category_id_novel_categories_id_fk" FOREIGN KEY ("default_chapter_category_id") REFERENCES "public"."novel_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "novels" ADD CONSTRAINT "novels_default_chapter_tag_id_novel_tags_id_fk" FOREIGN KEY ("default_chapter_tag_id") REFERENCES "public"."novel_tags"("id") ON DELETE set null ON UPDATE no action;

  CREATE UNIQUE INDEX IF NOT EXISTS "novel_categories_slug_idx" ON "novel_categories" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "novel_categories_updated_at_idx" ON "novel_categories" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "novel_categories_created_at_idx" ON "novel_categories" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "novel_categories_deleted_at_idx" ON "novel_categories" USING btree ("deleted_at");

  CREATE UNIQUE INDEX IF NOT EXISTS "novel_tags_slug_idx" ON "novel_tags" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "novel_tags_updated_at_idx" ON "novel_tags" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "novel_tags_created_at_idx" ON "novel_tags" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "novel_tags_deleted_at_idx" ON "novel_tags" USING btree ("deleted_at");

  CREATE INDEX IF NOT EXISTS "novels_rels_order_idx" ON "novels_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "novels_rels_parent_idx" ON "novels_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "novels_rels_path_idx" ON "novels_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "novels_rels_novel_categories_id_idx" ON "novels_rels" USING btree ("novel_categories_id");
  CREATE INDEX IF NOT EXISTS "novels_rels_novel_tags_id_idx" ON "novels_rels" USING btree ("novel_tags_id");

  CREATE INDEX IF NOT EXISTS "novel_chapters_rels_order_idx" ON "novel_chapters_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "novel_chapters_rels_parent_idx" ON "novel_chapters_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "novel_chapters_rels_path_idx" ON "novel_chapters_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "novel_chapters_rels_novel_categories_id_idx" ON "novel_chapters_rels" USING btree ("novel_categories_id");
  CREATE INDEX IF NOT EXISTS "novel_chapters_rels_novel_tags_id_idx" ON "novel_chapters_rels" USING btree ("novel_tags_id");

  CREATE INDEX IF NOT EXISTS "novels_default_chapter_category_idx" ON "novels" USING btree ("default_chapter_category_id");
  CREATE INDEX IF NOT EXISTS "novels_default_chapter_tag_idx" ON "novels" USING btree ("default_chapter_tag_id");

  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_novel_categories_fk" FOREIGN KEY ("novel_categories_id") REFERENCES "public"."novel_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_novel_tags_fk" FOREIGN KEY ("novel_tags_id") REFERENCES "public"."novel_tags"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_novel_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("novel_categories_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_novel_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("novel_tags_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_novel_tags_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_novel_categories_fk";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_novel_tags_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_novel_categories_id_idx";

  ALTER TABLE "novels" DROP CONSTRAINT IF EXISTS "novels_default_chapter_tag_id_novel_tags_id_fk";
  ALTER TABLE "novels" DROP CONSTRAINT IF EXISTS "novels_default_chapter_category_id_novel_categories_id_fk";
  DROP INDEX IF EXISTS "novels_default_chapter_tag_idx";
  DROP INDEX IF EXISTS "novels_default_chapter_category_idx";
  ALTER TABLE "novels" DROP COLUMN IF EXISTS "default_chapter_tag_id";
  ALTER TABLE "novels" DROP COLUMN IF EXISTS "default_chapter_category_id";

  ALTER TABLE "novels" ADD COLUMN IF NOT EXISTS "chapter_category_id" integer;
  ALTER TABLE "novels" ADD COLUMN IF NOT EXISTS "chapter_tag_id" integer;
  ALTER TABLE "novels" ADD CONSTRAINT "novels_chapter_category_id_categories_id_fk" FOREIGN KEY ("chapter_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "novels" ADD CONSTRAINT "novels_chapter_tag_id_tags_id_fk" FOREIGN KEY ("chapter_tag_id") REFERENCES "public"."tags"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX IF NOT EXISTS "novels_chapter_category_idx" ON "novels" USING btree ("chapter_category_id");
  CREATE INDEX IF NOT EXISTS "novels_chapter_tag_idx" ON "novels" USING btree ("chapter_tag_id");

  DROP TABLE IF EXISTS "novel_chapters_rels" CASCADE;
  DROP TABLE IF EXISTS "novels_rels" CASCADE;
  DROP TABLE IF EXISTS "novel_tags" CASCADE;
  DROP TABLE IF EXISTS "novel_categories" CASCADE;

  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "novel_tags_delete";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "novel_tags_update";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "novel_tags_create";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "novel_tags_find";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "novel_categories_delete";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "novel_categories_update";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "novel_categories_create";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "novel_categories_find";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "novel_tags_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "novel_categories_id";`)
}
