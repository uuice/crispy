/**
 * Public site origin for redirects behind reverse proxies.
 *
 * Prefer request Host / X-Forwarded-* over NEXT_PUBLIC_SERVER_URL:
 * NEXT_PUBLIC_* is inlined at `next build` time (often localhost from the pack machine),
 * while Host reflects the real public domain at runtime.
 *
 * Optional runtime override (not baked at build): CRISPY_PUBLIC_ORIGIN=https://uuice.com
 */
export function resolvePublicRequestOrigin(request: Request): string {
  const forwardedHost = request.headers.get('x-forwarded-host')?.split(',')[0]?.trim()
  const forwardedProto = request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim() || 'https'

  if (forwardedHost && !isBindAddressHost(forwardedHost)) {
    return `${forwardedProto}://${forwardedHost}`
  }

  const host = request.headers.get('host')?.trim()
  if (host && !isBindAddressHost(host)) {
    const proto = request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim() || inferProto(request)
    return `${proto}://${host}`
  }

  const runtimeOrigin = process.env.CRISPY_PUBLIC_ORIGIN?.replace(/\/$/, '')
  if (runtimeOrigin && !isBindAddressOrigin(runtimeOrigin)) {
    return runtimeOrigin
  }

  const fromPublicEnv = process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, '')
  if (fromPublicEnv && !isBindAddressOrigin(fromPublicEnv)) {
    return fromPublicEnv
  }

  try {
    const url = new URL(request.url)
    if (!isBindAddressHost(url.host)) {
      return url.origin
    }
  } catch {
    // ignore
  }

  return runtimeOrigin || fromPublicEnv || 'http://localhost:3333'
}

function inferProto(request: Request): string {
  try {
    return new URL(request.url).protocol === 'https:' ? 'https' : 'http'
  } catch {
    return 'http'
  }
}

function isBindAddressHost(host: string): boolean {
  const hostname = host.replace(/^\[|\]$/g, '').split(':')[0]?.toLowerCase()
  return hostname === '0.0.0.0' || hostname === '127.0.0.1' || hostname === '::' || hostname === '::1'
}

function isBindAddressOrigin(origin: string): boolean {
  try {
    return isBindAddressHost(new URL(origin).host)
  } catch {
    return false
  }
}
