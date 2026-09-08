/**
 * Copy Payload content from Postgres (.env) into local SQLite (.env.sqlite).
 *
 * Usage:
 *   pnpm cli db:ensure-sqlite-env   # create/refresh .env.sqlite from .env
 *   pnpm cli db:pg-to-sqlite        # export PG → push fresh SQLite schema → import
 *
 * Writes:
 *   .env.sqlite          — SQLite/backup env (gitignored; copy to server as .env)
 *   .data/pg-export/     — JSON dump
 *   .data/payload.db     — SQLite database (replaced; old file renamed *.bak-*)
 *
 * Skips ephemeral collections (authz-cache, frontend HTML cache, AI sessions).
 * Embeddings / pgvector are not copied.
 */
import dotenv from 'dotenv'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { getPayload } from 'payload'
import type { Payload, PayloadRequest, SanitizedConfig } from 'payload'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const ENV_PG = path.join(ROOT, '.env')
const ENV_SQLITE = path.join(ROOT, '.env.sqlite')
const EXPORT_DIR = path.join(ROOT, '.data', 'pg-export')
const SQLITE_PATH = path.join(ROOT, '.data', 'payload.db')
const SQLITE_URL = `file:${SQLITE_PATH}`

function loadEnvFile(filePath: string, override = false): void {
  const result = dotenv.config({ path: filePath, override })
  if (result.error && (result.error as NodeJS.ErrnoException).code !== 'ENOENT') {
    throw result.error
  }
}

/** Load env first, then import payload.config (db adapter reads env at init). */
async function loadPayloadConfig(): Promise<SanitizedConfig> {
  const mod = await import('../src/payload.config')
  return mod.default as SanitizedConfig
}

/** Build .env.sqlite from .env with SQLite overrides (safe to re-run). */
export function ensureSqliteEnv(): void {
  if (!fs.existsSync(ENV_PG)) {
    throw new Error(`Missing ${ENV_PG}`)
  }

  const text = fs.readFileSync(ENV_PG, 'utf8')
  const skip = new Set(['DATABASE_URL', 'DATABASE_DRIVER', 'DATABASE_PUSH', 'PGVECTOR_ENABLED'])
  const out: string[] = [
    '# Crispy SQLite / backup-site env (copy to the spare server as .env).',
    '# Generated from .env — gitignored. Next.js does NOT auto-load this file.',
    '# Local: dotenv -e .env.sqlite -- pnpm cli dev:dev',
    '# Or: set -a && source .env.sqlite && set +a && pnpm cli dev:dev',
    '',
  ]

  for (const line of text.split('\n')) {
    const m = line.match(/^#?\s*([A-Za-z_][A-Za-z0-9_]*)=/)
    if (m && skip.has(m[1])) continue
    out.push(line)
  }

  out.push(
    '',
    '# --- SQLite backup (overrides) ---',
    'DATABASE_DRIVER=sqlite',
    `DATABASE_URL=${SQLITE_URL}`,
    '# Keep false on the spare server. Import/schema scripts force push when needed.',
    'DATABASE_PUSH=false',
    'PGVECTOR_ENABLED=false',
    '',
  )

  fs.writeFileSync(ENV_SQLITE, out.join('\n'))
  console.log(`→ Wrote ${ENV_SQLITE}`)
}

const SKIP_COLLECTIONS = new Set([
  'authz-cache',
  'frontend-cache-entries',
  'ai-chat-sessions',
  'payload-locked-documents',
  'payload-preferences',
  'payload-migrations',
  'payload-jobs',
  // Ephemeral / rebuildable / not needed on spare site
  'audit-logs',
  'exports',
  'imports',
  'search',
])

/** Prefer this order so relationship targets exist before dependents. */
const COLLECTION_ORDER = [
  'roles',
  'media', // before users (avatar) / galleries / pages / posts
  'users',
  'forms', // before pages (form blocks)
  'categories',
  'tags',
  'link-groups',
  'links',
  'short-links',
  'galleries',
  'gallery-items',
  'pages',
  'posts',
  'comments',
  'app-configs',
  'llm-providers',
  'prompt-templates',
  'storage-targets',
  'email-transports',
  'form-submissions',
  'redirects',
  'payload-query-presets',
  'payload-mcp-api-keys',
]

/** AfterRead-only array; inserting it collides with user ids in posts_populated_authors. */
const STRIP_ON_IMPORT = new Set(['populatedAuthors'])

function sortCommentsParentsFirst(docs: Record<string, unknown>[]): Record<string, unknown>[] {
  const byId = new Map<string | number, Record<string, unknown>>()
  for (const doc of docs) {
    if (doc.id != null) byId.set(doc.id as string | number, doc)
  }

  const result: Record<string, unknown>[] = []
  const visiting = new Set<string | number>()
  const visited = new Set<string | number>()

  const parentIdOf = (doc: Record<string, unknown>): string | number | null => {
    const p = doc.parent
    if (p == null || p === '') return null
    if (typeof p === 'object' && p && 'id' in p) return (p as { id: string | number }).id
    return p as string | number
  }

  const visit = (id: string | number) => {
    if (visited.has(id) || !byId.has(id)) return
    if (visiting.has(id)) return
    visiting.add(id)
    const doc = byId.get(id)!
    const parentId = parentIdOf(doc)
    if (parentId != null) visit(parentId)
    visiting.delete(id)
    visited.add(id)
    result.push(doc)
  }

  for (const doc of docs) {
    if (doc.id != null) visit(doc.id as string | number)
  }
  return result
}

type DumpFile = {
  collections: Record<string, Record<string, unknown>[]>
  globals: Record<string, Record<string, unknown> | null>
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

/** Collapse populated relationships to ids; keep Lexical / JSON structures. */
function normalizeValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeValue(item))
  }
  if (!isPlainObject(value)) return value

  const keys = Object.keys(value)
  if (keys.length === 1 && keys[0] === 'id') {
    return value.id
  }
  if (
    typeof value.id !== 'undefined' &&
    keys.every((k) => ['id', 'updatedAt', 'createdAt'].includes(k))
  ) {
    return value.id
  }

  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(value)) {
    out[k] = normalizeValue(v)
  }
  return out
}

