import type { FrontendThemeId } from './definitions'

export type FrontendThemeAdminMeta = {
  description: string
  mock: 'blog' | 'cms'
}

export const FRONTEND_THEME_ADMIN_META: Record<FrontendThemeId, FrontendThemeAdminMeta> = {
  blog: {
    description: '轻量博客布局，侧栏导航与卡片列表，适合内容创作站点。',
    mock: 'blog',
  },
  cms: {
    description: '企业编辑风，深色顶栏与杂志式内容区，适合品牌官网与 CMS 展示。',
    mock: 'cms',
  },
}
