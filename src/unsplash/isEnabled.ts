export function isUnsplashEnabled(): boolean {
  return Boolean(process.env.UNSPLASH_ACCESS_KEY?.trim())
}

export function getUnsplashAccessKey(): string {
  const key = process.env.UNSPLASH_ACCESS_KEY?.trim()
  if (!key) {
    throw new Error('UNSPLASH_ACCESS_KEY is not configured')
  }
  return key
}
