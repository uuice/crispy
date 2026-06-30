import config from '@payload-config'
import { GRAPHQL_PLAYGROUND_GET } from '@payloadcms/next/routes'

import { requireAdminSessionFromRequest } from '@/utilities/requireAdminSession'

const playgroundGet = GRAPHQL_PLAYGROUND_GET(config)

/** Admin session required; overrides Payload default public playground in dev. */
export async function GET(request: Request): Promise<Response> {
  const auth = await requireAdminSessionFromRequest(request)
  if (!auth.ok) {
    return auth.response
  }

  return playgroundGet(request)
}
