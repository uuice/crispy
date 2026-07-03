import type { ThemeSearchIndexItem } from '@/themes/types'

import { queryPosts } from './data/queries'

export async function loadCmsSearchIndex(): Promise<ThemeSearchIndexItem[]> {
  const posts = await queryPosts()
  return posts.map((p) => ({
    id: p.url,
    title: p.title,
    url: p.url,
    excerpt: (p.excerpt || '').slice(0, 200),
    categories: p.categories,
    tags: p.tags,
    body: (p.excerpt || '').slice(0, 8000),
  }))
}
