import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "_novel_chapters_v_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "novel_categories_id" integer,
    "novel_tags_id" integer
  );

  CREATE TABLE IF NOT EXISTS "_novel_categories_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_title" varchar NOT NULL,
    "version_generate_slug" boolean DEFAULT true,
    "version_slug" varchar NOT NULL,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "version_deleted_at" timestamp(3) with time zone,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "_novel_tags_v" (
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

  ALTER TABLE "_novel_chapters_v_rels" ADD CONSTRAINT "_novel_chapters_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_novel_chapters_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_novel_chapters_v_rels" ADD CONSTRAINT "_novel_chapters_v_rels_novel_categories_fk" FOREIGN KEY ("novel_categories_id") REFERENCES "public"."novel_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_novel_chapters_v_rels" ADD CONSTRAINT "_novel_chapters_v_rels_novel_tags_fk" FOREIGN KEY ("novel_tags_id") REFERENCES "public"."novel_tags"("id") ON DELETE cascade ON UPDATE no action;

  ALTER TABLE "_novel_categories_v" ADD CONSTRAINT "_novel_categories_v_parent_id_novel_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."novel_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_novel_tags_v" ADD CONSTRAINT "_novel_tags_v_parent_id_novel_tags_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."novel_tags"("id") ON DELETE set null ON UPDATE no action;

  CREATE INDEX IF NOT EXISTS "_novel_chapters_v_rels_order_idx" ON "_novel_chapters_v_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "_novel_chapters_v_rels_parent_idx" ON "_novel_chapters_v_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_novel_chapters_v_rels_path_idx" ON "_novel_chapters_v_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "_novel_chapters_v_rels_novel_categories_id_idx" ON "_novel_chapters_v_rels" USING btree ("novel_categories_id");
  CREATE INDEX IF NOT EXISTS "_novel_chapters_v_rels_novel_tags_id_idx" ON "_novel_chapters_v_rels" USING btree ("novel_tags_id");

  CREATE INDEX IF NOT EXISTS "_novel_categories_v_parent_idx" ON "_novel_categories_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_novel_categories_v_version_version_slug_idx" ON "_novel_categories_v" USING btree ("version_slug");
  CREATE INDEX IF NOT EXISTS "_novel_categories_v_version_version_updated_at_idx" ON "_novel_categories_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_novel_categories_v_version_version_created_at_idx" ON "_novel_categories_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_novel_categories_v_version_version_deleted_at_idx" ON "_novel_categories_v" USING btree ("version_deleted_at");
  CREATE INDEX IF NOT EXISTS "_novel_categories_v_created_at_idx" ON "_novel_categories_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_novel_categories_v_updated_at_idx" ON "_novel_categories_v" USING btree ("updated_at");

  CREATE INDEX IF NOT EXISTS "_novel_tags_v_parent_idx" ON "_novel_tags_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_novel_tags_v_version_version_slug_idx" ON "_novel_tags_v" USING btree ("version_slug");
  CREATE INDEX IF NOT EXISTS "_novel_tags_v_version_version_updated_at_idx" ON "_novel_tags_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_novel_tags_v_version_version_created_at_idx" ON "_novel_tags_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_novel_tags_v_version_version_deleted_at_idx" ON "_novel_tags_v" USING btree ("version_deleted_at");
  CREATE INDEX IF NOT EXISTS "_novel_tags_v_created_at_idx" ON "_novel_tags_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_novel_tags_v_updated_at_idx" ON "_novel_tags_v" USING btree ("updated_at");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE IF EXISTS "_novel_chapters_v_rels" CASCADE;
  DROP TABLE IF EXISTS "_novel_categories_v" CASCADE;
  DROP TABLE IF EXISTS "_novel_tags_v" CASCADE;`)
}
