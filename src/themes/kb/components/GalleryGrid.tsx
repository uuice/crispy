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
        grid: 'kb-gallery-grid',
        item: 'kb-gallery-item',
        media: 'kb-gallery-media',
        image: 'kb-gallery-image',
        title: 'kb-gallery-title',
        description: 'kb-gallery-description',
      }}
      items={items}
    />
  )
}
