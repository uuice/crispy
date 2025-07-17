#!/usr/bin/env bun

import { migrateToLatest, migrateDown } from '../migrations/migrator'
import { execSync } from 'child_process'
import { join } from 'path'

const command = process.argv[2]

async function main() {
  try {
    switch (command) {
      case 'up':
        console.log('🚀 Running database migrations...')
        await migrateToLatest()
        console.log('✅ Database migrations completed successfully')

        console.log('🔄 Generating TypeScript types...')
        execSync('bun run db:generate', { stdio: 'inherit' })
        console.log('✅ TypeScript types generated successfully')
        break

      case 'down':
        console.log('⬇️ Rolling back database migrations...')
        await migrateDown()
        console.log('✅ Database migrations rolled back successfully')
        break

      case 'setup':
        console.log('🔧 Setting up database and generating types...')
        await migrateToLatest()
        console.log('✅ Database setup completed')

        console.log('🔄 Generating TypeScript types...')
        execSync('bun run db:generate', { stdio: 'inherit' })
        console.log('✅ TypeScript types generated successfully')
        break

      case 'generate':
        console.log('🔄 Generating TypeScript types...')
        execSync('bun run db:generate', { stdio: 'inherit' })
        console.log('✅ TypeScript types generated successfully')
        break

      default:
        console.log(`
Usage: bun run migrate <command>

Commands:
  up       - Run all pending migrations and generate types
  down     - Rollback the last migration
  setup    - Run migrations and generate types (same as up)
  generate - Generate TypeScript types only

Examples:
  bun run migrate up
  bun run migrate down
  bun run migrate setup
  bun run migrate generate
        `)
        process.exit(1)
    }
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

main()
