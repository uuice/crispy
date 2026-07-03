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
    <ul className="gallery-grid">
      {items.map((item) => {
        const image = item.image
        const resource = image && typeof image === 'object' ? (image as MediaType) : null

        if (!resource?.url) {
          return null
        }

        return (
          <li key={item.id} className="gallery-grid-item group">
            <figure className="gallery-grid-figure">
              <div className="gallery-grid-media">
                <Media
                  fill
                  imgClassName="gallery-grid-image"
                  resource={resource}
                />
              </div>
              <figcaption>
                <p className="gallery-grid-title">{item.title}</p>
                {item.description ? (
                  <p className="gallery-grid-description">{item.description}</p>
                ) : null}
              </figcaption>
            </figure>
          </li>
        )
      })}
    </ul>
  )
}
