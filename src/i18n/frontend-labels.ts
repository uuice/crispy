/** Chinese copy for the public frontend. */

import { getPagePath, getPostsListPath } from '@/utilities/frontendPaths'

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
  comments: {
    title: '评论',
    empty: '暂无评论，来抢沙发吧。',
    reply: '回复',
    cancelReply: '取消回复',
    submit: '发表评论',
    submitting: '提交中…',
    content: '评论内容',
    contentPlaceholder: '写下你的想法…',
    guestName: '昵称',
    guestNamePlaceholder: '如何称呼你',
    guestEmail: '邮箱（选填）',
    guestEmailPlaceholder: '不会公开显示',
    loginHint: '以登录用户身份评论',
    guestHint: '以访客身份评论',
    successApproved: '评论已发布',
    successPending: '评论已提交，审核通过后将显示',
    errorGeneric: '提交失败，请稍后重试',
    errorEmpty: '请输入评论内容',
    errorGuestName: '请输入昵称',
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
  { label: frontendLabels.site.home, url: '/' },
  { label: frontendLabels.site.posts, url: getPostsListPath() },
  { label: '友链', url: '/links' },
  { label: '关于', url: getPagePath('about') },
  { label: '导航', url: '/navigations' },
  { label: '小游戏', url: '/games' },
] as const

export function socialPlatformLabel(platform: string | null | undefined): string {
  if (!platform) return frontendLabels.social.other
  const key = platform as keyof typeof frontendLabels.social
  return frontendLabels.social[key] ?? platform
}
