import type { Metadata } from 'next'

import type { Page, Post } from '@/payload-types'
import { generateMeta } from '@/utilities/generateMeta'
import { getSiteName } from '@/utilities/getSiteSettings'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getServerSideURL } from '@/utilities/getURL'

function absoluteUrl(path: string): string {
  const base = getServerSideURL().replace(/\/$/, '')
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalized}`
}

export async function buildBlogListMetadata(args: {
  title: string
  description?: string
  path: string
  page?: number
}): Promise<Metadata> {
  const siteName = await getSiteName()
  const page = args.page ?? 1
  const title = page > 1 ? `${args.title} - 第 ${page} 页` : args.title
  const canonical = page > 1 ? `${args.path}?page=${page}` : args.path

  return {
    title,
    description: args.description,
    alternates: { canonical },
    openGraph: mergeOpenGraph(
      {
        title: `${title} | ${siteName}`,
        description: args.description || '',
        url: canonical,
      },
      siteName,
      args.description,
    ),
  }
}

export async function buildBlogPostMetadata(post: Post): Promise<Metadata> {
  const meta = await generateMeta({ doc: post })
  return {
    ...meta,
    alternates: {
      canonical: post.slug ? `/posts/${post.slug}` : undefined,
    },
  }
}

export async function buildBlogPageMetadata(page: Page): Promise<Metadata> {
  const meta = await generateMeta({ doc: page })
  return {
    ...meta,
    alternates: {
      canonical: page.slug ? `/pages/${page.slug}` : undefined,
    },
  }
}

export function buildArticleJsonLd(args: {
  title: string
  description?: string
  path: string
  datePublished?: string
  dateModified?: string
  imageUrl?: string
  authorName?: string
}): Record<string, unknown> {
  const url = absoluteUrl(args.path)

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: args.title,
    description: args.description,
    url,
    mainEntityOfPage: url,
    datePublished: args.datePublished,
    dateModified: args.dateModified || args.datePublished,
    image: args.imageUrl ? [args.imageUrl] : undefined,
    author: args.authorName
      ? {
          '@type': 'Person',
          name: args.authorName,
        }
      : undefined,
  }
}

export function getPostOgImageUrl(post: Post): string | undefined {
  const image = post.meta?.image
  if (!image || typeof image !== 'object' || !('url' in image) || !image.url) return undefined

  const serverUrl = getServerSideURL().replace(/\/$/, '')
  const og = image.sizes?.og?.url
  return og ? `${serverUrl}${og}` : `${serverUrl}${image.url}`
}
