import { Component } from '@angular/core'
import { CardModule } from 'primeng/card'
import { TabsModule } from 'primeng/tabs'
import { ButtonModule } from 'primeng/button'
import { MessageModule } from 'primeng/message'

@Component({
  selector: 'cs-doc-home',
  standalone: true,
  imports: [CardModule, TabsModule, ButtonModule, MessageModule],
  template: `
    <p-card header="Crispy 项目介绍" styleClass="system-card">
      <div class="flex flex-col gap-4 mb-4">
        <p-message icon="pi pi-exclamation-triangle" severity="error" variant="outlined">
          大部分代码是AI生成的(Cursor)，请谨慎使用。
        </p-message>

        <div class="text-base leading-relaxed" style="color: var(--p-content-color)">
          <p>
            <b>Crispy</b> 是一套现代全栈内容管理系统，前端采用 Angular + PrimeNG +
            Tailwind，后端基于 Node.js/Express，数据库层用 Kysely，支持 SSR、权限、内容建模、API
            自动文档等。
          </p>
        </div>
      </div>
    </p-card>
    <p-card header="架构图" styleClass="system-card">
      <pre
        class="p-4 rounded-xl shadow-inner border border-[var(--p-content-border-color)] overflow-x-auto text-sm"
      >
crispy/
├── src/
│   ├── app/                  # 前端主应用目录
│   │   ├── web-pc/           # PC端前台页面
│   │   │   ├── layouts/      # 页面布局组件
│   │   │   ├── pages/        # 具体页面（home, about, migration等）
│   │   │   ├── services/     # 前端服务（如 http、seo 等）
│   │   │   └── ...
│   │   ├── backstage/        # 后台管理相关页面
│   │   └── ...
│   ├── server/               # 后端 Node.js 相关代码
│   │   ├── routes/           # API 路由（admin/content）
│   │   ├── services/         # 业务服务层（如 userService 等）
│   │   └── ...
│   ├── db/                   # 数据库类型定义
│   └── libs/                 # 公共库/工具
├── migrations/               # 数据库迁移脚本
├── public/                   # 静态资源（图片、上传等）
├── package.json              # 项目依赖与脚本
├── angular.json              # Angular 配置
└── ...
        </pre
      >
    </p-card>
    <p-card header="技术栈" styleClass="system-card">
      <ul class="list-disc pl-6 space-y-1 text-[1.05rem]" style="color: var(--p-content-color)">
        <li>前端：Angular 20、PrimeNG、TailwindCSS</li>
        <li>后端：<b>Node.js + Express</b>、Kysely、PM2、Trpc</li>
        <li>模板：React JSX Engine</li>
        <li>数据库：MariaDB</li>
        <li>API文档：Swagger</li>
      </ul>
    </p-card>
    <p-card header="测试入口 & 相关链接" styleClass="system-card">
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
          label="文档"
          href="/doc"
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
      .bg-gradient-to-br {
        background: var(--p-content-background) !important;
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
