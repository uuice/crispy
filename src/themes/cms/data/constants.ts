import { getPagePath, getPostsListPath } from '@/utilities/frontendPaths'

import type { NavItem } from './types'

export type CmsLayoutData = {
  menu: NavItem[]
  footerMenu: NavItem[]
}

export const defaultCmsMenu: NavItem[] = [
  { title: '首页', url: '/', target: '_self' },
  { title: '内容', url: getPostsListPath(), target: '_self' },
  { title: '关于', url: getPagePath('about'), target: '_self' },
  { title: '友链', url: '/links', target: '_self' },
]

export function resolveCmsMenu(menu: NavItem[]): NavItem[] {
  return menu.length > 0 ? menu : defaultCmsMenu
}
