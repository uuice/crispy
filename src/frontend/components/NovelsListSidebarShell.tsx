'use client'

import React from 'react'
import { usePathname } from 'next/navigation'

import type { LatestNovelChapterItem } from '../data/types'
import { isNovelsListPath } from '../data/novelRoutes'
import { NovelsListSidebar } from './NovelsListSidebar'

type Props = {
  chapters: LatestNovelChapterItem[]
}

export function NovelsListSidebarShell({ chapters }: Props) {
  const pathname = usePathname()

  if (!isNovelsListPath(pathname)) {
    return null
  }

  return (
    <>
      <div className="w-72 shrink-0 hidden lg:block">
        <div className="sticky top-24">
          <NovelsListSidebar chapters={chapters} />
        </div>
      </div>
      <div className="lg:hidden border-t" style={{ borderColor: 'var(--card-border)' }}>
        <NovelsListSidebar chapters={chapters} />
      </div>
    </>
  )
}
