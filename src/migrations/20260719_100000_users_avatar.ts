import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Users.avatar upload field (replaces Gravatar for Admin header).
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "avatar_id" integer;
    ALTER TABLE "_users_v" ADD COLUMN IF NOT EXISTS "version_avatar_id" integer;

    DO $$ BEGIN
      ALTER TABLE "users"
        ADD CONSTRAINT "users_avatar_id_media_id_fk"
        FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_users_v"
        ADD CONSTRAINT "_users_v_version_avatar_id_media_id_fk"
        FOREIGN KEY ("version_avatar_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    CREATE INDEX IF NOT EXISTS "users_avatar_idx" ON "users" USING btree ("avatar_id");
    CREATE INDEX IF NOT EXISTS "_users_v_version_version_avatar_idx"
      ON "_users_v" USING btree ("version_avatar_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_avatar_id_media_id_fk";
    ALTER TABLE "_users_v" DROP CONSTRAINT IF EXISTS "_users_v_version_avatar_id_media_id_fk";
    DROP INDEX IF EXISTS "users_avatar_idx";
    DROP INDEX IF EXISTS "_users_v_version_version_avatar_idx";
    ALTER TABLE "users" DROP COLUMN IF EXISTS "avatar_id";
    ALTER TABLE "_users_v" DROP COLUMN IF EXISTS "version_avatar_id";
  `)
}
