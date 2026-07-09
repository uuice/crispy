import type { Redirect } from '@/payload-types'

import { getRedirects } from '@/utilities/getRedirects'

import { resolveRedirectDestination } from './resolveRedirectDestination'

export async function loadRedirectMap(): Promise<Record<string, string>> {
  const redirects = await getRedirects(1)
  const map: Record<string, string> = {}

  for (const redirect of redirects) {
    if (!redirect.from || redirect.deletedAt) continue

    const destination = resolveRedirectDestination(redirect as Redirect)
    if (destination) {
      map[redirect.from] = destination
    }
  }

  return map
}
