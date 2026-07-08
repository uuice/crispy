import 'dotenv/config'

import type { Payload } from 'payload'

import type { EmbeddableCollection } from '@/ai/embeddings/constants'
import { resolveEmbeddingConfig } from '@/ai/embeddings/config'
import { normalizeOpenAiBaseUrl } from '@/ai/providers/openaiCompatible'
import { syncContentEmbedding } from '@/ai/embeddings/syncContentEmbedding'
import { createLocalReq } from 'payload'

async function backfillCollection(payload: Payload, collection: EmbeddableCollection) {
  let page = 1
  let processed = 0

  while (true) {
    const result = await payload.find({
      collection,
      limit: 20,
      page,
      depth: 0,
      overrideAccess: true,
    })

    if (!result.docs.length) break

    const req = await createLocalReq({}, payload)

    for (const doc of result.docs) {
      await syncContentEmbedding(req, collection, doc as unknown as Record<string, unknown>)
      processed += 1
      process.stdout.write(`• ${collection} #${doc.id} … ✓\n`)
    }

    if (page >= result.totalPages) break
    page += 1
  }

  return processed
}

async function main() {
  const config = resolveEmbeddingConfig()
  if (!config.enabled) {
    console.error('✗ 向量回填未启用：需要 DATABASE_DRIVER=postgres、pgvector 及 Embedding API Key')
    process.exit(1)
  }

  console.log('\nCrispy 向量回填\n')
  console.log(`• 模型 ${config.model}`)
  console.log(`• 维度 ${config.dimensions}`)
  console.log(`• API ${normalizeOpenAiBaseUrl(config.baseUrl)}/v1/embeddings\n`)

  const { getPayload } = await import('payload')
  const configPromise = await import('@payload-config')
  const payload = await getPayload({ config: configPromise.default })

  let total = 0
  for (const collection of ['posts', 'pages'] as const) {
    process.stdout.write(`→ ${collection}\n`)
    total += await backfillCollection(payload, collection)
  }

  console.log(`\n完成，共处理 ${total} 条`)
  await payload.destroy()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

export {}
