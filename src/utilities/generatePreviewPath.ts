import { PreviewSearchParams } from '@/app/(frontend)/next/preview/route'
import { PayloadRequest, CollectionSlug } from 'payload'

type Props = {
  collection: CollectionSlug
  slug: string
  req: PayloadRequest
}

function pagePreviewPath(slug: string): string {
  if (slug === 'home') return '/'
  if (slug === 'about') return '/about'
  return `/pages/${slug}`
}

export const generatePreviewPath = ({ collection, slug }: Props) => {
  if (slug === undefined || slug === null) {
    return null
  }

  const encodedSlug = encodeURIComponent(slug)
  const path =
    collection === 'posts' ? `/archives/${encodedSlug}` : pagePreviewPath(decodeURIComponent(encodedSlug))

  const encodedParams = new URLSearchParams({
    path,
    previewSecret: process.env.PREVIEW_SECRET || '',
  } satisfies PreviewSearchParams)

  const url = `/next/preview?${encodedParams.toString()}`

  return url
}
