import { getUnsplashAccessKey } from '@/unsplash/isEnabled'
import type { UnsplashPhoto, UnsplashSearchRequest, UnsplashSearchResponse } from '@/unsplash/types'

type UnsplashApiPhoto = {
  id: string
  alt_description: string | null
  urls: { thumb: string }
  links: { download_location: string }
  user: { name: string; links: { html: string } }
}

type UnsplashApiSearchResponse = {
  total: number
  total_pages: number
  results: UnsplashApiPhoto[]
}

const REFERRAL = 'utm_source=crispy&utm_medium=referral'

function formatPhoto(photo: UnsplashApiPhoto): UnsplashPhoto {
  return {
    id: photo.id,
    alt: photo.alt_description?.trim() || 'Unsplash photo',
    thumbUrl: photo.urls.thumb,
    downloadLocation: photo.links.download_location,
    photographer: photo.user.name,
    photographerUrl: `${photo.user.links.html}?${REFERRAL}`,
  }
}

export async function searchUnsplashPhotos({
  query,
  page,
  orientation,
}: UnsplashSearchRequest): Promise<UnsplashSearchResponse> {
  const accessKey = getUnsplashAccessKey()
  const params = new URLSearchParams({
    query: query.trim(),
    page: String(page),
    per_page: '20',
  })

  if (orientation) {
    params.set('orientation', orientation)
  }

  const res = await fetch(`https://api.unsplash.com/search/photos?${params.toString()}`, {
    headers: { Authorization: `Client-ID ${accessKey}` },
  })

  if (!res.ok) {
    throw new Error(`Unsplash search failed (${res.status})`)
  }

  const data = (await res.json()) as UnsplashApiSearchResponse

  return {
    photos: data.results.map(formatPhoto),
    page,
    totalPages: Math.min(data.total_pages, 100),
    total: data.total,
  }
}
