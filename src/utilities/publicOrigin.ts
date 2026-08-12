/**
 * Public site origin for redirects / absolute URLs behind reverse proxies.
 * Standalone often sets HOSTNAME=0.0.0.0 for bind — that must never become the browser origin.
 */
export function resolvePublicRequestOrigin(request: Request): string {
  const fromEnv = process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, '')
  if (fromEnv && !isBindAddressOrigin(fromEnv)) {
    return fromEnv
  }

  const forwardedHost = request.headers.get('x-forwarded-host')?.split(',')[0]?.trim()
  const forwardedProto = request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim() || 'https'

  if (forwardedHost && !isBindAddressHost(forwardedHost)) {
    return `${forwardedProto}://${forwardedHost}`
  }

  const host = request.headers.get('host')?.trim()
  if (host && !isBindAddressHost(host)) {
    const proto = request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim() || 'https'
    return `${proto}://${host}`
  }

  try {
    const url = new URL(request.url)
    if (!isBindAddressHost(url.host)) {
      return url.origin
    }
  } catch {
    // ignore
  }

  return fromEnv || 'http://localhost:3333'
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
