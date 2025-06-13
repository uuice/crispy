import { Kysely, MysqlDialect } from 'kysely'
import { createPool } from 'mysql2'
import { config } from 'dotenv'
import { join } from 'path'
import { fileURLToPath } from 'url'
import type { DB } from '../db/db.d.ts'

// Get the directory name of the current module
const __dirname = fileURLToPath(new URL('.', import.meta.url))

// Load environment variables
config({
  path: join(__dirname, '../../.env')
})

// Create database connection pool
const dialect = new MysqlDialect({
  pool: createPool({
    host: process.env['DB_HOST'] || 'localhost',
    port: Number(process.env['DB_PORT']) || 3306,
    database: process.env['DB_NAME'] || 'crispy',
    user: process.env['DB_USER'] || 'root',
    password: process.env['DB_PASSWORD'] || '',
    // Connection pool settings
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // Timezone settings
    timezone: '+08:00',
    // Character set settings
    charset: 'utf8mb4'
  })
})

// Create Kysely instance
export const db = new Kysely<DB>({
  dialect,
  // Logging configuration
  log: process.env['NODE_ENV'] === 'development' ? ['query', 'error'] : ['error']
})

// Export types
export type { DB }

// Export table types
export type {
  Users,
  Roles,
  Rules,
  Menus,
  Articles,
  Pages,
  Categories,
  Tags,
  Comments,
  Configs,
  Enums,
  Links,
  Keywords,
  Ads,
  AdItems,
  Notices,
  Todos,
  Jobs,
  Holidays,
  UserTypes,
  OperateLogs,
  ApiLogs,
  Caches,
  Additions,
  Attrs,
  Votes,
  VoteItems
} from '../db/db.d.ts'

// Utility function: Transform BigInt values
export const transformBigInt = (data: any): any => {
  if (data === null || data === undefined) {
    return data
  }

  if (typeof data === 'bigint') {
    return data.toString()
  }

  if (Array.isArray(data)) {
    return data.map(transformBigInt)
  }

  if (typeof data === 'object') {
    const transformed: any = {}
    for (const key in data) {
      transformed[key] = transformBigInt(data[key])
    }
    return transformed
  }

  return data
}

// Middleware: Transform BigInt in query results
export const withBigIntTransform = async <T>(query: Promise<T>): Promise<T> => {
  const result = await query
  return transformBigInt(result)
}
