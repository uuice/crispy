import type { Metadata } from 'next/types'

import React from 'react'

import { GalleryGrid } from '@/components/Gallery/GalleryGrid'
import { frontendLabels } from '@/i18n/frontend-labels'
import { DEFAULT_SITE_NAME } from '@/utilities/getSiteSettings'
import { getCachedGalleryItems } from '@/utilities/getGalleryItems'

export const revalidate = false

export default async function GalleryPage() {
  const items = await getCachedGalleryItems()

  return (
    <div className="pt-24 pb-24">
      <div className="container mb-12">
        <div className="prose dark:prose-invert max-w-none">
          <h1>{frontendLabels.gallery.title}</h1>
          <p>{frontendLabels.gallery.description}</p>
        </div>
      </div>

      <div className="container">
        {items.length === 0 ? (
          <p className="text-muted-foreground">{frontendLabels.gallery.none}</p>
        ) : (
          <GalleryGrid items={items} />
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: frontendLabels.gallery.title,
    description: `${DEFAULT_SITE_NAME} ${frontendLabels.gallery.title}`,
  }
}
