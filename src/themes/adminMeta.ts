import type { FrontendThemeId } from './definitions'

export type FrontendThemeAdminMeta = {
  description: string
  mock: 'blog' | 'cms' | 'kb'
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
  kb: {
    description: '文档知识库布局，左侧分类导航与目录 TOC，适合帮助中心与产品文档。',
    mock: 'kb',
  },
}
