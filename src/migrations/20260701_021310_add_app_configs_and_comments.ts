import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_app_configs_category" AS ENUM('general', 'comments', 'features', 'integrations', 'other');
  CREATE TYPE "public"."enum_app_configs_value_type" AS ENUM('string', 'number', 'boolean', 'json');
  CREATE TYPE "public"."enum_comments_target_type" AS ENUM('post', 'page');
  CREATE TYPE "public"."enum_comments_status" AS ENUM('pending', 'approved', 'rejected', 'spam');
  CREATE TABLE "app_configs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"category" "enum_app_configs_category" DEFAULT 'general' NOT NULL,
  	"description" varchar,
  	"value_type" "enum_app_configs_value_type" DEFAULT 'string' NOT NULL,
  	"value_string" varchar,
  	"value_number" numeric,
  	"value_boolean" boolean DEFAULT false,
  	"value_json" varchar,
  	"enabled" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "comments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"content" varchar NOT NULL,
  	"target_type" "enum_comments_target_type" DEFAULT 'post' NOT NULL,
  	"post_id" integer,
  	"page_id" integer,
  	"parent_id" integer,
  	"status" "enum_comments_status" DEFAULT 'pending' NOT NULL,
  	"author_id" integer,
  	"guest_name" varchar,
  	"guest_email" varchar,
  	"ip_address" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "comment_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"require_moderation" boolean DEFAULT true,
  	"allow_guest_comments" boolean DEFAULT true,
  	"max_depth" numeric DEFAULT 3,
  	"allow_on_posts" boolean DEFAULT true,
  	"allow_on_pages" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "app_configs_find" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "comments_find" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "comments_create" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "comments_update" boolean DEFAULT false;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "app_configs_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "comments_id" integer;
  ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "comments" ADD CONSTRAINT "comments_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "comments" ADD CONSTRAINT "comments_parent_id_comments_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."comments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "comments" ADD CONSTRAINT "comments_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "app_configs_key_idx" ON "app_configs" USING btree ("key");
  CREATE INDEX "app_configs_updated_at_idx" ON "app_configs" USING btree ("updated_at");
  CREATE INDEX "app_configs_created_at_idx" ON "app_configs" USING btree ("created_at");
  CREATE INDEX "comments_post_idx" ON "comments" USING btree ("post_id");
  CREATE INDEX "comments_page_idx" ON "comments" USING btree ("page_id");
  CREATE INDEX "comments_parent_idx" ON "comments" USING btree ("parent_id");
  CREATE INDEX "comments_author_idx" ON "comments" USING btree ("author_id");
  CREATE INDEX "comments_updated_at_idx" ON "comments" USING btree ("updated_at");
  CREATE INDEX "comments_created_at_idx" ON "comments" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_app_configs_fk" FOREIGN KEY ("app_configs_id") REFERENCES "public"."app_configs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_comments_fk" FOREIGN KEY ("comments_id") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_app_configs_id_idx" ON "payload_locked_documents_rels" USING btree ("app_configs_id");
  CREATE INDEX "payload_locked_documents_rels_comments_id_idx" ON "payload_locked_documents_rels" USING btree ("comments_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "app_configs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "comments" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "comment_settings" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "app_configs" CASCADE;
  DROP TABLE "comments" CASCADE;
  DROP TABLE "comment_settings" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_app_configs_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_comments_fk";
  
  DROP INDEX "payload_locked_documents_rels_app_configs_id_idx";
  DROP INDEX "payload_locked_documents_rels_comments_id_idx";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "app_configs_find";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "comments_find";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "comments_create";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "comments_update";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "app_configs_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "comments_id";
  DROP TYPE "public"."enum_app_configs_category";
  DROP TYPE "public"."enum_app_configs_value_type";
  DROP TYPE "public"."enum_comments_target_type";
  DROP TYPE "public"."enum_comments_status";`)
}
