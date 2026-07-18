import React from 'react'

import { GalleryLightboxGrid } from '@/components/GalleryLightbox/GalleryLightboxGrid'
import type { GalleryItem } from '@/payload-types'

type GalleryGridItem = Pick<GalleryItem, 'id' | 'title' | 'image'> &
  Partial<Pick<GalleryItem, 'description'>>

type Props = {
  items: GalleryGridItem[]
}

export function GalleryGrid({ items }: Props) {
  return (
    <GalleryLightboxGrid
      classNames={{
        grid: 'cms-gallery-grid',
        item: 'cms-gallery-item',
        media: 'cms-gallery-media',
        image: 'cms-gallery-image',
        title: 'cms-gallery-title',
        description: 'cms-gallery-description',
      }}
      items={items}
    />
  )
}
