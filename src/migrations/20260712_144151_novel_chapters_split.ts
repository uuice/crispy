import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_novel_chapters_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__novel_chapters_v_version_status" AS ENUM('draft', 'published');
  ALTER TYPE "public"."enum_payload_query_presets_related_collection" ADD VALUE 'novel-chapters' BEFORE 'gallery-items';
  CREATE TABLE "novel_chapters" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" jsonb,
  	"novel_id" integer,
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"published_at" timestamp(3) with time zone,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "enum_novel_chapters_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_novel_chapters_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_content" jsonb,
  	"version_novel_id" integer,
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__novel_chapters_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  ALTER TABLE "posts" DROP CONSTRAINT "posts_novel_id_novels_id_fk";
  
  ALTER TABLE "_posts_v" DROP CONSTRAINT "_posts_v_version_novel_id_novels_id_fk";
  
  DROP INDEX "posts_novel_idx";
  DROP INDEX "_posts_v_version_version_novel_idx";
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "novel_chapters_find" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "novel_chapters_create" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "novel_chapters_update" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN IF NOT EXISTS "novel_chapters_delete" boolean DEFAULT false;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "novel_chapters_id" integer;
  ALTER TABLE "novel_chapters" ADD CONSTRAINT "novel_chapters_novel_id_novels_id_fk" FOREIGN KEY ("novel_id") REFERENCES "public"."novels"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "novel_chapters" ADD CONSTRAINT "novel_chapters_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_novel_chapters_v" ADD CONSTRAINT "_novel_chapters_v_parent_id_novel_chapters_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."novel_chapters"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_novel_chapters_v" ADD CONSTRAINT "_novel_chapters_v_version_novel_id_novels_id_fk" FOREIGN KEY ("version_novel_id") REFERENCES "public"."novels"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_novel_chapters_v" ADD CONSTRAINT "_novel_chapters_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "novel_chapters_novel_idx" ON "novel_chapters" USING btree ("novel_id");
  CREATE INDEX "novel_chapters_meta_meta_image_idx" ON "novel_chapters" USING btree ("meta_image_id");
  CREATE UNIQUE INDEX "novel_chapters_slug_idx" ON "novel_chapters" USING btree ("slug");
  CREATE INDEX "novel_chapters_updated_at_idx" ON "novel_chapters" USING btree ("updated_at");
  CREATE INDEX "novel_chapters_created_at_idx" ON "novel_chapters" USING btree ("created_at");
  CREATE INDEX "novel_chapters_deleted_at_idx" ON "novel_chapters" USING btree ("deleted_at");
  CREATE INDEX "novel_chapters__status_idx" ON "novel_chapters" USING btree ("_status");
  CREATE INDEX "_novel_chapters_v_parent_idx" ON "_novel_chapters_v" USING btree ("parent_id");
  CREATE INDEX "_novel_chapters_v_version_version_novel_idx" ON "_novel_chapters_v" USING btree ("version_novel_id");
  CREATE INDEX "_novel_chapters_v_version_meta_version_meta_image_idx" ON "_novel_chapters_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_novel_chapters_v_version_version_slug_idx" ON "_novel_chapters_v" USING btree ("version_slug");
  CREATE INDEX "_novel_chapters_v_version_version_updated_at_idx" ON "_novel_chapters_v" USING btree ("version_updated_at");
  CREATE INDEX "_novel_chapters_v_version_version_created_at_idx" ON "_novel_chapters_v" USING btree ("version_created_at");
  CREATE INDEX "_novel_chapters_v_version_version_deleted_at_idx" ON "_novel_chapters_v" USING btree ("version_deleted_at");
  CREATE INDEX "_novel_chapters_v_version_version__status_idx" ON "_novel_chapters_v" USING btree ("version__status");
  CREATE INDEX "_novel_chapters_v_created_at_idx" ON "_novel_chapters_v" USING btree ("created_at");
  CREATE INDEX "_novel_chapters_v_updated_at_idx" ON "_novel_chapters_v" USING btree ("updated_at");
  CREATE INDEX "_novel_chapters_v_latest_idx" ON "_novel_chapters_v" USING btree ("latest");
  CREATE INDEX "_novel_chapters_v_autosave_idx" ON "_novel_chapters_v" USING btree ("autosave");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_novel_chapters_fk" FOREIGN KEY ("novel_chapters_id") REFERENCES "public"."novel_chapters"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_novel_chapters_id_idx" ON "payload_locked_documents_rels" USING btree ("novel_chapters_id");`)

  await db.execute(sql`
  INSERT INTO "novel_chapters" (
    "title", "content", "novel_id", "meta_title", "meta_image_id", "meta_description",
    "published_at", "generate_slug", "slug", "updated_at", "created_at", "deleted_at", "_status"
  )
  SELECT
    "title", "content", "novel_id", "meta_title", "meta_image_id", "meta_description",
    "published_at", "generate_slug", "slug", "updated_at", "created_at", "deleted_at",
    "_status"::text::"enum_novel_chapters_status"
  FROM "posts"
  WHERE "novel_id" IS NOT NULL
    AND NOT EXISTS (SELECT 1 FROM "novel_chapters" LIMIT 1);

  DELETE FROM "content_embeddings"
  WHERE "collection" = 'posts'
    AND "doc_id" IN (SELECT "id" FROM "posts" WHERE "novel_id" IS NOT NULL);

  DELETE FROM "posts_rels"
  WHERE "parent_id" IN (SELECT "id" FROM "posts" WHERE "novel_id" IS NOT NULL);

  DELETE FROM "_posts_v"
  WHERE "parent_id" IN (SELECT "id" FROM "posts" WHERE "novel_id" IS NOT NULL);

  DELETE FROM "posts"
  WHERE "novel_id" IS NOT NULL;`)

  await db.execute(sql`
  ALTER TABLE "posts" DROP COLUMN "novel_id";
  ALTER TABLE "_posts_v" DROP COLUMN "version_novel_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "novel_chapters" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_novel_chapters_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "novel_chapters" CASCADE;
  DROP TABLE "_novel_chapters_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_novel_chapters_fk";
  
  ALTER TABLE "payload_query_presets" ALTER COLUMN "related_collection" SET DATA TYPE text;
  DROP TYPE "public"."enum_payload_query_presets_related_collection";
  CREATE TYPE "public"."enum_payload_query_presets_related_collection" AS ENUM('pages', 'posts', 'media', 'categories', 'tags', 'links', 'link-groups', 'short-links', 'ad-slots', 'ads', 'jobs', 'novels', 'gallery-items', 'app-configs', 'comments', 'api-access-logs', 'frontend-cache-entries', 'ai-chat-sessions', 'users', 'redirects', 'forms', 'form-submissions', 'search', 'exports', 'imports', 'audit-logs');
  ALTER TABLE "payload_query_presets" ALTER COLUMN "related_collection" SET DATA TYPE "public"."enum_payload_query_presets_related_collection" USING "related_collection"::"public"."enum_payload_query_presets_related_collection";
  DROP INDEX "payload_locked_documents_rels_novel_chapters_id_idx";
  ALTER TABLE "posts" ADD COLUMN "novel_id" integer;
  ALTER TABLE "_posts_v" ADD COLUMN "version_novel_id" integer;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_novel_id_novels_id_fk" FOREIGN KEY ("novel_id") REFERENCES "public"."novels"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_novel_id_novels_id_fk" FOREIGN KEY ("version_novel_id") REFERENCES "public"."novels"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "posts_novel_idx" ON "posts" USING btree ("novel_id");
  CREATE INDEX "_posts_v_version_version_novel_idx" ON "_posts_v" USING btree ("version_novel_id");
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "novel_chapters_find";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "novel_chapters_create";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "novel_chapters_update";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "novel_chapters_delete";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "novel_chapters_id";
  DROP TYPE "public"."enum_novel_chapters_status";
  DROP TYPE "public"."enum__novel_chapters_v_version_status";`)
}
