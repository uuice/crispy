import type { Metadata } from 'next'

import type { Link } from '@/payload-types'

import { queryFriendLinks } from '../data/queries'
import { LinksView } from '../views/LinksView'

export type LinksPageData = {
  links: Link[]
}

export async function loadLinksPageData(): Promise<LinksPageData> {
  const links = await queryFriendLinks()
  return { links }
}

export function linksPageMetadata(): Metadata {
  return { title: '友情链接' }
}

export const linksPage = {
  load: loadLinksPageData,
  View: LinksView,
  metadata: linksPageMetadata,
}
