import { promises as fs } from 'fs'
import { Kysely, Migrator, FileMigrationProvider } from 'kysely'
import { MysqlDialect } from 'kysely'
import { createPool } from 'mysql2'
import { join } from 'path'
import * as path from 'path'
import { env } from '../src/server/config/env'

// Create database connection
const pool = createPool({
  host: env['DB_HOST'] || 'localhost',
  port: Number(env['DB_PORT']) || 3306,
  database: env['DB_NAME'] || 'crispy',
  user: env['DB_USER'] || 'root',
  password: env['DB_PASSWORD'] || '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+08:00',
  charset: 'utf8mb4'
})

const dialect = new MysqlDialect({ pool })

// Create Kysely instance
const db = new Kysely({
  dialect,
  log: env['NODE_ENV'] === 'development' ? ['query', 'error'] : ['error']
})

// Create migrator
const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs,
    path,
    migrationFolder: join(__dirname, './migrations')
  })
})

// Migration functions
export async function migrateToLatest() {
  const { error, results } = await migrator.migrateToLatest()

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`Migration "${it.migrationName}" was executed successfully`)
    } else if (it.status === 'Error') {
      console.error(`Failed to execute migration "${it.migrationName}"`)
    }
  })

  if (error) {
    console.error('Failed to migrate')
    console.error(error)
    process.exit(1)
  }

  await db.destroy()
}

export async function migrateDown() {
  const { error, results } = await migrator.migrateDown()

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`Migration "${it.migrationName}" was reverted successfully`)
    } else if (it.status === 'Error') {
      console.error(`Failed to revert migration "${it.migrationName}"`)
    }
  })

  if (error) {
    console.error('Failed to migrate down')
    console.error(error)
    process.exit(1)
  }

  await db.destroy()
}

// Run migrations if this file is executed directly
if (require.main === module) {
  const command = process.argv[2]

  if (command === 'up') {
    migrateToLatest()
  } else if (command === 'down') {
    migrateDown()
  } else {
    console.log('Usage: node migrator.js [up|down]')
    process.exit(1)
  }
}
