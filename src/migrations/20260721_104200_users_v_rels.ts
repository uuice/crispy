import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Users.roles is a relationship; versions need `_users_v_rels`.
 * `20260720_100000_authz_roles` dropped `_users_v_version_roles` (select array)
 * but never created the relationship version table — saving a user then fails with
 * `relation "_users_v_rels" does not exist`.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_users_v_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "roles_id" integer
    );

    DO $$ BEGIN
      ALTER TABLE "_users_v_rels"
        ADD CONSTRAINT "_users_v_rels_parent_fk"
        FOREIGN KEY ("parent_id") REFERENCES "public"."_users_v"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_users_v_rels"
        ADD CONSTRAINT "_users_v_rels_roles_fk"
        FOREIGN KEY ("roles_id") REFERENCES "public"."roles"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    CREATE INDEX IF NOT EXISTS "_users_v_rels_order_idx"
      ON "_users_v_rels" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "_users_v_rels_parent_idx"
      ON "_users_v_rels" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "_users_v_rels_path_idx"
      ON "_users_v_rels" USING btree ("path");
    CREATE INDEX IF NOT EXISTS "_users_v_rels_roles_id_idx"
      ON "_users_v_rels" USING btree ("roles_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "_users_v_rels" CASCADE;
  `)
}
