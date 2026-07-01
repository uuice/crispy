import { purgeDbCacheByRoutePath, purgeDbCacheByTags } from '@/frontend-cache/dbCache'

/** Invalidate database cache entries by tag (replaces Next.js revalidateTag). */
export async function invalidateCacheTag(tag: string): Promise<void> {
  await purgeDbCacheByTags([tag])
}

export async function invalidateCacheTags(tags: string[]): Promise<void> {
  await purgeDbCacheByTags(tags)
}

/** Invalidate route cache for a path (replaces Next.js revalidatePath for cache purposes). */
export async function invalidateCachePath(path: string): Promise<void> {
  await purgeDbCacheByRoutePath(path)
}
