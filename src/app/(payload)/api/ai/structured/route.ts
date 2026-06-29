import config from '@payload-config'
import { headers } from 'next/headers'
import { createLocalReq, getPayload } from 'payload'

import { assertAiAccess } from '@/ai/access'
import { runAiSuggestTaxonomy } from '@/ai/runCompletion'
import type { AiStructuredRequest } from '@/ai/types'

export async function POST(request: Request): Promise<Response> {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()

  const { user } = await payload.auth({ headers: requestHeaders })

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: AiStructuredRequest
  try {
    body = (await request.json()) as AiStructuredRequest
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (body.action !== 'suggest_taxonomy' || !body.context) {
    return Response.json({ error: 'Invalid structured request' }, { status: 400 })
  }

  try {
    const req = await createLocalReq({ user }, payload)
    await assertAiAccess(req, body.collection, body.docId)

    const [categories, tags, siteSettings] = await Promise.all([
      payload.find({
        collection: 'categories',
        limit: 200,
        pagination: false,
        depth: 0,
        select: { title: true },
        overrideAccess: false,
      }),
      payload.find({
        collection: 'tags',
        limit: 200,
        pagination: false,
        depth: 0,
        select: { title: true },
        overrideAccess: false,
      }),
      payload.findGlobal({
        slug: 'site-settings',
        depth: 0,
        overrideAccess: true,
      }),
    ])

    const context = {
      ...body.context,
      siteName: body.context.siteName ?? siteSettings?.siteName ?? 'Crispy',
      existingCategories: categories.docs.map((c) => c.title).filter(Boolean) as string[],
      existingTags: tags.docs.map((t) => t.title).filter(Boolean) as string[],
    }

    const result = await runAiSuggestTaxonomy(context)

    return Response.json({
      data: result,
      categories: categories.docs,
      tags: tags.docs,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'AI request failed'
    const status = message.includes('未启用') ? 503 : message.includes('无权') ? 403 : 500
    payload.logger.error({ err: error, message: 'AI structured failed' })
    return Response.json({ error: message }, { status })
  }
}
