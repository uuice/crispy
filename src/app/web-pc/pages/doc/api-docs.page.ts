import { Component } from '@angular/core'
import { CardModule } from 'primeng/card'
import { TabsModule } from 'primeng/tabs'
import { ButtonModule } from 'primeng/button'

@Component({
  selector: 'cs-doc-api-docs',
  standalone: true,
  imports: [CardModule, TabsModule, ButtonModule],
  template: `
    <p-card header="Swagger API 文档" styleClass="system-card">
      <div class="text-base leading-relaxed mb-4" style="color: var(--p-content-color)">
        <p>
          API 分为两套：<b>Admin</b>（后台 JWT 登录）与 <b>Content</b>（官网前台，Access Token
          鉴权）。文档由路由注解自动生成，构建前执行 <code>bun run swagger:generate</code>。
        </p>
      </div>
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
      <p-tabs value="0">
        <p-tablist>
          <p-tab value="0">Admin API</p-tab>
          <p-tab value="1">Content API</p-tab>
          <p-tab value="2">认证说明</p-tab>
        </p-tablist>
        <p-tabpanels>
          <p-tabpanel value="0">
            <p class="mb-2 font-semibold">路径前缀：<code>/api/admin</code></p>
            <ul class="list-disc pl-6 space-y-1 text-[1.05rem]" style="color: var(--p-content-color)">
              <li>用户与权限：users、roles、rules</li>
              <li>内容管理：articles、pages、categories、tags、attrs</li>
              <li>站点：menus、links、configs、jobs、ads、ad_items</li>
              <li>系统：caches、api_logs、operate_logs、access_token</li>
              <li>登录：<code>POST /login</code>，请求头携带 JWT</li>
            </ul>
          </p-tabpanel>
          <p-tabpanel value="1">
            <p class="mb-2 font-semibold">路径前缀：<code>/api/content</code></p>
            <ul class="list-disc pl-6 space-y-1 text-[1.05rem]" style="color: var(--p-content-color)">
              <li>只读内容：articles、pages、categories、tags、attrs、menus、links、jobs、ads</li>
              <li>站点配置：configs、site-settings</li>
              <li>搜索：search/articles、search/pages</li>
              <li>系统信息：system/getSystemInfo（文档页 About 使用）</li>
              <li>可选 AI 辅助：/ai/*（需配置 OpenAI）</li>
              <li>
                已从 Content 移除（仅 Admin）：users、roles、rules、caches、operate_logs 等管理接口
              </li>
            </ul>
          </p-tabpanel>
          <p-tabpanel value="2">
            <div class="space-y-3 text-[1.05rem]" style="color: var(--p-content-color)">
              <div>
                <p class="font-semibold mb-1">Admin — JWT</p>
                <p>登录后使用 <code>Authorization: Bearer &lt;token&gt;</code></p>
              </div>
              <div>
                <p class="font-semibold mb-1">Content — Access Token</p>
                <p>请求头需携带：</p>
                <ul class="list-disc pl-6 mt-1 space-y-1">
                  <li><code>x-access-token</code></li>
                  <li><code>x-app-name</code></li>
                  <li><code>x-channel</code></li>
                </ul>
                <p class="mt-2 text-sm" style="color: var(--p-text-muted-color)">
                  Token 在后台 access_token 模块创建，对应 access_token 表。
                </p>
              </div>
            </div>
          </p-tabpanel>
        </p-tabpanels>
      </p-tabs>
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
    `
  ]
})
export class DocApiDocsPage {}
