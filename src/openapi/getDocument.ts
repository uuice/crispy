import config from '@payload-config'
import { getPayload } from 'payload'

import { buildOpenApiDocument } from '@/openapi/buildDocument'
import { getServerSideURL } from '@/utilities/getURL'

let cachedDocument: string | null = null
let cachedAt = 0
const CACHE_MS = process.env.NODE_ENV === 'production' ? 60_000 : 5_000

/** Returns OpenAPI JSON string, with short-lived cache in dev/prod. */
export async function getOpenApiDocumentJson(): Promise<string> {
  const now = Date.now()
  if (cachedDocument && now - cachedAt < CACHE_MS) {
    return cachedDocument
  }

  const payload = await getPayload({ config })
  const serverUrl = getServerSideURL().replace(/\/$/, '')
  const document = await buildOpenApiDocument(payload, serverUrl)

  cachedDocument = JSON.stringify(document, null, 2)
  cachedAt = now

  return cachedDocument
}

export function clearOpenApiCache(): void {
  cachedDocument = null
  cachedAt = 0
}
