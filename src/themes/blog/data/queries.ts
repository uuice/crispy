export * from '../../shared/data/queries'
export * from '../../shared/data/types'

import { cache } from 'react'

import type { NavItem } from '../../shared/data/types'

import { defaultBlogMenu } from './constants'

export const queryBlogNavMenu = cache(async (): Promise<NavItem[]> => {
  return defaultBlogMenu
})
