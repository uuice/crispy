import { getPagePath, getPostsListPath } from '@/utilities/frontendPaths'

import type { NavItem } from './types'

export const defaultBlogMenu: NavItem[] = [
  { title: '首页', url: '/', target: '_self' },
  { title: '文章', url: getPostsListPath(), target: '_self' },
  { title: '友链', url: '/links', target: '_self' },
  { title: '关于', url: getPagePath('about'), target: '_self' },
  { title: '导航', url: '/navigations', target: '_self' },
  { title: '小游戏', url: '/games', target: '_self' },
]

export function resolveBlogMenu(menu: NavItem[]): NavItem[] {
  return menu.length > 0 ? menu : defaultBlogMenu
}
