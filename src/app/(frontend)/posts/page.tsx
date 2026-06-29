import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { AdSlot } from '@/components/AdSlot'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import { frontendLabels } from '@/i18n/frontend-labels'
import { DEFAULT_SITE_NAME } from '@/utilities/getSiteSettings'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      categories: true,
      tags: true,
      meta: true,
    },
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>{frontendLabels.posts.title}</h1>
          <p>{frontendLabels.posts.description}</p>
        </div>
      </div>

      <div className="container mb-8">
        <AdSlot slot="post-list-top" />
        <PageRange
          collection="posts"
          currentPage={posts.page}
          limit={12}
          totalDocs={posts.totalDocs}
        />
      </div>

      <CollectionArchive posts={posts.docs} showTags />

      <div className="container">
        {posts.totalPages > 1 && posts.page && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: frontendLabels.posts.title,
    description: `${DEFAULT_SITE_NAME} ${frontendLabels.posts.description}`,
  }
}
