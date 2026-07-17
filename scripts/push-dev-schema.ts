/**
 * One-off CLI: initialize Payload with DATABASE_PUSH=true to apply dev schema push.
 *
 * Usage: DATABASE_PUSH=true pnpm tsx scripts/push-dev-schema.ts
 * Pipe `printf 'y\n'` when warnings require confirmation.
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

async function main() {
  await getPayload({ config })
  console.log('Schema push completed.')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
