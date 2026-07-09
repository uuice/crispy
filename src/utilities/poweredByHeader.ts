import type { NextResponse } from 'next/server'

const POWERED_BY_TOKENS = ['Next.js', 'Payload', 'uuice', 'crispy'] as const

export function applyPoweredByHeader(response: NextResponse): NextResponse {
  const existing = response.headers.get('X-Powered-By')
  const parts: string[] = []
  const seen = new Set<string>()

  for (const token of [...(existing ? existing.split(',') : []), ...POWERED_BY_TOKENS]) {
    const normalized = token.trim()
    if (!normalized) continue

    const key = normalized.toLowerCase()
    if (seen.has(key)) continue

    seen.add(key)
    parts.push(normalized)
  }

  response.headers.set('X-Powered-By', parts.join(', '))
  return response
}
