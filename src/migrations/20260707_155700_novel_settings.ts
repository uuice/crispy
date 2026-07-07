import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "novel_settings_characters" CASCADE;
    DROP TABLE IF EXISTS "novel_settings" CASCADE;

    CREATE TABLE IF NOT EXISTS "novels" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "generate_slug" boolean DEFAULT true,
      "slug" varchar NOT NULL,
      "enabled" boolean DEFAULT true,
      "genre" varchar,
      "synopsis" varchar,
      "writing_style" varchar,
      "world_building" varchar,
      "constraints" varchar,
      "plot_outline" varchar,
      "current_progress" varchar,
      "chapter_target_words" numeric DEFAULT 4000,
      "chapter_category_id" integer,
      "chapter_tag_id" integer,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "deleted_at" timestamp(3) with time zone
    );

    CREATE TABLE IF NOT EXISTS "novels_characters" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "role" varchar,
      "personality" varchar,
      "notes" varchar
    );

    DO $$ BEGIN
      ALTER TABLE "novels"
        ADD CONSTRAINT "novels_chapter_category_id_categories_id_fk"
        FOREIGN KEY ("chapter_category_id") REFERENCES "categories"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "novels"
        ADD CONSTRAINT "novels_chapter_tag_id_tags_id_fk"
        FOREIGN KEY ("chapter_tag_id") REFERENCES "tags"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "novels_characters"
        ADD CONSTRAINT "novels_characters_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "novels"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "novel_id" integer;

    DO $$ BEGIN
      ALTER TABLE "posts"
        ADD CONSTRAINT "posts_novel_id_novels_id_fk"
        FOREIGN KEY ("novel_id") REFERENCES "novels"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    CREATE UNIQUE INDEX IF NOT EXISTS "novels_slug_idx" ON "novels" ("slug");
    CREATE INDEX IF NOT EXISTS "novels_chapter_category_idx" ON "novels" ("chapter_category_id");
    CREATE INDEX IF NOT EXISTS "novels_chapter_tag_idx" ON "novels" ("chapter_tag_id");
    CREATE INDEX IF NOT EXISTS "novels_updated_at_idx" ON "novels" ("updated_at");
    CREATE INDEX IF NOT EXISTS "novels_created_at_idx" ON "novels" ("created_at");
    CREATE INDEX IF NOT EXISTS "novels_deleted_at_idx" ON "novels" ("deleted_at");
    CREATE INDEX IF NOT EXISTS "novels_characters_order_idx" ON "novels_characters" ("_order");
    CREATE INDEX IF NOT EXISTS "novels_characters_parent_id_idx" ON "novels_characters" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "posts_novel_idx" ON "posts" ("novel_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "posts" DROP CONSTRAINT IF EXISTS "posts_novel_id_novels_id_fk";
    ALTER TABLE "posts" DROP COLUMN IF EXISTS "novel_id";
    DROP TABLE IF EXISTS "novels_characters" CASCADE;
    DROP TABLE IF EXISTS "novels" CASCADE;
  `)
}
