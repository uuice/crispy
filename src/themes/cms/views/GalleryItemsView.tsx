import React from 'react'

import { frontendLabels } from '@/i18n/frontend-labels'

import { GalleryGrid } from '../components/GalleryGrid'
import { PageHeader } from '../components/PageHeader'
import type { GalleryItemsPageData } from '../pages/galleryItems'

type Props = { data: GalleryItemsPageData }

export function GalleryItemsView({ data }: Props) {
  const { items } = data

  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        stats={<span className="cms-stat-pill">{items.length} 张图片</span>}
        subtitle={frontendLabels.gallery.description}
        title={frontendLabels.gallery.title}
      />
      <div className="cms-container cms-page-body">
        {items.length > 0 ? (
          <GalleryGrid items={items} />
        ) : (
          <p className="cms-empty">{frontendLabels.gallery.none}</p>
        )}
      </div>
    </>
  )
}
