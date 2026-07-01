export type FrontendCacheKind = 'tag' | 'path'

export type FrontendCacheGroup = 'global' | 'collection' | 'page' | 'route' | 'sitemap' | 'data'

export type FrontendCacheEntry = {
  id: string
  label: string
  description?: string
  group: FrontendCacheGroup
  kind: FrontendCacheKind
  /** Tag name or URL path */
  target: string
  /** Tag name or URL path for purge */
  pathType?: 'page' | 'layout'
}

export const FRONTEND_CACHE_REGISTRY: FrontendCacheEntry[] = [
  // Globals
  {
    id: 'global-header',
    label: '页头导航',
    group: 'global',
    kind: 'tag',
    target: 'global_header',
  },
  {
    id: 'global-footer',
    label: '页脚导航',
    group: 'global',
    kind: 'tag',
    target: 'global_footer',
  },
  {
    id: 'global-site-settings',
    label: '站点设置',
    group: 'global',
    kind: 'tag',
    target: 'global_site-settings',
  },
  {
    id: 'global-comment-settings',
    label: '评论设置',
    group: 'global',
    kind: 'tag',
    target: 'global_comment-settings',
  },
  {
    id: 'global-cache-settings',
    label: '缓存设置',
    group: 'global',
    kind: 'tag',
    target: 'global_cache-settings',
  },
  // Collections (tag-based data cache)
  {
    id: 'collection-links',
    label: '友情链接',
    group: 'collection',
    kind: 'tag',
    target: 'collection_links',
  },
  {
    id: 'collection-ads',
    label: '广告',
    group: 'collection',
    kind: 'tag',
    target: 'collection_ads',
  },
  {
    id: 'collection-ad-slots',
    label: '广告位',
    group: 'collection',
    kind: 'tag',
    target: 'collection_ad-slots',
  },
  {
    id: 'collection-gallery',
    label: '图库',
    group: 'collection',
    kind: 'tag',
    target: 'collection_gallery-items',
  },
  {
    id: 'collection-jobs',
    label: '招聘',
    group: 'collection',
    kind: 'tag',
    target: 'collection_jobs',
  },
  {
    id: 'collection-comments',
    label: '评论（汇总）',
    description: '不含单篇 posts/pages 评论 tag',
    group: 'collection',
    kind: 'tag',
    target: 'collection_comments',
  },
  {
    id: 'collection-app-configs',
    label: '应用配置',
    group: 'collection',
    kind: 'tag',
    target: 'collection_app-configs',
  },
  {
    id: 'data-redirects',
    label: '重定向规则',
    group: 'data',
    kind: 'tag',
    target: 'redirects',
  },
  {
    id: 'data-friend-links',
    label: '友情链接数据',
    group: 'data',
    kind: 'tag',
    target: 'friend-links',
  },
  {
    id: 'data-gallery-items',
    label: '图库列表数据',
    group: 'data',
    kind: 'tag',
    target: 'gallery-items',
  },
  {
    id: 'data-site-explore',
    label: '站点探索数据',
    group: 'data',
    kind: 'tag',
    target: 'site-explore',
  },
  // Sitemaps
  {
    id: 'sitemap-posts',
    label: '文章 Sitemap',
    group: 'sitemap',
    kind: 'tag',
    target: 'posts-sitemap',
  },
  {
    id: 'sitemap-pages',
    label: '页面 Sitemap',
    group: 'sitemap',
    kind: 'tag',
    target: 'pages-sitemap',
  },
  // Frontend routes (ISR pages)
  {
    id: 'path-home',
    label: '首页',
    group: 'page',
    kind: 'path',
    target: '/',
    pathType: 'page',
  },
  {
    id: 'path-home-layout',
    label: '全站 Layout',
    description: '含页头页脚等 layout 级缓存',
    group: 'page',
    kind: 'path',
    target: '/',
    pathType: 'layout',
  },
  {
    id: 'path-posts',
    label: '文章列表',
    group: 'page',
    kind: 'path',
    target: '/posts',
  },
  {
    id: 'path-gallery',
    label: '图库页',
    group: 'page',
    kind: 'path',
    target: '/gallery',
  },
  {
    id: 'path-jobs',
    label: '招聘列表',
    group: 'page',
    kind: 'path',
    target: '/jobs',
  },
  {
    id: 'path-archive',
    label: '归档页',
    group: 'page',
    kind: 'path',
    target: '/archive',
  },
  {
    id: 'path-search',
    label: '搜索页',
    group: 'page',
    kind: 'path',
    target: '/search',
  },
  {
    id: 'path-rss',
    label: 'RSS',
    group: 'route',
    kind: 'path',
    target: '/rss.xml',
  },
]

const registryById = new Map(FRONTEND_CACHE_REGISTRY.map((entry) => [entry.id, entry]))

export function getCacheEntryById(id: string): FrontendCacheEntry | undefined {
  return registryById.get(id)
}

export function resolveCacheEntries(ids: string[]): FrontendCacheEntry[] {
  const unique = [...new Set(ids)]
  return unique
    .map((id) => getCacheEntryById(id))
    .filter((entry): entry is FrontendCacheEntry => Boolean(entry))
}

export const FRONTEND_CACHE_GROUP_LABELS: Record<FrontendCacheGroup, string> = {
  global: 'Globals',
  collection: 'Collections',
  page: '前台页面',
  route: '路由',
  sitemap: 'Sitemap',
  data: '数据缓存',
}
