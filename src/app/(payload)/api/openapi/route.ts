import { getOpenApiDocumentJson } from '@/openapi/getDocument'
import { requireAdminSession } from '@/utilities/requireAdminSession'

export async function GET(): Promise<Response> {
  const auth = await requireAdminSession()
  if (!auth.ok) {
    return auth.response
  }

  const body = await getOpenApiDocumentJson()

  return new Response(body, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'private, max-age=60',
    },
  })
}
