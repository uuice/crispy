import { loadThemeSearchIndex } from '@/themes/render'

export const revalidate = false

export async function GET() {
  const index = await loadThemeSearchIndex()

  return Response.json(index, {
    headers: { 'Content-Type': 'application/json' },
  })
}
