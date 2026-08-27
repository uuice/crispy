import type { Metadata } from 'next'

import type { FriendLinkSection } from '@/utilities/getFriendLinks'

import { queryFriendLinkSections } from '../data/queries'
import { LinksView } from '../views/LinksView'

export type LinksPageData = {
  sections: FriendLinkSection[]
  totalCount: number
}

export async function loadLinksPageData(): Promise<LinksPageData> {
  const sections = await queryFriendLinkSections()
  const totalCount = sections.reduce((sum, section) => sum + section.links.length, 0)
  return { sections, totalCount }
}

export function linksPageMetadata(): Metadata {
  return { title: '友情链接' }
}

export const linksPage = {
  load: loadLinksPageData,
  View: LinksView,
  metadata: linksPageMetadata,
}
