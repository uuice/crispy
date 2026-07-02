import type { Metadata } from 'next'
import React from 'react'

import { Banner } from '@/components/BlogSkin/Banner'
import { GalleryGrid } from '@/components/Gallery/GalleryGrid'
import { frontendLabels } from '@/i18n/frontend-labels'
import { getCachedGalleryItems } from '@/utilities/getGalleryItems'

export const revalidate = false

export default async function GalleryItemsPage() {
  const items = await getCachedGalleryItems()

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

export const metadata: Metadata = {
  title: frontendLabels.gallery.title,
}
