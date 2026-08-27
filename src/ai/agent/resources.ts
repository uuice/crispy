import type { AgentManagedCollection, AgentManagedGlobal } from '@/ai/agent/types'

/** Collections the AI agent may query and mutate (aligned with MCP plugin scope). */
export const AGENT_COLLECTIONS: AgentManagedCollection[] = [
  { slug: 'posts', label: '文章', description: '博客文章，含标题、正文、分类、标签、SEO' },
  { slug: 'pages', label: '页面', description: '静态页面，含 Hero 区块与 SEO' },
  { slug: 'categories', label: '分类', description: '博客文章分类（支持嵌套）' },
  { slug: 'tags', label: '标签', description: '博客文章标签' },
  {
    slug: 'novel-categories',
    label: '小说分类',
    description: '小说专用分类，与博客 categories 独立',
  },
  { slug: 'novel-tags', label: '小说标签', description: '小说专用标签，与博客 tags 独立' },
  { slug: 'links', label: '链接', description: '友情链接（可归属 link-groups 分组）' },
  { slug: 'link-groups', label: '友链分组', description: '友情链接分组（标题、描述、排序、启用）' },
  { slug: 'ad-slots', label: '广告位', description: '广告展示位' },
  { slug: 'ads', label: '广告', description: '广告素材' },
  { slug: 'jobs', label: '招聘', description: '招聘职位' },
  {
    slug: 'galleries',
    label: '图库',
    description: '图库相册（主实体）；一本图库含多条图片；前台 /galleries/{slug}',
  },
  {
    slug: 'gallery-items',
    label: '图库图片',
    description: '单张图片条目，gallery 字段必填归属一本图库',
  },
  {
    slug: 'novels',
    label: '小说',
    description:
      '长篇小说项目（一本一条）：书名、梗概、人物、大纲、当前进度、单章目标字数',
  },
  {
    slug: 'novel-chapters',
    label: '小说章节',
    description: '长篇小说章节正文，通过 novel 字段关联所属小说',
  },
  {
    slug: 'short-links',
    label: '短链',
    description: '短链接跳转规则，前台路径 /s/{slug}',
  },
  {
    slug: 'app-configs',
    label: '应用配置',
    description: '键值型应用配置（string/number/boolean/json），按 key 读取',
  },
  {
    slug: 'llm-providers',
    label: 'LLM 提供商',
    description:
      'OpenAI 兼容端点 Catalog（chat / embedding）；密钥加密；capabilities 区分用途；需 catalog:secrets',
  },
  {
    slug: 'prompt-templates',
    label: 'Prompt 模板',
    description:
      '字段 AI 技能卡（action、systemPrompt、userPrompt；可绑 provider/model）。读 catalog:prompts:read；写 catalog:prompts:write',
  },
  {
    slug: 'storage-targets',
    label: '存储目标',
    description: 'S3/OSS 目标 Catalog（密钥加密；catalog:secrets；切换 Active 后需重启）',
  },
  {
    slug: 'integration-credentials',
    label: '集成凭证',
    description: 'Unsplash 等第三方凭证 Catalog（密钥加密；catalog:secrets）',
  },
  {
    slug: 'email-transports',
    label: '邮件通道',
    description: 'Resend / SMTP Catalog（密钥加密；catalog:secrets；切换 Active 后需重启）',
  },
  {
    slug: 'comments',
    label: '评论',
    description: '文章与单页评论，含审核状态、嵌套回复、访客信息',
  },
  {
    slug: 'payload-query-presets',
    label: '查询预设',
    description:
      '后台列表保存的筛选条件（where/columns/groupBy），按 relatedCollection 关联到具体 Collection',
  },
  {
    slug: 'redirects',
    label: '重定向',
    description: 'URL 重定向规则（from → to），关联 pages/posts 或自定义 URL',
  },
  {
    slug: 'forms',
    label: '表单',
    description: 'Form Builder 表单定义（字段、确认消息、邮件通知等）',
  },
  {
    slug: 'form-submissions',
    label: '表单提交',
    description: '前台提交的表单记录（只读查询与删除，不可通过助手创建或修改）',
  },
  { slug: 'media', label: '媒体', description: '图片与文件（不可删除；可通过 search_stock_images + import_stock_image 从 Unsplash 导入）' },
]

export const AGENT_GLOBALS: AgentManagedGlobal[] = [
  { slug: 'header', label: '页头', description: '站点导航与页头配置' },
  { slug: 'footer', label: '页脚', description: '页脚链接与版权信息' },
  { slug: 'site-settings', label: '站点设置', description: '站点名称、Logo、RSS 等全局配置' },
  {
    slug: 'comment-settings',
    label: '评论设置',
    description: '评论开关、审核策略、访客评论、嵌套层级、文章/单页是否可评',
  },
  {
    slug: 'cache-settings',
    label: '缓存设置',
    description: '前台 HTML 缓存开关、pageRevalidateSeconds（秒）、是否输出缓存调试 Header',
  },
  {
    slug: 'ai-settings',
    label: 'AI 设置',
    description:
      'AI 总开关、默认 chat Provider/模型、默认 Embedding Provider/模型；Prompt 见 prompt-templates，密钥在 llm-providers',
  },
  {
    slug: 'storage-settings',
    label: '存储设置',
    description: 'local / S3 模式与 Active 存储目标（切换 S3 后需重启）',
  },
  {
    slug: 'integration-settings',
    label: '集成设置',
    description: 'Unsplash 等 Active 凭证（即时生效）',
  },
  {
    slug: 'email-settings',
    label: '邮件设置',
    description: 'Active 邮件通道与发件人（切换后需重启）',
  },
]

export const AGENT_COLLECTION_SLUGS = new Set(AGENT_COLLECTIONS.map((c) => c.slug))
export const AGENT_GLOBAL_SLUGS = new Set(AGENT_GLOBALS.map((g) => g.slug))

/**
 * Admin surfaces intentionally out of Agent scope (use Admin UI / dedicated APIs).
 * Keep in sync with systemPrompt「不可管理」and docs/dev-docs.md#permissions.
 */
export const AGENT_OUT_OF_SCOPE = [
  'users',
  'roles',
  'authz-cache',
  'payload-mcp-api-keys',
  'search',
  'imports',
  'exports',
  'api-access-logs',
  'document-versions', // Payload versions restore UI — no Agent tool
] as const

export function isAgentCollection(slug: string): boolean {
  return AGENT_COLLECTION_SLUGS.has(slug)
}

export function isAgentGlobal(slug: string): boolean {
  return AGENT_GLOBAL_SLUGS.has(slug)
}
