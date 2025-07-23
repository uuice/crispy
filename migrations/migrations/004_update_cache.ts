import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('caches')
    .modifyColumn('cache_data', sql`longtext not null default '' COMMENT '缓存数据'`)
    .execute()

  await db.schema
    .alterTable('caches')
    .addColumn('url', 'varchar(255)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '原始url' AFTER hash`)
    )
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('caches')
    .modifyColumn('cache_data', sql`text not null default '' COMMENT ''`)
    .execute()
  await db.schema.alterTable('caches').dropColumn('url').execute()
}
