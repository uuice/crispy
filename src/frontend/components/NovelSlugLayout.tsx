import React from 'react'
import { notFound } from 'next/navigation'

import { getNovelPath, getNovelsPath } from '@/utilities/frontendPaths'

import { queryNovelChapters } from '../data/queries'
import { NovelSidebarWithPath } from './NovelSidebarWithPath'

type Props = {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

export async function NovelSlugLayout({ children, params }: Props) {
  const { slug } = await params
  const { novel, chapters } = await queryNovelChapters(decodeURIComponent(slug))

  if (!novel?.slug) notFound()

  const sidebarData = {
    novelTitle: novel.title,
    novelUrl: getNovelPath(novel.slug),
    novelsUrl: getNovelsPath(),
    chapters,
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
      <div className="flex-1 min-w-0">{children}</div>
      <div className="w-72 shrink-0 hidden lg:block">
        <div className="sticky top-24">
          <NovelSidebarWithPath data={sidebarData} />
        </div>
      </div>
      <div className="lg:hidden border-t" style={{ borderColor: 'var(--card-border)' }}>
        <NovelSidebarWithPath data={sidebarData} />
      </div>
    </div>
  )
}
