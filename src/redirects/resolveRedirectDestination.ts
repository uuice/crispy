import type { Redirect } from '@/payload-types'
import { getPagePath, getPostPath } from '@/utilities/frontendPaths'

export function resolveRedirectDestination(redirect: Redirect): string | null {
  const to = redirect.to
  if (!to) return null

  if (to.url) {
    return to.url
  }

  const reference = to.reference
  if (!reference?.value) return null

  const slug =
    typeof reference.value === 'object' && reference.value !== null
      ? reference.value.slug
      : null

  if (!slug) return null

  if (reference.relationTo === 'pages') {
    return getPagePath(slug)
  }

  if (reference.relationTo === 'posts') {
    return getPostPath(slug)
  }

  return null
}
