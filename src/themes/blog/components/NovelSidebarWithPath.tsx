'use client'

import React from 'react'
import { usePathname } from 'next/navigation'

import { getNovelsPath } from '@/utilities/frontendPaths'

import type { NovelSidebarData } from '../data/novelRoutes'
import { NovelSidebar } from './NovelSidebar'

type Props = {
  data: Omit<NovelSidebarData, 'currentChapterSlug'>
}

function resolveChapterSlug(pathname: string): string | undefined {
  const novelsPath = getNovelsPath()
  if (!pathname.startsWith(`${novelsPath}/`)) return undefined

  const parts = pathname.slice(novelsPath.length + 1).split('/').filter(Boolean)
  if (parts.length < 2) return undefined

  return decodeURIComponent(parts[1]!)
}

export function NovelSidebarWithPath({ data }: Props) {
  const pathname = usePathname()

  return <NovelSidebar data={{ ...data, currentChapterSlug: resolveChapterSlug(pathname) }} />
}
