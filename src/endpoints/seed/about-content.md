## 关于本站

Crispy 3.0 是基于 **Payload CMS 3** 与 **Next.js 16 App Router** 构建的通用内容管理系统，用于发布技术文章、学习笔记与资源整理。内容与页面在后台编辑，支持分类、标签、归档与全文搜索，具备评论、短链接与 AI 助手。

---

## 技术架构

### 核心栈

- **Payload CMS 3.85+** — Headless CMS，Collection / Global / Plugin 扩展
- **Next.js 16 App Router** — 前台 SSR/RSC，开发端口 3333
- **Lexical** — 富文本编辑器
- **Tailwind CSS 4 + shadcn/ui** — 样式与组件
- **pnpm** — 包管理，统一命令入口 `pnpm cli`

### 数据存储

- **SQLite** — 本地开发（`.data/payload.db`），首次启动自动建表
- **PostgreSQL** — 生产环境，通过 `pnpm cli db:migrate` 执行迁移（生产禁止 schema push）

### 官方插件

- SEO、Search、Redirects、Nested Docs、Form Builder
- Import/Export、Query Presets
- **MCP** — 外部 AI Agent 读写内容

### Crispy 自建能力

- **软删除 + 版本历史** — 全业务 Collection 回收站与版本面板
- **前台** — `src/frontend/`，侧栏导航与卡片列表
- **Admin AI 助手** — 对话式内容管理（`/admin/ai-agent`）
- **前台 AI 助手** — 访客公开只读检索（右下角浮窗）
- **OpenAPI / Swagger** — 自动生成 REST 文档（`/admin/api-docs`）
- **审计日志** — 操作追踪
- **前台 HTML 缓存** — 可配置 TTL 与 purge

---

## 内容与功能

- **首页** — 最新文章列表，卡片式展示
- **归档** — `/posts` 文章列表与详情
- **分类与标签** — 嵌套分类、标签筛选
- **单页** — Hero 区块 + 布局区块，后台可视化编辑
- **友情链接 / 友链分组** — `/links`
- **短链接** — `/s/{slug}` 跳转目标 URL，后台可新增与管理
- **招聘** — `/jobs`
- **图库** — `/gallery-items`
- **评论** — 文章与单页评论，后台审核
- **RSS** — `/rss`
- **搜索** — 生成 `search-index.json` 供前台检索
- **后台** — `/admin` Payload Admin，RBAC 角色权限
- **二次开发文档** — 仓库 `docs/dev-docs.md`（部署、权限、AI、MCP 等）

---

## 界面与风格

- **博客皮肤** — 侧栏导航与卡片列表
- **Admin 主题色相** — OKLCH `--hue` 可调
- **响应式** — 移动端导航与阅读区域适配小屏

---

## 版权与说明

- 文章采用 **CC BY-NC-SA 4.0** 许可，转载需署名、非商用、相同方式共享。
- Crispy 3.0 为 greenfield 重写，与 2.x 无代码继承；`main` 为稳定主线，`v3-payload` 用于开发测试，2.x 归档在 `crispy-2x`。
- 开源仓库：[GitHub](https://github.com/uuice/crispy)
