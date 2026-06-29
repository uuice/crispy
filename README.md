# Crispy 3.0

基于 **Payload CMS 3** 的通用内容管理系统。

## 快速开始

```bash
# 1. 环境变量
cp .env.example .env
# 编辑 .env：设置 PAYLOAD_SECRET（openssl rand -hex 32）

# 2. 依赖
pnpm install

# 3. 开发（默认 SQLite，无需 Docker）
pnpm dev
```

本地默认使用 **SQLite**（`.data/payload.db`），首次启动自动建表。

### 生产环境（PostgreSQL）

部署时设置：

```bash
DATABASE_URL=postgresql://user:password@host:5432/crispy
DATABASE_DRIVER=postgres
DATABASE_PUSH=false         # 生产禁止 schema push
NODE_ENV=production
pnpm migrate                # 生产必须跑迁移
pnpm build && pnpm start
```

详见 Admin 内 **[二次开发文档](http://localhost:3333/admin/dev-docs)**（部署、迁移、权限、AI、MCP 等完整说明）。

可选：本地调试 PostgreSQL 时使用 `pnpm docker:up` 并改 `DATABASE_URL`。

## 访问地址

| 入口       | URL                               |
| ---------- | --------------------------------- |
| 前台首页   | http://localhost:3333             |
| 后台 Admin | http://localhost:3333/admin       |
| REST API   | http://localhost:3333/api         |
| MCP 端点   | http://localhost:3333/api/mcp     |
| GraphQL    | http://localhost:3333/api/graphql |
| Swagger    | http://localhost:3333/admin/api-docs |

首次访问 Admin 会引导创建超级管理员账号。

## 技术栈

| 层             | 技术                         |
| -------------- | ---------------------------- |
| CMS            | Payload 3.85                 |
| 框架           | Next.js 16 App Router        |
| 数据库（本地） | SQLite（`.data/payload.db`） |
| 数据库（生产） | PostgreSQL                   |
| 编辑器         | Lexical                      |
| UI             | Tailwind 4 + shadcn/ui       |

## 官方插件（已启用）

- SEO、Search、Redirects、Nested Docs、Form Builder
- **MCP** — AI Agent 读写内容

## 文档

完整二次开发文档已内置在 Admin：**http://localhost:3333/admin/dev-docs**（侧边栏「二次开发文档」）。

涵盖：技术栈、目录结构、环境变量、命令、Collection 字段、RBAC 权限、Admin AI（DeepSeek）、MCP、部署迁移与 CI。

## 常用命令

| 命令                          | 说明                                  |
| ----------------------------- | ------------------------------------- |
| `pnpm dev`                    | 开发服务器（端口 3333）               |
| `pnpm build`                  | 生产构建                              |
| `pnpm docker:up`              | 启动 PostgreSQL（可选，本地 PG 调试） |
| `pnpm docker:down`            | 停止 PostgreSQL                       |
| `pnpm verify:phase1`          | Phase 1 冒烟验证                      |
| `pnpm verify:phase2`          | Phase 2 冒烟验证                      |
| `pnpm verify:ai`              | Admin AI（DeepSeek）连通与流式验证    |
| `pnpm seed`                   | CLI 填充示例数据                      |
| `pnpm mcp:key`                | 生成 MCP API Key                      |
| `pnpm migrate:create:initial` | 首次 Postgres 迁移（Docker + Node 22） |
| `pnpm migrate`                | 执行数据库迁移（生产）                 |
| `pnpm migrate:status`         | 查看迁移状态                           |
| `pnpm ci:check`               | 本地 CI 检查（lint/tsc/test/build）    |
| `pnpm generate:openapi`       | 生成 OpenAPI JSON（Swagger）           |

## AI / MCP

**Admin AI 助手**（DeepSeek，后台润色/SEO/智能填充）：见 Admin → [二次开发文档](http://localhost:3333/admin/dev-docs) → Admin AI 章节。

**MCP**（外部 Agent 读写内容）：

1. Admin 创建用户并分配 `editor` 或 `super-admin` 角色
2. 为用户生成 API Key（Users 详情 → API Key）
3. MCP 客户端连接 `http://localhost:3333/api/mcp`
4. 鉴权：`Authorization: users API-Key <your-key>`

详见 Admin [二次开发文档 — MCP](http://localhost:3333/admin/dev-docs#mcp) 章节。

## 角色说明

| 角色          | 权限                                                                    |
| ------------- | ----------------------------------------------------------------------- |
| `super-admin` | 全部权限 + 用户管理                                                     |
| `editor`      | 内容 CRUD、发布、站点/导航/运营模块                                     |
| `author`      | 创建/编辑自己的文章（草稿）；上传媒体；不可改单页、分类、导航、删除媒体 |

## 与 2.x 的关系

Crispy 3.0 在 `v3-payload` 分支完全重写，不继承 2.x 代码。2.x（Next.js + Prisma + 自研 Admin）保留在 `nextjs` 等历史分支。

## License

MIT
