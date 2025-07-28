import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // Add performance indexes for better query performance
  // This migration adds indexes to improve query speed

  // Articles table indexes
  await sql`ALTER TABLE articles ADD INDEX idx_status (status)`.execute(db)
  await sql`ALTER TABLE articles ADD INDEX idx_type_id (type_id)`.execute(db)
  await sql`ALTER TABLE articles ADD INDEX idx_create_time (create_time)`.execute(db)
  await sql`ALTER TABLE articles ADD INDEX idx_status_create_time (status, create_time)`.execute(db)
  await sql`ALTER TABLE articles ADD INDEX idx_type_id_status (type_id, status)`.execute(db)
  await sql`ALTER TABLE articles ADD INDEX idx_url (url)`.execute(db)
  await sql`ALTER TABLE articles ADD INDEX idx_tags (tags)`.execute(db)

  // Categories table indexes
  await sql`ALTER TABLE categories ADD INDEX idx_parent_id (parent_id)`.execute(db)
  await sql`ALTER TABLE categories ADD INDEX idx_status (status)`.execute(db)
  await sql`ALTER TABLE categories ADD INDEX idx_alias (alias)`.execute(db)

  // Tags table indexes
  await sql`ALTER TABLE tags ADD INDEX idx_status (status)`.execute(db)
  await sql`ALTER TABLE tags ADD INDEX idx_type_id (type_id)`.execute(db)
  await sql`ALTER TABLE tags ADD INDEX idx_sort (sort)`.execute(db)

  // Pages table indexes
  await sql`ALTER TABLE pages ADD INDEX idx_status (status)`.execute(db)
  await sql`ALTER TABLE pages ADD INDEX idx_create_time (create_time)`.execute(db)
  await sql`ALTER TABLE pages ADD INDEX idx_url (url)`.execute(db)

  // Caches table indexes
  await sql`ALTER TABLE caches ADD INDEX idx_hash (hash)`.execute(db)
  await sql`ALTER TABLE caches ADD INDEX idx_status (status)`.execute(db)
  await sql`ALTER TABLE caches ADD INDEX idx_create_time (create_time)`.execute(db)

  // Users table indexes
  await sql`ALTER TABLE users ADD INDEX idx_status (status)`.execute(db)
  await sql`ALTER TABLE users ADD INDEX idx_role_id (role_id)`.execute(db)

  // Comments table indexes
  await sql`ALTER TABLE comments ADD INDEX idx_status (status)`.execute(db)
  await sql`ALTER TABLE comments ADD INDEX idx_create_time (create_time)`.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  // Remove all indexes added in this migration

  // Articles table indexes
  await sql`ALTER TABLE articles DROP INDEX idx_status`.execute(db)
  await sql`ALTER TABLE articles DROP INDEX idx_type_id`.execute(db)
  await sql`ALTER TABLE articles DROP INDEX idx_create_time`.execute(db)
  await sql`ALTER TABLE articles DROP INDEX idx_status_create_time`.execute(db)
  await sql`ALTER TABLE articles DROP INDEX idx_type_id_status`.execute(db)
  await sql`ALTER TABLE articles DROP INDEX idx_url`.execute(db)
  await sql`ALTER TABLE articles DROP INDEX idx_tags`.execute(db)

  // Categories table indexes
  await sql`ALTER TABLE categories DROP INDEX idx_parent_id`.execute(db)
  await sql`ALTER TABLE categories DROP INDEX idx_status`.execute(db)
  await sql`ALTER TABLE categories DROP INDEX idx_alias`.execute(db)

  // Tags table indexes
  await sql`ALTER TABLE tags DROP INDEX idx_status`.execute(db)
  await sql`ALTER TABLE tags DROP INDEX idx_type_id`.execute(db)
  await sql`ALTER TABLE tags DROP INDEX idx_sort`.execute(db)

  // Pages table indexes
  await sql`ALTER TABLE pages DROP INDEX idx_status`.execute(db)
  await sql`ALTER TABLE pages DROP INDEX idx_create_time`.execute(db)
  await sql`ALTER TABLE pages DROP INDEX idx_url`.execute(db)

  // Caches table indexes
  await sql`ALTER TABLE caches DROP INDEX idx_hash`.execute(db)
  await sql`ALTER TABLE caches DROP INDEX idx_status`.execute(db)
  await sql`ALTER TABLE caches DROP INDEX idx_create_time`.execute(db)

  // Users table indexes
  await sql`ALTER TABLE users DROP INDEX idx_status`.execute(db)
  await sql`ALTER TABLE users DROP INDEX idx_role_id`.execute(db)

  // Comments table indexes
  await sql`ALTER TABLE comments DROP INDEX idx_status`.execute(db)
  await sql`ALTER TABLE comments DROP INDEX idx_create_time`.execute(db)
}
