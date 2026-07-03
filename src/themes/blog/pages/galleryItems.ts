import type { Metadata } from 'next'

import { frontendLabels } from '@/i18n/frontend-labels'

import { queryGalleryItems } from '../data/queries'
import { GalleryItemsView } from '../views/GalleryItemsView'

export type GalleryItemsPageData = {
  items: Awaited<ReturnType<typeof queryGalleryItems>>
}

export async function loadGalleryItemsPageData(): Promise<GalleryItemsPageData> {
  const items = await queryGalleryItems()
  return { items }
}

export function galleryItemsPageMetadata(): Metadata {
  return { title: frontendLabels.gallery.title }
}

export const galleryItemsPage = {
  load: loadGalleryItemsPageData,
  View: GalleryItemsView,
  metadata: galleryItemsPageMetadata,
}
