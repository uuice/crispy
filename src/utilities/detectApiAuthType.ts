/** Classify auth mechanism without logging secrets. */
export function detectApiAuthType(request: Request): 'none' | 'session' | 'api-key' | 'bearer' {
  const authorization = request.headers.get('authorization')?.trim()

  if (authorization) {
    if (/^users\s+api-key\s+/i.test(authorization)) {
      return 'api-key'
    }

    if (/^bearer\s+/i.test(authorization)) {
      return 'bearer'
    }
  }

  const cookie = request.headers.get('cookie') ?? ''
  if (cookie.includes('payload-token=')) {
    return 'session'
  }

  return 'none'
}