function sanitizeDoc(doc: Record<string, unknown>): Record<string, unknown> {
  const copy = { ...(normalizeValue(doc) as Record<string, unknown>) }
  delete copy.collection
  return copy
}

async function findAllDocs(payload: Payload, slug: string): Promise<Record<string, unknown>[]> {
  const docs: Record<string, unknown>[] = []
  let page = 1
  const limit = 100

  for (;;) {
    const result = await payload.find({
      collection: slug as never,
      depth: 0,
      draft: true,
      limit,
      overrideAccess: true,
      page,
      pagination: true,
      showHiddenFields: true,
      trash: true,
    })

    for (const doc of result.docs) {
      docs.push(doc as unknown as Record<string, unknown>)
    }

    if (!result.hasNextPage) break
    page += 1
  }

  return docs
}

async function exportFromPostgres(): Promise<string> {
  loadEnvFile(ENV_PG, true)
  const driver = process.env.DATABASE_DRIVER
  const url = process.env.DATABASE_URL || ''
  if (driver === 'sqlite' || url.startsWith('file:')) {
    throw new Error('Current .env points at SQLite. Point DATABASE_URL at Postgres first.')
  }

  console.log('→ Connecting to Postgres (.env)…')
  const config = await loadPayloadConfig()
  const payload = await getPayload({ config })

  fs.mkdirSync(EXPORT_DIR, { recursive: true })
  const dump: DumpFile = { collections: {}, globals: {} }

  const slugs = Object.keys(payload.collections).filter((slug) => !SKIP_COLLECTIONS.has(slug))
  for (const slug of slugs) {
    process.stdout.write(`  export ${slug}… `)
    const docs = await findAllDocs(payload, slug)
    dump.collections[slug] = docs.map((doc) => sanitizeDoc(doc))
    console.log(`${docs.length} doc(s)`)
  }

  for (const globalConfig of payload.config.globals) {
    const slug = globalConfig.slug
    process.stdout.write(`  export global:${slug}… `)
    try {
      const doc = await payload.findGlobal({
        slug: slug as never,
        depth: 0,
        overrideAccess: true,
        showHiddenFields: true,
      })
      dump.globals[slug] = sanitizeDoc(doc as unknown as Record<string, unknown>)
      console.log('ok')
    } catch (err) {
      dump.globals[slug] = null
      console.log(`skip (${err instanceof Error ? err.message : String(err)})`)
    }
  }

  const outFile = path.join(EXPORT_DIR, 'dump.json')
  fs.writeFileSync(outFile, JSON.stringify(dump, null, 2))
  console.log(`→ Wrote ${outFile}`)
  return outFile
}

