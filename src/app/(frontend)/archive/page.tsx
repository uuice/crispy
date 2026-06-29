import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { DEFAULT_SITE_NAME } from '@/utilities/getSiteSettings'
import { queryArchiveGroups } from '@/utilities/queryPostsByTaxonomy'

export const revalidate = 600

export default async function ArchivePage() {
  const groups = await queryArchiveGroups()

  return (
    <div className="pt-24 pb-24">
      <div className="container mb-12">
        <div className="prose dark:prose-invert max-w-none">
          <h1>归档</h1>
          <p>按发布时间浏览全部文章</p>
        </div>
      </div>

      <div className="container space-y-12">
        {groups.length === 0 && <p className="text-muted-foreground">暂无已发布文章</p>}

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
    title: `归档 | ${DEFAULT_SITE_NAME}`,
  }
}
