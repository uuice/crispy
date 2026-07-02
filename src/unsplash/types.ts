export type UnsplashSearchRequest = {
  query: string
  page: number
  limit?: number
  orientation?: UnsplashOrientation
}

export type UnsplashOrientation = 'landscape' | 'portrait' | 'squarish'

export type UnsplashPhoto = {
  id: string
  alt: string
  thumbUrl: string
  downloadLocation: string
  photographer: string
  photographerUrl: string
}

export type UnsplashSearchResponse = {
  photos: UnsplashPhoto[]
  page: number
  limit: number
  totalPages: number
  total: number
}

export type UnsplashImportRequest = {
  photoId: string
  downloadLocation: string
  alt?: string
}
