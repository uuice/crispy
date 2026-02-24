import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // Binary table
  await db.schema
    .createTable('binary')
    .addColumn('id', 'integer', (col) =>
      col
        .unsigned()
        .autoIncrement()
        .primaryKey()
        .modifyEnd(sql`COMMENT '自增id'`)
    )
    .addColumn('key', 'varchar(255)', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT '键名'`)
    )
    .addColumn('binary_str', 'text', (col) => col.notNull().modifyEnd(sql`COMMENT '二进制字符串'`))
    .addColumn('status', 'smallint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(10)
        .modifyEnd(sql`COMMENT '状态'`)
    )
    .addColumn('is_delete', 'smallint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '是否删除'`)
    )
    .addColumn('create_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '创建时间'`)
    )
    .addColumn('update_time', 'bigint', (col) =>
      col
        .unsigned()
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '更新时间'`)
    )
    .modifyEnd(
      sql`ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci COMMENT='二进制数据存储表'`
    )
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('binary').execute()
}
