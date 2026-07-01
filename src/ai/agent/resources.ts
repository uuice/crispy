import type { AgentManagedCollection, AgentManagedGlobal } from '@/ai/agent/types'

/** Collections the AI agent may query and mutate (aligned with MCP plugin scope). */
export const AGENT_COLLECTIONS: AgentManagedCollection[] = [
  { slug: 'posts', label: '文章', description: '博客文章，含标题、正文、分类、标签、SEO' },
  { slug: 'pages', label: '页面', description: '静态页面，含 Hero 区块与 SEO' },
  { slug: 'categories', label: '分类', description: '文章分类（支持嵌套）' },
  { slug: 'tags', label: '标签', description: '文章标签' },
  { slug: 'links', label: '链接', description: '友情链接' },
  { slug: 'ad-slots', label: '广告位', description: '广告展示位' },
  { slug: 'ads', label: '广告', description: '广告素材' },
  { slug: 'jobs', label: '招聘', description: '招聘职位' },
  { slug: 'gallery-items', label: '图库', description: '图库条目' },
  {
    slug: 'app-configs',
    label: '应用配置',
    description: '键值型应用配置（string/number/boolean/json），按 key 读取',
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
  { slug: 'media', label: '媒体', description: '图片与文件（不可删除）' },
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
    description: '前台缓存开关、路由/数据 TTL（秒）、是否输出缓存调试 Header',
  },
  {
    slug: 'ai-settings',
    label: 'AI 设置',
    description: 'AI 助手开关、LLM 提供商/模型/温度、字段 AI Prompt 模板（API Key 在环境变量）',
  },
]

export const AGENT_COLLECTION_SLUGS = new Set(AGENT_COLLECTIONS.map((c) => c.slug))
export const AGENT_GLOBAL_SLUGS = new Set(AGENT_GLOBALS.map((g) => g.slug))

export function isAgentCollection(slug: string): boolean {
  return AGENT_COLLECTION_SLUGS.has(slug)
}

export function isAgentGlobal(slug: string): boolean {
  return AGENT_GLOBAL_SLUGS.has(slug)
}
