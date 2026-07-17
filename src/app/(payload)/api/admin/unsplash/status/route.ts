import { isUnsplashEnabled } from '@/unsplash/isEnabled'
import { requireAuthorSession } from '@/utilities/requireAuthorSession'

export async function GET(): Promise<Response> {
  const auth = await requireAuthorSession()
  if (!auth.ok) return auth.response

  return Response.json({ enabled: await isUnsplashEnabled() })
}
