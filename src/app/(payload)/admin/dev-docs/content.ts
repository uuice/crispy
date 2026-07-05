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
          ['AI 助手（后台）', '/admin/ai-agent（需 Admin 登录）'],
          ['AI 助手（前台）', '右下角浮窗 + POST /api/ai/assistant（公开只读）'],
          ['前台主题预览', '?theme_preview=blog|cms|kb（editor+ Cookie）'],
          ['AI 文档', '/admin/dev-docs#openai-api'],
          ['Swagger API', '/admin/api-docs（需 Admin 登录）'],
          ['OpenAPI JSON', 'GET /api/openapi.json（需 Admin 登录）'],
          ['前台缓存管理', '/admin/cache（editor+）'],
          ['缓存配置 Global', '/admin/globals/cache-settings（editor+）'],
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
        text: 'Crispy 自建插件（src/plugins/）',
      },
      {
        type: 'ul',
        items: [
          'auditLogPlugin — 写操作审计（audit-logs collection）',
          'enableTrashAndVersionsPlugin — 全业务 Collection 软删除 + 版本历史',
          'enableQueryPresetsPlugin — 列表 Query Presets（保存筛选/排序）',
          'enableListRefreshButtonPlugin — 列表页刷新按钮',
          'localizePluginCollectionsPlugin — 插件 Collection 中文 labels / 分组',
          'localizeFieldLabelsPlugin — 通用字段（folder/slug/url）中文 label',
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
│   │   │   ├── api/ai/assistant # 公开只读 AI 助手 SSE
│   │   │   └── next/exit-theme-preview
│   │   └── (payload)/             # Admin + API + 二次开发文档
│   │       ├── admin/[[...segments]]/
│   │       ├── admin/dev-docs/    # 本文档页面
│   │       └── api/               # Payload REST + Admin AI 路由
│   ├── collections/             # Posts, Pages, Media, Tags…
│   ├── collections/defaults.ts  # trash/versions 默认值、内部 Collection 判定
│   ├── Header/ Footer/ SiteSettings/ AiSettings/ CacheSettings/  # Globals
│   ├── themes/                  # 前台可插拔主题（blog / cms / kb）
│   ├── frontend-cache/          # 前台 DB 缓存（数据 + 路由状态）
│   ├── CacheSettings/           # cache-settings Global 配置
│   ├── access/                  # RBAC helpers
│   ├── ai/                      # LLM provider、Admin Agent、embedding
│   │   ├── agent/               # 后台对话助手（CRUD 工具）
│   │   └── frontend-assistant/  # 前台只读检索助手
│   ├── components/AdminAi/      # 字段 AI 弹框、Lexical Feature
│   ├── components/AdminAiAgent/ # 后台对话式 AI 助手
│   ├── components/FrontendAiAssistant/  # 前台 AI 浮窗
│   ├── components/FrontendThemePreview/ # 站点设置主题卡片
│   ├── fields/ai/               # withAiTextField 等
│   ├── plugins/                 # 官方 + 自建插件聚合
│   ├── utilities/               # trashOrDeleteDocument 等横切工具
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
          ['DEEPSEEK_API_KEY', 'LLM API Key（Admin 字段 AI + 双端对话助手共用）'],
          ['DEEPSEEK_BASE_URL', '默认 https://api.deepseek.com（勿带 /v1 后缀）'],
          ['DEEPSEEK_MODEL', '默认 deepseek-chat'],
          ['FRONTEND_THEME', '可选：blog | cms | kb，覆盖 site-settings.frontendTheme'],
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
        text: '以下为业务 Collection 与主要字段摘要；插件还会自动生成 redirects、forms、search、exports、imports、payload-mcp-api-keys、payload-query-presets 等表。除 posts/pages 保留 drafts 外，其余业务 Collection 由 enableTrashAndVersionsPlugin 统一启用 trash（软删除）与 versions（每文档最多 50 条历史）。',
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
          ['comments', '评论', 'content, status, post/page, parent, author, guestInfo'],
          ['app-configs', '应用配置', 'key, valueType, value（KV 配置，Agent 只读除 super-admin）'],
          ['ai-chat-sessions', 'AI 对话会话', 'title, messages[], user（Agent 侧栏历史）'],
          ['api-access-logs', 'API 访问日志', 'method, path, status, authType, user, duration'],
          ['frontend-cache-entries', '前台缓存条目（系统）', 'cacheKey, kind(route), cachedValue(JSON), routePath, expiresAt'],
          ['audit-logs', '审计日志', 'action, collection, docId, user, summary（只读）'],
        ],
      },
      {
        type: 'h3',
        text: '回收站与版本历史',
      },
      {
        type: 'ul',
        items: [
          'Admin 列表右上角可切换「回收站」视图，恢复或永久删除',
          '文档编辑页可查看版本历史并还原（posts/pages 含 draft 工作流）',
          '软删除时 embedding 同步清理（src/ai/embeddings/syncContentEmbedding.ts）',
          'Postgres 生产：单文件初始迁移 20260701_091350_initial（含 trash/versions、frontend-cache-entries、cache-settings）',
          'payload-* 系统 Collection 不启用 trash/versions',
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
          ['site-settings', '站点设置', 'siteName, description, logo, socialLinks[], enableRss, frontendTheme, adminThemeHue'],
          ['comment-settings', '评论设置', 'enabled, moderation, guestComments, nesting, posts/pages 开关'],
          ['ai-settings', 'AI 设置', 'enabled, baseUrl, model, temperature, maxTokens, promptTemplates[]'],
          ['cache-settings', '缓存设置', 'cachingEnabled, pageRevalidateSeconds, exposeCacheHeaders'],
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
          ['POST /api/ai/complete|stream|structured', 'Admin Cookie + RBAC', '字段 AI；author 仅自己的 posts'],
          ['POST /api/ai/agent', 'Admin Cookie + RBAC', '后台对话助手 SSE；会话持久化'],
          ['GET/DELETE /api/ai/agent/sessions', 'Admin Cookie', '后台助手会话列表 / 删除（软删除）'],
          ['GET/POST /api/ai/assistant', '无（公开）', '前台只读助手；GET 返回 available；POST SSE 检索'],
          ['POST /api/mcp', 'MCP Bearer / users API-Key', '生产必须配置 MCP API Key'],
          ['POST /api/internal/access-log', 'x-access-log-secret', '仅 middleware 内部调用'],
          ['GET /api/internal/cache-settings', '无（Edge 可读）', 'middleware 读取缓存开关/TTL，60s 内存缓存'],
          ['POST /api/internal/route-cache-touch', '无（Edge 可读）', 'middleware 写入/读取路由缓存状态（DB）'],
          ['GET /api/admin/cache', 'Admin Cookie（editor+）', '缓存管理页数据 + DB 条目统计'],
          ['POST /api/admin/cache/purge', 'Admin Cookie（editor+）', '按注册表 tag/path 或全部清除 DB 缓存'],
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
        text: '后台字段 AI 仅 Admin 内使用，基于 OpenAI Chat Completions 兼容协议（默认 DeepSeek）。与前台公开 AI 助手（#frontend-ai-assistant）共用 ai-settings 与 LLM 配置，但 API、工具集、鉴权完全分离。完整请求/响应说明见下文「OpenAI 兼容 API 文档」章节。',
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
          'AI：/api/ai/complete、/stream、/structured、/agent（含 request/response schema）',
          '前台 AI：GET/POST /api/ai/assistant（公开只读）',
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
    id: 'frontend-cache',
    title: '前台缓存（Database Cache）',
    blocks: [
      {
        type: 'p',
        text: 'Crispy 前台缓存仅持久化页面 HTML（Collection frontend-cache-entries，kind=route）。Middleware 在 HIT 时从 DB 直出 HTML；RSC 渲染时直接查 Payload，不再单独缓存 JSON 数据。TTL 由 cache-settings.pageRevalidateSeconds 控制。',
      },
      {
        type: 'h3',
        text: '架构总览',
      },
      {
        type: 'pre',
        text: `┌─────────────────────────────────────────────────────────────┐
│  Admin                                                       │
│  /admin/globals/cache-settings  开关 / TTL / 调试 Header      │
│  /admin/cache                   注册表清除 + DB 条目统计       │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│  PostgreSQL / SQLite                                         │
│  frontend_cache_entries (+ _tags)                            │
│  kind=route → routePath + cachedValue { html, ... }          │
└───────────────────────────▲─────────────────────────────────┘
                            │
     ┌──────────────────────┼──────────────────────┐
     │                      │                      │
  RSC 直查 Payload    middleware 路由层      Admin 手动清除
  getCachedGlobal 等  route-cache-touch      /admin/cache
                      cache-settings API`,
      },
      {
        type: 'h3',
        text: '存储模型（frontend-cache-entries）',
      },
      {
        type: 'table',
        headers: ['字段', '说明'],
        rows: [
          ['cacheKey', '唯一键 route:{pathname}'],
          ['kind', 'route（仅 HTML 页面缓存）'],
          ['cachedValue', '{ html, contentType, statusCode }'],
          ['routePath', 'URL 路径，如 /、/posts/foo'],
          ['expiresAt', '绝对过期时间（写入时 = now + TTL）'],
          ['updatedAt', 'HIT/MISS/STALE 判定依据（与 TTL 比较）'],
        ],
      },
      {
        type: 'h3',
        text: '页面 TTL（单一来源）',
      },
      {
        type: 'table',
        headers: ['配置', '作用', '是否必需'],
        rows: [
          ['cache-settings.pageRevalidateSeconds', 'DB HTML 缓存 TTL + middleware Header + route 条目过期', '必需'],
          ['各 page export const revalidate = false', '关闭 Next.js 页面 ISR，避免与 DB HTML 双轨', '必需'],
        ],
      },
      {
        type: 'p',
        text: '前台各 page.tsx 须在本文件内写 export const revalidate = false（Next 不支持 re-export）。RSS 等 Route Handler 的 Cache-Control s-maxage 运行时读取 getResolvedCacheSettings().pageRevalidateSeconds。',
      },
      {
        type: 'table',
        headers: ['字段', '默认', '作用'],
        rows: [
          ['cachingEnabled', 'true', 'false 时所有读写走 BYPASS，不写入 DB'],
          ['pageRevalidateSeconds', '600', '路由缓存 TTL（秒）；middleware Header 用'],
          ['exposeCacheHeaders', 'true', 'false 时 middleware 不注入 X-Crispy-* Header'],
        ],
      },
      {
        type: 'p',
        text: 'getResolvedCacheSettings() 直接 findGlobal("cache-settings")，带 60s 进程内缓存，且不经过 DB 缓存层（避免循环依赖）。constants.ts 中 DEFAULT_PAGE_REVALIDATE 仅作为 Global 字段默认值，与运行时 TTL 对齐。',
      },
      {
        type: 'h3',
        text: 'HIT / MISS / STALE / BYPASS 判定',
      },
      {
        type: 'pre',
        text: `age = now - updatedAt（秒）
TTL <= 0 或 cachingEnabled=false 或 bypass → BYPASS
age < TTL           → HIT
TTL <= age < TTL*2  → STALE（仍返回缓存；STALE 时刷新 expiresAt）
age >= TTL*2        → MISS（重新 fetch 并 upsert）`,
      },
      {
        type: 'p',
        text: 'bypass 条件（middlewareCache.ts）：URL 带 ?nocache、存在 __prerender_bypass 或 __next_preview_data Cookie（草稿预览）。',
      },
      {
        type: 'h3',
        text: '路由 HTML 缓存层（middleware）',
      },
      {
        type: 'p',
        text: 'middleware 为 Edge 环境，禁止 import Payload。流程：getMiddlewareCacheSettings → fetch /api/internal/cache-settings；对前台 HTML GET → fetch /api/internal/route-cache-touch → resolveRouteCacheFromDb；HIT/STALE 且有 html 时直接返回 DB HTML，MISS 时 Next 渲染并在 after() 中 capture 写入 route-cache-store。预览 Cookie / ?nocache → BYPASS。',
      },
      {
        type: 'h3',
        text: 'HTTP 调试 Header',
      },
      {
        type: 'table',
        headers: ['Header', '值'],
        rows: [
          ['X-Crispy-Page-Cache', 'HIT | MISS | STALE | BYPASS'],
          ['X-Crispy-Data-Cache', '固定 BYPASS（已无独立数据缓存层）'],
          ['X-Crispy-Cache-TTL', 'pageRevalidateSeconds'],
          ['X-Crispy-Cache-Enabled', 'true | false'],
          ['X-Crispy-Cache-Mode', 'database | disabled'],
        ],
      },
      {
        type: 'pre',
        text: `# 验证（需 exposeCacheHeaders=true 且 cachingEnabled=true）
curl -I http://localhost:3333/
# 首次 MISS，短 TTL 内再次请求 → HIT`,
      },
      {
        type: 'h3',
        text: '手动清除（/admin/cache）',
      },
      {
        type: 'p',
        text: '缓存清除仅通过 /admin/cache 手动执行（按路径、清除全部、清理过期）。内容变更不会自动删除 HTML 缓存。',
      },
      {
        type: 'table',
        headers: ['API', '行为'],
        rows: [
          ['purgeCacheEntries(registry)', 'Admin 按注册表 path 批量清除'],
          ['purgeAllRegisteredCache()', 'DELETE 全部 frontend-cache-entries（含历史遗留行）'],
          ['purgeExpiredCacheEntries()', 'DELETE expiresAt 已过期条目（cron 每小时）'],
        ],
      },
      {
        type: 'h3',
        text: '注册表（registry.ts）',
      },
      {
        type: 'p',
        text: '注册表由 discoverFrontendRoutes 自动扫描 app/(frontend) 的 page.tsx / route.ts 路径，供 Admin /admin/cache 按 path 手动清除。',
      },
      {
        type: 'h3',
        text: '源码索引',
      },
      {
        type: 'table',
        headers: ['路径', '职责'],
        rows: [
          ['src/frontend-cache/dbCache.ts', 'resolveRouteCacheFromDb、storeRouteHtmlCache、purge、getDbCacheStats'],
          ['src/frontend-cache/constants.ts', 'DEFAULT_PAGE_REVALIDATE 等 Global 默认值'],
          ['src/frontend-cache/getCacheSettings.ts', '读 cache-settings Global（防循环）'],
          ['src/frontend-cache/middlewareCache.ts', 'Edge 安全 settings 类型 + internal API fetch'],
          ['src/frontend-cache/registry.ts', 'Admin 可清除项注册表'],
          ['src/frontend-cache/purge.ts', 'Admin purge 入口（按 path / 全部）'],
          ['src/frontend-cache/headers.ts', 'X-Crispy-* Header 常量与写入'],
          ['src/middleware.ts', '前台 HTML Header + API access log'],
          ['src/collections/FrontendCacheEntries/', 'DB Collection 定义（hidden，系统写入）'],
          ['src/app/(payload)/admin/cache/', 'Custom View 缓存管理 UI'],
        ],
      },
      {
        type: 'h3',
        text: '约束与注意',
      },
      {
        type: 'ul',
        items: [
          'middleware 不得 import @payload-config / getPayload（Edge 兼容）；仅 fetch internal API',
          'cache-settings 直接 findGlobal，带 60s 进程内缓存',
          'JSON 字段必须叫 cachedValue，不可用 payload（Payload 保留语义）',
          'cachedValue 写入前 JSON.parse(JSON.stringify) 保证可序列化',
          'frontend-cache-entries 在 SYSTEM_COLLECTION_SLUGS 中，无 trash/versions',
          'SQLite dev：schema push 新增表时选 create table，勿 rename 到 _xxx_v 版本表',
          'Postgres 生产：Collection 变更需 pnpm migrate:create + migrate',
          '页面 HTML 由 DB + middleware 负责；Next.js 页面段 revalidate=false，勿再叠加 ISR',
        ],
      },
      {
        type: 'h3',
        text: '内容变更失效',
      },
      {
        type: 'p',
        text: '发布/修改内容后，到 /admin/cache 手动清除相关路径或「清除全部」，否则访客可能继续看到旧 HTML（直到 TTL 过期）。',
      },
    ],
  },
  {
    id: 'frontend-themes',
    title: '前台主题（可插拔）',
    blocks: [
      {
        type: 'p',
        text: 'Crispy 前台通过 src/themes/ 注册多套皮肤，由 site-settings.frontendTheme 或环境变量 FRONTEND_THEME 决定当前主题。App Router 页面统一调用 renderThemePage()，各主题实现自己的 Layout 与页面 View。运行时通过 loadTheme.ts 的 dynamic import 只加载当前主题 chunk（含 styles.css），三套之间禁止互相 import。',
      },
      {
        type: 'table',
        headers: ['ID', '名称', '适用场景'],
        rows: [
          ['blog', '博客皮肤', '侧栏导航、卡片列表，适合个人博客'],
          ['cms', '通用 CMS', '深色顶栏、杂志式内容区，适合品牌官网'],
          ['kb', '知识库', '左侧分类导航、文档 TOC、站内搜索，适合帮助中心'],
        ],
      },
      {
        type: 'h3',
        text: '配置与预览',
      },
      {
        type: 'ul',
        items: [
          'Admin → Globals → 站点设置 → 前台主题：卡片选择 + 新窗口预览',
          '保存后全站生效；切换主题会自动 purge 全部前台 HTML 缓存（purgeCacheOnFrontendThemeChange）',
          '预览：/?theme_preview=blog|cms|kb，仅 super-admin / editor Cookie 有效',
          '预览 Cookie：crispy_theme_preview（1h）；预览站内链接自动附带 theme_preview 参数',
          '退出预览：GET /next/exit-theme-preview；预览模式 robots noindex',
          '回退顺序：预览 Header → site-settings → FRONTEND_THEME 环境变量 → 默认 blog',
        ],
      },
      {
        type: 'h3',
        text: '代码与样式隔离',
      },
      {
        type: 'ul',
        items: [
          '代码：blog / cms / kb 各自独立目录；仅 registry → loadTheme 动态 import 进入主题模块',
          '主题 CSS：styles.css 原生嵌套写在 html.{theme}-skin { } 内',
          '主题 CSS：pnpm build:theme-css 编译到 public/theme-assets/{id}.css；layout 仅 <link> 当前主题，dev/prod 均只请求一个文件',
          '主题 Tailwind：含在各主题 tailwind.css 内，与 styles.css 一并编译进 theme-assets',
          '共享 Tailwind：globals.css 含 preflight / @theme / .crispy-chrome',
          'Admin / AI 浮窗包在 .crispy-chrome，不受主题 CSS 影响',
          '共享数据查询放 src/themes/shared/，主题内组件不得 cross-import 其他主题',
        ],
      },
      {
        type: 'pre',
        text: `src/app/(frontend)/globals.css        # preflight + chrome Tailwind
public/theme-assets/{blog,cms,kb}.css  # pnpm build:theme-css 产出
src/themes/blog/tailwind.css           # Tailwind + @source + styles.css（编译输入）
src/themes/blog/index.ts               # 无 CSS import；layout 按 themeId 挂 link`,
      },
      {
        type: 'h3',
        text: '主题结构',
      },
      {
        type: 'pre',
        text: `src/themes/
├── definitions.ts      # FRONTEND_THEME_DEFINITIONS（id + 中文名）
├── loadTheme.ts        # dynamic import，按 id 加载单主题 chunk + CSS
├── registry.ts         # getActiveFrontendThemeId / getActiveFrontendTheme
├── render.tsx          # renderThemePage / generateThemeMetadata
├── types.ts            # FrontendTheme、ThemePageName
├── blog/ | cms/ | kb/  # tailwind.css + styles.css + Layout/pages/views
└── shared/             # data/ + tailwind-theme|variants|sources.css`,
      },
      {
        type: 'h3',
        text: '新增主题步骤',
      },
      {
        type: 'ol',
        items: [
          '在 definitions.ts 注册 id 与 label',
          '新建 src/themes/<id>/（参考 kb/ 或 cms/），实现全部 ThemePageName 页面',
          '在 loadTheme.ts 的 themeLoaders 注册 dynamic import',
          '在 adminMeta.ts 注册；更新 FrontendThemeField 预览 mock',
          'pnpm generate:types（site-settings.frontendTheme 联合类型）',
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
          '回收站 / 版本历史：列表切换回收站、编辑页版本面板',
          '列表刷新：各 Collection 列表右上角「刷新」按钮',
          'Query Presets：保存列表筛选与排序',
          '深色模式：Admin 主题色相 + 各前台皮肤自带 ThemeToggle',
          '前台主题：站点设置切换 blog / cms / kb；editor 可 ?theme_preview= 预览',
          'AI：DEEPSEEK_API_KEY + verify:ai',
          '后台 AI 助手：/admin/ai-agent 对话 CRUD + semantic_search',
          '前台 AI 助手：右下角浮窗，公开检索文章/分类/友链等（ai-settings.enabled 开启时）',
          '前台缓存：/admin/cache DB 条目统计；curl -I 查看 X-Crispy-Page-Cache HIT/MISS',
        ],
      },
    ],
  },
  {
    id: 'architecture',
    title: 'Payload 扩展架构',
    blocks: [
      {
        type: 'p',
        text: 'Crispy 在 Payload 能力边界内做产品化二次开发：不 fork 核心、不改 node_modules，通过 Plugin、Custom View、薄 wrapper 注入横切行为；差异化能力（AI Agent、审计、OpenAPI、embedding）放在自有模块。',
      },
      {
        type: 'pre',
        text: `┌─────────────────────────────────────────┐
│  Crispy 产品层                           │
│  AI Agent · 前台助手 · 主题 · 审计 · OpenAPI   │
├─────────────────────────────────────────┤
│  横切 Plugin（src/plugins/）             │
│  trash/versions · query presets · 刷新   │
├─────────────────────────────────────────┤
│  Payload 3 原生                          │
│  Collections · Access · Admin · REST/MCP │
└─────────────────────────────────────────┘`,
      },
      {
        type: 'h3',
        text: '扩展原则',
      },
      {
        type: 'ul',
        items: [
          '横切逻辑 → Plugin 统一注入（新增 Collection 自动继承）',
          'payload-* 系统 Collection → isInternalCollectionSlug 排除',
          'Payload 语义不足 → utilities 薄封装（如 trashOrDeleteDocument）',
          'Admin UI 定制 → admin.components + generate:importmap',
          '避免大面积 override DefaultListView，仅在必要时包一层',
        ],
      },
      {
        type: 'h3',
        text: '软删除约定',
      },
      {
        type: 'p',
        text: 'Payload 的 delete() 为硬删；启用 trash 后须 update({ deletedAt }) 才能移入回收站。Crispy 统一通过 src/utilities/trashOrDeleteDocument.ts 处理，AI Agent 的 delete_document 工具已接入。',
      },
      {
        type: 'h3',
        text: '推荐扩展模式',
      },
      {
        type: 'table',
        headers: ['模式', '适用场景', '示例'],
        rows: [
          ['Plugin 注入 config', '全 Collection 横切行为', 'enableTrashAndVersionsPlugin'],
          ['Collection hooks / access', '单 Collection 业务规则', 'restrictAuthorPublish、syncContentEmbedding 等'],
          ['Custom Field 组件', '字段级 UI（AI 按钮等）', 'withAiTextField、AiCodeField'],
          ['Custom View（admin.views）', '独立 Admin 页面', 'dev-docs、api-docs、ai-agent'],
          ['utilities 薄封装', 'Payload API 语义不足', 'trashOrDeleteDocument'],
          ['独立 API 路由', '非 CRUD 能力', '/api/ai/*（Admin）、/api/ai/assistant（前台）、/api/openapi.json'],
          ['前台 Next.js + themes/', '访客站点（可插拔皮肤 + DB HTML 缓存）', 'src/app/(frontend)/、src/themes/'],
        ],
      },
      {
        type: 'h3',
        text: '禁止 / 慎用',
      },
      {
        type: 'table',
        headers: ['做法', '风险', '替代方案'],
        rows: [
          ['修改 node_modules / fork Payload', '升级灾难、安全补丁无法合并', 'Plugin + Custom 组件'],
          ['每个 Collection 复制横切配置', '遗漏、不一致、升级要改 N 处', 'Plugin 统一注入'],
          ['大面积 override DefaultListView / Edit', 'Payload minor 升级易 breakage', '仅包一层注入 beforeActions；复杂流程用 Custom View'],
          ['直接 payload.delete()（已开 trash）', '永久删除，与回收站语义不符', 'trashOrDeleteDocument'],
          ['在 Plugin 里写重业务逻辑', 'config merge 难测、职责混乱', 'hooks 放 Collection，Plugin 只改 config'],
          ['深度定制 payload-* 系统 Collection', '与上游插件冲突', 'isInternalCollectionSlug 排除'],
        ],
      },
      {
        type: 'h3',
        text: '常见限制与应对',
      },
      {
        type: 'table',
        headers: ['限制', '应对'],
        rows: [
          ['delete() ≠ 软删除', '统一走 trashOrDeleteDocument'],
          ['Admin 列表/编辑 UI 难深度改造', '接受 Payload 交互；极特殊流程外置 Custom View 或独立服务'],
          ['importMap 随 Admin 组件变更', '改组件后执行 pnpm generate:importmap'],
          ['插件 Collection 英文 labels', 'localizePluginCollectionsPlugin 集中中文化'],
          ['Media 文件夹视图无列表刷新', '已知缺口；需单独 Folder 视图扩展时再评估'],
        ],
      },
      {
        type: 'h3',
        text: '性能注意',
      },
      {
        type: 'ul',
        items: [
          '前台 (frontend) 不加载 Admin bundle；RSC 直查 Payload，页面 HTML 走 DB + middleware（revalidate=false）',
          'Admin 列表避免 populate 大字段（Lexical 正文）；详情页再提高 depth',
          '语义搜索 / embedding 走 Postgres pgvector + 独立 API，不经 Admin 渲染链',
          '生产媒体用 S3（S3_*），避免本机磁盘成为瓶颈',
          'Local API 查询可显式 select 字段、控制 limit/depth',
        ],
      },
      {
        type: 'h3',
        text: 'Payload 升级 Checklist',
      },
      {
        type: 'p',
        text: '升级前：@payloadcms/* 全家桶保持同版本（见 package.json）；大版本单独分支，不与功能开发混发。小版本建议隔 1–2 个 minor 跟进，避免 lag 过久。',
      },
      {
        type: 'ol',
        items: [
          'pnpm update @payloadcms/* payload（或按 release note 指定版本），确保所有 @payloadcms 包版本一致',
          '阅读 Payload changelog / breaking changes；重点看 Plugin API、Admin 组件、DB adapter',
          'pnpm install && pnpm generate:importmap',
          '若 schema 有变：pnpm payload migrate:create <name> → 审阅 src/migrations/ → pnpm migrate',
          'pnpm migrate:status && pnpm ci:check（lint + tsc + test + build）',
          'Admin 冒烟：登录、Collection 列表、编辑保存、回收站切换、版本历史还原',
          'Plugin 相关：Query Presets 保存/加载、列表「刷新」按钮',
          'AI：pnpm verify:ai；/admin/ai-agent 对话 + delete_document 软删除',
          'MCP / Preview：pnpm verify:phase1',
          'Postgres 环境再跑一遍 migrate + test:int（与 CI postgres-migrations job 一致）',
        ],
      },
      {
        type: 'h3',
        text: '何时评估离开 Payload',
      },
      {
        type: 'ul',
        items: [
          'Admin 需完全不同于 CMS 的复杂业务 UI（审批流、看板、实时协作）',
          '多租户 SaaS 且 Payload 数据隔离模型 fit 不好',
          '核心瓶颈在 API 极致性能且 Local API 无法满足（应优先优化先独立读服务，而非整体重写 Admin）',
          'override Admin 核心视图数量持续增加 — 这是预警信号，应回退到 Custom View 或外置服务',
        ],
      },
    ],
  },
  {
    id: 'payload-plugins',
    title: '自建 Plugin 说明',
    blocks: [
      {
        type: 'table',
        headers: ['Plugin', '作用', '代码'],
        rows: [
          ['enableTrashAndVersionsPlugin', '业务 Collection 默认 trash + versions（maxPerDoc: 50）', 'src/plugins/enableTrashAndVersions.ts'],
          ['enableQueryPresetsPlugin', 'enableQueryPresets: true', 'src/plugins/enableQueryPresets.ts'],
          ['enableListRefreshButtonPlugin', '列表页注入 AdminListView + 刷新按钮', 'src/plugins/enableListRefreshButton.ts'],
          ['auditLogPlugin', 'create/update/delete 写 audit-logs', 'src/plugins/auditLog.ts'],
          ['localizePluginCollectionsPlugin', '插件 Collection 中文化', 'src/plugins/localizePluginCollections.ts'],
          ['localizeFieldLabelsPlugin', 'folder/slug/url 字段中文 label', 'src/plugins/localizeFieldLabels.ts'],
        ],
      },
      {
        type: 'h3',
        text: '注册顺序',
      },
      {
        type: 'p',
        text: '全部在 src/plugins/index.ts 末尾注册；auditLog 需在业务 hooks 之前生效，trash/versions 与 list refresh 在 collection 定义之后 merge。',
      },
      {
        type: 'h3',
        text: '新增横切能力',
      },
      {
        type: 'ol',
        items: [
          '新建 src/plugins/enableXxx.ts，map collections 或改 config',
          '在 src/plugins/index.ts 注册',
          '若改 Admin 组件：pnpm generate:importmap',
          '若改 schema：pnpm payload migrate:create <name> 并 commit 迁移',
        ],
      },
    ],
  },
  {
    id: 'ai-agent',
    title: 'Admin AI 助手（对话）',
    blocks: [
      {
        type: 'p',
        text: 'Admin 内对话式 AI 助手（/admin/ai-agent），通过 Function Calling 读写 CMS 内容，与字段级 AI（润色/SEO）互补。需 DEEPSEEK_API_KEY 且 AI 总开关开启。',
      },
      {
        type: 'table',
        headers: ['入口', '说明'],
        rows: [
          ['Admin 页面', '/admin/ai-agent'],
          ['右下角浮窗', '任意 Admin 页可唤起（AdminAiAgentWidget）'],
          ['POST /api/ai/agent', 'SSE 流式对话（含 tool call 结果）'],
          ['GET /api/ai/agent/sessions', '当前用户会话列表'],
          ['GET /api/ai/agent/sessions/:id', '会话详情与消息历史'],
          ['DELETE /api/ai/agent/sessions/:id', '删除会话（软删除）'],
        ],
      },
      {
        type: 'h3',
        text: '工具（Function Calling）',
      },
      {
        type: 'table',
        headers: ['工具', '说明'],
        rows: [
          ['list_resources', '列出可管理的 Collections / Globals'],
          ['describe_resource', '查看字段结构（create/update 前应先调用）'],
          ['semantic_search', 'posts/pages 语义搜索（需 Postgres pgvector）'],
          ['find_documents / get_document', '列表查询 / 单条详情（find 支持 trash: true 查回收站）'],
          ['create_document / update_document', '新建 / 更新文档（posts/pages 发布设 _status: published）'],
          ['delete_document / restore_document', '移入回收站 / 从回收站恢复'],
          ['get_global / update_global', '读取 / 更新 Global 配置'],
          ['get_cache_settings', '读取 cache-settings（开关、TTL、调试 Header）'],
          ['update_cache_settings', '更新 cache-settings（开关、TTL、调试 Header；修改前确认）'],
          ['list_frontend_cache', '缓存 registry 状态、DB 统计、动态路由明细（dynamicRoutes）'],
          ['purge_frontend_cache', '按 ids / routePaths / expired / all 清除前台 DB 缓存'],
          ['list_query_presets', '列出后台保存的查询预设（可复用到 find_documents）'],
          ['get_site_stats', '各 Collection 数量统计（/admin/stats，editor+）'],
          ['list_audit_logs', '审计日志只读查询（super-admin）'],
          ['search_stock_images', 'Unsplash 图片检索（editor+）'],
          ['import_stock_image / import_stock_images', '导入图片到 media（editor+）'],
        ],
      },
      {
        type: 'h3',
        text: '权限',
      },
      {
        type: 'ul',
        items: [
          'super-admin / editor：AGENT_COLLECTIONS 内全部（media 不可 delete；form-submissions 不可 create/update）',
          'author：仅 posts，且必须是文档 authors 之一',
          'app-configs：仅 super-admin 可 create/update/delete',
          'redirects / forms：editor+ 可 CRUD；form-submissions：editor+ 只读查/删',
          'Globals：header/footer/site-settings/cache-settings/comment-settings/ai-settings（ai-settings 修改仅 super-admin）',
          '前台缓存：list_frontend_cache、purge_frontend_cache、update_cache_settings 仅 super-admin / editor',
          'get_site_stats：editor+；list_audit_logs：仅 super-admin',
          '代码：src/ai/agent/、src/components/AdminAiAgent/',
        ],
      },
      {
        type: 'h3',
        text: '与 MCP 的区别',
      },
      {
        type: 'ul',
        items: [
          'AI 助手：Admin 内对话，Cookie 鉴权，适合运营人员',
          'MCP：外部 Agent（Cursor 等），Bearer / API-Key，JSON-RPC',
          '两者 Collection 范围大致对齐（见 src/ai/agent/resources.ts 与 plugins/index.ts mcpPlugin）',
          'AI 助手 delete 走软删除；MCP delete 行为取决于 Payload MCP 插件实现',
        ],
      },
    ],
  },
  {
    id: 'frontend-ai-assistant',
    title: '前台 AI 助手（公开只读）',
    blocks: [
      {
        type: 'p',
        text: '访客可在任意前台主题右下角唤起 AI 助手，无需登录。与后台 /admin/ai-agent 完全分离：独立 API、独立工具集、无会话持久化、仅检索公开数据。共用 ai-settings 的 LLM 配置（enabled / model / baseUrl），关闭 AI 总开关后前台浮窗不显示。',
      },
      {
        type: 'table',
        headers: ['入口', '说明'],
        rows: [
          ['前台浮窗', 'src/components/FrontendAiAssistant（layout.tsx 全局挂载）'],
          ['GET /api/ai/assistant', '返回 { available, semanticSearch }，用于控制浮窗显隐'],
          ['POST /api/ai/assistant', 'SSE 流式对话（无 session 事件）'],
        ],
      },
      {
        type: 'h3',
        text: '与后台 AI 助手的区别',
      },
      {
        type: 'table',
        headers: ['', '前台助手', '后台助手'],
        rows: [
          ['API', '/api/ai/assistant', '/api/ai/agent'],
          ['鉴权', '无', 'Admin Cookie + canUseAiAgent'],
          ['会话', '仅浏览器内存', 'ai-chat-sessions Collection'],
          ['能力', '只读检索', 'CRUD + 缓存 + 审计 + Unsplash 等'],
          ['代码', 'src/ai/frontend-assistant/', 'src/ai/agent/'],
        ],
      },
      {
        type: 'h3',
        text: '工具（Function Calling）',
      },
      {
        type: 'table',
        headers: ['工具', '说明'],
        rows: [
          ['search_content', '关键词搜索全站公开内容（可按 type 过滤）'],
          ['list_content', '按类型浏览目录（分类、标签、友链等）'],
          ['get_content', '按 type + slug 获取单条详情'],
          ['semantic_search', 'posts/pages 语义搜索（需 Postgres pgvector；仅 published）'],
        ],
      },
      {
        type: 'h3',
        text: '可检索公开类型',
      },
      {
        type: 'ul',
        items: [
          'post / page — 已发布文章与单页',
          'category / tag — 分类与标签（含文章计数）',
          'link — 已启用友链',
          'job / gallery-item — 已启用招聘与图库条目',
          'navigation — 类库导航 JSON 中的外部站点',
          'section — 站点栏目入口（/posts、/links、/jobs 等）',
          '数据查询均 overrideAccess: false，遵守 Collection read access',
          '索引实现：src/ai/frontend-assistant/publicContent.ts',
        ],
      },
      {
        type: 'h3',
        text: '代码位置',
      },
      {
        type: 'ul',
        items: [
          '路由：src/app/(frontend)/api/ai/assistant/route.ts',
          '流式推理：src/ai/frontend-assistant/runStream.ts',
          'SSE 消费复用：src/components/AdminAiAgent/consumeAgentStream.ts',
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
          '横切行为：优先写 Plugin（参考 enableTrashAndVersionsPlugin）',
          '软删除调用：trashOrDeleteDocument，勿直接 payload.delete()',
          '扩展红线与 Payload 升级：见本文档 #architecture 章节',
          '前台路由：src/app/(frontend)/',
          '前台主题：src/themes/（见 #frontend-themes）',
          '前台 AI：src/ai/frontend-assistant/（见 #frontend-ai-assistant）',
          'Revalidation：内容变更后不自动清缓存；切换前台主题或手动 /admin/cache 清除（见 #frontend-cache）',
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
