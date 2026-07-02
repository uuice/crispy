import { PreviewSearchParams } from '@/app/(frontend)/next/preview/route'
import { PayloadRequest, CollectionSlug } from 'payload'

import { getPagePath, getPostPath } from '@/utilities/frontendPaths'

type Props = {
  collection: CollectionSlug
  slug: string
  req: PayloadRequest
}

export const generatePreviewPath = ({ collection, slug }: Props) => {
  if (slug === undefined || slug === null) {
    return null
  }

  const encodedSlug = encodeURIComponent(slug)
  const path =
    collection === 'posts'
      ? getPostPath(decodeURIComponent(encodedSlug))
      : getPagePath(decodeURIComponent(encodedSlug))

  const encodedParams = new URLSearchParams({
    path,
    previewSecret: process.env.PREVIEW_SECRET || '',
  } satisfies PreviewSearchParams)

  const url = `/next/preview?${encodedParams.toString()}`

  return url
}
