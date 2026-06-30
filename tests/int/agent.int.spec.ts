import { getPayload, createLocalReq, type Payload } from 'payload'
import config from '@/payload.config'
import { beforeAll, describe, expect, it } from 'vitest'

import { assertAgentCollectionAccess } from '@/ai/agent/access'
import { describeCollectionSchema } from '@/ai/agent/describeResource'
import { executeAgentTool } from '@/ai/agent/tools'
import type { User } from '@/payload-types'

let payload: Payload

const mockSuperAdmin = {
  id: 1,
  roles: ['super-admin'],
} as User

describe('AI agent', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
  })

  it('describeCollectionSchema returns fields for posts', async () => {
    const req = await createLocalReq({}, payload)
    const schema = describeCollectionSchema(req, 'posts') as {
      slug: string
      fields: { name: string }[]
    }

    expect(schema.slug).toBe('posts')
    expect(schema.fields.some((f) => f.name === 'title')).toBe(true)
  })

  it('executeAgentTool rejects unsupported collections', async () => {
    const req = await createLocalReq({ user: mockSuperAdmin }, payload)

    await expect(
      executeAgentTool(req, {
        id: 'call-test',
        name: 'find_documents',
        arguments: JSON.stringify({ collection: 'users' }),
      }),
    ).rejects.toThrow(/不支持的内容类型/)
  })

  it('assertAgentCollectionAccess blocks media delete', async () => {
    const req = await createLocalReq({ user: mockSuperAdmin }, payload)

    await expect(assertAgentCollectionAccess(req, 'media', 'delete', 1)).rejects.toThrow(
      /不允许通过 AI 助手删除/,
    )
  })
})
