import { isRetiredFrontendPath } from '@/utilities/mapGlobalNavItems'
import {
  getGalleriesPath,
  getPagePath,
  getPostsListPath,
} from '@/utilities/frontendPaths'

import type { NavItem } from './types'

/** Default nav when Header global has no items. */
export const defaultBlogMenu: NavItem[] = [
  { title: '首页', url: '/', target: '_self' },
  { title: '归档', url: getPostsListPath(), target: '_self' },
  { title: '图库', url: getGalleriesPath(), target: '_self' },
  { title: '友情链接', url: '/links', target: '_self' },
  { title: '类库导航', url: '/navigations', target: '_self' },
  { title: '关于', url: getPagePath('about'), target: '_self' },
]

const NAV_URL_ALIASES: Record<string, string> = {
  '/archive': getPostsListPath(),
  '/archives': getPostsListPath(),
  '/about': getPagePath('about'),
}

/** Normalize CMS nav URLs that still use legacy or shorthand paths. */
export function normalizeBlogNavUrl(url: string): string {
  return NAV_URL_ALIASES[url] ?? url
}

export function resolveBlogMenu(menu: NavItem[]): NavItem[] {
  const source = menu.length > 0 ? menu : defaultBlogMenu

  return source
    .map((item) => ({
      ...item,
      url: normalizeBlogNavUrl(item.url),
    }))
    .filter((item) => item.url !== '/search' && !isRetiredFrontendPath(item.url))
}
