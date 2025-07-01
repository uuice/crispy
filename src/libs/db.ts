import {
  Kysely,
  MysqlDialect,
  KyselyPlugin,
  PluginTransformQueryArgs,
  PluginTransformResultArgs
} from 'kysely'
import { createPool } from 'mysql2'

import { join } from 'path'
import { fileURLToPath } from 'url'
import type { DB } from '../db/db.d.ts'
import { sql } from 'kysely'

import { env } from '../server/config/env'

// 工具函数：过滤 undefined 字段
export const filterUndefined = <T extends Record<string, any>>(obj: T): Partial<T> => {
  const filtered: Partial<T> = {}
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      filtered[key as keyof T] = value
    }
  }
  return filtered
}

// 过滤 undefined 字段的插件
class FilterUndefinedPlugin implements KyselyPlugin {
  transformQuery(args: PluginTransformQueryArgs): any {
    const { node } = args

    // 对于 INSERT 和 UPDATE 查询，我们在这里不做处理
    // 而是通过扩展方法来实现过滤功能
    return node
  }

  transformResult(args: PluginTransformResultArgs): any {
    return args.result
  }
}

// 扩展 Kysely 实例的方法
export const createDbWithHelpers = (kyselyInstance: Kysely<DB>) => {
  // 直接在原始实例上添加方法，避免破坏内部结构
  const enhanced = kyselyInstance as any

  // 添加安全插入方法
  enhanced.safeInsertInto = <T extends keyof DB>(table: T) => {
    return {
      values: (data: any) => {
        const filteredData = filterUndefined(data) as any
        return kyselyInstance.insertInto(table).values(filteredData)
      }
    }
  }

  // 添加安全更新方法
  enhanced.safeUpdateTable = <T extends keyof DB>(table: T) => {
    return {
      set: (data: any) => {
        const filteredData = filterUndefined(data)
        return (kyselyInstance.updateTable(table) as any).set(filteredData)
      }
    }
  }

  return enhanced as Kysely<DB> & {
    safeInsertInto: <T extends keyof DB>(
      table: T
    ) => {
      values: (data: any) => any
    }
    safeUpdateTable: <T extends keyof DB>(
      table: T
    ) => {
      set: (data: any) => any
    }
  }
}

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
const pool = createPool({
  host: env['DB_HOST'] || 'localhost',
  port: Number(env['DB_PORT']) || 3306,
  database: env['DB_NAME'] || 'crispy',
  user: env['DB_USER'] || 'root',
  password: env['DB_PASSWORD'] || '',
  // Connection pool settings - optimized to prevent "many connection" errors
  waitForConnections: true,
  connectionLimit: 10, // Reduced from 20 to 10
  queueLimit: 0, // Unlimited queue to prevent connection errors
  // Timezone settings
  timezone: '+08:00',
  // Character set settings
  charset: 'utf8mb4'
})

const dialect = new MysqlDialect({ pool })

// Create Kysely instance with plugin
const kyselyInstance = new Kysely<DB>({
  dialect,
  // Logging configuration
  log: env['NODE_ENV'] === 'development' ? ['query', 'error'] : ['error'],
  plugins: [new FilterUndefinedPlugin()]
})

// Export enhanced db instance with helper methods
export const db = createDbWithHelpers(kyselyInstance)

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

// Monitor connection pool status
export const getPoolStatus = () => {
  return {
    connectionLimit: pool.config.connectionLimit,
    queueLimit: pool.config.queueLimit
  }
}

// Log pool status periodically in development
if (env['NODE_ENV'] === 'development') {
  setInterval(() => {
    console.log('Database pool status:', getPoolStatus())
  }, 30000) // Log every 30 seconds
}
