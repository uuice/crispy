import { getPagePath, getPostsListPath } from '@/utilities/frontendPaths'

import type { NavItem } from './types'

export type KbLayoutData = {
  menu: NavItem[]
  footerMenu: NavItem[]
  categories: Array<{ id: string; title: string; url: string; count: number }>
}

export const defaultKbMenu: NavItem[] = [
  { title: '首页', url: '/', target: '_self' },
  { title: '全部文档', url: getPostsListPath(), target: '_self' },
  { title: '关于', url: getPagePath('about'), target: '_self' },
]

export function resolveKbMenu(menu: NavItem[]): NavItem[] {
  return menu.length > 0 ? menu : defaultKbMenu
}
