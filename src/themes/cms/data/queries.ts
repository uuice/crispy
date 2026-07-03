export * from '../../shared/data/queries'
export * from '../../shared/data/types'

import { cache } from 'react'

import type { NavItem } from '../../shared/data/types'
import { querySidebarData } from '../../shared/data/queries'

import { resolveCmsMenu } from './constants'

export const queryCmsNavMenu = cache(async (): Promise<NavItem[]> => {
  const sidebar = await querySidebarData()
  return resolveCmsMenu(sidebar.menu)
})

export async function loadCmsLayoutData() {
  const menu = await queryCmsNavMenu()
  return { menu }
}
