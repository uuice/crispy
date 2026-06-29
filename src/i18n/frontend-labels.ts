/** Chinese copy for the public frontend. */

export const frontendLabels = {
  site: {
    home: '首页',
    posts: '文章',
    pages: '单页',
    search: '搜索',
    archive: '归档',
    gallery: '图库',
    jobs: '招聘',
    admin: '管理后台',
    rss: 'RSS 订阅',
    contact: '联系我们',
    explore: '站点导览',
  },
  posts: {
    title: '文章',
    description: '全部已发布文章',
    singular: '篇',
    plural: '篇',
    latest: '最新文章',
    viewAll: '查看全部文章',
    related: '相关文章',
    none: '暂无文章',
    noImage: '暂无图片',
    untitledCategory: '未命名分类',
  },
  search: {
    title: '搜索',
    placeholder: '搜索文章…',
    noResults: '未找到相关结果',
    ariaLabel: '搜索',
  },
  archive: {
    title: '归档',
    description: '按发布时间浏览全部文章',
    none: '暂无已发布文章',
  },
  category: {
    titlePrefix: '分类：',
    notFound: '分类不存在',
    browse: '分类浏览',
  },
  tag: {
    titlePrefix: '标签：',
    notFound: '标签不存在',
    browse: '标签',
  },
  gallery: {
    title: '图库',
    description: '精选图片展示，仅在此处发布的条目会对访客可见。',
    none: '暂无公开图片',
    viewAll: '进入图库',
  },
  jobs: {
    title: '加入我们',
    description: '开放职位列表，欢迎投递简历。',
    none: '暂无开放职位',
    viewAll: '查看全部职位',
    viewDetail: '查看详情',
  },
  links: {
    title: '友情链接',
  },
  pages: {
    title: '单页',
  },
  pagination: {
    previous: '上一页',
    next: '下一页',
    more: '更多页',
    range: (start: number, end: number, total: number, unit: string) =>
      `显示 ${start}${start > 0 ? ` - ${end}` : ''}，共 ${total} ${unit}`,
    empty: '没有符合条件的内容',
  },
  theme: {
    label: '主题',
    auto: '跟随系统',
    light: '浅色',
    dark: '深色',
  },
  notFound: {
    title: '404',
    message: '页面不存在',
    home: '返回首页',
  },
  adminBar: {
    dashboard: '控制台',
    pages: { singular: '单页', plural: '单页' },
    posts: { singular: '文章', plural: '文章' },
  },
  explore: {
    title: '站点导览',
    subtitle: '浏览本站全部内容与后台配置的资源',
    categories: '分类',
    tags: '标签',
    navigation: '快捷导航',
    more: '更多内容',
  },
  social: {
    title: '社交链接',
    github: 'GitHub',
    twitter: 'Twitter / X',
    weibo: '微博',
    wechat: '微信',
    other: '其他',
  },
} as const

export const defaultHeaderNav = [
  { label: frontendLabels.site.posts, url: '/posts' },
  { label: frontendLabels.site.archive, url: '/archive' },
  { label: frontendLabels.site.gallery, url: '/gallery' },
  { label: frontendLabels.site.jobs, url: '/jobs' },
  { label: frontendLabels.site.search, url: '/search' },
] as const

export function socialPlatformLabel(platform: string | null | undefined): string {
  if (!platform) return frontendLabels.social.other
  const key = platform as keyof typeof frontendLabels.social
  return frontendLabels.social[key] ?? platform
}
