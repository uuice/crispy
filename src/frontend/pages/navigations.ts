import type { Metadata } from 'next'

import { loadNavigationsPageData } from '../data/navigations'

import { NavigationsView } from '../views/NavigationsView'

export type { NavCategory, NavigationsPageData } from '../data/navigations'

export { loadNavigationsPageData }

export function navigationsPageMetadata(): Metadata {
  return { title: '类库导航' }
}

export const navigationsPage = {
  load: loadNavigationsPageData,
  View: NavigationsView,
  metadata: navigationsPageMetadata,
}
