/**
 * Resolve the origin the request proxy should use for internal API self-fetch.
 * In production behind a reverse proxy, fetching the public URL often fails (hairpin NAT / TLS).
 */
export function resolveMiddlewareFetchOrigin(requestUrl: string): string {
  const explicit = process.env.CRISPY_INTERNAL_ORIGIN?.replace(/\/$/, '')
  if (explicit) return explicit

  if (process.env.NODE_ENV === 'production') {
    const port = process.env.PORT || '3333'
    return `http://127.0.0.1:${port}`
  }

  return new URL(requestUrl).origin
}

export function internalApiUrl(path: string, requestUrl: string): URL {
  return new URL(path, resolveMiddlewareFetchOrigin(requestUrl))
}

/** Preserve the public Host when calling loopback so SSR/routes see the real site. */
export function withForwardedPublicHost(
  requestUrl: string,
  init: RequestInit = {},
): RequestInit {
  const headers = new Headers(init.headers)
  const publicHost = new URL(requestUrl).host

  if (publicHost && !headers.has('x-forwarded-host')) {
    headers.set('x-forwarded-host', publicHost)
  }

  return { ...init, headers }
}
