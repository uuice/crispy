import { loadRedirectMap } from '@/redirects/loadRedirectMap'

export async function GET(): Promise<Response> {
  const redirects = await loadRedirectMap()

  return Response.json(
    { redirects },
    {
      headers: {
        'Cache-Control': 'private, max-age=60',
      },
    },
  )
}
