import { queryPosts } from '@/utilities/queryFrontendData'

export const revalidate = false

export async function GET() {
  const posts = await queryPosts()

  const index = posts.map((p) => ({
    id: p.url,
    title: p.title,
    url: p.url,
    excerpt: (p.excerpt || '').slice(0, 200),
    categories: p.categories,
    tags: p.tags,
    body: (p.excerpt || '').slice(0, 8000),
  }))

  return Response.json(index, {
    headers: { 'Content-Type': 'application/json' },
  })
}
