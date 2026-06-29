/**
 * Run database seed from CLI (uses first admin user for Local API context).
 *
 * Usage: pnpm seed
 */
import 'dotenv/config'
import { createLocalReq, getPayload } from 'payload'
import config from '@payload-config'
import { seed } from '@/endpoints/seed'

async function main() {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'users',
    limit: 1,
    sort: 'createdAt',
    depth: 0,
  })

  const user = docs[0]
  if (!user) {
    console.error('No user found. Create an admin account at /admin first.')
    process.exit(1)
  }

  const req = await createLocalReq({ user }, payload)
  await seed({ payload, req })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
