import type { Metadata } from 'next'

import { frontendLabels } from '@/i18n/frontend-labels'
import { getGalleriesPath } from '@/utilities/frontendPaths'

import { queryGalleries } from '../data/queries'
import { buildBlogListMetadata } from '../seo'
import { GalleriesView } from '../views/GalleriesView'

export type GalleriesPageData = {
  galleries: Awaited<ReturnType<typeof queryGalleries>>
}

export async function loadGalleriesPageData(): Promise<GalleriesPageData> {
  const galleries = await queryGalleries()
  return { galleries }
}

export async function galleriesPageMetadata(): Promise<Metadata> {
  return buildBlogListMetadata({
    title: frontendLabels.gallery.title,
    description: frontendLabels.gallery.description,
    path: getGalleriesPath(),
  })
}

export const galleriesPage = {
  load: loadGalleriesPageData,
  View: GalleriesView,
  metadata: galleriesPageMetadata,
}
