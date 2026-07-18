import Link from 'next/link'
import React from 'react'

import { frontendLabels } from '@/i18n/frontend-labels'
import { getGalleriesPath } from '@/utilities/frontendPaths'

import { Banner } from '../components/Banner'
import { GalleryGrid } from '../components/GalleryGrid'
import type { GalleryDetailPageData } from '../pages/galleryDetail'

type Props = {
  data: GalleryDetailPageData
}

export function GalleryDetailView({ data }: Props) {
  const { gallery, items } = data

  return (
    <>
      <Banner
        subtitle={gallery.description || frontendLabels.gallery.description}
        title={gallery.title}
      />
      <div className="intro-bubble animate-in animate-in-delay-1">
        <p className="m-0 code-label">
          共 <strong>{items.length}</strong> {frontendLabels.gallery.itemCount}
          {' · '}
          <Link className="hover:opacity-80" href={getGalleriesPath()} prefetch={false}>
            {frontendLabels.gallery.title}
          </Link>
        </p>
      </div>
      <section className="section-card p-5 sm:p-6 animate-in animate-in-delay-2">
        {items.length > 0 ? (
          <GalleryGrid items={items} />
        ) : (
          <p className="code-label m-0">{frontendLabels.gallery.noneItems}</p>
        )}
      </section>
    </>
  )
}
