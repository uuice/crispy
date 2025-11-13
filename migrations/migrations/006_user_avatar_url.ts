import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('users')
    .modifyColumn('avatar_url', sql`text default '' not null comment '头像'`)
    .execute()
}
