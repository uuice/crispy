# Crispy 3.0 架构设计

> 基于 Payload CMS 3 的通用内容管理系统  
> 分支：`v3-payload`（orphan，与 2.x 无代码继承）  
> 原则：**Payload First** — 最大化官方能力与插件，最小化自研

---

## 目录

1. [项目概述](#1-项目概述)
2. [技术栈](#2-技术栈)
3. [系统架构](#3-系统架构)
4. [官方插件策略](#4-官方插件策略)
5. [内容模型](#5-内容模型)
6. [权限模型](#6-权限模型)
7. [AI / MCP 集成](#7-ai--mcp-集成)
8. [前台设计](#8-前台设计)
9. [目录结构](#9-目录结构)
10. [基础设施](#10-基础设施)
11. [实施路线图](#11-实施路线图)
12. [与 Crispy 2.x 对照](#12-与-crispy-2x-对照)

---

## 1. 项目概述

### 1.1 定位

Crispy 3.0 是一个**通用 CMS**，支持：

- 企业官网 / 博客 / 文档站前台（SSR + SEO）
- Payload Admin 后台内容运营
- 草稿 / 发布 / 定时发布 / 版本历史
- **AI Agent 通过 MCP 读写内容**

### 1.2 与 2.x 的关系

| 维度 | Crispy 2.x | Crispy 3.0 |
|------|------------|------------|
| CMS 核心 | 自研 Prisma + Hono RPC | **Payload 3** |
| 后台 | 自研 `(admin)` + shadcn | Payload Admin |
| 数据库 | MySQL | **SQLite（本地）/ PostgreSQL（生产）** |
| API | Hono Admin/Content RPC | Payload REST + Local API + MCP |
| 内容版本 | status 字段 | Payload versions + drafts |

**代码策略**：`v3-payload` 为 orphan 分支，2.x 代码不保留。

---

## 2. 技术栈

| 类别 | 选型 |
|------|------|
| 框架 | Next.js 16 App Router |
| CMS | Payload 3.85+ |
| 语言 | TypeScript 5.7+ |
| 数据库（本地） | SQLite（`.data/payload.db`，无需 Docker） |
| 数据库（生产） | PostgreSQL 16 |
| 编辑器 | Lexical（Payload 内置） |
| 样式 | Tailwind CSS 4 + shadcn/ui |
| 包管理 | pnpm |
| 运行时 | Node 22 LTS |

### 明确不使用

Prisma、Hono、自研 Admin RPC、NextAuth 独立层、MySQL。

---

## 3. 系统架构

```
┌──────────────────────────────────────────────────────────────┐
│                        Browser                                │
├─────────────────────────────┬────────────────────────────────┤
│  (frontend) 前台 SSR/RSC     │  /admin  Payload Admin Panel    │
└──────────────┬──────────────┴──────────────┬─────────────────┘
               │                             │
               ▼                             ▼
┌──────────────────────────────────────────────────────────────┐
│              Next.js 单仓（Payload 嵌入）                      │
│  payload.config.ts │ collections/ │ plugins/ │ globals/       │
└──────────────────────────────┬───────────────────────────────┘
                               │
         ┌─────────────────────┼─────────────────────┐
         ▼                     ▼                     ▼
   SQLite (dev) / PG (prod)  Media (local/S3)     POST /api/mcp
```

数据流：

- **前台 RSC** → Payload Local API（`getPayload()`）直读，无额外 HTTP
- **Admin** → Payload 内置 UI
- **AI Agent** → MCP Plugin → `/api/mcp` + User API Key
- **外部集成** → Payload REST `/api/*`

---

## 4. 官方插件策略

### 4.1 已启用（MVP）

| 插件 | 用途 |
|------|------|
| `@payloadcms/plugin-seo` | 文章/单页 SEO meta |
| `@payloadcms/plugin-search` | 全文搜索 |
| `@payloadcms/plugin-redirects` | URL 重定向 |
| `@payloadcms/plugin-nested-docs` | 分类树 |
| `@payloadcms/plugin-form-builder` | 联系表单 |
| `@payloadcms/plugin-mcp` | AI Agent 读写 |

### 4.2 Phase 2 按需

| 插件 | 用途 |
|------|------|
| `@payloadcms/plugin-import-export` | 内容导入导出 |
| `@payloadcms/plugin-sentry` | 生产监控 |
| `@payloadcms/storage-s3` | 生产媒体存储 |
| `@payloadcms/plugin-multi-tenant` | 多站点 SaaS |

### 4.3 不自研替代

| 能力 | 方案 |
|------|------|
| 文档版本 / diff | Payload `versions` |
| 草稿 / 定时发布 | Payload `drafts` + Jobs Queue |
| 操作审计 | versions + Phase 2 audit 插件 |
| Meilisearch | Search Plugin（内置 PG 索引） |

---

## 5. 内容模型

### 5.1 Collections（MVP）

| Slug | 说明 | 来源 |
|------|------|------|
| `posts` | 文章，Lexical + 分类/标签 | 模板 + 扩展 tags |
| `pages` | 单页，Layout Builder | 模板 |
| `media` | 媒体库 | 模板 |
| `categories` | 分类树 | 模板 + Nested Docs |
| `tags` | 标签 | **新增** |
| `users` | 用户 + roles + API Key | 模板 + 扩展 |

插件自动生成：`redirects`、`search`、`forms`、`form-submissions`、`payload-mcp-api-keys`

### 5.2 Globals（MVP）

| Slug | 说明 |
|------|------|
| `header` | 主导航 |
| `footer` | 页脚 |
| `site-settings` | 站点名、Logo、社交、RSS 开关 |

### 5.3 Phase 2 扩展

| Slug | 说明 |
|------|------|
| `links` | 友情链接 |
| `ad-slots` / `ads` | 广告位 |
| `jobs` | 招聘 |

---

## 6. 权限模型

### 6.1 角色

| 角色 | 权限 |
|------|------|
| `super-admin` | 全部 + 用户管理 |
| `editor` | 内容 CRUD、发布、globals |
| `author` | 创建/编辑自己的 posts（draft） |

实现：`src/access/roles.ts` + `users.roles` 字段（`saveToJWT: true`）

### 6.2 Access 层级

- Collection 级：create / read / update / delete / admin
- 公开读：`authenticatedOrPublished`（仅 `_status: published`）
- Admin 菜单：无权限的 collection 自动隐藏

---

## 7. AI / MCP 集成

### 7.1 配置

`src/plugins/index.ts` 中 `mcpPlugin` 已启用 posts/pages/categories/tags/media 的 CRUD（media 禁 delete，users 只读 find）。

### 7.2 Agent 工作流

1. Admin 创建 `agent` 用户，角色 `editor`
2. 为用户生成 API Key（Users → API Key）
3. MCP 客户端连接 `http://localhost:3333/api/mcp`
4. Header: `Authorization: users API-Key <key>`

### 7.3 安全

- 生产必须带 API Key
- `users` collection MCP 仅 find
- `media` MCP 禁 delete
- 细粒度开关：Admin → MCP API Keys

---

## 8. 前台设计

### 8.1 路由（模板已有 + 待扩展）

| 路由 | 状态 |
|------|------|
| `/` | ✅ 模板 |
| `/posts`, `/posts/[slug]` | ✅ 模板 |
| `/[slug]` | ✅ Pages |
| `/search` | ✅ Search Plugin |
| `/category/[slug]` | 🔲 Phase 1 |
| `/tag/[slug]` | 🔲 Phase 1 |
| `/archive` | 🔲 Phase 1 |
| `/rss.xml` | 🔲 Phase 1 |

### 8.2 数据读取

```typescript
const payload = await getPayload({ config })
const { docs } = await payload.find({
  collection: 'posts',
  where: { _status: { equals: 'published' } },
  sort: '-publishedAt',
})
```

### 8.3 缓存

模板已配置 on-demand revalidation（`afterChange` hooks）。`site-settings` global 变更会 revalidate layout。

---

## 9. 目录结构

```
crispy/
├── docs/
│   ├── crispy-v3-architecture.md    # 本文档
│   └── implementation-roadmap.md    # 任务清单
├── src/
│   ├── app/
│   │   ├── (frontend)/              # 前台
│   │   └── (payload)/               # Admin + API
│   ├── collections/
│   │   ├── Posts/
│   │   ├── Pages/
│   │   ├── Categories.ts
│   │   ├── Tags.ts                  # 新增
│   │   ├── Media.ts
│   │   └── Users/
│   ├── globals/ → Header/, Footer/, SiteSettings/
│   ├── access/
│   │   ├── roles.ts                 # 新增
│   │   └── ...
│   ├── plugins/index.ts             # SEO/Search/MCP/...
│   └── payload.config.ts
├── docker-compose.yml               # PostgreSQL（可选，本地 PG 调试 / 生产）
└── package.json
```

---

## 10. 基础设施

### 10.1 本地开发（SQLite，默认）

```bash
cp .env.example .env    # DATABASE_URL=file:./.data/payload.db
pnpm install
pnpm dev                # http://localhost:3333
```

无需 Docker。SQLite 文件位于 `.data/payload.db`，schema 由 Drizzle `push` 自动同步。

### 10.2 生产部署（PostgreSQL）

```bash
DATABASE_URL=postgresql://user:pass@host:5432/crispy
NODE_ENV=production
pnpm payload migrate    # 生产必须跑迁移
pnpm build && pnpm start
```

驱动选择逻辑见 `src/database/adapter.ts`：根据 `DATABASE_URL` 前缀（`file:` → SQLite，`postgresql://` → PG）或 `DATABASE_DRIVER` 环境变量自动切换。

### 10.3 可选：本地 PostgreSQL 调试

```bash
pnpm docker:up
# .env 改为 DATABASE_URL=postgresql://crispy:crispy@localhost:5432/crispy
pnpm dev
```

### 10.4 环境变量

见 `.env.example`：`DATABASE_URL`、`DATABASE_DRIVER`（可选）、`PAYLOAD_SECRET`、`NEXT_PUBLIC_SERVER_URL`、`CRON_SECRET`、`PREVIEW_SECRET`

### 10.5 生产部署检查清单

1. `pnpm build`
2. `pnpm payload migrate`（Postgres 必须跑迁移）
3. `pnpm start`
4. 配置 S3 storage + Sentry（可选）

---

## 11. 实施路线图

详见 [implementation-roadmap.md](./implementation-roadmap.md)。

| Phase | 周期 | 目标 |
|----------|------|------|
| Phase 0 | 第 1 周 | 脚手架、文档、MVP 扩展 ✅ |
| Phase 1 | 第 2–3 周 | 前台路由、中文化、Agent 用户 |
| Phase 2 | 第 4–5 周 | links/ads/jobs、audit、S3 |
| Phase 3 | 第 6 周 | 生产 CI/CD、部署文档 |

---

## 12. 与 Crispy 2.x 对照

| 2.x 功能 | 3.0 方案 |
|----------|----------|
| Article / Page | posts / pages |
| Category 树 | categories + nested-docs |
| Tag | tags collection |
| Config 表 | site-settings global |
| Menu | header global |
| 自研 Admin | Payload Admin |
| Hono Content API | Payload REST / Local API |
| Access Token | User API Key + MCP |
| OperateLog | versions + audit 插件 |
| ApiLog | Phase 2 middleware |
| RBAC Rule 树 | users.roles + access |
| Meilisearch | search plugin |
| Vditor Markdown | Lexical richText（或 Phase 2 markdown 字段） |

---

## 参考链接

- [Payload Docs](https://payloadcms.com/docs)
- [Website Template](https://github.com/payloadcms/payload/tree/main/templates/website)
- [MCP Plugin](https://payloadcms.com/docs/plugins/mcp)
- [Access Control](https://payloadcms.com/docs/access-control/overview)
