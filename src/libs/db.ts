import { Kysely, MysqlDialect } from 'kysely'
import { createPool } from 'mysql2'

import { join } from 'path'
import { fileURLToPath } from 'url'
import type { DB } from '../db/db.d.ts'
import { sql } from 'kysely'

import { env } from '../server/config/env'
// Get the directory name of the current module
const __dirname = fileURLToPath(new URL('.', import.meta.url))

console.log('=== 开始加载数据库配置 ===')
console.log('当前目录:', __dirname)

// Fix the path to point to project root
const envPath = join(__dirname, '../../../.env')
console.log('环境文件路径:', envPath)

console.log('环境变量加载完成')
console.log('DB_HOST:', env['DB_HOST'])
console.log('DB_PORT:', env['DB_PORT'])
console.log('DB_NAME:', env['DB_NAME'])
console.log('DB_USER:', env['DB_USER'])

// Create database connection pool
const dialect = new MysqlDialect({
  pool: createPool({
    host: env['DB_HOST'] || 'localhost',
    port: Number(env['DB_PORT']) || 3306,
    database: env['DB_NAME'] || 'crispy',
    user: env['DB_USER'] || 'root',
    password: env['DB_PASSWORD'] || '',
    // Connection pool settings
    waitForConnections: true,
    connectionLimit: 20,
    queueLimit: 10,
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
  log: env['NODE_ENV'] === 'development' ? ['query', 'error'] : ['error']
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

// Simple database connection test
export const testDbConnection = async (): Promise<boolean> => {
  const startTime = Date.now()

  try {
    // Test connection with native SQL SELECT 1
    await db.executeQuery(sql`SELECT 1`.compile(db))

    const queryTime = Date.now() - startTime
    console.log(`Database connection test: ${queryTime}ms`)
    return true
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}

// Test database connection
testDbConnection()
