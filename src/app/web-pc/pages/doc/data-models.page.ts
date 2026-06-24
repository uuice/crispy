import { Component } from '@angular/core'
import { CardModule } from 'primeng/card'
import { TableModule } from 'primeng/table'
import { ButtonModule } from 'primeng/button'
import { DOC_TABLES } from './table-metadata'

@Component({
  selector: 'cs-doc-data-models',
  standalone: true,
  imports: [CardModule, TableModule, ButtonModule],
  template: `
    <p-card header="数据模型说明" styleClass="system-card">
      <div class="text-base leading-relaxed space-y-2" style="color: var(--p-content-color)">
        <p>
          当前数据库共 <b>{{ tables.length }}</b> 张表，字段定义与
          <code>src/db/db.d.ts</code>（Kysely codegen）保持一致。
        </p>
        <p>
          迁移脚本位于 <code>migrations/migrations/</code>（001–011）。Schema 变更后请执行
          <code>bun run db:setup</code>（或 <code>bun run doc:tables</code>）同步本页数据。
        </p>
        <p class="text-sm" style="color: var(--p-text-muted-color)">
          已移除模块（comments、binary、keywords、notices、enums、additions、user_types 等）不再列出。
        </p>
      </div>
    </p-card>
    <p-card header="数据表 (Database Schema)" styleClass="system-card">
      <p-table
        [value]="tables"
        styleClass="p-datatable-sm beautify-table"
        dataKey="name"
        [expandedRowKeys]="expandedRows"
        (onRowExpand)="onRowExpand($event)"
        (onRowCollapse)="onRowCollapse($event)"
        [scrollable]="true"
      >
        <ng-template pTemplate="header">
          <tr>
            <th style="width: 50px"></th>
            <th>表名</th>
            <th>说明</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-row let-expanded="expanded">
          <tr>
            <td>
              <p-button
                type="button"
                pRipple
                [pRowToggler]="row"
                [text]="true"
                severity="secondary"
                [rounded]="true"
                [icon]="expanded ? 'pi pi-chevron-down' : 'pi pi-chevron-right'"
              ></p-button>
            </td>
            <td>{{ row.name }}</td>
            <td>{{ row.comment }}</td>
          </tr>
        </ng-template>
        <ng-template pTemplate="expandedrow" let-row>
          <tr>
            <td colspan="3">
              <div class="expansion-content">
                <div class="expansion-header">
                  <h3 class="tag-title">{{ row.name }} 字段详情</h3>
                  <p class="tag-description">{{ row.comment }}</p>
                </div>
                <div class="parameters-section">
                  <div class="section-header">
                    <i class="pi pi-cog"></i>
                    <h4>字段列表</h4>
                  </div>
                  <div class="parameters-table">
                    <table>
                      <thead>
                        <tr>
                          <th>字段名</th>
                          <th>说明</th>
                        </tr>
                      </thead>
                      <tbody>
                        @for (col of row.columns; track col.name) {
                          <tr>
                            <td>
                              <span class="param-name">{{ col.name }}</span>
                            </td>
                            <td>{{ col.comment || '—' }}</td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </ng-template>
      </p-table>
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
      .beautify-table th,
      .beautify-table td {
        padding: 0.5rem 1rem;
        font-size: 1.05rem;
        background: var(--p-content-background);
        border-bottom: 1px solid var(--p-content-border-color);
      }
      .beautify-table tr:hover {
        background: var(--p-primary-color) !important;
        color: var(--p-text-color) !important;
      }
      .expansion-content {
        padding: 1.5rem;
        background: linear-gradient(
          135deg,
          var(--p-surface-section) 0%,
          var(--p-surface-ground) 100%
        );
        border-top: 2px solid var(--p-primary-color);
        border-radius: 0 0 8px 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
      .expansion-header {
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 2px solid var(--p-primary-color);
      }
      .tag-title {
        margin: 0 0 0.5rem 0;
        color: var(--p-primary-color);
        font-size: 1.5rem;
        font-weight: 700;
      }
      .tag-description {
        margin: 0;
        color: var(--p-text-color-secondary);
        font-size: 1.1rem;
        line-height: 1.5;
      }
      .section-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1rem;
        padding: 0.75rem 1rem;
        background: var(--p-primary-color);
        color: white;
        border-radius: 6px;
      }
      .section-header h4 {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 600;
      }
      .parameters-section {
        margin-bottom: 2rem;
      }
      .parameters-table table {
        width: 100%;
        border-collapse: collapse;
        background: var(--p-content-background);
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid var(--p-content-border-color);
      }
      .parameters-table th,
      .parameters-table td {
        padding: 0.75rem 1rem;
        text-align: left;
        border-bottom: 1px solid var(--p-content-border-color);
        font-size: 0.95rem;
      }
      .parameters-table th {
        font-weight: 600;
      }
      .param-name {
        background: var(--p-primary-color);
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        font-size: 0.85rem;
        font-weight: 600;
      }
    `
  ]
})
export class DocDataModelsPage {
  tables = DOC_TABLES
  expandedRows: Record<string, boolean> = Object.fromEntries(DOC_TABLES.map((t) => [t.name, true]))

  onRowExpand(event: { data: { name: string } }) {
    console.log('Row expanded:', event.data)
  }

  onRowCollapse(event: { data: { name: string } }) {
    console.log('Row collapsed:', event.data)
  }
}
