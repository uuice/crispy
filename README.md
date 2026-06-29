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

详见 [部署与迁移](docs/deployment.md)。

可选：本地调试 PostgreSQL 时使用 `pnpm docker:up` 并改 `DATABASE_URL`。

## 访问地址

| 入口       | URL                               |
| ---------- | --------------------------------- |
| 前台首页   | http://localhost:3333             |
| 后台 Admin | http://localhost:3333/admin       |
| REST API   | http://localhost:3333/api         |
| MCP 端点   | http://localhost:3333/api/mcp     |
| GraphQL    | http://localhost:3333/api/graphql |

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

- [架构设计](docs/crispy-v3-architecture.md)
- [实施路线图](docs/implementation-roadmap.md)
- [Admin AI 助手指南](docs/ai-admin-guide.md)
- [MCP 连接指南](docs/mcp-guide.md)
- [Admin 验证清单](docs/admin-verification.md)
- [部署与迁移](docs/deployment.md)

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

## AI / MCP

**Admin AI 助手**（DeepSeek，后台润色/SEO/智能填充）：见 [docs/ai-admin-guide.md](docs/ai-admin-guide.md)。

**MCP**（外部 Agent 读写内容）：

1. Admin 创建用户并分配 `editor` 或 `super-admin` 角色
2. 为用户生成 API Key（Users 详情 → API Key）
3. MCP 客户端连接 `http://localhost:3333/api/mcp`
4. 鉴权：`Authorization: users API-Key <your-key>`

详见 [架构文档 — AI / MCP 集成](docs/crispy-v3-architecture.md#7-ai--mcp-集成) 与 [MCP 指南](docs/mcp-guide.md)。

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
