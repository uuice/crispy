export * from '../../shared/data/queries'
export * from '../../shared/data/types'

import { cache } from 'react'

import type { NavItem } from '../../shared/data/types'
import { querySidebarData } from '../../shared/data/queries'

import { resolveKbMenu } from './constants'

export const queryKbNavMenu = cache(async (): Promise<NavItem[]> => {
  const sidebar = await querySidebarData()
  return resolveKbMenu(sidebar.menu)
})

export async function loadKbLayoutData() {
  const sidebar = await querySidebarData()
  return {
    menu: resolveKbMenu(sidebar.menu),
    footerMenu: sidebar.footerMenu,
    categories: sidebar.categories,
  }
}
