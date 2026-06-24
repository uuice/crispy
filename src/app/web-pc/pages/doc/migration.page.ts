import { Component } from '@angular/core'
import { CardModule } from 'primeng/card'
import { AccordionModule } from 'primeng/accordion'

@Component({
  selector: 'cs-doc-migration',
  standalone: true,
  imports: [CardModule, AccordionModule],
  template: `
    <p-card header="数据库迁移" styleClass="system-card">
      <div class="text-base leading-relaxed space-y-2" style="color: var(--p-content-color)">
        <p>
          使用 <b>Kysely Migrator</b> 管理 schema，脚本位于
          <code>migrations/migrations/</code>，入口为 <code>migrations/migrator.ts</code>。
        </p>
        <p>环境变量从项目根目录 <code>.env</code> 读取（数据库连接等）。</p>
      </div>
    </p-card>
    <p-card header="常用命令" styleClass="system-card">
      <ul class="list-disc pl-6 space-y-2 text-[1.05rem]" style="color: var(--p-content-color)">
        <li><code>bun run db:migrate</code> — 执行全部 pending 迁移（up）</li>
        <li><code>bun run db:migrate:down</code> — 回滚最近一次迁移（down）</li>
        <li><code>bun run db:generate</code> — 从数据库生成 <code>src/db/db.d.ts</code></li>
        <li><code>bun run db:setup</code> — 迁移 + 类型生成（推荐本地初始化）</li>
      </ul>
    </p-card>
    <p-card header="迁移文件列表" styleClass="system-card">
      <p-accordion [multiple]="true">
        @for (item of migrations; track item.file) {
          <p-accordion-panel [value]="item.file">
            <p-accordion-header>{{ item.file }}</p-accordion-header>
            <p-accordion-content>{{ item.summary }}</p-accordion-content>
          </p-accordion-panel>
        }
      </p-accordion>
    </p-card>
    <p-card header="迁移示例" styleClass="system-card">
      <pre
        class="p-4 rounded-xl border border-[var(--p-content-border-color)] overflow-x-auto text-sm"
      >{{ migrationExample }}</pre>
    </p-card>
    <p-card header="注意事项" styleClass="system-card">
      <ul class="list-disc pl-6 space-y-1 text-[1.05rem]" style="color: var(--p-content-color)">
        <li>生产环境执行迁移前请备份数据库</li>
        <li>删除类迁移（009–011）的 down 通常不重建已删表</li>
        <li>Schema 变更后运行 <code>bun run db:generate && bun run doc:tables</code>（或 <code>db:setup</code>）</li>
      </ul>
    </p-card>
  `,
  styles: [
    `
      .system-card {
        flex: 1;
        background: var(--p-content-background) !important;
        color: var(--p-content-color) !important;
        border: 1px solid var(--p-content-border-color) !important;
        border-radius: 10px;
        box-shadow: none;
        padding: 1.2rem 1.2rem 1rem 1.2rem;
        transition: border-color 0.2s;
        margin-bottom: 0.5rem;
      }
      .system-card:hover {
        border-color: var(--p-primary-color) !important;
      }
      pre {
        background: var(--p-content-background) !important;
        color: var(--p-text-color) !important;
        border-radius: 6px;
        border: 1px solid var(--p-content-border-color);
        box-shadow: none;
        white-space: pre-wrap;
      }
    `
  ]
})
export class DocMigrationPage {
  readonly migrations = [
    { file: '001_initial_schema.ts', summary: '初始表结构（users、articles、pages 等）' },
    { file: '002_initial_data.ts', summary: '种子数据（管理员账号、基础配置等）' },
    { file: '003_update_post_page.ts', summary: '文章与单页字段调整' },
    { file: '004_update_cache.ts', summary: 'caches 表结构更新' },
    { file: '005_add_performance_indexes.ts', summary: '常用查询索引' },
    { file: '006_user_avatar_url.ts', summary: 'users 增加 avatar_url' },
    { file: '007_binary.ts', summary: 'binary 表（已在 010 删除）' },
    { file: '008_drop_votes_holidays_todos.ts', summary: '删除 votes、holidays、todos' },
    {
      file: '009_drop_unused_modules.ts',
      summary: '删除 keywords、notices、enums、additions、user_types'
    },
    { file: '010_drop_binary.ts', summary: '删除 binary 表' },
    { file: '011_drop_comments.ts', summary: '删除 comments 表及评论功能' }
  ]

  readonly migrationExample = `import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('comments').ifExists().execute()
}

export async function down(_db: Kysely<any>): Promise<void> {
  // Table is intentionally not recreated on rollback.
}`
}
