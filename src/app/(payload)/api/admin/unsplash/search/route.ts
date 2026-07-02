import {
  buildUnsplashSearchQuery,
  isUnsplashStyleId,
  isUnsplashTopicId,
  parseUnsplashOrientation,
} from '@/unsplash/categories'
import { isUnsplashEnabled } from '@/unsplash/isEnabled'
import { searchUnsplashPhotos } from '@/unsplash/server/searchPhotos'
import { requireAuthorSession } from '@/utilities/requireAuthorSession'

export async function GET(request: Request): Promise<Response> {
  const auth = await requireAuthorSession()
  if (!auth.ok) return auth.response

  if (!isUnsplashEnabled()) {
    return Response.json({ error: 'Unsplash is not configured' }, { status: 503 })
  }

  const { searchParams } = new URL(request.url)
  const keyword = searchParams.get('q')?.trim() ?? ''
  const topicParam = searchParams.get('topic')?.trim() ?? searchParams.get('category')?.trim() ?? 'all'
  const styleParam = searchParams.get('style')?.trim() ?? 'all'
  const page = Math.max(1, Number.parseInt(searchParams.get('page') ?? '1', 10) || 1)
  const orientation = parseUnsplashOrientation(searchParams.get('orientation'))

  if (!isUnsplashTopicId(topicParam)) {
    return Response.json({ error: 'Invalid topic' }, { status: 400 })
  }

  if (!isUnsplashStyleId(styleParam)) {
    return Response.json({ error: 'Invalid style' }, { status: 400 })
  }

  const query = buildUnsplashSearchQuery(topicParam, styleParam, keyword)
  if (!query) {
    return Response.json({ error: 'Select a topic/style or enter a keyword' }, { status: 400 })
  }

  try {
    const data = await searchUnsplashPhotos({ query, page, orientation })
    return Response.json(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unsplash search failed'
    return Response.json({ error: message }, { status: 502 })
  }
}
