import { buildThemeSearchIndex } from '@/search/buildThemeSearchIndex'

export const dynamic = 'force-dynamic'
export const revalidate = false

export async function GET() {
  const index = await buildThemeSearchIndex()

  return Response.json(index, {
    headers: { 'Content-Type': 'application/json' },
  })
}
