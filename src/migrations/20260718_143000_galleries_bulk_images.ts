import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/** Staging hasMany upload bulkImages on galleries → galleries_rels / version rels. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "galleries_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "media_id" integer
    );

    CREATE TABLE IF NOT EXISTS "_galleries_v_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "media_id" integer
    );

    DO $$ BEGIN
      ALTER TABLE "galleries_rels"
        ADD CONSTRAINT "galleries_rels_parent_fk"
        FOREIGN KEY ("parent_id") REFERENCES "public"."galleries"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "galleries_rels"
        ADD CONSTRAINT "galleries_rels_media_fk"
        FOREIGN KEY ("media_id") REFERENCES "public"."media"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_galleries_v_rels"
        ADD CONSTRAINT "_galleries_v_rels_parent_fk"
        FOREIGN KEY ("parent_id") REFERENCES "public"."_galleries_v"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_galleries_v_rels"
        ADD CONSTRAINT "_galleries_v_rels_media_fk"
        FOREIGN KEY ("media_id") REFERENCES "public"."media"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    CREATE INDEX IF NOT EXISTS "galleries_rels_order_idx" ON "galleries_rels" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "galleries_rels_parent_idx" ON "galleries_rels" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "galleries_rels_path_idx" ON "galleries_rels" USING btree ("path");
    CREATE INDEX IF NOT EXISTS "galleries_rels_media_id_idx" ON "galleries_rels" USING btree ("media_id");
    CREATE INDEX IF NOT EXISTS "_galleries_v_rels_order_idx" ON "_galleries_v_rels" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "_galleries_v_rels_parent_idx" ON "_galleries_v_rels" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "_galleries_v_rels_path_idx" ON "_galleries_v_rels" USING btree ("path");
    CREATE INDEX IF NOT EXISTS "_galleries_v_rels_media_id_idx" ON "_galleries_v_rels" USING btree ("media_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "_galleries_v_rels" CASCADE;
    DROP TABLE IF EXISTS "galleries_rels" CASCADE;
  `)
}
