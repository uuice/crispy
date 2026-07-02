import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { frontendLabels } from '@/i18n/frontend-labels'
import { DEFAULT_SITE_NAME } from '@/utilities/getSiteSettings'
import { queryArchiveGroups } from '@/utilities/queryPostsByTaxonomy'

export const revalidate = false

export default async function ArchivePage() {
  const groups = await queryArchiveGroups()

  return (
    <div className="pt-24 pb-24">
      <div className="container mb-12">
        <div className="prose dark:prose-invert max-w-none">
          <h1>{frontendLabels.archive.title}</h1>
          <p>{frontendLabels.archive.description}</p>
        </div>
      </div>

      <div className="container space-y-12">
        {groups.length === 0 && (
          <p className="text-muted-foreground">{frontendLabels.archive.none}</p>
        )}

        {groups.map(({ year, months }) => (
          <section key={year}>
            <h2 className="text-2xl font-semibold mb-6">{year}</h2>
            <div className="space-y-8">
              {months.map(({ month, label, posts }) => (
                <div key={`${year}-${month}`}>
                  <h3 className="text-lg font-medium mb-3 text-muted-foreground">
                    {label}
                    <span className="ml-2 text-sm">({posts.length})</span>
                  </h3>
                  <ul className="space-y-2">
                    {posts.map((post) => (
                      <li key={post.slug}>
                        <Link className="hover:underline" href={`/posts/${post.slug}`}>
                          {post.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `${frontendLabels.archive.title} | ${DEFAULT_SITE_NAME}`,
  }
}
