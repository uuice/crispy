export * from './contentQueries'
export * from './contentTypes'

import { cache } from 'react'

import type { NavItem } from './contentTypes'

import { defaultBlogMenu } from './constants'

export const queryBlogNavMenu = cache(async (): Promise<NavItem[]> => {
  return defaultBlogMenu
})
