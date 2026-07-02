import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'

import { PostArchiveLayout } from '@/components/PostArchiveLayout'
import { frontendLabels } from '@/i18n/frontend-labels'
import { DEFAULT_SITE_NAME } from '@/utilities/getSiteSettings'
import { queryPostsByCategorySlug } from '@/utilities/queryPostsByTaxonomy'

export const revalidate = false

type Args = {
  params: Promise<{ slug: string }>
}

export default async function CategoryPage({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const { category, posts } = await queryPostsByCategorySlug(decodedSlug)

  if (!category || !posts) notFound()

  return (
    <PostArchiveLayout
      description={null}
      posts={posts}
      title={`${frontendLabels.category.titlePrefix}${category.title}`}
    />
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise
  const { category } = await queryPostsByCategorySlug(decodeURIComponent(slug))

  if (!category) return { title: frontendLabels.category.notFound }

  return {
    title: `${category.title} | ${DEFAULT_SITE_NAME}`,
  }
}

export async function generateStaticParams() {
  const configPromise = (await import('@payload-config')).default
  const { getPayload } = await import('payload')
  const payload = await getPayload({ config: configPromise })

  const categories = await payload.find({
    collection: 'categories',
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })

  return categories.docs.map(({ slug }) => ({ slug }))
}
