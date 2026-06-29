import { getOpenApiDocumentJson } from '@/openapi/getDocument'

export async function GET(): Promise<Response> {
  const body = await getOpenApiDocumentJson()

  return new Response(body, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=60',
    },
  })
}
