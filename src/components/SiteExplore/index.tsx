import Link from 'next/link'
import React from 'react'

import { frontendLabels } from '@/i18n/frontend-labels'
import { getCachedSiteExploreData } from '@/utilities/getSiteExploreData'

function pageHref(slug: string): string {
  if (slug === 'about') return '/about'
  return `/pages/${slug}`
}

export async function SiteExplore() {
  const data = await getCachedSiteExploreData()

  const hasContent =
    data.posts.length > 0 ||
    data.categories.length > 0 ||
    data.tags.length > 0 ||
    data.pages.length > 0

  if (!hasContent) return null

  return (
    <section className="container mt-16 space-y-16 border-t border-border pt-16">
      <header className="prose dark:prose-invert max-w-none">
        <h2>{frontendLabels.explore.title}</h2>
        <p>{frontendLabels.explore.subtitle}</p>
      </header>

      {data.posts.length > 0 && (
        <div>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h3 className="text-xl font-semibold">{frontendLabels.posts.latest}</h3>
            <Link className="text-sm text-primary hover:underline" href="/archives">
              {frontendLabels.posts.viewAll}
            </Link>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.posts.map((post) => (
              <li key={post.id}>
                <Link
                  className="block rounded-lg border border-border p-4 hover:bg-muted/40 transition-colors"
                  href={`/archives/${post.slug}`}
                >
                  <span className="font-medium">{post.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-12 lg:grid-cols-2">
        {data.categories.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-4">{frontendLabels.explore.categories}</h3>
            <div className="flex flex-wrap gap-2">
              {data.categories.map((cat) => (
                <Link
                  key={cat.id}
                  className="rounded-full border border-border px-3 py-1 text-sm hover:bg-muted/40"
                  href={`/categories/${cat.slug}`}
                >
                  {cat.title}
                </Link>
              ))}
            </div>
          </div>
        )}

        {data.tags.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-4">{frontendLabels.explore.tags}</h3>
            <div className="flex flex-wrap gap-2">
              {data.tags.map((tag) => (
                <Link
                  key={tag.id}
                  className="rounded-full bg-muted px-3 py-1 text-sm hover:bg-muted/80"
                  href={`/tags/${tag.slug}`}
                >
                  #{tag.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {data.pages.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">{frontendLabels.pages.title}</h3>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {data.pages.map((page) => (
              <li key={page.id}>
                <Link className="text-primary hover:underline" href={pageHref(page.slug)}>
                  {page.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h3 className="text-xl font-semibold mb-4">{frontendLabels.explore.navigation}</h3>
        <div className="flex flex-wrap gap-3">
          {[
            { href: '/', label: frontendLabels.site.home },
            { href: '/archives', label: frontendLabels.site.archive },
            { href: '/links', label: frontendLabels.links.title },
            { href: '/about', label: '关于' },
            { href: '/navigations', label: '导航' },
            { href: '/games', label: '小游戏' },
            { href: '/rss.xml', label: frontendLabels.site.rss },
          ].map(({ href, label }) => (
            <Link
              key={href}
              className="rounded-md border border-border px-4 py-2 text-sm hover:bg-muted/40"
              href={href}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
