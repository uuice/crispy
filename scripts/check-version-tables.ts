/**
 * Check draft/version `_v` table integrity for Admin list (latest=true) paths.
 *
 * Usage: pnpm cli util:check-version-tables
 */
import 'dotenv/config'

import { getPayload } from 'payload'
import config from '@payload-config'

/** Collections with drafts — admin list reads _v with latest=true. */
const DRAFT_COLLECTIONS = ['posts', 'pages'] as const

/** Collections with version history (no drafts) — backfill initial _v row per doc. */
const VERSION_HISTORY_COLLECTIONS = [
  'categories',
  'tags',
  'links',
  'link-groups',
  'short-links',
  'gallery-items',
  'app-configs',
  'comments',
  'media',
  'users',
  'redirects',
] as const

function toTable(slug: string): string {
  return slug.replace(/-/g, '_')
}

async function countTable(
  payload: Awaited<ReturnType<typeof getPayload>>,
  table: string,
): Promise<number | null> {
  try {
    const result = await payload.db.pool.query(`SELECT count(*)::int AS c FROM "${table}"`)
    return result.rows[0]?.c ?? 0
  } catch {
    return null
  }
}

async function main() {
  const payload = await getPayload({ config })
  const gaps: string[] = []

  console.log('\n=== Draft collections (latest version row) ===\n')
  for (const slug of DRAFT_COLLECTIONS) {
    const main = toTable(slug)
    const version = `_${main}_v`
    const [mainCount, versionCount, latestCount] = await Promise.all([
      countTable(payload, main),
      countTable(payload, version),
      payload.db.pool
        .query(
          `SELECT count(*)::int AS c FROM "${version}" WHERE latest = true AND version_deleted_at IS NULL`,
        )
        .then((r) => r.rows[0]?.c ?? 0)
        .catch(() => null),
    ])

    const status =
      mainCount === null
        ? 'missing main'
        : latestCount === null
          ? 'missing version table'
          : mainCount > 0 && latestCount === 0
            ? 'NEEDS BACKFILL'
            : 'ok'

    console.log(`${slug}: main=${mainCount} _v=${versionCount} latest=${latestCount} → ${status}`)
    if (status === 'NEEDS BACKFILL') gaps.push(slug)
  }

  console.log('\n=== Version history collections (any _v row per doc) ===\n')
  for (const slug of VERSION_HISTORY_COLLECTIONS) {
    const main = toTable(slug)
    const version = `_${main}_v`
    const [mainCount, versionCount] = await Promise.all([
      countTable(payload, main),
      countTable(payload, version),
    ])

    const missingTable = versionCount === null
    const needsBackfill = !missingTable && (mainCount ?? 0) > 0 && (versionCount ?? 0) === 0
    const status = missingTable ? 'MISSING _v TABLE' : needsBackfill ? 'NEEDS BACKFILL' : 'ok'

    console.log(`${slug}: main=${mainCount} _v=${versionCount} → ${status}`)
    if (status === 'MISSING _v TABLE' || status === 'NEEDS BACKFILL') gaps.push(slug)
  }

  if (gaps.length) {
    console.log('\nGaps:', gaps.join(', '))
  } else {
    console.log('\nNo gaps found.')
  }

  await payload.destroy()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
