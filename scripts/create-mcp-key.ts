/**
 * Regenerate MCP API key for the seeded agent user.
 *
 * Usage: pnpm cli mcp:key
 */
import 'dotenv/config'
import crypto from 'crypto'
import { getPayload } from 'payload'
import config from '@payload-config'

async function main() {
  const payload = await getPayload({ config })

  const agentResult = await payload.find({
    collection: 'users',
    limit: 1,
    where: { email: { equals: 'agent@example.com' } },
  })

  const agent = agentResult.docs[0]
  if (!agent) {
    console.error('agent@example.com not found. Run pnpm cli db:seed first.')
    process.exit(1)
  }

  await payload.delete({
    collection: 'payload-mcp-api-keys',
    overrideAccess: true,
    where: { label: { equals: '开发 Agent' } },
  })

  const mcpApiKey = crypto.randomBytes(32).toString('hex')

  await payload.create({
    collection: 'payload-mcp-api-keys',
    data: {
      label: '开发 Agent',
      description: '本地开发 / MCP 验证用',
      user: agent.id,
      enableAPIKey: true,
      apiKey: mcpApiKey,
      posts: { find: true, create: true, update: true, delete: true },
      pages: { find: true, create: true, update: true, delete: true },
      categories: { find: true, create: true, update: true, delete: true },
      tags: { find: true, create: true, update: true, delete: true },
      links: { find: true, create: true, update: true, delete: true },
      linkGroups: { find: true, create: true, update: true, delete: true },
      adSlots: { find: true, create: true, update: true, delete: true },
      ads: { find: true, create: true, update: true, delete: true },
      jobs: { find: true, create: true, update: true, delete: true },
      galleryItems: { find: true, create: true, update: true, delete: true },
      novels: { find: true, create: true, update: true, delete: true },
      novelChapters: { find: true, create: true, update: true, delete: true },
      novelCategories: { find: true, create: true, update: true, delete: true },
      novelTags: { find: true, create: true, update: true, delete: true },
      shortLinks: { find: true, create: true, update: true, delete: true },
      redirects: { find: true, create: true, update: true, delete: true },
      forms: { find: true, create: true, update: true, delete: true },
      comments: { find: true, create: true, update: true },
      media: { find: true, create: true, update: true },
      header: { find: true, update: true },
      footer: { find: true, update: true },
      siteSettings: { find: true, update: true },
      cacheSettings: { find: true, update: true },
      commentSettings: { find: true, update: false },
      aiSettings: { find: true, update: false },
      'payload-mcp-tool': {
        listFrontendCache: true,
        purgeFrontendCache: true,
        getCacheSettings: true,
        updateCacheSettings: true,
        restoreDocument: true,
        semanticSearch: true,
        describeResource: true,
      },
    },
    overrideAccess: true,
  })

  console.log(`MCP_API_KEY=${mcpApiKey}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
