import { Component } from '@angular/core'
import { CardModule } from 'primeng/card'
import { TabViewModule } from 'primeng/tabview'
import { ButtonModule } from 'primeng/button'

@Component({
  selector: 'cs-doc-api-docs',
  standalone: true,
  imports: [CardModule, TabViewModule, ButtonModule],
  template: `
    <p-card header="Swagger API 文档" styleClass="system-card">
      <div class="flex flex-wrap gap-4 mb-4">
        <a
          pButton
          label="Admin API"
          href="/doc/admin/docs"
          target="_blank"
          class="p-button-outlined api-link-btn"
          style="color: var(--p-content-color)"
        ></a>
        <a
          pButton
          label="Content API"
          href="/doc/content/docs"
          target="_blank"
          class="p-button-outlined api-link-btn"
          style="color: var(--p-content-color)"
        ></a>
      </div>
      <p-tabView>
        <p-tabPanel header="接口分组">
          <ul class="list-disc pl-6 space-y-1 text-[1.05rem]" style="color: var(--p-content-color)">
            <li>Admin API：后台管理接口，权限严格，支持内容、用户、配置等管理</li>
            <li>Content API：内容前台接口，面向内容消费，权限宽松</li>
          </ul>
        </p-tabPanel>
        <p-tabPanel header="自动同步说明">
          <div style="color: var(--p-content-color)">
            <p>所有 API 文档均自动从路由和参数生成，确保文档与实现一致。</p>
          </div>
        </p-tabPanel>
      </p-tabView>
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
      .api-link-btn {
        transition:
          background 0.2s,
          color 0.2s;
        border-radius: 6px;
        background: var(--p-content-background);
        color: var(--p-primary-color) !important;
        border: 1px solid var(--p-content-border-color);
        box-shadow: none;
      }
      .api-link-btn:hover {
        background: var(--p-primary-color) !important;
        color: #fff !important;
        border-color: var(--p-primary-color);
      }
      .bg-gradient-to-br {
        background: var(--p-content-background) !important;
      }
    `
  ]
})
export class DocApiDocsPage {}
