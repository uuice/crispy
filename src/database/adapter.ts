import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'

import { isPgvectorEnabled } from '@/database/pgvector'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const projectRoot = path.resolve(dirname, '../..')

export type DatabaseDriver = 'sqlite' | 'postgres'

const DEFAULT_SQLITE_PATH = path.join(projectRoot, '.data', 'payload.db')
const MIGRATIONS_DIR = path.join(projectRoot, 'src/migrations')

/** Resolve libSQL `file:` URL to an absolute filesystem path. */
export function resolveSqliteFilePath(url: string): string {
  if (!url.startsWith('file:')) {
    throw new Error(`Invalid SQLite DATABASE_URL (expected file: prefix): ${url}`)
  }

  const raw = url.slice('file:'.length)

  if (raw.startsWith('///')) {
    return decodeURIComponent(raw.slice(2))
  }

  if (path.isAbsolute(raw)) {
    return raw
  }

  return path.resolve(projectRoot, raw.replace(/^\.\//, ''))
}

/** Ensure parent dir exists and return a stable absolute `file:` URL. */
export function prepareSqliteUrl(url: string): string {
  const filePath = resolveSqliteFilePath(url)
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  return `file:${filePath}`
}

export function resolveDatabaseDriver(): DatabaseDriver {
  const explicit = process.env.DATABASE_DRIVER?.toLowerCase()
  if (explicit === 'sqlite' || explicit === 'postgres') {
    return explicit
  }

  const url = process.env.DATABASE_URL ?? ''
  if (url.startsWith('file:')) return 'sqlite'
  if (url.startsWith('postgres://') || url.startsWith('postgresql://')) return 'postgres'

  // Local dev default: SQLite, no Docker required
  return process.env.NODE_ENV === 'production' ? 'postgres' : 'sqlite'
}

export function resolveDatabaseUrl(driver: DatabaseDriver): string {
  if (driver === 'sqlite') {
    const url = process.env.DATABASE_URL ?? `file:${DEFAULT_SQLITE_PATH}`
    return prepareSqliteUrl(url)
  }

  if (process.env.DATABASE_URL) return process.env.DATABASE_URL
  throw new Error('DATABASE_URL is required when using PostgreSQL')
}

/** When false, skip Drizzle schema push (use after local SQLite drift or with `pnpm migrate` on Postgres). */
export function shouldPushDatabaseSchema(): boolean {
  if (process.env.DATABASE_PUSH === 'true') return true
  if (process.env.DATABASE_PUSH === 'false') return false
  return process.env.NODE_ENV !== 'production'
}

/** @deprecated Use shouldPushDatabaseSchema */
export const shouldPushPostgresSchema = shouldPushDatabaseSchema

export function createDatabaseAdapter() {
  const driver = resolveDatabaseDriver()
  const url = resolveDatabaseUrl(driver)

  if (driver === 'sqlite') {
    return sqliteAdapter({
      client: {
        url,
      },
      push: shouldPushDatabaseSchema(),
    })
  }

  return postgresAdapter({
    migrationDir: MIGRATIONS_DIR,
    extensions: isPgvectorEnabled() ? ['vector'] : [],
    pool: {
      connectionString: url,
    },
    push: shouldPushDatabaseSchema(),
  })
}
