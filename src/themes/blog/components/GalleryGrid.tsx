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
        grid: 'gallery-grid',
        item: 'gallery-grid-item group',
        figure: 'gallery-grid-figure',
        media: 'gallery-grid-media',
        image: 'gallery-grid-image',
        title: 'gallery-grid-title',
        description: 'gallery-grid-description',
      }}
      items={items}
    />
  )
}
