import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

import { ALL_PERMISSIONS } from '../access/permissions'

const permissionEnumSql = ALL_PERMISSIONS.map((p) => `'${p}'`).join(', ')

/**
 * RBAC: roles + authz-cache collections; users.roles select → relationship.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_roles_permissions" AS ENUM(${permissionEnumSql});
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_authz_cache_scope" AS ENUM('user', 'role');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    CREATE TABLE IF NOT EXISTS "roles" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "slug" varchar NOT NULL,
      "description" varchar,
      "is_system" boolean DEFAULT false,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE UNIQUE INDEX IF NOT EXISTS "roles_slug_idx" ON "roles" USING btree ("slug");
    CREATE INDEX IF NOT EXISTS "roles_updated_at_idx" ON "roles" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "roles_created_at_idx" ON "roles" USING btree ("created_at");

    CREATE TABLE IF NOT EXISTS "roles_permissions" (
      "order" integer NOT NULL,
      "parent_id" integer NOT NULL,
      "value" "enum_roles_permissions",
      "id" serial PRIMARY KEY NOT NULL
    );

    DO $$ BEGIN
      ALTER TABLE "roles_permissions"
        ADD CONSTRAINT "roles_permissions_parent_fk"
        FOREIGN KEY ("parent_id") REFERENCES "public"."roles"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    CREATE INDEX IF NOT EXISTS "roles_permissions_order_idx" ON "roles_permissions" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "roles_permissions_parent_idx" ON "roles_permissions" USING btree ("parent_id");

    CREATE TABLE IF NOT EXISTS "authz_cache" (
      "id" serial PRIMARY KEY NOT NULL,
      "cache_key" varchar NOT NULL,
      "scope" "enum_authz_cache_scope" NOT NULL,
      "cached_value" jsonb,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE UNIQUE INDEX IF NOT EXISTS "authz_cache_cache_key_idx" ON "authz_cache" USING btree ("cache_key");
    CREATE INDEX IF NOT EXISTS "authz_cache_scope_idx" ON "authz_cache" USING btree ("scope");
    CREATE INDEX IF NOT EXISTS "authz_cache_updated_at_idx" ON "authz_cache" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "authz_cache_created_at_idx" ON "authz_cache" USING btree ("created_at");

    CREATE TABLE IF NOT EXISTS "users_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "roles_id" integer
    );

    DO $$ BEGIN
      ALTER TABLE "users_rels"
        ADD CONSTRAINT "users_rels_parent_fk"
        FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "users_rels"
        ADD CONSTRAINT "users_rels_roles_fk"
        FOREIGN KEY ("roles_id") REFERENCES "public"."roles"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    CREATE INDEX IF NOT EXISTS "users_rels_order_idx" ON "users_rels" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "users_rels_parent_idx" ON "users_rels" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "users_rels_path_idx" ON "users_rels" USING btree ("path");
    CREATE INDEX IF NOT EXISTS "users_rels_roles_id_idx" ON "users_rels" USING btree ("roles_id");

    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "roles_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "authz_cache_id" integer;

    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_roles_fk"
        FOREIGN KEY ("roles_id") REFERENCES "public"."roles"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_authz_cache_fk"
        FOREIGN KEY ("authz_cache_id") REFERENCES "public"."authz_cache"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_roles_id_idx"
      ON "payload_locked_documents_rels" USING btree ("roles_id");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_authz_cache_id_idx"
      ON "payload_locked_documents_rels" USING btree ("authz_cache_id");

    INSERT INTO "roles" ("name", "slug", "description", "is_system")
    SELECT v.name, v.slug, v.description, v.is_system
    FROM (VALUES
      ('超级管理员', 'super-admin', '全部权限，含用户/角色与系统配置', true),
      ('编辑', 'editor', '内容与运营管理，不可改用户/角色与密钥配置', true),
      ('作者', 'author', '管理自己的文章（仅草稿）与媒体上传', true)
    ) AS v(name, slug, description, is_system)
    WHERE NOT EXISTS (SELECT 1 FROM "roles" r WHERE r.slug = v.slug);

    INSERT INTO "users_rels" ("order", "parent_id", "path", "roles_id")
    SELECT ur."order", ur."parent_id", 'roles', r."id"
    FROM "users_roles" ur
    JOIN "roles" r ON r."slug" = ur."value"::text
    WHERE NOT EXISTS (
      SELECT 1 FROM "users_rels" rel
      WHERE rel."parent_id" = ur."parent_id"
        AND rel."path" = 'roles'
        AND rel."roles_id" = r."id"
    );

    DROP TABLE IF EXISTS "users_roles" CASCADE;
    DROP TABLE IF EXISTS "_users_v_version_roles" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_users_roles";
    DROP TYPE IF EXISTS "public"."enum__users_v_version_roles";
  `))
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_users_roles" AS ENUM('super-admin', 'editor', 'author');
    CREATE TYPE "public"."enum__users_v_version_roles" AS ENUM('super-admin', 'editor', 'author');

    CREATE TABLE IF NOT EXISTS "users_roles" (
      "order" integer NOT NULL,
      "parent_id" integer NOT NULL,
      "value" "public"."enum_users_roles",
      "id" serial PRIMARY KEY NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "_users_v_version_roles" (
      "order" integer NOT NULL,
      "parent_id" integer NOT NULL,
      "value" "public"."enum__users_v_version_roles",
      "id" serial PRIMARY KEY NOT NULL
    );

    INSERT INTO "users_roles" ("order", "parent_id", "value")
    SELECT rel."order", rel."parent_id", r."slug"::"public"."enum_users_roles"
    FROM "users_rels" rel
    JOIN "roles" r ON r."id" = rel."roles_id"
    WHERE rel."path" = 'roles'
      AND r."slug" IN ('super-admin', 'editor', 'author');

    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_roles_fk";
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_authz_cache_fk";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_roles_id_idx";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_authz_cache_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "roles_id";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "authz_cache_id";

    DROP TABLE IF EXISTS "users_rels" CASCADE;
    DROP TABLE IF EXISTS "roles_permissions" CASCADE;
    DROP TABLE IF EXISTS "roles" CASCADE;
    DROP TABLE IF EXISTS "authz_cache" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_roles_permissions";
    DROP TYPE IF EXISTS "public"."enum_authz_cache_scope";
  `)
}
