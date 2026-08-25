import Link from 'next/link'
import React from 'react'

import { Media } from '@/components/Media'
import { frontendLabels } from '@/i18n/frontend-labels'
import type { Media as MediaType } from '@/payload-types'
import { getGalleryPath } from '@/utilities/frontendPaths'

import { Banner } from '../components/Banner'
import type { GalleriesPageData } from '../pages/galleries'

type Props = {
  data: GalleriesPageData
}

export function GalleriesView({ data }: Props) {
  const { galleries } = data

  return (
    <>
      <Banner subtitle={frontendLabels.gallery.description} title={frontendLabels.gallery.title} />
      <div className="intro-bubble animate-in animate-in-delay-1">
        <p className="m-0 code-label">
          共 <strong>{galleries.length}</strong> 个图库
        </p>
      </div>
      <section className="space-y-4 animate-in animate-in-delay-2">
        {galleries.length > 0 ? (
          galleries.map((gallery) => {
            const cover = gallery.listCover
            const href = gallery.slug ? getGalleryPath(gallery.slug) : getGalleryPath(String(gallery.id))

            return (
              <article className="section-card p-5 sm:p-6" key={gallery.id}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  {cover?.url ? (
                    <Link className="relative block shrink-0" href={href} prefetch={false}>
                      <div className="gallery-grid-media" style={{ width: '8rem' }}>
                        <Media
                          fill
                          imageVariant="thumbnail"
                          imgClassName="gallery-grid-image"
                          resource={cover as MediaType}
                          size="8rem"
                        />
                      </div>
                    </Link>
                  ) : null}
                  <div className="min-w-0 flex-1">
                    <h2 className="content-title m-0">
                      <Link className="hover:opacity-80" href={href} prefetch={false}>
                        {gallery.title}
                      </Link>
                    </h2>
                    {gallery.description ? (
                      <p className="mt-2 mb-0 text-sm" style={{ color: 'var(--text-muted)' }}>
                        {gallery.description}
                      </p>
                    ) : null}
                    <p className="mt-4 mb-0">
                      <Link
                        className="inline-flex items-center gap-1 font-medium text-sm hover:opacity-80"
                        href={href}
                        prefetch={false}
                        style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
                      >
                        {frontendLabels.gallery.viewAll} →
                      </Link>
                    </p>
                  </div>
                </div>
              </article>
            )
          })
        ) : (
          <p className="code-label m-0">{frontendLabels.gallery.none}</p>
        )}
      </section>
    </>
  )
}
