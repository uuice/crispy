import { buildSearchIndex } from '@/search/buildSearchIndex'

export const dynamic = 'force-dynamic'
export const revalidate = false

export async function GET() {
  const index = await buildSearchIndex()

  return Response.json(index, {
    headers: { 'Content-Type': 'application/json' },
  })
}