function orderedSlugs(slugs: string[]): string[] {
  const set = new Set(slugs)
  const ordered: string[] = []
  for (const slug of COLLECTION_ORDER) {
    if (set.delete(slug)) ordered.push(slug)
  }
  ordered.push(...[...set].sort())
  return ordered
}

async function importToSqlite(dumpPath: string): Promise<void> {
  loadEnvFile(ENV_SQLITE, true)
  process.env.DATABASE_DRIVER = 'sqlite'
  process.env.DATABASE_URL = SQLITE_URL
  process.env.DATABASE_PUSH = 'true'
  process.env.PGVECTOR_ENABLED = 'false'
  process.env.CRISPY_ALLOW_ID_ON_CREATE = 'true'
  // Disable S3 adapter/uploads (files already on OSS). Plugin still inserts media.prefix.
  process.env.CRISPY_DISABLE_S3 = 'true'
  // Avoid ensureSystemRoles racing with role import; keep jobs from holding the process.
  process.env.CRISPY_SKIP_ONINIT = 'true'

  if (!fs.existsSync(dumpPath)) {
    throw new Error(`Dump not found: ${dumpPath}`)
  }

  const raw = fs.readFileSync(dumpPath, 'utf8')
  const dump = JSON.parse(raw) as DumpFile

  console.log('→ SQLite schema push + import (no S3 upload; OSS URLs only)…')
  const config = await loadPayloadConfig()
  const payload = await getPayload({ config })

  const context = {
    skipEmbeddingSync: true,
    disableRevalidate: true,
    skipOssVirtualSizes: true,
  }

  /** Minimal req for db.* (avoids upload/auth hooks). */
  const dbReq = {
    payload,
    context,
    user: null,
    headers: new Headers(),
    t: (k: string) => k,
  } as unknown as PayloadRequest

  /** Collections where Local API hooks break hash/OSS metadata import. */
  const useDbCreate = new Set(['roles', 'users', 'media', 'comments', 'payload-mcp-api-keys'])
  const usedFilenames = new Set<string>()

  for (const slug of orderedSlugs(Object.keys(dump.collections))) {
    if (SKIP_COLLECTIONS.has(slug)) continue
    let docs = dump.collections[slug] || []
    if (slug === 'comments') {
      docs = sortCommentsParentsFirst(docs)
    }
    process.stdout.write(`  import ${slug} (${docs.length})… `)
    let ok = 0
    let failed = 0

    for (const doc of docs) {
      const data = { ...doc }
      for (const key of STRIP_ON_IMPORT) {
        delete data[key]
      }
      const id = data.id
      const status = data._status
      const isDraft = status === 'draft'
      const isTrashed = Boolean(data.deletedAt)

      try {
        if (slug === 'users') {
          delete data.password
          delete data.sessions
          delete data.resetPasswordToken
          delete data.resetPasswordExpiration
        }

        if (slug === 'media') {
          if (data.folder == null) delete data.folder
          // Payload enforces unique filename; PG dump can contain duplicates (same name, different prefix/url).
          let filename = String(data.filename || `file-${id}`)
          if (usedFilenames.has(filename)) {
            const dot = filename.lastIndexOf('.')
            const base = dot > 0 ? filename.slice(0, dot) : filename
            const ext = dot > 0 ? filename.slice(dot) : ''
            filename = `${base}-${id}${ext}`
            data.filename = filename
          }
          usedFilenames.add(filename)
        }

        if (slug === 'comments' && !String(data.guestName || '').trim() && !data.author) {
          data.guestName = 'imported'
        }

        if (useDbCreate.has(slug)) {
          await payload.db.create({
            collection: slug,
            data: data as never,
            req: dbReq,
          })
        } else {
          await payload.create({
            collection: slug as never,
            context,
            data: data as never,
            depth: 0,
            draft: isDraft,
            overrideAccess: true,
            showHiddenFields: true,
            disableVerificationEmail: true,
          })
        }

        if (isTrashed && id != null) {
          try {
            await payload.db.updateOne({
              collection: slug,
              id: id as string | number,
              data: { deletedAt: data.deletedAt } as never,
              req: dbReq,
            })
          } catch {
            // soft-delete optional
          }
        }

        ok += 1
      } catch (err) {
        failed += 1
        if (failed <= 5) {
          console.error(
            `\n    ! ${slug} id=${String(id)}:`,
            err instanceof Error ? err.message : err,
          )
        }
      }
    }

    console.log(`ok=${ok} fail=${failed}`)
  }

  for (const [slug, doc] of Object.entries(dump.globals)) {
    if (!doc) continue
    process.stdout.write(`  import global:${slug}… `)
    try {
      const data = { ...doc }
      delete data.id
      delete data.globalType
      await payload.updateGlobal({
        slug: slug as never,
        context,
        data: data as never,
        depth: 0,
        overrideAccess: true,
      })
      console.log('ok')
    } catch (err) {
      console.log(`fail (${err instanceof Error ? err.message : String(err)})`)
    }
  }

  console.log(`→ SQLite ready: ${SQLITE_PATH}`)
  try {
    await payload.destroy()
  } catch {
    // ignore
  }
  process.exit(0)
}

