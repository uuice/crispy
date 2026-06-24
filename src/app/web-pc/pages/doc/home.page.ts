import { Component } from '@angular/core'
import { CardModule } from 'primeng/card'
import { ButtonModule } from 'primeng/button'

@Component({
  selector: 'cs-doc-home',
  standalone: true,
  imports: [CardModule, ButtonModule],
  template: `
    <p-card header="Crispy 项目介绍" styleClass="system-card">
      <div class="text-base leading-relaxed space-y-3" style="color: var(--p-content-color)">
        <p>
          <b>Crispy</b> 是公司官网内容管理系统（CMS）：前台展示官网页面、新闻、招聘、广告等内容，后台供运营与管理员维护站点结构、文章、分类、标签、链接、广告位及系统配置。
        </p>
        <p>
          技术栈为 Angular + PrimeNG + Tailwind 前端，Bun + Express + Kysely 后端，MariaDB 存储，支持 Angular SSR 与 Swagger 自动 API 文档。
        </p>
      </div>
    </p-card>
    <p-card header="主要功能模块" styleClass="system-card">
      <ul class="list-disc pl-6 space-y-1 text-[1.05rem]" style="color: var(--p-content-color)">
        <li>单页与文章：pages、articles（新闻/动态）</li>
        <li>分类与标签：categories、tags、attrs（置顶/推荐等特殊标记）</li>
        <li>站点结构：menus、links、configs / site-settings</li>
        <li>招聘与广告：jobs、ads、ad_items</li>
        <li>权限与审计：users、roles、rules、operate_logs（仅 Admin API）</li>
        <li>Content API 访问控制：access_token</li>
      </ul>
    </p-card>
    <p-card header="目录结构" styleClass="system-card">
      <pre
        class="p-4 rounded-xl shadow-inner border border-[var(--p-content-border-color)] overflow-x-auto text-sm"
      >
crispy/
├── src/
│   ├── app/
│   │   ├── web-pc/           # 官网前台与文档页 (/doc)
│   │   ├── backstage/        # 后台管理 (/backstage)
│   │   └── ...
│   ├── server/               # Express API（admin / content）
│   │   ├── routes/
│   │   ├── controller/
│   │   └── services/
│   └── db/                   # Kysely 类型 (db.d.ts)
├── migrations/               # 数据库迁移 (001–011)
├── public/                   # 静态资源与上传
└── scripts/                  # swagger 生成等工具脚本
      </pre>
    </p-card>
    <p-card header="技术栈" styleClass="system-card">
      <ul class="list-disc pl-6 space-y-1 text-[1.05rem]" style="color: var(--p-content-color)">
        <li>前端：Angular 21、PrimeNG、TailwindCSS</li>
        <li>后端：Bun + Express、Kysely</li>
        <li>渲染：Angular SSR</li>
        <li>数据库：MariaDB / MySQL</li>
        <li>API 文档：Swagger（Admin / Content 两套）</li>
      </ul>
    </p-card>
    <p-card header="快捷入口" styleClass="system-card">
      <div class="flex flex-wrap gap-4 mb-4">
        <a
          pButton
          label="管理后台"
          href="/backstage"
          target="_blank"
          class="p-button-outlined home-link-btn"
          style="color: var(--p-content-color)"
        ></a>
        <a
          pButton
          label="内容前台"
          href="/"
          target="_blank"
          class="p-button-outlined home-link-btn"
          style="color: var(--p-content-color)"
        ></a>
        <a
          pButton
          label="Swagger Admin"
          href="/doc/admin/docs"
          target="_blank"
          class="p-button-outlined home-link-btn"
          style="color: var(--p-content-color)"
        ></a>
        <a
          pButton
          label="Swagger Content"
          href="/doc/content/docs"
          target="_blank"
          class="p-button-outlined home-link-btn"
          style="color: var(--p-content-color)"
        ></a>
        <a
          pButton
          label="GitHub"
          href="https://github.com/uuice/crispy"
          target="_blank"
          class="p-button-outlined home-link-btn"
          style="color: var(--p-content-color)"
        ></a>
      </div>
      <div
        class="text-sm mt-4 px-2 py-1 rounded bg-[var(--p-surface-section)] border border-[var(--p-content-border-color)] inline-block"
        style="color: var(--p-text-muted-color)"
      >
        后台测试账号：<b>admin</b> / <b>111111</b>
      </div>
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
      .home-link-btn {
        transition:
          background 0.2s,
          color 0.2s;
        border-radius: 6px;
        background: var(--p-content-background);
        color: var(--p-primary-color) !important;
        border: 1px solid var(--p-content-border-color);
        box-shadow: none;
      }
      .home-link-btn:hover {
        background: var(--p-primary-color) !important;
        color: #fff !important;
        border-color: var(--p-primary-color);
      }
      pre {
        background: var(--p-content-background) !important;
        color: var(--p-text-color) !important;
        border-radius: 6px;
        border: 1px solid var(--p-content-border-color);
        box-shadow: none;
      }
    `
  ]
})
export class DocHomePage {}
