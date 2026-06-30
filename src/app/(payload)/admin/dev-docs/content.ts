export type DocBlock =
  | { type: 'p'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'pre'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'table'; headers: string[]; rows: string[][] }

export type DocSection = {
  id: string
  title: string
  blocks: DocBlock[]
}

export const DEV_DOC_SECTIONS: DocSection[] = [
  {
    id: 'overview',
    title: '概述',
    blocks: [
      {
        type: 'p',
        text: 'Crispy 3.0 是基于 Payload CMS 3 的通用内容管理系统，单仓 Next.js App Router，本地 SQLite 开发、生产 PostgreSQL + 显式迁移。分支 v3-payload 为 greenfield 重写，与 2.x 无代码继承。',
      },
      {
        type: 'table',
        headers: ['入口', 'URL'],
        rows: [
          ['前台', 'http://localhost:3333'],
          ['Admin', 'http://localhost:3333/admin'],
          ['REST API', 'http://localhost:3333/api'],
          ['GraphQL API', 'POST /api/graphql（按 Collection access）'],
          ['GraphQL Playground', '/api/graphql-playground（需 Admin 登录）'],
          ['MCP', 'http://localhost:3333/api/mcp'],
          ['AI 流式', 'POST /api/ai/stream（需 Admin 登录）'],
          ['AI 文档', '/admin/dev-docs#openai-api'],
          ['Swagger API', '/admin/api-docs（需 Admin 登录）'],
          ['OpenAPI JSON', 'GET /api/openapi.json（需 Admin 登录）'],
        ],
      },
    ],
  },
  {
    id: 'stack',
    title: '技术栈',
    blocks: [
      {
        type: 'table',
        headers: ['层级', '选型'],
        rows: [
          ['框架', 'Next.js 16 App Router'],
          ['CMS', 'Payload 3.85+'],
          ['语言', 'TypeScript 5.7+'],
          ['本地数据库', 'SQLite（.data/payload.db）'],
          ['生产数据库', 'PostgreSQL 16 + Drizzle 迁移'],
          ['编辑器', 'Lexical（Payload 内置）'],
          ['样式', 'Tailwind 4 + Payload Admin UI'],
          ['包管理', 'pnpm'],
          ['运行时', 'Node 22 LTS（migrate:create 需 Node 22）'],
          ['LLM', 'DeepSeek（OpenAI 兼容 Chat Completions API）'],
        ],
      },
      {
        type: 'h3',
        text: '官方插件（已启用）',
      },
      {
        type: 'ul',
        items: [
          'SEO、Search、Redirects、Nested Docs、Form Builder',
          'MCP — 外部 AI Agent 读写内容',
          'Import/Export — 批量导入导出',
          'S3 Storage — 生产媒体（配置 S3_* 后启用）',
          'Audit Log — 自建 audit-logs collection',
        ],
      },
      {
        type: 'h3',
        text: '明确不使用',
      },
      {
        type: 'p',
        text: 'Prisma、Hono、自研 Admin RPC、NextAuth 独立层、MySQL。',
      },
    ],
  },
  {
    id: 'structure',
    title: '目录结构',
    blocks: [
      {
        type: 'pre',
        text: `crispy/
├── src/
│   ├── app/
│   │   ├── (frontend)/          # 前台 SSR/RSC
│   │   └── (payload)/             # Admin + API + 二次开发文档
│   │       ├── admin/[[...segments]]/
│   │       ├── admin/dev-docs/    # 本文档页面
│   │       └── api/               # Payload REST + AI 路由
│   ├── collections/             # Posts, Pages, Media, Tags…
│   ├── Header/ Footer/ SiteSettings/ AiSettings/  # Globals
│   ├── access/                  # RBAC helpers
│   ├── ai/                      # DeepSeek provider、模板、权限
│   ├── components/AdminAi/      # AI 弹框、Lexical Feature
│   ├── fields/ai/               # withAiTextField 等
│   ├── plugins/                 # 插件聚合
│   ├── database/adapter.ts      # SQLite / Postgres 双驱动
│   ├── migrations/              # Postgres 迁移（生产）
│   └── payload.config.ts
├── scripts/                     # seed、verify、migrate bootstrap
├── .github/workflows/ci.yml
└── Dockerfile`,
      },
    ],
  },
  {
    id: 'config',
    title: '环境变量与配置',
    blocks: [
      {
        type: 'h3',
        text: '核心变量（见 .env.example）',
      },
      {
        type: 'table',
        headers: ['变量', '说明'],
        rows: [
          ['DATABASE_URL', 'file:./.data/payload.db（本地）或 postgresql://…（生产）'],
          ['DATABASE_DRIVER', 'sqlite | postgres（可省略，按 URL 推断）'],
          ['DATABASE_PUSH', '生产设为 false，禁止 schema push'],
          ['PAYLOAD_SECRET', 'JWT 加密（openssl rand -hex 32）'],
          ['NEXT_PUBLIC_SERVER_URL', '站点公网 URL，默认 http://localhost:3333'],
          ['PREVIEW_SECRET', '草稿 / Live Preview 鉴权'],
          ['CRON_SECRET', '定时发布 Jobs 鉴权'],
          ['MCP_API_KEY', '本地 verify 用，来自 seed 或 Admin MCP Keys'],
          ['DEEPSEEK_API_KEY', 'Admin AI 助手（OpenAI 兼容）'],
          ['DEEPSEEK_BASE_URL', '默认 https://api.deepseek.com（勿带 /v1 后缀）'],
          ['DEEPSEEK_MODEL', '默认 deepseek-chat'],
          ['S3_*', '生产媒体存储（bucket、密钥、region 等）'],
          ['API_ACCESS_LOG_ENABLED', 'API 访问日志 middleware'],
        ],
      },
      {
        type: 'h3',
        text: 'Payload 配置入口',
      },
      {
        type: 'ul',
        items: [
          'src/payload.config.ts — collections、globals、plugins、admin 定制',
          'src/database/adapter.ts — 双驱动与 migrationDir、push 策略',
          'src/plugins/index.ts — SEO/MCP/Search/Import 等插件开关',
          'Admin → AI 设置 Global — 模型参数与 Prompt 模板覆盖',
        ],
      },
    ],
  },
  {
    id: 'commands',
    title: '常用命令',
    blocks: [
      {
        type: 'table',
        headers: ['命令', '说明'],
        rows: [
          ['pnpm dev', '开发服务器（端口 3333，SQLite）'],
          ['pnpm build / pnpm start', '生产构建与启动'],
          ['pnpm docker:up / docker:down', '本地 PostgreSQL（可选）'],
          ['pnpm migrate', '执行 Postgres 迁移（生产必跑）'],
          ['pnpm migrate:status', '迁移状态'],
          ['pnpm migrate:create:initial', '首次迁移（Docker + Node 22）'],
          ['pnpm ci:check', '本地 CI：lint + tsc + test + build'],
          ['pnpm seed', 'CLI 填充示例数据'],
          ['pnpm mcp:key', '重新生成 MCP API Key'],
          ['pnpm verify:phase1', 'MCP + Preview + RSS 冒烟'],
          ['pnpm verify:phase2', '图库/招聘/中文前台/access-log'],
          ['pnpm verify:ai', 'DeepSeek 连通与流式'],
          ['pnpm generate:types', '更新 payload-types.ts'],
          ['pnpm generate:importmap', 'Admin 自定义组件 import map'],
          ['pnpm payload migrate:create <name>', 'Schema 变更后新建迁移'],
        ],
      },
    ],
  },
  {
    id: 'collections',
    title: 'Collection 列表与字段',
    blocks: [
      {
        type: 'p',
        text: '以下为业务 Collection 与主要字段摘要；插件还会自动生成 redirects、forms、search、exports、imports、payload-mcp-api-keys 等表。',
      },
      {
        type: 'table',
        headers: ['Slug', '说明', '主要字段'],
        rows: [
          ['posts', '文章', 'title, slug, heroImage, content(Lexical+Blocks), categories, tags, authors, meta(SEO), publishedAt, drafts/versions'],
          ['pages', '单页', 'title, slug, hero, layout(Blocks), meta(SEO), publishedAt, drafts'],
          ['media', '媒体库', 'alt, caption(Lexical), filename, mimeType, folder(S3/local)'],
          ['categories', '分类树', 'title, slug, parent(Nested Docs), breadcrumbs'],
          ['tags', '标签', 'title, slug, description'],
          ['users', '用户', 'name, email, roles[], API Key, auth'],
          ['links', '友情链接', 'title, url, logo, description, enabled, order'],
          ['ad-slots', '广告位', 'title, slug, description, enabled'],
          ['ads', '广告', 'title, slot, format, image/html, link, enabled, schedule'],
          ['jobs', '招聘', 'title, slug, department, location, employmentType, salary, description, requirements, enabled'],
          ['gallery-items', '图库', 'title, image, description, enabled, order'],
          ['api-access-logs', 'API 访问日志', 'method, path, status, authType, user, duration'],
          ['audit-logs', '审计日志', 'action, collection, docId, user, summary（只读）'],
        ],
      },
      {
        type: 'h3',
        text: 'Globals',
      },
      {
        type: 'table',
        headers: ['Slug', '说明', '主要字段'],
        rows: [
          ['header', '主导航', 'navItems[]（link 组）'],
          ['footer', '页脚', 'navItems[]'],
          ['site-settings', '站点设置', 'siteName, description, logo, socialLinks[], rssEnabled, theme'],
          ['ai-settings', 'AI 设置', 'enabled, baseUrl, model, temperature, maxTokens, promptTemplates[]'],
        ],
      },
      {
        type: 'h3',
        text: 'Posts 内嵌 Block（Lexical BlocksFeature）',
      },
      {
        type: 'ul',
        items: [
          'Banner — content 富文本 + AI 选区',
          'Code — 代码块 + AiCodeField',
          'Media Block — media 关联 + 可选 Caption AI',
          'Pages layout — CTA, Content, MediaBlock, Archive, FormBlock',
        ],
      },
    ],
  },
  {
    id: 'permissions',
    title: '权限列表（RBAC）',
    blocks: [
      {
        type: 'table',
        headers: ['角色', '权限摘要'],
        rows: [
          ['super-admin', '全部权限 + 用户/角色管理 + AI 设置 Global 更新'],
          ['editor', '内容 CRUD、发布、运营模块、Header/Footer/Site Settings、删除媒体'],
          ['author', '创建/编辑自己的 posts（仅草稿）；上传/编辑媒体；不可删媒体、不可改 pages/categories/tags/globals'],
        ],
      },
      {
        type: 'h3',
        text: 'Collection 级 Access',
      },
      {
        type: 'table',
        headers: ['资源', 'create', 'read', 'update', 'delete'],
        rows: [
          ['posts', 'author+', '已发布公开 / 登录见全部', 'editor 全部；author 仅自己的', 'editor+'],
          ['pages', 'editor+', 'editor 全部；author/访客仅 published', 'editor+', 'editor+'],
          ['categories / tags', 'editor+', '公开读', 'editor+', 'editor+'],
          ['links / ads / ad-slots', 'editor+', '公开仅 enabled；editor 见全部', 'editor+', 'editor+'],
          ['jobs / gallery-items', 'editor+', '公开仅 enabled；editor 见全部', 'editor+', 'editor+'],
          ['media', 'author+', '公开读（前台需 URL）', 'author+', 'editor+'],
          ['users', 'super-admin', 'authenticated', 'authenticated（roles 仅 super-admin 改）', 'super-admin'],
          ['api-access-logs / audit-logs', '—', 'super-admin', '—', '—'],
          ['forms / form-submissions（插件）', 'editor+ / 匿名 create', 'editor+', 'editor+ / —', 'editor+'],
        ],
      },
      {
        type: 'h3',
        text: 'API 路由鉴权',
      },
      {
        type: 'table',
        headers: ['路由', '鉴权', '说明'],
        rows: [
          ['GET /api/openapi.json', 'Admin Cookie', 'Swagger Spec；未登录 401'],
          ['GET /api/graphql-playground', 'Admin Cookie', 'GraphQL Playground；未登录 401'],
          ['POST /api/graphql', '按 Collection access', 'Cookie / users API-Key；权限与 REST 一致'],
          ['POST /api/ai/*', 'Admin Cookie + RBAC', 'super-admin/editor 全量；author 仅自己的 posts'],
          ['POST /api/mcp', 'MCP Bearer / users API-Key', '生产必须配置 MCP API Key'],
          ['POST /api/internal/access-log', 'x-access-log-secret', '仅 middleware 内部调用'],
          ['POST /api/users/login', '无', '获取 payload-token'],
          ['POST /api/form-submissions', '无（插件默认）', '联系表单；建议加 CAPTCHA / 限流'],
          ['GET /api/{collection}', '按 Collection read', '见上表；写操作均需登录 + 角色'],
        ],
      },
      {
        type: 'h3',
        text: 'Globals Access',
      },
      {
        type: 'table',
        headers: ['Global', 'read', 'update'],
        rows: [
          ['header / footer / site-settings', '公开 / 全员', 'editor+'],
          ['ai-settings', 'editor+', 'super-admin'],
        ],
      },
      {
        type: 'p',
        text: '实现位置：src/access/roles.ts、enabledPublicRead.ts、posts.ts、pages.ts、media.ts；OpenAPI / GraphQL Playground 鉴权：src/utilities/requireAdminSession.ts。作者发布限制：restrictAuthorPublish hook 强制 draft。',
      },
    ],
  },
  {
    id: 'ai',
    title: 'Admin AI（DeepSeek / OpenAI 兼容）',
    blocks: [
      {
        type: 'p',
        text: '后台 AI 仅 Admin 内使用，基于 OpenAI Chat Completions 兼容协议（默认 DeepSeek）。完整请求/响应说明见下文「OpenAI 兼容 API 文档」章节。',
      },
      {
        type: 'h3',
        text: 'API 路由',
      },
      {
        type: 'table',
        headers: ['路由', '用途'],
        rows: [
          ['POST /api/ai/stream', 'SSE 流式文本（主入口）'],
          ['POST /api/ai/complete', '非流式文本'],
          ['POST /api/ai/structured', 'JSON 结构化（智能填充）'],
        ],
      },
      {
        type: 'h3',
        text: 'Collection AI 能力',
      },
      {
        type: 'table',
        headers: ['Collection', '标题 AI', '文本/描述 AI', 'Lexical 选区', 'SEO 弹框', '智能填充'],
        rows: [
          ['posts', '✓', '—', '✓ 正文+Block', '✓', '✓ 分类/标签/SEO'],
          ['pages', '✓', '—', '✓ hero', '✓', '✓'],
          ['jobs', '✓', '—', '✓ 描述/要求', '—', '—'],
          ['categories', '✓', '—', '—', '—', '—'],
          ['tags / gallery / links / ad-slots', '✓', '✓ description', '—', '—', '✓ 描述'],
          ['ads', '✓', '✓ alt', '—', '—', '—'],
          ['media', '✓ alt', '—', '✓ caption', '—', '—'],
        ],
      },
      {
        type: 'h3',
        text: 'AI 权限',
      },
      {
        type: 'ul',
        items: [
          'super-admin / editor：所有已启用 Collection',
          'author：仅 posts，且必须是文档 authors 之一',
          '代码：src/ai/、src/components/AdminAi/、src/fields/ai/、src/ai/collectionProfiles.ts',
        ],
      },
      {
        type: 'h3',
        text: '扩展新 Collection AI',
      },
      {
        type: 'ol',
        items: [
          '在 collectionProfiles.ts 增加 profile',
          '字段使用 withAiTextField / withAiRewriteFeatures / aiSeoAssistField 等',
          'pnpm generate:importmap',
        ],
      },
    ],
  },
  {
    id: 'openai-api',
    title: 'OpenAI 兼容 API 文档',
    blocks: [
      {
        type: 'p',
        text: 'Crispy Admin AI 通过 OpenAI Chat Completions 协议调用上游 LLM（默认 DeepSeek，可切换 OpenAI / Azure / 其他兼容网关）。Admin 前端调用 Crispy 自有 /api/ai/* 路由，服务端再转发至上游。',
      },
      {
        type: 'h3',
        text: '架构',
      },
      {
        type: 'pre',
        text: `Admin UI (✨ 弹框)
    │  Cookie 会话鉴权
    ▼
POST /api/ai/stream | /complete | /structured   ← Crispy 内部 API
    │  assertAiAccess + Prompt 模板渲染
    ▼
POST {baseUrl}/v1/chat/completions              ← OpenAI 兼容上游
    Authorization: Bearer {apiKey}`,
      },
      {
        type: 'h3',
        text: '上游 LLM 配置（OpenAI 兼容）',
      },
      {
        type: 'table',
        headers: ['配置项', '环境变量', 'Admin AI 设置', '说明'],
        rows: [
          ['API Key', 'DEEPSEEK_API_KEY', '—（仅 .env）', 'Bearer Token，勿提交 Git'],
          ['Base URL', 'DEEPSEEK_BASE_URL', 'baseUrl 字段', '不含 /v1 后缀，代码自动拼接 /v1/chat/completions'],
          ['Model', 'DEEPSEEK_MODEL', 'model 字段', '如 deepseek-chat、gpt-4o-mini'],
          ['Temperature', '—', 'temperature', '0–2，默认 0.7'],
          ['Max Tokens', '—', 'maxTokens', '默认 2048'],
          ['总开关', '—', 'enabled', '关闭后所有 AI 路由返回 503'],
        ],
      },
      {
        type: 'h3',
        text: '切换至 OpenAI 官方',
      },
      {
        type: 'pre',
        text: `# .env
DEEPSEEK_API_KEY=sk-...your-openai-key...
DEEPSEEK_BASE_URL=https://api.openai.com
DEEPSEEK_MODEL=gpt-4o-mini

# Admin → AI 设置 中 baseUrl / model 会覆盖 .env 默认值
# Azure OpenAI：baseUrl 设为 https://{resource}.openai.azure.com/openai/deployments/{deployment}`,
      },
      {
        type: 'h3',
        text: '上游请求格式（OpenAI Chat Completions）',
      },
      {
        type: 'p',
        text: '实现：src/ai/providers/deepseek.ts、deepseekStream.ts。非流式与流式均 POST 同一端点，流式设 stream: true。',
      },
      {
        type: 'pre',
        text: `POST {baseUrl}/v1/chat/completions
Content-Type: application/json
Authorization: Bearer {apiKey}

{
  "model": "deepseek-chat",
  "messages": [
    { "role": "system", "content": "..." },
    { "role": "user", "content": "..." }
  ],
  "temperature": 0.7,
  "max_tokens": 2048,
  "stream": false,
  "response_format": { "type": "json_object" }   // 仅 structured / suggest_taxonomy
}`,
      },
      {
        type: 'h3',
        text: 'Crispy 内部 API — 鉴权',
      },
      {
        type: 'ul',
        items: [
          '须已登录 Admin（Payload 会话 Cookie，与 /admin 相同）',
          '未登录 → 401 Unauthorized',
          '无 AI 权限 → 403（作者仅限自己的 posts）',
          '未配置 API Key 或 AI 关闭 → 503',
          '前台 / 外部不可匿名调用，无 API Key 对外暴露',
        ],
      },
      {
        type: 'h3',
        text: 'POST /api/ai/complete — 非流式文本',
      },
      {
        type: 'pre',
        text: `# Request
POST /api/ai/complete
Content-Type: application/json
Cookie: payload-token=...

{
  "action": "polish",
  "collection": "posts",
  "docId": "1",
  "fieldPath": "title",
  "input": "这是一段需要润色的标题",
  "context": {
    "title": "文章标题",
    "contentPlain": "正文纯文本摘要…",
    "selection": "选区文本（Lexical 改写时）"
  },
  "customPrompt": "改为英文",        // action=custom 时必填
  "templateId": "polish"             // 可选，覆盖默认模板
}

# Response 200
{
  "text": "润色后的文本",
  "templateId": "polish",
  "usage": { "total_tokens": 128 }
}

# Error
{ "error": "无权使用 AI 功能" }   // 403 / 503 / 500`,
      },
      {
        type: 'h3',
        text: 'POST /api/ai/stream — SSE 流式（主入口）',
      },
      {
        type: 'pre',
        text: `# Request body 与 /complete 相同

# Response: text/event-stream
data: {"text":"你"}
data: {"text":"好"}
data: {"done":true,"templateId":"polish"}

# 错误（仍 200 + SSE）
data: {"error":"AI 未启用：请在 .env 设置 DEEPSEEK_API_KEY"}`,
      },
      {
        type: 'h3',
        text: 'POST /api/ai/structured — JSON 智能填充',
      },
      {
        type: 'pre',
        text: `# Request（当前仅支持 suggest_taxonomy）
POST /api/ai/structured
{
  "action": "suggest_taxonomy",
  "collection": "posts",
  "docId": "1",
  "context": {
    "title": "可选",
    "contentPlain": "正文纯文本，用于生成标题/SEO/分类建议"
  }
}

# Response 200
{
  "data": {
    "title": "建议标题",
    "summary": "摘要",
    "categoryTitles": ["已有分类名"],
    "tagTitles": ["已有标签名"],
    "seoTitle": "...",
    "seoDescription": "..."
  },
  "categories": [ /* Payload 文档 */ ],
  "tags": [ /* Payload 文档 */ ]
}

# 分类/标签只能从已有条目匹配，不会编造新 slug`,
      },
      {
        type: 'h3',
        text: 'action 枚举（AiAction）',
      },
      {
        type: 'table',
        headers: ['action', '用途', '接口'],
        rows: [
          ['polish', '润色', 'stream / complete'],
          ['expand', '扩写', 'stream / complete'],
          ['shorten', '精简', 'stream / complete'],
          ['custom', '自定义指令（需 customPrompt）', 'stream / complete'],
          ['rewrite', 'Lexical 选区改写', 'stream / complete'],
          ['seo_title', '生成 SEO 标题', 'stream / complete'],
          ['seo_description', '生成 SEO 描述', 'stream / complete'],
          ['suggest_taxonomy', '智能填充标题/SEO/分类/标签', 'structured only'],
        ],
      },
      {
        type: 'h3',
        text: 'Prompt 模板变量',
      },
      {
        type: 'table',
        headers: ['变量', '来源'],
        rows: [
          ['{{field}}', 'request.input 当前字段文本'],
          ['{{selection}}', 'context.selection 选区'],
          ['{{instruction}}', 'customPrompt 自定义指令'],
          ['{{context.*}}', 'title、contentPlain、siteName 等 AiContext'],
        ],
      },
      {
        type: 'p',
        text: '默认模板：src/ai/defaultTemplates.ts；可在 Admin → AI 设置 → Prompt 模板 按 id/action 覆盖。',
      },
      {
        type: 'h3',
        text: 'curl 示例（需先登录 Admin 获取 Cookie）',
      },
      {
        type: 'pre',
        text: `# 非流式
curl -s -X POST http://localhost:3333/api/ai/complete \\
  -H "Content-Type: application/json" \\
  -b "payload-token=YOUR_SESSION" \\
  -d '{
    "action": "polish",
    "collection": "posts",
    "docId": "1",
    "fieldPath": "title",
    "input": "测试标题"
  }'

# 流式
curl -N -X POST http://localhost:3333/api/ai/stream \\
  -H "Content-Type: application/json" \\
  -b "payload-token=YOUR_SESSION" \\
  -d '{"action":"polish","collection":"posts","fieldPath":"title","input":"测试"}'`,
      },
      {
        type: 'h3',
        text: '验证与调试',
      },
      {
        type: 'ul',
        items: [
          'pnpm verify:ai — 检测 API Key、流式 /complete /stream 连通',
          '代码入口：src/app/(payload)/api/ai/*/route.ts',
          '类型定义：src/ai/types.ts',
          'OpenAI 官方文档：https://platform.openai.com/docs/api-reference/chat',
        ],
      },
    ],
  },
  {
    id: 'swagger',
    title: 'Swagger / OpenAPI',
    blocks: [
      {
        type: 'p',
        text: 'Crispy 从 Payload 运行时配置自动生成 OpenAPI 3.0 文档，覆盖全部 Collection/Global REST、Auth、AI、MCP、GraphQL 与内部路由。新增 Collection 或插件后无需手写，刷新 Spec 即可同步。**OpenAPI JSON 需 Admin 登录**，与 Swagger UI 一致。',
      },
      {
        type: 'table',
        headers: ['入口', 'URL'],
        rows: [
          ['Swagger UI（Admin）', '/admin/api-docs'],
          ['OpenAPI JSON（动态）', 'GET /api/openapi.json（需 Admin Cookie）'],
          ['静态文件（本地可选）', 'public/openapi.json（pnpm generate:openapi；勿在生产公开托管）'],
        ],
      },
      {
        type: 'h3',
        text: '主题',
      },
      {
        type: 'p',
        text: 'Swagger UI 自动跟随 Admin 主题（html[data-theme]）：右上角切换浅色/深色时，文档区同步更新，使用与后台一致的 --crispy-admin-surface、--theme-text 等变量。',
      },
      {
        type: 'h3',
        text: '自动生成范围',
      },
      {
        type: 'ul',
        items: [
          '每个 Collection：GET/POST /api/{slug}、GET/PATCH/DELETE /api/{slug}/{id}、GET /api/{slug}/count',
          '每个 Global：GET/POST /api/globals/{slug}',
          'Auth：login / logout / me / refresh-token',
          'AI：/api/ai/complete、/stream、/structured（含 request/response schema）',
          'MCP：POST /api/mcp（JSON-RPC）',
          'GraphQL：POST /api/graphql（按 Collection access）',
          'GraphQL Playground：GET /api/graphql-playground（需 Admin 登录）',
          'Internal：POST /api/internal/access-log',
          '插件 Collection 随 getPayload().config.collections 自动纳入',
        ],
      },
      {
        type: 'h3',
        text: '命令与代码',
      },
      {
        type: 'pre',
        text: `pnpm generate:openapi    # 写入 public/openapi.json（本地备份，生产勿公开）
# 实现：src/openapi/buildDocument.ts
# 路由：src/app/(payload)/api/openapi/route.ts（requireAdminSession）`,
      },
      {
        type: 'h3',
        text: '鉴权方案（components.securitySchemes）',
      },
      {
        type: 'table',
        headers: ['Scheme', '用途'],
        rows: [
          ['cookieAuth', 'Admin 会话 payload-token'],
          ['usersApiKey', 'Header: Authorization: users API-Key <key>'],
          ['mcpBearer', 'MCP API Key Bearer'],
          ['accessLogSecret', 'Header: x-access-log-secret'],
        ],
      },
    ],
  },
  {
    id: 'mcp',
    title: 'MCP 连接',
    blocks: [
      {
        type: 'p',
        text: 'Payload @payloadcms/plugin-mcp 提供 JSON-RPC 端点，供 Cursor / Claude 等 Agent 读写 CMS。',
      },
      {
        type: 'pre',
        text: `端点: POST http://localhost:3333/api/mcp
鉴权: Authorization: Bearer <mcp-api-key>
      或 Authorization: users API-Key <user-api-key>`,
      },
      {
        type: 'h3',
        text: '获取 API Key',
      },
      {
        type: 'ul',
        items: [
          'pnpm seed 或 Admin 仪表盘「填充示例数据」→ 终端 MCP_API_KEY',
          'Admin → MCP → API Keys → 关联 editor 用户（如 agent@example.com）',
          'pnpm mcp:key 单独轮换',
        ],
      },
      {
        type: 'h3',
        text: 'MCP Collection 能力（plugins/index.ts 默认）',
      },
      {
        type: 'table',
        headers: ['Collection', 'find', 'create', 'update', 'delete'],
        rows: [
          ['posts / pages / categories / tags / links / jobs / gallery / ad-slots / ads', '✓', '✓', '✓', '✓'],
          ['media', '✓', '✓', '✓', '✗'],
          ['users', 'find only', '—', '—', '—'],
        ],
      },
      {
        type: 'h3',
        text: 'Cursor .cursor/mcp.json 示例',
      },
      {
        type: 'pre',
        text: `{
  "mcpServers": {
    "crispy": {
      "url": "http://localhost:3333/api/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_MCP_API_KEY"
      }
    }
  }
}`,
      },
      {
        type: 'p',
        text: '验证：MCP_API_KEY=xxx pnpm verify:phase1',
      },
    ],
  },
  {
    id: 'deploy',
    title: '部署与迁移',
    blocks: [
      {
        type: 'h3',
        text: '生产最小环境变量',
      },
      {
        type: 'pre',
        text: `DATABASE_DRIVER=postgres
DATABASE_URL=postgresql://user:pass@host:5432/crispy
DATABASE_PUSH=false
PAYLOAD_SECRET=...
NEXT_PUBLIC_SERVER_URL=https://your-domain.com
PREVIEW_SECRET=...
CRON_SECRET=...`,
      },
      {
        type: 'h3',
        text: '部署流程',
      },
      {
        type: 'ol',
        items: [
          'pnpm migrate && pnpm migrate:status',
          'pnpm build && pnpm start（或 Docker standalone，端口 3333）',
          '可选：配置 S3_*、DEEPSEEK_API_KEY',
        ],
      },
      {
        type: 'h3',
        text: 'Postgres push 策略',
      },
      {
        type: 'table',
        headers: ['环境', 'push', '说明'],
        rows: [
          ['生产 NODE_ENV=production', '关闭', '仅 pnpm migrate'],
          ['开发 Postgres', '默认开启', 'DATABASE_PUSH=false 强制迁移'],
          ['SQLite 本地', 'N/A', '自动建表，不用 src/migrations/'],
        ],
      },
      {
        type: 'h3',
        text: 'Docker',
      },
      {
        type: 'pre',
        text: `docker build -t crispy .
docker run -p 3333:3333 \\
  -e DATABASE_URL=postgresql://... \\
  -e PAYLOAD_SECRET=... \\
  -e NEXT_PUBLIC_SERVER_URL=http://localhost:3333 \\
  crispy
# 启动前需在 entrypoint 或 init 容器执行 pnpm migrate`,
      },
      {
        type: 'h3',
        text: '备份',
      },
      {
        type: 'ul',
        items: [
          'PostgreSQL: pg_dump / pg_restore',
          'SQLite: 复制 .data/payload.db',
          '媒体: public/media/ 或 S3 bucket',
        ],
      },
    ],
  },
  {
    id: 'ci',
    title: 'CI 与验证',
    blocks: [
      {
        type: 'p',
        text: 'GitHub Actions .github/workflows/ci.yml：',
      },
      {
        type: 'ul',
        items: [
          'quality — lint → tsc → test:int（SQLite）→ build',
          'postgres-migrations — 检查 src/migrations/*.ts → migrate → test:int',
        ],
      },
      {
        type: 'h3',
        text: 'Admin 验证清单',
      },
      {
        type: 'ul',
        items: [
          '中文化：i18n zh + 自定义 labels',
          'Draft / Live Preview：PREVIEW_SECRET + verify:phase1',
          '深色模式：Admin 主题 + 前台 ThemeSelector',
          'AI：DEEPSEEK_API_KEY + verify:ai',
        ],
      },
    ],
  },
  {
    id: 'extend',
    title: '二次开发指引',
    blocks: [
      {
        type: 'ul',
        items: [
          '新增 Collection：src/collections/ → 注册 payload.config.ts → generate:types',
          'Postgres 生产：migrate:create → commit src/migrations/',
          'Admin 组件：admin.components → generate:importmap',
          '前台路由：src/app/(frontend)/',
          'Revalidation：Collection afterChange hooks（如 revalidatePost）',
          '中文 Slug：chineseSlugField + pinyin-pro hook',
        ],
      },
      {
        type: 'h3',
        text: 'Seed 演示账号',
      },
      {
        type: 'table',
        headers: ['邮箱', '密码', '角色'],
        rows: [
          ['admin@example.com', 'password', 'super-admin'],
          ['editor@example.com', 'password', 'editor'],
          ['author@example.com', 'password', 'author'],
          ['agent@example.com', 'password', 'editor（MCP）'],
        ],
      },
    ],
  },
]
