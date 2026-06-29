/**
 * Regenerate MCP API key for the seeded agent user.
 *
 * Usage: pnpm mcp:key
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
    console.error('agent@example.com not found. Run pnpm seed first.')
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
      adSlots: { find: true, create: true, update: true, delete: true },
      ads: { find: true, create: true, update: true, delete: true },
      jobs: { find: true, create: true, update: true, delete: true },
      galleryItems: { find: true, create: true, update: true, delete: true },
      media: { find: true, create: true, update: true },
    },
    overrideAccess: true,
  })

  console.log(`MCP_API_KEY=${mcpApiKey}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
