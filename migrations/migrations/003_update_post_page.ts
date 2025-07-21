import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // Add markdown_content column to articles table after content
  await db.schema
    .alterTable('articles')
    .addColumn('markdown_content', 'text', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT 'markdown 内容' AFTER content`)
    )
    .execute()

  // Add is_mark column to articles table after markdown_content
  await db.schema
    .alterTable('articles')
    .addColumn('is_markdown', 'smallint', (col) =>
      col
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '是否是markdown 内容' AFTER markdown_content`)
    )
    .execute()

  // Add markdown_content column to pages table after content
  await db.schema
    .alterTable('pages')
    .addColumn('markdown_content', 'text', (col) =>
      col
        .notNull()
        .defaultTo('')
        .modifyEnd(sql`COMMENT 'markdown 内容' AFTER content`)
    )
    .execute()

  // Add is_mark column to pages table after markdown_content
  await db.schema
    .alterTable('pages')
    .addColumn('is_markdown', 'smallint', (col) =>
      col
        .notNull()
        .defaultTo(0)
        .modifyEnd(sql`COMMENT '是否是markdown 内容' AFTER markdown_content`)
    )
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  // Remove is_mark column from pages table
  await db.schema.alterTable('pages').dropColumn('is_markdown').execute()

  // Remove markdown_content column from pages table
  await db.schema.alterTable('pages').dropColumn('markdown_content').execute()

  // Remove is_mark column from articles table
  await db.schema.alterTable('articles').dropColumn('is_markdown').execute()

  // Remove markdown_content column from articles table
  await db.schema.alterTable('articles').dropColumn('markdown_content').execute()
}
