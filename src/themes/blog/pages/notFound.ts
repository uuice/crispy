import type { Metadata } from 'next'

import { queryBlogNavMenu } from '../data/queries'
import type { NavItem } from '../data/types'
import { NotFoundView } from '../views/NotFoundView'

export type NotFoundPageData = {
  menu: NavItem[]
}

export async function loadNotFoundPageData(): Promise<NotFoundPageData> {
  const menu = await queryBlogNavMenu()
  return { menu }
}

export function notFoundPageMetadata(): Metadata {
  return { title: '404' }
}

export const notFoundPage = {
  load: loadNotFoundPageData,
  View: NotFoundView,
  metadata: notFoundPageMetadata,
}
