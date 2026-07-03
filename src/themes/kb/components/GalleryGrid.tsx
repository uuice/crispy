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
    <ul className="kb-gallery-grid">
      {items.map((item) => {
        const image = item.image
        const resource = image && typeof image === 'object' ? (image as MediaType) : null

        if (!resource?.url) {
          return null
        }

        return (
          <li key={item.id} className="kb-gallery-item">
            <figure>
              <div className="kb-gallery-media">
                <Media fill imgClassName="kb-gallery-image" resource={resource} />
              </div>
              <figcaption>
                <p className="kb-gallery-title">{item.title}</p>
                {item.description ? (
                  <p className="kb-gallery-description">{item.description}</p>
                ) : null}
              </figcaption>
            </figure>
          </li>
        )
      })}
    </ul>
  )
}
