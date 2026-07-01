import { getResolvedCacheSettings } from '@/frontend-cache/getCacheSettings'

export async function GET(): Promise<Response> {
  const settings = await getResolvedCacheSettings()

  return Response.json(settings, {
    headers: {
      'Cache-Control': 'private, max-age=60',
    },
  })
}
