import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'

import { PostArchiveLayout } from '@/components/PostArchiveLayout'
import { frontendLabels } from '@/i18n/frontend-labels'
import { DEFAULT_SITE_NAME } from '@/utilities/getSiteSettings'
import { queryPostsByTagSlug } from '@/utilities/queryPostsByTaxonomy'

export const revalidate = false

type Args = {
  params: Promise<{ slug: string }>
}

export default async function TagPage({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const { tag, posts } = await queryPostsByTagSlug(decodedSlug)

  if (!tag || !posts) notFound()

  return (
    <PostArchiveLayout
      description={tag.description}
      posts={posts}
      title={`${frontendLabels.tag.titlePrefix}${tag.title}`}
    />
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise
  const { tag } = await queryPostsByTagSlug(decodeURIComponent(slug))

  if (!tag) return { title: frontendLabels.tag.notFound }

  return {
    title: `${tag.title} | ${DEFAULT_SITE_NAME}`,
    description: tag.description || undefined,
  }
}

export async function generateStaticParams() {
  const configPromise = (await import('@payload-config')).default
  const { getPayload } = await import('payload')
  const payload = await getPayload({ config: configPromise })

  const tags = await payload.find({
    collection: 'tags',
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })

  return tags.docs.map(({ slug }) => ({ slug }))
}
