import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum__ads_v_version_format" AS ENUM('image', 'html');
  CREATE TYPE "public"."enum__jobs_v_version_employment_type" AS ENUM('full-time', 'part-time', 'contract', 'intern', 'remote');
  CREATE TYPE "public"."enum__app_configs_v_version_category" AS ENUM('general', 'comments', 'features', 'integrations', 'other');
  CREATE TYPE "public"."enum__app_configs_v_version_value_type" AS ENUM('string', 'number', 'boolean', 'json');
  CREATE TYPE "public"."enum__comments_v_version_target_type" AS ENUM('post', 'page');
  CREATE TYPE "public"."enum__comments_v_version_status" AS ENUM('pending', 'approved', 'rejected', 'spam');
  CREATE TYPE "public"."enum__api_access_logs_v_version_auth_type" AS ENUM('none', 'session', 'api-key', 'bearer');
  CREATE TYPE "public"."enum__users_v_version_roles" AS ENUM('super-admin', 'editor', 'author');
  CREATE TYPE "public"."enum__redirects_v_version_to_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__forms_v_version_confirmation_type" AS ENUM('message', 'redirect');
  CREATE TYPE "public"."enum__exports_v_version_format" AS ENUM('csv', 'json');
  CREATE TYPE "public"."enum__exports_v_version_sort_order" AS ENUM('asc', 'desc');
  CREATE TYPE "public"."enum__exports_v_version_drafts" AS ENUM('yes', 'no');
  CREATE TYPE "public"."enum__imports_v_version_import_mode" AS ENUM('create', 'update', 'upsert');
  CREATE TYPE "public"."enum__imports_v_version_status" AS ENUM('pending', 'completed', 'partial', 'failed');
  CREATE TYPE "public"."enum__audit_logs_v_version_action" AS ENUM('create', 'update', 'delete');
  CREATE TABLE "_media_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_alt" varchar,
  	"version_caption" jsonb,
  	"version_folder_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version_url" varchar,
  	"version_thumbnail_u_r_l" varchar,
  	"version_filename" varchar,
  	"version_mime_type" varchar,
  	"version_filesize" numeric,
  	"version_width" numeric,
  	"version_height" numeric,
  	"version_focal_x" numeric,
  	"version_focal_y" numeric,
  	"version_sizes_thumbnail_url" varchar,
  	"version_sizes_thumbnail_width" numeric,
  	"version_sizes_thumbnail_height" numeric,
  	"version_sizes_thumbnail_mime_type" varchar,
  	"version_sizes_thumbnail_filesize" numeric,
  	"version_sizes_thumbnail_filename" varchar,
  	"version_sizes_square_url" varchar,
  	"version_sizes_square_width" numeric,
  	"version_sizes_square_height" numeric,
  	"version_sizes_square_mime_type" varchar,
  	"version_sizes_square_filesize" numeric,
  	"version_sizes_square_filename" varchar,
  	"version_sizes_small_url" varchar,
  	"version_sizes_small_width" numeric,
  	"version_sizes_small_height" numeric,
  	"version_sizes_small_mime_type" varchar,
  	"version_sizes_small_filesize" numeric,
  	"version_sizes_small_filename" varchar,
  	"version_sizes_medium_url" varchar,
  	"version_sizes_medium_width" numeric,
  	"version_sizes_medium_height" numeric,
  	"version_sizes_medium_mime_type" varchar,
  	"version_sizes_medium_filesize" numeric,
  	"version_sizes_medium_filename" varchar,
  	"version_sizes_large_url" varchar,
  	"version_sizes_large_width" numeric,
  	"version_sizes_large_height" numeric,
  	"version_sizes_large_mime_type" varchar,
  	"version_sizes_large_filesize" numeric,
  	"version_sizes_large_filename" varchar,
  	"version_sizes_xlarge_url" varchar,
  	"version_sizes_xlarge_width" numeric,
  	"version_sizes_xlarge_height" numeric,
  	"version_sizes_xlarge_mime_type" varchar,
  	"version_sizes_xlarge_filesize" numeric,
  	"version_sizes_xlarge_filename" varchar,
  	"version_sizes_og_url" varchar,
  	"version_sizes_og_width" numeric,
  	"version_sizes_og_height" numeric,
  	"version_sizes_og_mime_type" varchar,
  	"version_sizes_og_filesize" numeric,
  	"version_sizes_og_filename" varchar,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_categories_v_version_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"doc_id" integer,
  	"url" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_categories_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar NOT NULL,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar NOT NULL,
  	"version_parent_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_tags_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar NOT NULL,
  	"version_description" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar NOT NULL,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_links_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar NOT NULL,
  	"version_url" varchar NOT NULL,
  	"version_description" varchar,
  	"version_logo_id" integer,
  	"version_sort" numeric DEFAULT 0,
  	"version_enabled" boolean DEFAULT true,
  	"version_open_in_new_tab" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_ad_slots_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar NOT NULL,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar NOT NULL,
  	"version_description" varchar,
  	"version_recommended_width" numeric,
  	"version_recommended_height" numeric,
  	"version_enabled" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_ads_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar NOT NULL,
  	"version_slot_id" integer NOT NULL,
  	"version_format" "enum__ads_v_version_format" DEFAULT 'image' NOT NULL,
  	"version_image_id" integer,
  	"version_html" varchar,
  	"version_link" varchar,
  	"version_alt" varchar,
  	"version_sort" numeric DEFAULT 0,
  	"version_start_at" timestamp(3) with time zone,
  	"version_end_at" timestamp(3) with time zone,
  	"version_enabled" boolean DEFAULT true,
  	"version_open_in_new_tab" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_jobs_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar NOT NULL,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar NOT NULL,
  	"version_department" varchar,
  	"version_location" varchar,
  	"version_employment_type" "enum__jobs_v_version_employment_type" DEFAULT 'full-time',
  	"version_salary" varchar,
  	"version_description" jsonb NOT NULL,
  	"version_requirements" jsonb,
  	"version_published_at" timestamp(3) with time zone,
  	"version_enabled" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_gallery_items_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar NOT NULL,
  	"version_image_id" integer NOT NULL,
  	"version_description" varchar,
  	"version_sort" numeric DEFAULT 0,
  	"version_enabled" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_app_configs_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_key" varchar NOT NULL,
  	"version_label" varchar NOT NULL,
  	"version_category" "enum__app_configs_v_version_category" DEFAULT 'general' NOT NULL,
  	"version_description" varchar,
  	"version_value_type" "enum__app_configs_v_version_value_type" DEFAULT 'string' NOT NULL,
  	"version_value_string" varchar,
  	"version_value_number" numeric,
  	"version_value_boolean" boolean DEFAULT false,
  	"version_value_json" varchar,
  	"version_enabled" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_comments_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_content" varchar NOT NULL,
  	"version_target_type" "enum__comments_v_version_target_type" DEFAULT 'post' NOT NULL,
  	"version_post_id" integer,
  	"version_page_id" integer,
  	"version_parent_id" integer,
  	"version_status" "enum__comments_v_version_status" DEFAULT 'pending' NOT NULL,
  	"version_author_id" integer,
  	"version_guest_name" varchar,
  	"version_guest_email" varchar,
  	"version_ip_address" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_api_access_logs_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_method" varchar NOT NULL,
  	"version_path" varchar NOT NULL,
  	"version_status" numeric,
  	"version_duration_ms" numeric,
  	"version_ip" varchar,
  	"version_user_agent" varchar,
  	"version_referer" varchar,
  	"version_auth_type" "enum__api_access_logs_v_version_auth_type" DEFAULT 'none',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_ai_chat_sessions_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar NOT NULL,
  	"version_user_id" integer NOT NULL,
  	"version_last_message_at" timestamp(3) with time zone NOT NULL,
  	"version_messages" jsonb NOT NULL,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_users_v_version_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__users_v_version_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_users_v_version_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "_users_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version_enable_a_p_i_key" boolean,
  	"version_api_key" varchar,
  	"version_api_key_index" varchar,
  	"version_email" varchar NOT NULL,
  	"version_reset_password_token" varchar,
  	"version_reset_password_expiration" timestamp(3) with time zone,
  	"version_salt" varchar,
  	"version_hash" varchar,
  	"version_login_attempts" numeric DEFAULT 0,
  	"version_lock_until" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_redirects_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_from" varchar NOT NULL,
  	"version_to_type" "enum__redirects_v_version_to_type" DEFAULT 'reference',
  	"version_to_url" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_redirects_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer
  );
  
  CREATE TABLE "_forms_v_blocks_checkbox" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"default_value" boolean,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_forms_v_blocks_country" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_forms_v_blocks_email" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_forms_v_blocks_message" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"message" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_forms_v_blocks_number" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" numeric,
  	"required" boolean,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_forms_v_blocks_select_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_forms_v_blocks_select" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" varchar,
  	"placeholder" varchar,
  	"required" boolean,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_forms_v_blocks_state" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_forms_v_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" varchar,
  	"required" boolean,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_forms_v_blocks_textarea" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" varchar,
  	"required" boolean,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_forms_v_version_emails" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"email_to" varchar,
  	"cc" varchar,
  	"bcc" varchar,
  	"reply_to" varchar,
  	"email_from" varchar,
  	"subject" varchar DEFAULT 'You''ve received a new message.' NOT NULL,
  	"message" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_forms_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar NOT NULL,
  	"version_submit_button_label" varchar,
  	"version_confirmation_type" "enum__forms_v_version_confirmation_type" DEFAULT 'message',
  	"version_confirmation_message" jsonb,
  	"version_redirect_url" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_form_submissions_v_version_submission_data" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"field" varchar NOT NULL,
  	"value" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_form_submissions_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_form_id" integer NOT NULL,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_search_v_version_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"relation_to" varchar,
  	"category_i_d" varchar,
  	"title" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_search_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_priority" numeric,
  	"version_slug" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_search_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer,
  	"pages_id" integer
  );
  
  CREATE TABLE "_exports_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_format" "enum__exports_v_version_format" DEFAULT 'csv' NOT NULL,
  	"version_limit" numeric,
  	"version_page" numeric DEFAULT 1,
  	"version_sort" varchar,
  	"version_sort_order" "enum__exports_v_version_sort_order",
  	"version_drafts" "enum__exports_v_version_drafts" DEFAULT 'yes',
  	"version_collection_slug" varchar DEFAULT 'posts' NOT NULL,
  	"version_where" jsonb DEFAULT '{}'::jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version_url" varchar,
  	"version_thumbnail_u_r_l" varchar,
  	"version_filename" varchar,
  	"version_mime_type" varchar,
  	"version_filesize" numeric,
  	"version_width" numeric,
  	"version_height" numeric,
  	"version_focal_x" numeric,
  	"version_focal_y" numeric,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_exports_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_imports_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_collection_slug" varchar DEFAULT 'posts' NOT NULL,
  	"version_import_mode" "enum__imports_v_version_import_mode",
  	"version_match_field" varchar DEFAULT 'id',
  	"version_status" "enum__imports_v_version_status" DEFAULT 'pending',
  	"version_summary_imported" numeric,
  	"version_summary_updated" numeric,
  	"version_summary_total" numeric,
  	"version_summary_issues" numeric,
  	"version_summary_issue_details" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version_url" varchar,
  	"version_thumbnail_u_r_l" varchar,
  	"version_filename" varchar,
  	"version_mime_type" varchar,
  	"version_filesize" numeric,
  	"version_width" numeric,
  	"version_height" numeric,
  	"version_focal_x" numeric,
  	"version_focal_y" numeric,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_audit_logs_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_collection" varchar NOT NULL,
  	"version_action" "enum__audit_logs_v_version_action" NOT NULL,
  	"version_document_id" varchar NOT NULL,
  	"version_user_id" integer,
  	"version_changes" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "pages" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "_pages_v" ADD COLUMN "version_deleted_at" timestamp(3) with time zone;
  ALTER TABLE "posts" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "_posts_v" ADD COLUMN "version_deleted_at" timestamp(3) with time zone;
  ALTER TABLE "media" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "categories" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "tags" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "links" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "ad_slots" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "ads" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "jobs" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "gallery_items" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "app_configs" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "comments" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "api_access_logs" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "ai_chat_sessions" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "users" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "redirects" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "forms" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "form_submissions" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "search" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "exports" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "imports" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "audit_logs" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "_media_v" ADD CONSTRAINT "_media_v_parent_id_media_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_media_v" ADD CONSTRAINT "_media_v_version_folder_id_payload_folders_id_fk" FOREIGN KEY ("version_folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_categories_v_version_breadcrumbs" ADD CONSTRAINT "_categories_v_version_breadcrumbs_doc_id_categories_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_categories_v_version_breadcrumbs" ADD CONSTRAINT "_categories_v_version_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_categories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_categories_v" ADD CONSTRAINT "_categories_v_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_categories_v" ADD CONSTRAINT "_categories_v_version_parent_id_categories_id_fk" FOREIGN KEY ("version_parent_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tags_v" ADD CONSTRAINT "_tags_v_parent_id_tags_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tags"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_links_v" ADD CONSTRAINT "_links_v_parent_id_links_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."links"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_links_v" ADD CONSTRAINT "_links_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_ad_slots_v" ADD CONSTRAINT "_ad_slots_v_parent_id_ad_slots_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."ad_slots"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_ads_v" ADD CONSTRAINT "_ads_v_parent_id_ads_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."ads"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_ads_v" ADD CONSTRAINT "_ads_v_version_slot_id_ad_slots_id_fk" FOREIGN KEY ("version_slot_id") REFERENCES "public"."ad_slots"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_ads_v" ADD CONSTRAINT "_ads_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_jobs_v" ADD CONSTRAINT "_jobs_v_parent_id_jobs_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."jobs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_gallery_items_v" ADD CONSTRAINT "_gallery_items_v_parent_id_gallery_items_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."gallery_items"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_gallery_items_v" ADD CONSTRAINT "_gallery_items_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_app_configs_v" ADD CONSTRAINT "_app_configs_v_parent_id_app_configs_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."app_configs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_comments_v" ADD CONSTRAINT "_comments_v_parent_id_comments_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."comments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_comments_v" ADD CONSTRAINT "_comments_v_version_post_id_posts_id_fk" FOREIGN KEY ("version_post_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_comments_v" ADD CONSTRAINT "_comments_v_version_page_id_pages_id_fk" FOREIGN KEY ("version_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_comments_v" ADD CONSTRAINT "_comments_v_version_parent_id_comments_id_fk" FOREIGN KEY ("version_parent_id") REFERENCES "public"."comments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_comments_v" ADD CONSTRAINT "_comments_v_version_author_id_users_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_api_access_logs_v" ADD CONSTRAINT "_api_access_logs_v_parent_id_api_access_logs_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."api_access_logs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_ai_chat_sessions_v" ADD CONSTRAINT "_ai_chat_sessions_v_parent_id_ai_chat_sessions_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."ai_chat_sessions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_ai_chat_sessions_v" ADD CONSTRAINT "_ai_chat_sessions_v_version_user_id_users_id_fk" FOREIGN KEY ("version_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_users_v_version_roles" ADD CONSTRAINT "_users_v_version_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_users_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_users_v_version_sessions" ADD CONSTRAINT "_users_v_version_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_users_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_users_v" ADD CONSTRAINT "_users_v_parent_id_users_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_redirects_v" ADD CONSTRAINT "_redirects_v_parent_id_redirects_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."redirects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_redirects_v_rels" ADD CONSTRAINT "_redirects_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_redirects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_redirects_v_rels" ADD CONSTRAINT "_redirects_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_redirects_v_rels" ADD CONSTRAINT "_redirects_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_forms_v_blocks_checkbox" ADD CONSTRAINT "_forms_v_blocks_checkbox_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_forms_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_forms_v_blocks_country" ADD CONSTRAINT "_forms_v_blocks_country_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_forms_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_forms_v_blocks_email" ADD CONSTRAINT "_forms_v_blocks_email_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_forms_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_forms_v_blocks_message" ADD CONSTRAINT "_forms_v_blocks_message_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_forms_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_forms_v_blocks_number" ADD CONSTRAINT "_forms_v_blocks_number_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_forms_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_forms_v_blocks_select_options" ADD CONSTRAINT "_forms_v_blocks_select_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_forms_v_blocks_select"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_forms_v_blocks_select" ADD CONSTRAINT "_forms_v_blocks_select_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_forms_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_forms_v_blocks_state" ADD CONSTRAINT "_forms_v_blocks_state_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_forms_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_forms_v_blocks_text" ADD CONSTRAINT "_forms_v_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_forms_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_forms_v_blocks_textarea" ADD CONSTRAINT "_forms_v_blocks_textarea_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_forms_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_forms_v_version_emails" ADD CONSTRAINT "_forms_v_version_emails_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_forms_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_forms_v" ADD CONSTRAINT "_forms_v_parent_id_forms_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_form_submissions_v_version_submission_data" ADD CONSTRAINT "_form_submissions_v_version_submission_data_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_form_submissions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_form_submissions_v" ADD CONSTRAINT "_form_submissions_v_parent_id_form_submissions_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."form_submissions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_form_submissions_v" ADD CONSTRAINT "_form_submissions_v_version_form_id_forms_id_fk" FOREIGN KEY ("version_form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_search_v_version_categories" ADD CONSTRAINT "_search_v_version_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_search_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_search_v" ADD CONSTRAINT "_search_v_parent_id_search_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."search"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_search_v" ADD CONSTRAINT "_search_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_search_v_rels" ADD CONSTRAINT "_search_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_search_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_search_v_rels" ADD CONSTRAINT "_search_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_search_v_rels" ADD CONSTRAINT "_search_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_exports_v" ADD CONSTRAINT "_exports_v_parent_id_exports_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."exports"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_exports_v_texts" ADD CONSTRAINT "_exports_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_exports_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_imports_v" ADD CONSTRAINT "_imports_v_parent_id_imports_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."imports"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_audit_logs_v" ADD CONSTRAINT "_audit_logs_v_parent_id_audit_logs_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."audit_logs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_audit_logs_v" ADD CONSTRAINT "_audit_logs_v_version_user_id_users_id_fk" FOREIGN KEY ("version_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "_media_v_parent_idx" ON "_media_v" USING btree ("parent_id");
  CREATE INDEX "_media_v_version_version_folder_idx" ON "_media_v" USING btree ("version_folder_id");
  CREATE INDEX "_media_v_version_version_updated_at_idx" ON "_media_v" USING btree ("version_updated_at");
  CREATE INDEX "_media_v_version_version_created_at_idx" ON "_media_v" USING btree ("version_created_at");
  CREATE INDEX "_media_v_version_version_deleted_at_idx" ON "_media_v" USING btree ("version_deleted_at");
  CREATE INDEX "_media_v_version_version_filename_idx" ON "_media_v" USING btree ("version_filename");
  CREATE INDEX "_media_v_version_sizes_thumbnail_version_sizes_thumbnail_idx" ON "_media_v" USING btree ("version_sizes_thumbnail_filename");
  CREATE INDEX "_media_v_version_sizes_square_version_sizes_square_filen_idx" ON "_media_v" USING btree ("version_sizes_square_filename");
  CREATE INDEX "_media_v_version_sizes_small_version_sizes_small_filenam_idx" ON "_media_v" USING btree ("version_sizes_small_filename");
  CREATE INDEX "_media_v_version_sizes_medium_version_sizes_medium_filen_idx" ON "_media_v" USING btree ("version_sizes_medium_filename");
  CREATE INDEX "_media_v_version_sizes_large_version_sizes_large_filenam_idx" ON "_media_v" USING btree ("version_sizes_large_filename");
  CREATE INDEX "_media_v_version_sizes_xlarge_version_sizes_xlarge_filen_idx" ON "_media_v" USING btree ("version_sizes_xlarge_filename");
  CREATE INDEX "_media_v_version_sizes_og_version_sizes_og_filename_idx" ON "_media_v" USING btree ("version_sizes_og_filename");
  CREATE INDEX "_media_v_created_at_idx" ON "_media_v" USING btree ("created_at");
  CREATE INDEX "_media_v_updated_at_idx" ON "_media_v" USING btree ("updated_at");
  CREATE INDEX "_categories_v_version_breadcrumbs_order_idx" ON "_categories_v_version_breadcrumbs" USING btree ("_order");
  CREATE INDEX "_categories_v_version_breadcrumbs_parent_id_idx" ON "_categories_v_version_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX "_categories_v_version_breadcrumbs_doc_idx" ON "_categories_v_version_breadcrumbs" USING btree ("doc_id");
  CREATE INDEX "_categories_v_parent_idx" ON "_categories_v" USING btree ("parent_id");
  CREATE INDEX "_categories_v_version_version_slug_idx" ON "_categories_v" USING btree ("version_slug");
  CREATE INDEX "_categories_v_version_version_parent_idx" ON "_categories_v" USING btree ("version_parent_id");
  CREATE INDEX "_categories_v_version_version_updated_at_idx" ON "_categories_v" USING btree ("version_updated_at");
  CREATE INDEX "_categories_v_version_version_created_at_idx" ON "_categories_v" USING btree ("version_created_at");
  CREATE INDEX "_categories_v_version_version_deleted_at_idx" ON "_categories_v" USING btree ("version_deleted_at");
  CREATE INDEX "_categories_v_created_at_idx" ON "_categories_v" USING btree ("created_at");
  CREATE INDEX "_categories_v_updated_at_idx" ON "_categories_v" USING btree ("updated_at");
  CREATE INDEX "_tags_v_parent_idx" ON "_tags_v" USING btree ("parent_id");
  CREATE INDEX "_tags_v_version_version_slug_idx" ON "_tags_v" USING btree ("version_slug");
  CREATE INDEX "_tags_v_version_version_updated_at_idx" ON "_tags_v" USING btree ("version_updated_at");
  CREATE INDEX "_tags_v_version_version_created_at_idx" ON "_tags_v" USING btree ("version_created_at");
  CREATE INDEX "_tags_v_version_version_deleted_at_idx" ON "_tags_v" USING btree ("version_deleted_at");
  CREATE INDEX "_tags_v_created_at_idx" ON "_tags_v" USING btree ("created_at");
  CREATE INDEX "_tags_v_updated_at_idx" ON "_tags_v" USING btree ("updated_at");
  CREATE INDEX "_links_v_parent_idx" ON "_links_v" USING btree ("parent_id");
  CREATE INDEX "_links_v_version_version_logo_idx" ON "_links_v" USING btree ("version_logo_id");
  CREATE INDEX "_links_v_version_version_updated_at_idx" ON "_links_v" USING btree ("version_updated_at");
  CREATE INDEX "_links_v_version_version_created_at_idx" ON "_links_v" USING btree ("version_created_at");
  CREATE INDEX "_links_v_version_version_deleted_at_idx" ON "_links_v" USING btree ("version_deleted_at");
  CREATE INDEX "_links_v_created_at_idx" ON "_links_v" USING btree ("created_at");
  CREATE INDEX "_links_v_updated_at_idx" ON "_links_v" USING btree ("updated_at");
  CREATE INDEX "_ad_slots_v_parent_idx" ON "_ad_slots_v" USING btree ("parent_id");
  CREATE INDEX "_ad_slots_v_version_version_slug_idx" ON "_ad_slots_v" USING btree ("version_slug");
  CREATE INDEX "_ad_slots_v_version_version_updated_at_idx" ON "_ad_slots_v" USING btree ("version_updated_at");
  CREATE INDEX "_ad_slots_v_version_version_created_at_idx" ON "_ad_slots_v" USING btree ("version_created_at");
  CREATE INDEX "_ad_slots_v_version_version_deleted_at_idx" ON "_ad_slots_v" USING btree ("version_deleted_at");
  CREATE INDEX "_ad_slots_v_created_at_idx" ON "_ad_slots_v" USING btree ("created_at");
  CREATE INDEX "_ad_slots_v_updated_at_idx" ON "_ad_slots_v" USING btree ("updated_at");
  CREATE INDEX "_ads_v_parent_idx" ON "_ads_v" USING btree ("parent_id");
  CREATE INDEX "_ads_v_version_version_slot_idx" ON "_ads_v" USING btree ("version_slot_id");
  CREATE INDEX "_ads_v_version_version_image_idx" ON "_ads_v" USING btree ("version_image_id");
  CREATE INDEX "_ads_v_version_version_updated_at_idx" ON "_ads_v" USING btree ("version_updated_at");
  CREATE INDEX "_ads_v_version_version_created_at_idx" ON "_ads_v" USING btree ("version_created_at");
  CREATE INDEX "_ads_v_version_version_deleted_at_idx" ON "_ads_v" USING btree ("version_deleted_at");
  CREATE INDEX "_ads_v_created_at_idx" ON "_ads_v" USING btree ("created_at");
  CREATE INDEX "_ads_v_updated_at_idx" ON "_ads_v" USING btree ("updated_at");
  CREATE INDEX "_jobs_v_parent_idx" ON "_jobs_v" USING btree ("parent_id");
  CREATE INDEX "_jobs_v_version_version_slug_idx" ON "_jobs_v" USING btree ("version_slug");
  CREATE INDEX "_jobs_v_version_version_updated_at_idx" ON "_jobs_v" USING btree ("version_updated_at");
  CREATE INDEX "_jobs_v_version_version_created_at_idx" ON "_jobs_v" USING btree ("version_created_at");
  CREATE INDEX "_jobs_v_version_version_deleted_at_idx" ON "_jobs_v" USING btree ("version_deleted_at");
  CREATE INDEX "_jobs_v_created_at_idx" ON "_jobs_v" USING btree ("created_at");
  CREATE INDEX "_jobs_v_updated_at_idx" ON "_jobs_v" USING btree ("updated_at");
  CREATE INDEX "_gallery_items_v_parent_idx" ON "_gallery_items_v" USING btree ("parent_id");
  CREATE INDEX "_gallery_items_v_version_version_image_idx" ON "_gallery_items_v" USING btree ("version_image_id");
  CREATE INDEX "_gallery_items_v_version_version_updated_at_idx" ON "_gallery_items_v" USING btree ("version_updated_at");
  CREATE INDEX "_gallery_items_v_version_version_created_at_idx" ON "_gallery_items_v" USING btree ("version_created_at");
  CREATE INDEX "_gallery_items_v_version_version_deleted_at_idx" ON "_gallery_items_v" USING btree ("version_deleted_at");
  CREATE INDEX "_gallery_items_v_created_at_idx" ON "_gallery_items_v" USING btree ("created_at");
  CREATE INDEX "_gallery_items_v_updated_at_idx" ON "_gallery_items_v" USING btree ("updated_at");
  CREATE INDEX "_app_configs_v_parent_idx" ON "_app_configs_v" USING btree ("parent_id");
  CREATE INDEX "_app_configs_v_version_version_key_idx" ON "_app_configs_v" USING btree ("version_key");
  CREATE INDEX "_app_configs_v_version_version_updated_at_idx" ON "_app_configs_v" USING btree ("version_updated_at");
  CREATE INDEX "_app_configs_v_version_version_created_at_idx" ON "_app_configs_v" USING btree ("version_created_at");
  CREATE INDEX "_app_configs_v_version_version_deleted_at_idx" ON "_app_configs_v" USING btree ("version_deleted_at");
  CREATE INDEX "_app_configs_v_created_at_idx" ON "_app_configs_v" USING btree ("created_at");
  CREATE INDEX "_app_configs_v_updated_at_idx" ON "_app_configs_v" USING btree ("updated_at");
  CREATE INDEX "_comments_v_parent_idx" ON "_comments_v" USING btree ("parent_id");
  CREATE INDEX "_comments_v_version_version_post_idx" ON "_comments_v" USING btree ("version_post_id");
  CREATE INDEX "_comments_v_version_version_page_idx" ON "_comments_v" USING btree ("version_page_id");
  CREATE INDEX "_comments_v_version_version_parent_idx" ON "_comments_v" USING btree ("version_parent_id");
  CREATE INDEX "_comments_v_version_version_author_idx" ON "_comments_v" USING btree ("version_author_id");
  CREATE INDEX "_comments_v_version_version_updated_at_idx" ON "_comments_v" USING btree ("version_updated_at");
  CREATE INDEX "_comments_v_version_version_created_at_idx" ON "_comments_v" USING btree ("version_created_at");
  CREATE INDEX "_comments_v_version_version_deleted_at_idx" ON "_comments_v" USING btree ("version_deleted_at");
  CREATE INDEX "_comments_v_created_at_idx" ON "_comments_v" USING btree ("created_at");
  CREATE INDEX "_comments_v_updated_at_idx" ON "_comments_v" USING btree ("updated_at");
  CREATE INDEX "_api_access_logs_v_parent_idx" ON "_api_access_logs_v" USING btree ("parent_id");
  CREATE INDEX "_api_access_logs_v_version_version_method_idx" ON "_api_access_logs_v" USING btree ("version_method");
  CREATE INDEX "_api_access_logs_v_version_version_path_idx" ON "_api_access_logs_v" USING btree ("version_path");
  CREATE INDEX "_api_access_logs_v_version_version_ip_idx" ON "_api_access_logs_v" USING btree ("version_ip");
  CREATE INDEX "_api_access_logs_v_version_version_auth_type_idx" ON "_api_access_logs_v" USING btree ("version_auth_type");
  CREATE INDEX "_api_access_logs_v_version_version_updated_at_idx" ON "_api_access_logs_v" USING btree ("version_updated_at");
  CREATE INDEX "_api_access_logs_v_version_version_created_at_idx" ON "_api_access_logs_v" USING btree ("version_created_at");
  CREATE INDEX "_api_access_logs_v_version_version_deleted_at_idx" ON "_api_access_logs_v" USING btree ("version_deleted_at");
  CREATE INDEX "_api_access_logs_v_created_at_idx" ON "_api_access_logs_v" USING btree ("created_at");
  CREATE INDEX "_api_access_logs_v_updated_at_idx" ON "_api_access_logs_v" USING btree ("updated_at");
  CREATE INDEX "_ai_chat_sessions_v_parent_idx" ON "_ai_chat_sessions_v" USING btree ("parent_id");
  CREATE INDEX "_ai_chat_sessions_v_version_version_user_idx" ON "_ai_chat_sessions_v" USING btree ("version_user_id");
  CREATE INDEX "_ai_chat_sessions_v_version_version_last_message_at_idx" ON "_ai_chat_sessions_v" USING btree ("version_last_message_at");
  CREATE INDEX "_ai_chat_sessions_v_version_version_updated_at_idx" ON "_ai_chat_sessions_v" USING btree ("version_updated_at");
  CREATE INDEX "_ai_chat_sessions_v_version_version_created_at_idx" ON "_ai_chat_sessions_v" USING btree ("version_created_at");
  CREATE INDEX "_ai_chat_sessions_v_version_version_deleted_at_idx" ON "_ai_chat_sessions_v" USING btree ("version_deleted_at");
  CREATE INDEX "_ai_chat_sessions_v_created_at_idx" ON "_ai_chat_sessions_v" USING btree ("created_at");
  CREATE INDEX "_ai_chat_sessions_v_updated_at_idx" ON "_ai_chat_sessions_v" USING btree ("updated_at");
  CREATE INDEX "_users_v_version_roles_order_idx" ON "_users_v_version_roles" USING btree ("order");
  CREATE INDEX "_users_v_version_roles_parent_idx" ON "_users_v_version_roles" USING btree ("parent_id");
  CREATE INDEX "_users_v_version_sessions_order_idx" ON "_users_v_version_sessions" USING btree ("_order");
  CREATE INDEX "_users_v_version_sessions_parent_id_idx" ON "_users_v_version_sessions" USING btree ("_parent_id");
  CREATE INDEX "_users_v_parent_idx" ON "_users_v" USING btree ("parent_id");
  CREATE INDEX "_users_v_version_version_updated_at_idx" ON "_users_v" USING btree ("version_updated_at");
  CREATE INDEX "_users_v_version_version_created_at_idx" ON "_users_v" USING btree ("version_created_at");
  CREATE INDEX "_users_v_version_version_deleted_at_idx" ON "_users_v" USING btree ("version_deleted_at");
  CREATE INDEX "_users_v_version_version_email_idx" ON "_users_v" USING btree ("version_email");
  CREATE INDEX "_users_v_created_at_idx" ON "_users_v" USING btree ("created_at");
  CREATE INDEX "_users_v_updated_at_idx" ON "_users_v" USING btree ("updated_at");
  CREATE INDEX "_redirects_v_parent_idx" ON "_redirects_v" USING btree ("parent_id");
  CREATE INDEX "_redirects_v_version_version_from_idx" ON "_redirects_v" USING btree ("version_from");
  CREATE INDEX "_redirects_v_version_version_updated_at_idx" ON "_redirects_v" USING btree ("version_updated_at");
  CREATE INDEX "_redirects_v_version_version_created_at_idx" ON "_redirects_v" USING btree ("version_created_at");
  CREATE INDEX "_redirects_v_version_version_deleted_at_idx" ON "_redirects_v" USING btree ("version_deleted_at");
  CREATE INDEX "_redirects_v_created_at_idx" ON "_redirects_v" USING btree ("created_at");
  CREATE INDEX "_redirects_v_updated_at_idx" ON "_redirects_v" USING btree ("updated_at");
  CREATE INDEX "_redirects_v_rels_order_idx" ON "_redirects_v_rels" USING btree ("order");
  CREATE INDEX "_redirects_v_rels_parent_idx" ON "_redirects_v_rels" USING btree ("parent_id");
  CREATE INDEX "_redirects_v_rels_path_idx" ON "_redirects_v_rels" USING btree ("path");
  CREATE INDEX "_redirects_v_rels_pages_id_idx" ON "_redirects_v_rels" USING btree ("pages_id");
  CREATE INDEX "_redirects_v_rels_posts_id_idx" ON "_redirects_v_rels" USING btree ("posts_id");
  CREATE INDEX "_forms_v_blocks_checkbox_order_idx" ON "_forms_v_blocks_checkbox" USING btree ("_order");
  CREATE INDEX "_forms_v_blocks_checkbox_parent_id_idx" ON "_forms_v_blocks_checkbox" USING btree ("_parent_id");
  CREATE INDEX "_forms_v_blocks_checkbox_path_idx" ON "_forms_v_blocks_checkbox" USING btree ("_path");
  CREATE INDEX "_forms_v_blocks_country_order_idx" ON "_forms_v_blocks_country" USING btree ("_order");
  CREATE INDEX "_forms_v_blocks_country_parent_id_idx" ON "_forms_v_blocks_country" USING btree ("_parent_id");
  CREATE INDEX "_forms_v_blocks_country_path_idx" ON "_forms_v_blocks_country" USING btree ("_path");
  CREATE INDEX "_forms_v_blocks_email_order_idx" ON "_forms_v_blocks_email" USING btree ("_order");
  CREATE INDEX "_forms_v_blocks_email_parent_id_idx" ON "_forms_v_blocks_email" USING btree ("_parent_id");
  CREATE INDEX "_forms_v_blocks_email_path_idx" ON "_forms_v_blocks_email" USING btree ("_path");
  CREATE INDEX "_forms_v_blocks_message_order_idx" ON "_forms_v_blocks_message" USING btree ("_order");
  CREATE INDEX "_forms_v_blocks_message_parent_id_idx" ON "_forms_v_blocks_message" USING btree ("_parent_id");
  CREATE INDEX "_forms_v_blocks_message_path_idx" ON "_forms_v_blocks_message" USING btree ("_path");
  CREATE INDEX "_forms_v_blocks_number_order_idx" ON "_forms_v_blocks_number" USING btree ("_order");
  CREATE INDEX "_forms_v_blocks_number_parent_id_idx" ON "_forms_v_blocks_number" USING btree ("_parent_id");
  CREATE INDEX "_forms_v_blocks_number_path_idx" ON "_forms_v_blocks_number" USING btree ("_path");
  CREATE INDEX "_forms_v_blocks_select_options_order_idx" ON "_forms_v_blocks_select_options" USING btree ("_order");
  CREATE INDEX "_forms_v_blocks_select_options_parent_id_idx" ON "_forms_v_blocks_select_options" USING btree ("_parent_id");
  CREATE INDEX "_forms_v_blocks_select_order_idx" ON "_forms_v_blocks_select" USING btree ("_order");
  CREATE INDEX "_forms_v_blocks_select_parent_id_idx" ON "_forms_v_blocks_select" USING btree ("_parent_id");
  CREATE INDEX "_forms_v_blocks_select_path_idx" ON "_forms_v_blocks_select" USING btree ("_path");
  CREATE INDEX "_forms_v_blocks_state_order_idx" ON "_forms_v_blocks_state" USING btree ("_order");
  CREATE INDEX "_forms_v_blocks_state_parent_id_idx" ON "_forms_v_blocks_state" USING btree ("_parent_id");
  CREATE INDEX "_forms_v_blocks_state_path_idx" ON "_forms_v_blocks_state" USING btree ("_path");
  CREATE INDEX "_forms_v_blocks_text_order_idx" ON "_forms_v_blocks_text" USING btree ("_order");
  CREATE INDEX "_forms_v_blocks_text_parent_id_idx" ON "_forms_v_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "_forms_v_blocks_text_path_idx" ON "_forms_v_blocks_text" USING btree ("_path");
  CREATE INDEX "_forms_v_blocks_textarea_order_idx" ON "_forms_v_blocks_textarea" USING btree ("_order");
  CREATE INDEX "_forms_v_blocks_textarea_parent_id_idx" ON "_forms_v_blocks_textarea" USING btree ("_parent_id");
  CREATE INDEX "_forms_v_blocks_textarea_path_idx" ON "_forms_v_blocks_textarea" USING btree ("_path");
  CREATE INDEX "_forms_v_version_emails_order_idx" ON "_forms_v_version_emails" USING btree ("_order");
  CREATE INDEX "_forms_v_version_emails_parent_id_idx" ON "_forms_v_version_emails" USING btree ("_parent_id");
  CREATE INDEX "_forms_v_parent_idx" ON "_forms_v" USING btree ("parent_id");
  CREATE INDEX "_forms_v_version_version_updated_at_idx" ON "_forms_v" USING btree ("version_updated_at");
  CREATE INDEX "_forms_v_version_version_created_at_idx" ON "_forms_v" USING btree ("version_created_at");
  CREATE INDEX "_forms_v_version_version_deleted_at_idx" ON "_forms_v" USING btree ("version_deleted_at");
  CREATE INDEX "_forms_v_created_at_idx" ON "_forms_v" USING btree ("created_at");
  CREATE INDEX "_forms_v_updated_at_idx" ON "_forms_v" USING btree ("updated_at");
  CREATE INDEX "_form_submissions_v_version_submission_data_order_idx" ON "_form_submissions_v_version_submission_data" USING btree ("_order");
  CREATE INDEX "_form_submissions_v_version_submission_data_parent_id_idx" ON "_form_submissions_v_version_submission_data" USING btree ("_parent_id");
  CREATE INDEX "_form_submissions_v_parent_idx" ON "_form_submissions_v" USING btree ("parent_id");
  CREATE INDEX "_form_submissions_v_version_version_form_idx" ON "_form_submissions_v" USING btree ("version_form_id");
  CREATE INDEX "_form_submissions_v_version_version_updated_at_idx" ON "_form_submissions_v" USING btree ("version_updated_at");
  CREATE INDEX "_form_submissions_v_version_version_created_at_idx" ON "_form_submissions_v" USING btree ("version_created_at");
  CREATE INDEX "_form_submissions_v_version_version_deleted_at_idx" ON "_form_submissions_v" USING btree ("version_deleted_at");
  CREATE INDEX "_form_submissions_v_created_at_idx" ON "_form_submissions_v" USING btree ("created_at");
  CREATE INDEX "_form_submissions_v_updated_at_idx" ON "_form_submissions_v" USING btree ("updated_at");
  CREATE INDEX "_search_v_version_categories_order_idx" ON "_search_v_version_categories" USING btree ("_order");
  CREATE INDEX "_search_v_version_categories_parent_id_idx" ON "_search_v_version_categories" USING btree ("_parent_id");
  CREATE INDEX "_search_v_parent_idx" ON "_search_v" USING btree ("parent_id");
  CREATE INDEX "_search_v_version_version_slug_idx" ON "_search_v" USING btree ("version_slug");
  CREATE INDEX "_search_v_version_meta_version_meta_image_idx" ON "_search_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_search_v_version_version_updated_at_idx" ON "_search_v" USING btree ("version_updated_at");
  CREATE INDEX "_search_v_version_version_created_at_idx" ON "_search_v" USING btree ("version_created_at");
  CREATE INDEX "_search_v_version_version_deleted_at_idx" ON "_search_v" USING btree ("version_deleted_at");
  CREATE INDEX "_search_v_created_at_idx" ON "_search_v" USING btree ("created_at");
  CREATE INDEX "_search_v_updated_at_idx" ON "_search_v" USING btree ("updated_at");
  CREATE INDEX "_search_v_rels_order_idx" ON "_search_v_rels" USING btree ("order");
  CREATE INDEX "_search_v_rels_parent_idx" ON "_search_v_rels" USING btree ("parent_id");
  CREATE INDEX "_search_v_rels_path_idx" ON "_search_v_rels" USING btree ("path");
  CREATE INDEX "_search_v_rels_posts_id_idx" ON "_search_v_rels" USING btree ("posts_id");
  CREATE INDEX "_search_v_rels_pages_id_idx" ON "_search_v_rels" USING btree ("pages_id");
  CREATE INDEX "_exports_v_parent_idx" ON "_exports_v" USING btree ("parent_id");
  CREATE INDEX "_exports_v_version_version_updated_at_idx" ON "_exports_v" USING btree ("version_updated_at");
  CREATE INDEX "_exports_v_version_version_created_at_idx" ON "_exports_v" USING btree ("version_created_at");
  CREATE INDEX "_exports_v_version_version_deleted_at_idx" ON "_exports_v" USING btree ("version_deleted_at");
  CREATE INDEX "_exports_v_version_version_filename_idx" ON "_exports_v" USING btree ("version_filename");
  CREATE INDEX "_exports_v_created_at_idx" ON "_exports_v" USING btree ("created_at");
  CREATE INDEX "_exports_v_updated_at_idx" ON "_exports_v" USING btree ("updated_at");
  CREATE INDEX "_exports_v_texts_order_parent" ON "_exports_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "_imports_v_parent_idx" ON "_imports_v" USING btree ("parent_id");
  CREATE INDEX "_imports_v_version_version_updated_at_idx" ON "_imports_v" USING btree ("version_updated_at");
  CREATE INDEX "_imports_v_version_version_created_at_idx" ON "_imports_v" USING btree ("version_created_at");
  CREATE INDEX "_imports_v_version_version_deleted_at_idx" ON "_imports_v" USING btree ("version_deleted_at");
  CREATE INDEX "_imports_v_version_version_filename_idx" ON "_imports_v" USING btree ("version_filename");
  CREATE INDEX "_imports_v_created_at_idx" ON "_imports_v" USING btree ("created_at");
  CREATE INDEX "_imports_v_updated_at_idx" ON "_imports_v" USING btree ("updated_at");
  CREATE INDEX "_audit_logs_v_parent_idx" ON "_audit_logs_v" USING btree ("parent_id");
  CREATE INDEX "_audit_logs_v_version_version_collection_idx" ON "_audit_logs_v" USING btree ("version_collection");
  CREATE INDEX "_audit_logs_v_version_version_action_idx" ON "_audit_logs_v" USING btree ("version_action");
  CREATE INDEX "_audit_logs_v_version_version_document_id_idx" ON "_audit_logs_v" USING btree ("version_document_id");
  CREATE INDEX "_audit_logs_v_version_version_user_idx" ON "_audit_logs_v" USING btree ("version_user_id");
  CREATE INDEX "_audit_logs_v_version_version_updated_at_idx" ON "_audit_logs_v" USING btree ("version_updated_at");
  CREATE INDEX "_audit_logs_v_version_version_created_at_idx" ON "_audit_logs_v" USING btree ("version_created_at");
  CREATE INDEX "_audit_logs_v_version_version_deleted_at_idx" ON "_audit_logs_v" USING btree ("version_deleted_at");
  CREATE INDEX "_audit_logs_v_created_at_idx" ON "_audit_logs_v" USING btree ("created_at");
  CREATE INDEX "_audit_logs_v_updated_at_idx" ON "_audit_logs_v" USING btree ("updated_at");
  CREATE INDEX "pages_deleted_at_idx" ON "pages" USING btree ("deleted_at");
  CREATE INDEX "_pages_v_version_version_deleted_at_idx" ON "_pages_v" USING btree ("version_deleted_at");
  CREATE INDEX "posts_deleted_at_idx" ON "posts" USING btree ("deleted_at");
  CREATE INDEX "_posts_v_version_version_deleted_at_idx" ON "_posts_v" USING btree ("version_deleted_at");
  CREATE INDEX "media_deleted_at_idx" ON "media" USING btree ("deleted_at");
  CREATE INDEX "categories_deleted_at_idx" ON "categories" USING btree ("deleted_at");
  CREATE INDEX "tags_deleted_at_idx" ON "tags" USING btree ("deleted_at");
  CREATE INDEX "links_deleted_at_idx" ON "links" USING btree ("deleted_at");
  CREATE INDEX "ad_slots_deleted_at_idx" ON "ad_slots" USING btree ("deleted_at");
  CREATE INDEX "ads_deleted_at_idx" ON "ads" USING btree ("deleted_at");
  CREATE INDEX "jobs_deleted_at_idx" ON "jobs" USING btree ("deleted_at");
  CREATE INDEX "gallery_items_deleted_at_idx" ON "gallery_items" USING btree ("deleted_at");
  CREATE INDEX "app_configs_deleted_at_idx" ON "app_configs" USING btree ("deleted_at");
  CREATE INDEX "comments_deleted_at_idx" ON "comments" USING btree ("deleted_at");
  CREATE INDEX "api_access_logs_deleted_at_idx" ON "api_access_logs" USING btree ("deleted_at");
  CREATE INDEX "ai_chat_sessions_deleted_at_idx" ON "ai_chat_sessions" USING btree ("deleted_at");
  CREATE INDEX "users_deleted_at_idx" ON "users" USING btree ("deleted_at");
  CREATE INDEX "redirects_deleted_at_idx" ON "redirects" USING btree ("deleted_at");
  CREATE INDEX "forms_deleted_at_idx" ON "forms" USING btree ("deleted_at");
  CREATE INDEX "form_submissions_deleted_at_idx" ON "form_submissions" USING btree ("deleted_at");
  CREATE INDEX "search_deleted_at_idx" ON "search" USING btree ("deleted_at");
  CREATE INDEX "exports_deleted_at_idx" ON "exports" USING btree ("deleted_at");
  CREATE INDEX "imports_deleted_at_idx" ON "imports" USING btree ("deleted_at");
  CREATE INDEX "audit_logs_deleted_at_idx" ON "audit_logs" USING btree ("deleted_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "_media_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_categories_v_version_breadcrumbs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_categories_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_tags_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_links_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_ad_slots_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_ads_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_jobs_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_gallery_items_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_app_configs_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_comments_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_api_access_logs_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_ai_chat_sessions_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_users_v_version_roles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_users_v_version_sessions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_users_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_redirects_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_redirects_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_forms_v_blocks_checkbox" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_forms_v_blocks_country" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_forms_v_blocks_email" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_forms_v_blocks_message" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_forms_v_blocks_number" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_forms_v_blocks_select_options" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_forms_v_blocks_select" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_forms_v_blocks_state" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_forms_v_blocks_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_forms_v_blocks_textarea" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_forms_v_version_emails" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_forms_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_form_submissions_v_version_submission_data" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_form_submissions_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_search_v_version_categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_search_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_search_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_exports_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_exports_v_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_imports_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_audit_logs_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "_media_v" CASCADE;
  DROP TABLE "_categories_v_version_breadcrumbs" CASCADE;
  DROP TABLE "_categories_v" CASCADE;
  DROP TABLE "_tags_v" CASCADE;
  DROP TABLE "_links_v" CASCADE;
  DROP TABLE "_ad_slots_v" CASCADE;
  DROP TABLE "_ads_v" CASCADE;
  DROP TABLE "_jobs_v" CASCADE;
  DROP TABLE "_gallery_items_v" CASCADE;
  DROP TABLE "_app_configs_v" CASCADE;
  DROP TABLE "_comments_v" CASCADE;
  DROP TABLE "_api_access_logs_v" CASCADE;
  DROP TABLE "_ai_chat_sessions_v" CASCADE;
  DROP TABLE "_users_v_version_roles" CASCADE;
  DROP TABLE "_users_v_version_sessions" CASCADE;
  DROP TABLE "_users_v" CASCADE;
  DROP TABLE "_redirects_v" CASCADE;
  DROP TABLE "_redirects_v_rels" CASCADE;
  DROP TABLE "_forms_v_blocks_checkbox" CASCADE;
  DROP TABLE "_forms_v_blocks_country" CASCADE;
  DROP TABLE "_forms_v_blocks_email" CASCADE;
  DROP TABLE "_forms_v_blocks_message" CASCADE;
  DROP TABLE "_forms_v_blocks_number" CASCADE;
  DROP TABLE "_forms_v_blocks_select_options" CASCADE;
  DROP TABLE "_forms_v_blocks_select" CASCADE;
  DROP TABLE "_forms_v_blocks_state" CASCADE;
  DROP TABLE "_forms_v_blocks_text" CASCADE;
  DROP TABLE "_forms_v_blocks_textarea" CASCADE;
  DROP TABLE "_forms_v_version_emails" CASCADE;
  DROP TABLE "_forms_v" CASCADE;
  DROP TABLE "_form_submissions_v_version_submission_data" CASCADE;
  DROP TABLE "_form_submissions_v" CASCADE;
  DROP TABLE "_search_v_version_categories" CASCADE;
  DROP TABLE "_search_v" CASCADE;
  DROP TABLE "_search_v_rels" CASCADE;
  DROP TABLE "_exports_v" CASCADE;
  DROP TABLE "_exports_v_texts" CASCADE;
  DROP TABLE "_imports_v" CASCADE;
  DROP TABLE "_audit_logs_v" CASCADE;
  DROP INDEX "pages_deleted_at_idx";
  DROP INDEX "_pages_v_version_version_deleted_at_idx";
  DROP INDEX "posts_deleted_at_idx";
  DROP INDEX "_posts_v_version_version_deleted_at_idx";
  DROP INDEX "media_deleted_at_idx";
  DROP INDEX "categories_deleted_at_idx";
  DROP INDEX "tags_deleted_at_idx";
  DROP INDEX "links_deleted_at_idx";
  DROP INDEX "ad_slots_deleted_at_idx";
  DROP INDEX "ads_deleted_at_idx";
  DROP INDEX "jobs_deleted_at_idx";
  DROP INDEX "gallery_items_deleted_at_idx";
  DROP INDEX "app_configs_deleted_at_idx";
  DROP INDEX "comments_deleted_at_idx";
  DROP INDEX "api_access_logs_deleted_at_idx";
  DROP INDEX "ai_chat_sessions_deleted_at_idx";
  DROP INDEX "users_deleted_at_idx";
  DROP INDEX "redirects_deleted_at_idx";
  DROP INDEX "forms_deleted_at_idx";
  DROP INDEX "form_submissions_deleted_at_idx";
  DROP INDEX "search_deleted_at_idx";
  DROP INDEX "exports_deleted_at_idx";
  DROP INDEX "imports_deleted_at_idx";
  DROP INDEX "audit_logs_deleted_at_idx";
  ALTER TABLE "pages" DROP COLUMN "deleted_at";
  ALTER TABLE "_pages_v" DROP COLUMN "version_deleted_at";
  ALTER TABLE "posts" DROP COLUMN "deleted_at";
  ALTER TABLE "_posts_v" DROP COLUMN "version_deleted_at";
  ALTER TABLE "media" DROP COLUMN "deleted_at";
  ALTER TABLE "categories" DROP COLUMN "deleted_at";
  ALTER TABLE "tags" DROP COLUMN "deleted_at";
  ALTER TABLE "links" DROP COLUMN "deleted_at";
  ALTER TABLE "ad_slots" DROP COLUMN "deleted_at";
  ALTER TABLE "ads" DROP COLUMN "deleted_at";
  ALTER TABLE "jobs" DROP COLUMN "deleted_at";
  ALTER TABLE "gallery_items" DROP COLUMN "deleted_at";
  ALTER TABLE "app_configs" DROP COLUMN "deleted_at";
  ALTER TABLE "comments" DROP COLUMN "deleted_at";
  ALTER TABLE "api_access_logs" DROP COLUMN "deleted_at";
  ALTER TABLE "ai_chat_sessions" DROP COLUMN "deleted_at";
  ALTER TABLE "users" DROP COLUMN "deleted_at";
  ALTER TABLE "redirects" DROP COLUMN "deleted_at";
  ALTER TABLE "forms" DROP COLUMN "deleted_at";
  ALTER TABLE "form_submissions" DROP COLUMN "deleted_at";
  ALTER TABLE "search" DROP COLUMN "deleted_at";
  ALTER TABLE "exports" DROP COLUMN "deleted_at";
  ALTER TABLE "imports" DROP COLUMN "deleted_at";
  ALTER TABLE "audit_logs" DROP COLUMN "deleted_at";
  DROP TYPE "public"."enum__ads_v_version_format";
  DROP TYPE "public"."enum__jobs_v_version_employment_type";
  DROP TYPE "public"."enum__app_configs_v_version_category";
  DROP TYPE "public"."enum__app_configs_v_version_value_type";
  DROP TYPE "public"."enum__comments_v_version_target_type";
  DROP TYPE "public"."enum__comments_v_version_status";
  DROP TYPE "public"."enum__api_access_logs_v_version_auth_type";
  DROP TYPE "public"."enum__users_v_version_roles";
  DROP TYPE "public"."enum__redirects_v_version_to_type";
  DROP TYPE "public"."enum__forms_v_version_confirmation_type";
  DROP TYPE "public"."enum__exports_v_version_format";
  DROP TYPE "public"."enum__exports_v_version_sort_order";
  DROP TYPE "public"."enum__exports_v_version_drafts";
  DROP TYPE "public"."enum__imports_v_version_import_mode";
  DROP TYPE "public"."enum__imports_v_version_status";
  DROP TYPE "public"."enum__audit_logs_v_version_action";`)
}
