import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { frontendLabels } from '@/i18n/frontend-labels'
import type { SlugPageProps } from '@/themes/types'
import { getGalleryPath } from '@/utilities/frontendPaths'

import { queryGalleryBySlug } from '../data/queries'
import { buildBlogListMetadata } from '../seo'
import { GalleryDetailView } from '../views/GalleryDetailView'

export type GalleryDetailPageData = {
  gallery: NonNullable<Awaited<ReturnType<typeof queryGalleryBySlug>>['gallery']>
  items: Awaited<ReturnType<typeof queryGalleryBySlug>>['items']
}

export async function loadGalleryDetailPageData({
  params,
}: SlugPageProps): Promise<GalleryDetailPageData> {
  const { slug } = await params
  const { gallery, items } = await queryGalleryBySlug(decodeURIComponent(slug))

  if (!gallery) notFound()

  return { gallery, items }
}

export async function galleryDetailPageMetadata({ params }: SlugPageProps): Promise<Metadata> {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)
  const { gallery } = await queryGalleryBySlug(decodedSlug)
  if (!gallery) return { title: frontendLabels.gallery.notFound }

  return buildBlogListMetadata({
    title: gallery.title,
    description: gallery.description || frontendLabels.gallery.description,
    path: getGalleryPath(decodedSlug),
  })
}

export async function galleryDetailStaticParams() {
  const configPromise = (await import('@payload-config')).default
  const { getPayload } = await import('payload')
  const payload = await getPayload({ config: configPromise })

  const galleries = await payload.find({
    collection: 'galleries',
    limit: 100,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
    where: { enabled: { equals: true } },
  })

  return galleries.docs.map(({ slug }) => ({ slug: slug || '' }))
}

export const galleryDetailPage = {
  params: 'slug' as const,
  load: loadGalleryDetailPageData,
  View: GalleryDetailView,
  metadata: galleryDetailPageMetadata,
  staticParams: galleryDetailStaticParams,
}
