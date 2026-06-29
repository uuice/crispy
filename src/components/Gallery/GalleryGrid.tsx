import React from 'react'

import { Media } from '@/components/Media'
import type { GalleryItem, Media as MediaType } from '@/payload-types'

type GalleryGridItem = Pick<GalleryItem, 'id' | 'title' | 'image'> &
  Partial<Pick<GalleryItem, 'description'>>

type Props = {
  items: GalleryGridItem[]
}

export function GalleryGrid({ items }: Props) {
  return (
    <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
      {items.map((item) => {
        const image = item.image
        const resource = image && typeof image === 'object' ? (image as MediaType) : null

        if (!resource?.url) {
          return null
        }

        return (
          <li key={item.id} className="group">
            <figure className="flex flex-col gap-2">
              <div className="relative aspect-square overflow-hidden rounded-lg border border-border bg-muted">
                <Media
                  fill
                  imgClassName="object-cover transition-transform duration-300 group-hover:scale-105"
                  resource={resource}
                />
              </div>
              <figcaption>
                <p className="text-sm font-medium leading-tight">{item.title}</p>
                {item.description && (
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                )}
              </figcaption>
            </figure>
          </li>
        )
      })}
    </ul>
  )
}
