import { Component } from '@angular/core'
import { CardModule } from 'primeng/card'
import { AccordionModule } from 'primeng/accordion'

@Component({
  selector: 'cs-doc-migration',
  standalone: true,
  imports: [CardModule, AccordionModule],
  template: `
    <p-card header="数据库迁移工具" styleClass="system-card">
      <div class="text-base leading-relaxed" style="color: var(--p-content-color)">
        <p>
          本项目使用 <b>Kysely</b> 进行数据库 schema 管理，迁移脚本位于
          <code>/migrations</code> 目录。
        </p>
      </div>
    </p-card>
    <p-card header="常用迁移命令" styleClass="system-card">
      <ul class="list-disc pl-6 space-y-1 text-[1.05rem]" style="color: var(--p-content-color)">
        <li><code>bun run migrate</code> —— 执行所有迁移</li>
        <li><code>bun run scripts/migrate.ts</code> —— 使用 bun 执行迁移脚本</li>
      </ul>
    </p-card>
    <p-card header="迁移文件示例" styleClass="system-card">
      <pre
        class=" p-4 rounded-xl shadow-inner border border-[var(--p-content-border-color)] overflow-x-auto text-sm"
        [innerHTML]="migrationExampleCode"
      ></pre>
    </p-card>
    <p-card header="注意事项" styleClass="system-card">
      <ul class="list-disc pl-6 space-y-1 text-[1.05rem]" style="color: var(--p-content-color)">
        <li>迁移脚本应可逆（实现 up/down）</li>
        <li>生产环境迁移前请备份数据</li>
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
      }
      .bg-gradient-to-br {
        background: var(--p-content-background) !important;
      }
    `
  ]
})
export class DocMigrationPage {
  readonly migrationExampleCode = `// migrations/001_initial_schema.ts<br>import { Kysely, Migration } from 'kysely';<br>export async function up(db: Kysely<any>): Promise<void> {<br>&nbsp;&nbsp;await db.schema.createTable('users')<br>&nbsp;&nbsp;&nbsp;&nbsp;.addColumn('id', 'integer', col => col.primaryKey().autoIncrement())<br>&nbsp;&nbsp;&nbsp;&nbsp;.addColumn('user_name', 'varchar', col => col.notNull())<br>&nbsp;&nbsp;&nbsp;&nbsp;.addColumn('password', 'varchar', col => col.notNull())<br>&nbsp;&nbsp;&nbsp;&nbsp;.execute();<br>}<br>export async function down(db: Kysely<any>): Promise<void> {<br>&nbsp;&nbsp;await db.schema.dropTable('users').execute();<br>}`
}
