import React from 'react'

import { GalleryGrid } from '../components/GalleryGrid'
import { frontendLabels } from '@/i18n/frontend-labels'

import type { GalleryItemsPageData } from '../pages/galleryItems'
import { Banner } from '../components/Banner'

type Props = {
  data: GalleryItemsPageData
}

export function GalleryItemsView({ data }: Props) {
  const { items } = data

  return (
    <>
      <Banner subtitle={frontendLabels.gallery.description} title={frontendLabels.gallery.title} />
      <div className="intro-bubble animate-in animate-in-delay-1">
        <p className="m-0 code-label">
          共 <strong>{items.length}</strong> 张图片
        </p>
      </div>
      <section className="section-card p-5 sm:p-6 animate-in animate-in-delay-2">
        {items.length > 0 ? (
          <GalleryGrid items={items} />
        ) : (
          <p className="code-label m-0">{frontendLabels.gallery.none}</p>
        )}
      </section>
    </>
  )
}
