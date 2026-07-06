import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_payload_query_presets_related_collection" ADD VALUE 'short-links' BEFORE 'ad-slots';
  CREATE TABLE "short_links" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"target_url" varchar NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_short_links_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar NOT NULL,
  	"version_slug" varchar NOT NULL,
  	"version_target_url" varchar NOT NULL,
  	"version_enabled" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "short_links_id" integer;
  ALTER TABLE "_short_links_v" ADD CONSTRAINT "_short_links_v_parent_id_short_links_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."short_links"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "short_links_slug_idx" ON "short_links" USING btree ("slug");
  CREATE INDEX "short_links_updated_at_idx" ON "short_links" USING btree ("updated_at");
  CREATE INDEX "short_links_created_at_idx" ON "short_links" USING btree ("created_at");
  CREATE INDEX "short_links_deleted_at_idx" ON "short_links" USING btree ("deleted_at");
  CREATE INDEX "_short_links_v_parent_idx" ON "_short_links_v" USING btree ("parent_id");
  CREATE INDEX "_short_links_v_version_version_slug_idx" ON "_short_links_v" USING btree ("version_slug");
  CREATE INDEX "_short_links_v_version_version_updated_at_idx" ON "_short_links_v" USING btree ("version_updated_at");
  CREATE INDEX "_short_links_v_version_version_created_at_idx" ON "_short_links_v" USING btree ("version_created_at");
  CREATE INDEX "_short_links_v_version_version_deleted_at_idx" ON "_short_links_v" USING btree ("version_deleted_at");
  CREATE INDEX "_short_links_v_created_at_idx" ON "_short_links_v" USING btree ("created_at");
  CREATE INDEX "_short_links_v_updated_at_idx" ON "_short_links_v" USING btree ("updated_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_short_links_fk" FOREIGN KEY ("short_links_id") REFERENCES "public"."short_links"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_short_links_id_idx" ON "payload_locked_documents_rels" USING btree ("short_links_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "short_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_short_links_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "short_links" CASCADE;
  DROP TABLE "_short_links_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_short_links_fk";
  
  ALTER TABLE "payload_query_presets" ALTER COLUMN "related_collection" SET DATA TYPE text;
  DROP TYPE "public"."enum_payload_query_presets_related_collection";
  CREATE TYPE "public"."enum_payload_query_presets_related_collection" AS ENUM('pages', 'posts', 'media', 'categories', 'tags', 'links', 'link-groups', 'ad-slots', 'ads', 'jobs', 'gallery-items', 'app-configs', 'comments', 'api-access-logs', 'frontend-cache-entries', 'ai-chat-sessions', 'users', 'redirects', 'forms', 'form-submissions', 'search', 'exports', 'imports', 'audit-logs');
  ALTER TABLE "payload_query_presets" ALTER COLUMN "related_collection" SET DATA TYPE "public"."enum_payload_query_presets_related_collection" USING "related_collection"::"public"."enum_payload_query_presets_related_collection";
  DROP INDEX "payload_locked_documents_rels_short_links_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "short_links_id";`)
}