function runImportChild(dumpPath: string): void {
  if (fs.existsSync(SQLITE_PATH)) {
    const bak = `${SQLITE_PATH}.bak-${Date.now()}`
    fs.renameSync(SQLITE_PATH, bak)
    console.log(`→ Backed up existing SQLite to ${bak}`)
  }
  for (const suffix of ['-wal', '-shm']) {
    const p = `${SQLITE_PATH}${suffix}`
    if (fs.existsSync(p)) fs.unlinkSync(p)
  }

  const env = {
    ...process.env,
    DATABASE_DRIVER: 'sqlite',
    DATABASE_URL: SQLITE_URL,
    DATABASE_PUSH: 'true',
    PGVECTOR_ENABLED: 'false',
    CRISPY_ALLOW_ID_ON_CREATE: 'true',
    CRISPY_DISABLE_S3: 'true',
    CRISPY_SKIP_ONINIT: 'true',
    CRISPY_PG_TO_SQLITE_MODE: 'import',
    CRISPY_PG_TO_SQLITE_DUMP: dumpPath,
  }

  console.log('→ Spawning SQLite import (fresh schema; no OSS re-upload)…')
  const tsxBin = path.join(ROOT, 'node_modules', '.bin', 'tsx')
  const result = spawnSync(tsxBin, [path.join(ROOT, 'scripts', 'pg-to-sqlite.ts')], {
    cwd: ROOT,
    env,
    stdio: 'inherit',
  })

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
  // Child should exit itself; parent finishes cleanly.
  process.exit(0)
}

async function main(): Promise<void> {
  const mode = process.env.CRISPY_PG_TO_SQLITE_MODE || 'export'

  if (mode === 'import') {
    const dumpPath = process.env.CRISPY_PG_TO_SQLITE_DUMP || path.join(EXPORT_DIR, 'dump.json')
    await importToSqlite(dumpPath)
    return
  }

  if (process.argv.includes('--ensure-env-only')) {
    ensureSqliteEnv()
    return
  }

  // Re-import from existing dump (skip Postgres export). Useful after fixing import bugs.
  if (process.argv.includes('--import-only')) {
    ensureSqliteEnv()
    const dumpPath = path.join(EXPORT_DIR, 'dump.json')
    if (!fs.existsSync(dumpPath)) {
      throw new Error(`Missing ${dumpPath}; run a full db:pg-to-sqlite once first.`)
    }
    runImportChild(dumpPath)
    console.log('\nDone (import-only).')
    console.log(`  SQLite file: ${SQLITE_PATH}`)
    return
  }

  ensureSqliteEnv()
  const dumpPath = await exportFromPostgres()
  runImportChild(dumpPath)
  console.log('\nDone.')
  console.log(`  SQLite file: ${SQLITE_PATH}`)
  console.log(
    `  Env for spare server: copy ${ENV_SQLITE} → .env (set NEXT_PUBLIC_SERVER_URL to the real domain)`,
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
