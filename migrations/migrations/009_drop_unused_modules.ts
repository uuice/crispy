import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('additions').ifExists().execute()
  await db.schema.dropTable('enums').ifExists().execute()
  await db.schema.dropTable('keywords').ifExists().execute()
  await db.schema.dropTable('notices').ifExists().execute()
  await db.schema.dropTable('user_types').ifExists().execute()
}

export async function down(_db: Kysely<any>): Promise<void> {
  // Tables are intentionally not recreated on rollback.
}
