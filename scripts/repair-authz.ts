/**
 * Ensure system roles exist and recompute all user authz-cache rows.
 *
 * Usage: pnpm cli util:repair-authz
 */
import 'dotenv/config'
import { getPayload } from 'payload'

import { recomputeAllUserAuthzCaches } from '../src/access/authzCache'
import { ensureSystemRoles } from '../src/access/ensureSystemRoles'
import config from '../src/payload.config'

async function main() {
  const payload = await getPayload({ config })
  const roleIds = await ensureSystemRoles(payload)
  console.log('system roles', roleIds)

  for (const slug of Object.keys(roleIds) as Array<keyof typeof roleIds>) {
    const role = await payload.findByID({
      collection: 'roles',
      id: roleIds[slug],
      depth: 0,
      overrideAccess: true,
    })
    console.log(slug, 'permissions', (role.permissions || []).length)
  }

  const updated = await recomputeAllUserAuthzCaches(payload)
  console.log('authz-cache updated for', updated, 'user(s)')
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
