import config from '@payload-config'
import { getPayload } from 'payload'

let cachedKey: string | null | undefined
let cachedAt = 0
const CACHE_MS = 30_000

export function resetUnsplashKeyCache(): void {
  cachedKey = undefined
  cachedAt = 0
}

function relationId(value: unknown): string | number | undefined {
  if (value == null) return undefined
  if (typeof value === 'object' && value !== null && 'id' in value) {
    return (value as { id: string | number }).id
  }
  if (typeof value === 'string' || typeof value === 'number') return value
  return undefined
}

/** DB Active Unsplash key only (no UNSPLASH_ACCESS_KEY env fallback). Cached briefly. */
export async function resolveUnsplashAccessKey(): Promise<string | null> {
  const now = Date.now()
  if (cachedKey !== undefined && now - cachedAt < CACHE_MS) {
    return cachedKey
  }

  try {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({
      slug: 'integration-settings',
      depth: 0,
      overrideAccess: true,
    })
    const id = relationId(settings?.activeUnsplash)
    if (id != null) {
      const cred = await payload.findByID({
        collection: 'integration-credentials',
        id,
        depth: 0,
        overrideAccess: true,
        context: { returnSecrets: true },
      })
      if (cred && cred.enabled !== false && cred.type === 'unsplash' && cred.apiKey) {
        cachedKey = String(cred.apiKey).trim() || null
        cachedAt = now
        return cachedKey
      }
    }
  } catch {
    // ignore
  }

  cachedKey = null
  cachedAt = now
  return null
}

export async function isUnsplashEnabled(): Promise<boolean> {
  return Boolean(await resolveUnsplashAccessKey())
}

export async function getUnsplashAccessKey(): Promise<string> {
  const key = await resolveUnsplashAccessKey()
  if (!key) {
    throw new Error('Unsplash 未配置：请在「集成凭证」添加 Key，并在「集成设置」中选为 Active')
  }
  return key
}
