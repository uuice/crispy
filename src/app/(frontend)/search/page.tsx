import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import configPromise from '@payload-config'
import { getPayload, type Where } from 'payload'
import React from 'react'
import { Search } from '@/search/Component'
import PageClient from './page.client'
import { CardPostData } from '@/components/Card'
import { frontendLabels } from '@/i18n/frontend-labels'
import { DEFAULT_SITE_NAME } from '@/utilities/getSiteSettings'
import { searchContentBySemantics } from '@/search/semanticSearch'
import type { Search as SearchDoc } from '@/payload-types'

export const revalidate = false

type Args = {
  searchParams: Promise<{
    q: string
  }>
}

async function findSearchDocsBySemanticQuery(
  payload: Awaited<ReturnType<typeof getPayload>>,
  query: string,
): Promise<SearchDoc[] | null> {
  try {
    const semantic = await searchContentBySemantics(payload, query, { limit: 12 })
    if (!semantic.length) return null

    const where = {
      or: semantic.map((hit) => ({
        and: [
          { 'doc.relationTo': { equals: hit.collection } },
          { 'doc.value': { equals: hit.docId } },
        ],
      })),
    } as unknown as Where

    const result = await payload.find({
      collection: 'search',
      depth: 1,
      limit: 12,
      pagination: false,
      where,
      select: {
        title: true,
        slug: true,
        categories: true,
        meta: true,
        doc: true,
      },
    })

    return result.docs.length > 0 ? (result.docs as SearchDoc[]) : null
  } catch {
    return null
  }
}

export default async function Page({ searchParams: searchParamsPromise }: Args) {
  const { q: query } = await searchParamsPromise
  const payload = await getPayload({ config: configPromise })

  let docs: SearchDoc[] = []

  if (query?.trim()) {
    const semanticDocs = await findSearchDocsBySemanticQuery(payload, query.trim())
    if (semanticDocs) {
      docs = semanticDocs
    }
  }

  if (!docs.length) {
    const keywordResult = await payload.find({
      collection: 'search',
      depth: 1,
      limit: 12,
      select: {
        title: true,
        slug: true,
        categories: true,
        meta: true,
      },
      pagination: false,
      ...(query
        ? {
            where: {
              or: [
                { title: { like: query } },
                { 'meta.description': { like: query } },
                { 'meta.title': { like: query } },
                { slug: { like: query } },
              ],
            },
          }
        : {}),
    })
    docs = keywordResult.docs as SearchDoc[]
  }

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none text-center">
          <h1 className="mb-8 lg:mb-16">{frontendLabels.search.title}</h1>

          <div className="max-w-[50rem] mx-auto">
            <Search />
          </div>
        </div>
      </div>

      {docs.length > 0 ? (
        <CollectionArchive posts={docs as CardPostData[]} />
      ) : (
        <div className="container">{frontendLabels.search.noResults}</div>
      )}
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: frontendLabels.search.title,
    description: `${DEFAULT_SITE_NAME} 站内搜索`,
  }
}
