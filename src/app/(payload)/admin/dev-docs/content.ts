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
          ['GraphQL', 'http://localhost:3333/api/graphql'],
          ['MCP', 'http://localhost:3333/api/mcp'],
          ['AI 流式', 'POST /api/ai/stream'],
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
          ['posts', 'author+', '已发布公开 / 登录见草稿规则', 'editor 全部；author 仅自己的', 'editor+'],
          ['pages', 'editor+', 'editor 全部；author/访客仅 published', 'editor+', 'editor+'],
          ['categories / tags / 运营模块', 'editor+', '多数公开读', 'editor+', 'editor+'],
          ['media', 'author+', 'authenticated', 'author+', 'editor+'],
          ['users', 'super-admin', 'authenticated', 'authenticated（roles 仅 super-admin 改）', 'super-admin'],
          ['api-access-logs / audit-logs', '—', 'super-admin', '—', '—'],
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
        text: '实现位置：src/access/roles.ts、posts.ts、pages.ts、media.ts 及各 Collection config。作者发布限制：restrictAuthorPublish hook 强制 draft。',
      },
    ],
  },
  {
    id: 'ai',
    title: 'Admin AI（DeepSeek / OpenAI 兼容）',
    blocks: [
      {
        type: 'p',
        text: '后台 AI 仅 Admin 内使用，基于 DeepSeek Chat Completions（与 OpenAI SDK 兼容的 REST）。配置 DEEPSEEK_API_KEY + Admin → AI 设置。',
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
