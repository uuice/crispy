# Crispy 3.0

基于 **Payload CMS 3** 的个人博客 / 内容站。文章与页面为主，叠加 REST、Admin、后台 AI Agent 与 MCP（GraphQL 已关闭）。不再定位为「通用多业态 CMS」。

## 快速开始

```bash
cp .env.example .env          # 设置 PAYLOAD_SECRET（openssl rand -hex 32）
pnpm install
pnpm cli dev:dev              # http://localhost:3333
```

本地默认 **SQLite**（`.data/payload.db`），首次启动自动建表。

生产环境使用 **PostgreSQL**，`DATABASE_PUSH=false`，部署前执行 `pnpm cli db:migrate`。完整说明见 **[二次开发文档](docs/dev-docs.md)**。

低内存备用站可用 **SQLite standalone**（约 1G 机可行）：`pnpm cli dev:pack-sqlite-spare` 默认只打应用，不覆盖服务器上的 `.data/payload.db`；首次部署再 `-- --with-db`。

## Payload 能力（博客相关）

Crispy 不 fork Payload，核心能力来自官方栈与插件：

| 能力 | 说明 |
| ---- | ---- |
| **REST API** | `GET/POST/PATCH/DELETE /api/{collection}`，按 Collection `access` 鉴权 |
| **Admin** | Lexical 富文本、Live Preview、草稿 / 定时发布、版本历史、媒体文件夹 |
| **SEO 插件** | posts / pages 的 meta title / description / image |
| **Search 插件** | posts、pages、galleries 站内搜索索引 |
| **Redirects 插件** | Admin 配置 URL 重定向（middleware 实时生效） |
| **Nested Docs** | categories 嵌套分类与面包屑 URL |
| **Form Builder** | 可选：联系表单等（`POST /api/form-submissions`） |
| **Import/Export** | Admin 批量导入导出 |
| **MCP 插件** | `POST /api/mcp`，外部 Agent 读写内容 |
| **S3 Storage** | 媒体对象存储（可选） |
| **Jobs** | Payload 任务队列：定时发布、导入导出等 |

**内容模型（博客向）**：posts（Lexical + 分类/标签）、pages、media、categories、tags、comments；可选 galleries、短链、友链等。插件表：redirects、forms、search、exports 等。

**RBAC**：Permission 枚举 + 后台 Roles + `authz-cache`；系统三角色 `super-admin` / `editor` / `author`。详情：[dev-docs — 权限](docs/dev-docs.md#permissions)。

## API 一览

### Payload 标准 API

| 端点 | 方法 | 鉴权 | 说明 |
| ---- | ---- | ---- | ---- |
| `/api/{collection}` | REST | JWT / API Key / 公开 read | 标准 CRUD + count |
| `/api/globals/{slug}` | REST | 按 Global access | header、footer、site-settings 等 |
| `/api/form-submissions` | POST | 匿名（插件默认） | 前台表单提交 |
| `/api/mcp` | POST | Bearer MCP Key 或 `users API-Key` | JSON-RPC，见 [MCP 章节](#mcp) |

### Crispy 扩展 API

| 端点 | 方法 | 鉴权 | 说明 |
| ---- | ---- | ---- | ---- |
| `/api/ai/agent` | POST | Admin | 后台对话助手 SSE（Function Calling CRUD） |
| `/api/ai/agent/sessions` | GET/DELETE | Admin | 助手会话列表 / 删除 |
| `/api/ai/assistant` | GET/POST | **公开** | 前台只读检索助手（SSE） |
| `/search-index.json` | GET | 公开 | 前台搜索索引（posts/pages/galleries） |
| `/api/internal/redirects` | GET | 内部 | middleware 拉取重定向映射（60s 缓存） |
| `/api/internal/route-cache-*` | POST | 内部 | 前台 HTML 缓存读写 |

对接说明见 [dev-docs](docs/dev-docs.md)（REST / MCP / AI）；已不再提供 Swagger / OpenAPI Spec。

## Crispy 新增能力

在 Payload 原生能力之上的产品层扩展：

| 能力 | 说明 |
| ---- | ---- |
| **软删除** | 业务 Collection 回收站（`enableTrashAndVersionsPlugin`）；版本历史仅 posts/pages 草稿流 |
| **URL 重定向（实时）** | Redirects 插件 + middleware，约 60 秒内生效，无需重建 |
| **表单邮件** | Admin「邮件通道 / 邮件设置」（改 Active 后需重启）；未配置时仅入库不发信 |
| **Import/Export 扩展** | 含 galleries、gallery-items、short-links、redirects、forms 等 |
| **MCP 范围对齐** | 与后台 AI Agent 管理范围一致（redirects、forms、galleries 等） |
| **前台** | Layout / 页面 / 样式在 `src/frontend/` |
| **后台 AI 助手** | `/admin/ai-agent` — CRUD、语义搜索、缓存 |
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
| MCP | http://localhost:3333/api/mcp |
| 后台 AI | http://localhost:3333/admin/ai-agent |
| 二次开发文档 | [docs/dev-docs.md](docs/dev-docs.md) |

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
| `pnpm cli db:create <name>` | 新建迁移（需 Postgres；Node 20/22/24 均可） |
| `pnpm cli generate:types` | 生成 `payload-types.ts` |
| `pnpm cli quality:ci` | lint + tsc + test + build |
| `pnpm cli util:repair-authz` | 重建系统角色 / authz-cache |
| `pnpm cli util:sync-oss-sizes` | 回填 Media OSS 虚拟尺寸 |
| `pnpm cli util:test-oss` | 探测 Active OSS 连通性 |

## MCP

外部 Agent（Cursor 等）通过 JSON-RPC 读写 CMS：

```bash
# 端点
POST http://localhost:3333/api/mcp

# 鉴权（二选一）
Authorization: Bearer <mcp-api-key>
Authorization: users API-Key <user-api-key>
```

1. Admin 创建用户并分配角色（如 editor）
2. Admin → MCP → API Keys 生成 Key

MCP 可访问 posts、pages、categories、tags、links、galleries、gallery-items、redirects、forms、media 等（与后台 AI Agent 对齐）。详见 [dev-docs — MCP](docs/dev-docs.md#mcp)。

## 角色与权限（RBAC）

权限枚举在 `src/access/permissions.ts`；后台 **系统 → 角色** 勾选；用户挂角色后写入 `authz-cache`，`can()` 即时生效（无需重登）。

| 系统角色 | 说明 |
| ---- | ---- |
| `super-admin` | 全部 Permission（用户/角色/密钥 Catalog/日志等） |
| `editor` | 内容与运营、发布、站点设置、缓存/统计；无用户与密钥写 |
| `author` | 自己的文章（草稿）、媒体上传、AI；不可发布 |

自定义角色：Admin 新建角色并勾选权限即可。完整矩阵与 API 鉴权见 [dev-docs — 权限](docs/dev-docs.md#permissions)。

## 分支与 2.x

Crispy 3.0 为面向个人博客的 greenfield 重写，不继承 2.x 代码。2.x 已归档至 `crispy-2x` 分支与 `v2-last` 标签。

| 分支 | 用途 |
| ---- | ---- |
| `main` | 稳定版，生产部署 |
| `v3-payload` | 日常开发、测试与 bug 修复 |
| `crispy-2x` | 2.x 归档（只读） |

## License

MIT
