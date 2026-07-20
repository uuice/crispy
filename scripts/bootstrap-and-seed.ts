/**
 * Bootstrap first super-admin (if empty DB) then run seed.
 * One-off helper for fresh migrate on production.
 */
import 'dotenv/config'
import { createLocalReq, getPayload } from 'payload'
import config from '@payload-config'
import { ensureSystemRoles } from '@/access/ensureSystemRoles'
import { seed } from '@/endpoints/seed'

async function main() {
  const payload = await getPayload({ config })
  const roleIds = await ensureSystemRoles(payload)

  const { totalDocs } = await payload.count({ collection: 'users' })
  if (totalDocs === 0) {
    const admin = await payload.create({
      collection: 'users',
      overrideAccess: true,
      data: {
        name: 'Admin',
        email: 'admin@example.com',
        password: 'password',
        roles: [roleIds['super-admin']],
      },
    })
    console.log(`Created bootstrap admin: ${admin.email}`)
  } else {
    console.log(`Users already exist: ${totalDocs}`)
  }

  const { docs } = await payload.find({
    collection: 'users',
    limit: 1,
    sort: 'createdAt',
    depth: 0,
  })

  const user = docs[0]
  if (!user) {
    console.error('No user found after bootstrap.')
    process.exit(1)
  }

  const req = await createLocalReq({ user }, payload)
  await seed({ payload, req })
  console.log('Seed completed.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
