import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await sql`DELETE FROM menus WHERE alias = 'holidays' OR url = '/backstage/holidays'`.execute(db)

  await db.schema.dropTable('vote_items').ifExists().execute()
  await db.schema.dropTable('votes').ifExists().execute()
  await db.schema.dropTable('holidays').ifExists().execute()
  await db.schema.dropTable('todos').ifExists().execute()
}

export async function down(_db: Kysely<any>): Promise<void> {
  // Tables are intentionally not recreated on rollback.
}
