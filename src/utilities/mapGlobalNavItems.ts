import type { Footer, Header } from '@/payload-types'

import type { NavItem } from '@/themes/shared/data/types'

import { resolveNavLinkUrl } from './resolveNavLink'

type GlobalNavItems = Header['navItems'] | Footer['navItems']

export function mapGlobalNavItems(navItems: GlobalNavItems | null | undefined): NavItem[] {
  return (navItems || []).flatMap((item) => {
    const url = resolveNavLinkUrl(item.link)
    const title = item.link?.label || ''

    if (!title || !url) {
      return []
    }

    return [
      {
        title,
        url,
        target: item.link?.newTab ? '_blank' : '_self',
      },
    ]
  })
}

/** Admin hint for custom nav URLs on the frontend. */
export const frontendNavPathHint =
  '自定义 URL 请使用前台路径，如 /、/posts、/pages/about、/links、/navigations、/games、/rss。推荐使用「内部链接」关联页面或文章。'
