# Crispy 3.0

基于 **Payload CMS 3** 的通用内容管理系统。在 Payload 原生 REST / GraphQL / Admin / 插件体系之上，叠加 Crispy 产品层 API 与运营能力。

## 快速开始

```bash
cp .env.example .env          # 设置 PAYLOAD_SECRET（openssl rand -hex 32）
pnpm install
pnpm cli dev:dev              # http://localhost:3333
```

本地默认 **SQLite**（`.data/payload.db`），首次启动自动建表。

生产环境使用 **PostgreSQL**，`DATABASE_PUSH=false`，部署前执行 `pnpm cli db:migrate`。完整说明见 Admin **[二次开发文档](http://localhost:3333/admin/dev-docs)**。

## Payload 原生能力

Crispy 不 fork Payload，核心能力均来自官方栈与插件：

| 能力 | 说明 |
| ---- | ---- |
| **REST API** | `GET/POST/PATCH/DELETE /api/{collection}`，按 Collection `access` 鉴权 |
| **GraphQL** | `POST /api/graphql`；Playground：`/api/graphql-playground`（需 Admin 登录） |
| **Admin** | Lexical 富文本、Live Preview、草稿 / 定时发布、版本历史、媒体文件夹 |
| **SEO 插件** | posts / pages 的 meta title / description / image |
| **Search 插件** | posts、pages、jobs、gallery-items 站内搜索索引 |
| **Redirects 插件** | Admin 配置 URL 重定向（Crispy 接入 middleware 实时生效） |
| **Nested Docs** | categories 嵌套分类与面包屑 URL |
| **Form Builder** | 表单定义 + `POST /api/form-submissions` 提交（可配邮件通知） |
| **Import/Export** | Admin 批量导入导出多 Collection |
| **MCP 插件** | `POST /api/mcp` JSON-RPC，外部 Agent 读写内容 |
| **S3 Storage** | 配置 `S3_*` 后 media 存对象存储 |
| **Jobs** | 定时发布（`schedulePublish`）、导入导出任务等 |

**内容模型（节选）**：pages（Hero + Blocks）、posts（Lexical + 分类/标签）、media、categories、tags、jobs、gallery-items、comments、users（RBAC）等。插件自动创建 redirects、forms、search、exports 等表。

**RBAC 三角色**：`super-admin` / `editor` / `author`（见文末角色表）。

## API 一览

### Payload 标准 API

| 端点 | 方法 | 鉴权 | 说明 |
| ---- | ---- | ---- | ---- |
| `/api/{collection}` | REST | JWT / API Key / 公开 read | 标准 CRUD + count |
| `/api/globals/{slug}` | REST | 按 Global access | header、footer、site-settings 等 |
| `/api/graphql` | POST | 按 Collection access | GraphQL 查询与变更 |
| `/api/form-submissions` | POST | 匿名（插件默认） | 前台表单提交 |
| `/api/mcp` | POST | Bearer MCP Key 或 `users API-Key` | JSON-RPC，见 [MCP 章节](#mcp) |

### Crispy 扩展 API

| 端点 | 方法 | 鉴权 | 说明 |
| ---- | ---- | ---- | ---- |
| `/api/openapi.json` | GET | Admin 登录 | OpenAPI 3.0 文档（动态生成） |
| `/admin/api-docs` | GET | Admin 登录 | Swagger UI |
| `/api/ai/stream` | POST | Admin | 字段 AI 流式输出 |
| `/api/ai/complete` | POST | Admin | 字段 AI 一次性补全 |
| `/api/ai/structured` | POST | Admin | 字段 AI 结构化 JSON |
| `/api/ai/agent` | POST | Admin | 后台对话助手 SSE（Function Calling CRUD） |
| `/api/ai/agent/sessions` | GET/DELETE | Admin | 助手会话列表 / 删除 |
| `/api/ai/assistant` | GET/POST | **公开** | 前台只读检索助手（SSE） |
| `/search-index.json` | GET | 公开 | 前台主题搜索索引（posts/pages/jobs/gallery） |
| `/api/internal/redirects` | GET | 内部 | middleware 拉取重定向映射（60s 缓存） |
| `/api/internal/route-cache-*` | POST | 内部 | 前台 HTML 缓存读写 |
| `/api/internal/access-log` | POST | Secret | API 访问日志写入 |

OpenAPI 覆盖全部 Collection、Globals、插件表及上述 AI 路由。详见 `/admin/dev-docs#openapi`。

## Crispy 新增能力

在 Payload 原生能力之上的产品层扩展：

| 能力 | 说明 |
| ---- | ---- |
| **软删除 + 版本历史** | 全业务 Collection 回收站与版本面板（`enableTrashAndVersionsPlugin`） |
| **URL 重定向（实时）** | Redirects 插件 + middleware，约 60 秒内生效，无需重建 |
| **表单邮件** | Resend 或 SMTP（`RESEND_API_KEY` / `SMTP_*`），未配置时仅入库不发信 |
| **Import/Export 扩展** | 含 gallery-items、short-links、redirects、forms、novels 等 |
| **MCP 范围对齐** | 与后台 AI Agent 管理范围一致（novels、redirects、forms 等） |
| **前台可插拔主题** | blog / cms / kb，`site-settings` 或 `?theme_preview=` 切换 |
| **字段 AI** | 润色、SEO、智能填充（DeepSeek / OpenAI 兼容） |
| **后台 AI 助手** | `/admin/ai-agent` — CRUD、语义搜索、缓存、Unsplash 导入 |
| **前台 AI 助手** | 公开只读检索，无需登录 |
| **审计日志** | 写操作记录至 `audit-logs` |
| **前台 DB 缓存** | HTML 路由缓存，`/admin/cache` 手动清除 |
| **语义搜索** | Postgres + pgvector + embedding API（posts/pages） |

**Pages 布局 Blocks**：CTA、Content、MediaBlock、Archive、FormBlock、RelatedPosts、Faq。

## 访问地址

| 入口 | URL |
| ---- | --- |
| 前台 | http://localhost:3333 |
| Admin | http://localhost:3333/admin |
| REST | http://localhost:3333/api |
| GraphQL | http://localhost:3333/api/graphql |
| MCP | http://localhost:3333/api/mcp |
| Swagger | http://localhost:3333/admin/api-docs |
| 后台 AI | http://localhost:3333/admin/ai-agent |
| 二次开发文档 | http://localhost:3333/admin/dev-docs |

## 技术栈

| 层 | 技术 |
| -- | ---- |
| CMS | Payload 3.85 |
| 框架 | Next.js 16 App Router |
| 数据库 | SQLite（本地）/ PostgreSQL（生产） |
| 编辑器 | Lexical |
| UI | Tailwind 4 + Payload Admin UI |

## 常用命令

`pnpm cli help` 查看全部命令。

| 命令 | 说明 |
| ---- | ---- |
| `pnpm cli dev:dev` | 开发服务器（3333） |
| `pnpm cli dev:build` | 生产构建 |
| `pnpm cli db:migrate` | Postgres 迁移（生产必跑） |
| `pnpm cli db:create <name>` | 新建迁移（需 Node 22 + Postgres） |
| `pnpm cli generate:types` | 生成 `payload-types.ts` |
| `pnpm cli verify:all` | 冒烟验证 |
| `pnpm cli quality:ci` | lint + tsc + test + build |

## MCP

外部 Agent（Cursor 等）通过 JSON-RPC 读写 CMS：

```bash
# 端点
POST http://localhost:3333/api/mcp

# 鉴权（二选一）
Authorization: Bearer <mcp-api-key>
Authorization: users API-Key <user-api-key>
```

1. `pnpm cli db:seed` 或 Admin 创建 editor 用户
2. Admin → MCP → API Keys 生成 Key
3. 验证：`MCP_API_KEY=xxx pnpm cli verify:phase1`

MCP 可访问 posts、pages、categories、tags、links、jobs、gallery-items、novels、redirects、forms、media 等（与后台 AI Agent 对齐）。详见 [dev-docs — MCP](http://localhost:3333/admin/dev-docs#mcp)。

## 角色说明

| 角色 | 权限 |
| ---- | ---- |
| `super-admin` | 全部权限 + 用户管理 |
| `editor` | 内容 CRUD、发布、运营模块、站点/导航 Globals |
| `author` | 自己的 posts（草稿）；上传媒体；不可改 pages、分类、Globals |

## 与 2.x 的关系

Crispy 3.0 在 `v3-payload` 分支 greenfield 重写，不继承 2.x 代码。

## License

MIT
