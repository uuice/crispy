import type { Page, Post } from '@/payload-types'

import { getPagePath, getPostPath } from './frontendPaths'

export type NavLinkSource = {
  type?: ('reference' | 'custom') | null
  url?: string | null
  reference?:
    | {
        relationTo: 'pages'
        value: number | Page
      }
    | {
        relationTo: 'posts'
        value: number | Post
      }
    | null
}

export function resolveNavLinkUrl(link: NavLinkSource | null | undefined): string | null {
  if (!link) return null

  if (
    link.type === 'reference' &&
    link.reference &&
    typeof link.reference.value === 'object' &&
    link.reference.value &&
    'slug' in link.reference.value &&
    link.reference.value.slug
  ) {
    return link.reference.relationTo === 'posts'
      ? getPostPath(link.reference.value.slug)
      : getPagePath(link.reference.value.slug)
  }

  if (link.url) {
    return link.url
  }

  return null
}
