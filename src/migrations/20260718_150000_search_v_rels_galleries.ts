import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Search plugin indexes galleries; versioned search docs need _search_v_rels.galleries_id.
 * Missing column caused gallery updates to roll back (cover / bulkImages lost).
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "_search_v_rels" ADD COLUMN IF NOT EXISTS "galleries_id" integer;

    DO $$ BEGIN
      ALTER TABLE "_search_v_rels"
        ADD CONSTRAINT "_search_v_rels_galleries_fk"
        FOREIGN KEY ("galleries_id") REFERENCES "public"."galleries"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    CREATE INDEX IF NOT EXISTS "_search_v_rels_galleries_id_idx"
      ON "_search_v_rels" USING btree ("galleries_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "_search_v_rels" DROP CONSTRAINT IF EXISTS "_search_v_rels_galleries_fk";
    DROP INDEX IF EXISTS "_search_v_rels_galleries_id_idx";
    ALTER TABLE "_search_v_rels" DROP COLUMN IF EXISTS "galleries_id";
  `)
}
