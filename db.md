# Database Documentation

## Overview

This document describes the database setup and usage with Kysely ORM in our application.

## Setup

The database connection is configured in `src/libs/db.ts`. It uses Kysely with MySQL dialect and includes type safety with generated types.

## Database Connection

```typescript
import { db, withBigIntTransform } from '../libs/db'
```

## Basic Operations

### Select Queries

```typescript
// Get all users
const users = await withBigIntTransform(db.selectFrom('users').selectAll().execute())

// Get a single user
const user = await withBigIntTransform(
  db.selectFrom('users').selectAll().where('id', '=', 1).executeTakeFirst()
)

// Select specific columns
const userNames = await db.selectFrom('users').select(['id', 'user_name', 'email']).execute()

// Complex where conditions
const activeUsers = await db
  .selectFrom('users')
  .selectAll()
  .where('status', '=', 1)
  .where('is_delete', '=', 0)
  .execute()
```

### Insert Operations

```typescript
// Insert a single record
const newUser = await db
  .insertInto('users')
  .values({
    user_name: 'test',
    password: '123456',
    email: 'test@example.com'
    // ... other fields
  })
  .executeTakeFirst()

// Insert multiple records
const newUsers = await db
  .insertInto('users')
  .values([{ user_name: 'user1' /* ... */ }, { user_name: 'user2' /* ... */ }])
  .execute()
```

### Update Operations

```typescript
// Update a single record
await db
  .updateTable('users')
  .set({
    status: 0,
    update_time: Date.now()
  })
  .where('id', '=', 1)
  .execute()

// Update multiple records
await db.updateTable('users').set({ status: 0 }).where('status', '=', 1).execute()
```

### Delete Operations

```typescript
// Soft delete (update is_delete flag)
await db.updateTable('users').set({ is_delete: 1 }).where('id', '=', 1).execute()

// Hard delete
await db.deleteFrom('users').where('id', '=', 1).execute()
```

## Transactions

```typescript
const result = await db.transaction().execute(async (trx) => {
  // Create user
  const user = await trx
    .insertInto('users')
    .values({
      user_name: 'test',
      password: '123456'
      // ... other fields
    })
    .executeTakeFirst()

  // Create user role
  await trx
    .insertInto('roles')
    .values({
      title: 'test role'
      // ... other fields
    })
    .execute()

  return user
})
```

## Joins

```typescript
// Inner join
const userWithRole = await db
  .selectFrom('users')
  .innerJoin('roles', 'roles.id', 'users.role_id')
  .select(['users.id', 'users.user_name', 'roles.title as role_title'])
  .execute()

// Left join
const usersWithRoles = await db
  .selectFrom('users')
  .leftJoin('roles', 'roles.id', 'users.role_id')
  .select(['users.*', 'roles.title as role_title'])
  .execute()
```

## BigInt Handling

The database operations automatically handle BigInt values through the `withBigIntTransform` middleware:

```typescript
// All queries should use withBigIntTransform
const result = await withBigIntTransform(db.selectFrom('users').selectAll().execute())
```

## Error Handling

```typescript
try {
  const result = await db
    .insertInto('users')
    .values({
      /* ... */
    })
    .execute()
} catch (error) {
  if (error.code === 'ER_DUP_ENTRY') {
    // Handle duplicate entry error
  }
  // Handle other errors
}
```

## Best Practices

1. Always use `withBigIntTransform` for queries that might return BigInt values
2. Use transactions for operations that modify multiple tables
3. Use type-safe queries with the generated types
4. Handle database errors appropriately
5. Use soft deletes (is_delete flag) instead of hard deletes when possible
6. Keep database operations in separate service layers
7. Use appropriate indexes for frequently queried columns

## Type Safety

The database operations are fully type-safe with the generated types from `db.d.ts`. This provides:

- Autocomplete for table and column names
- Type checking for values
- Type inference for query results

## Environment Variables

Required environment variables in `.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=crispy
DB_USER=root
DB_PASSWORD=your_password
```

````

然后，修改 `db.ts` 的注释为英文：

```typescript
// src/libs/db.ts
import { Kysely, MySQLDialect } from 'kysely'
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
const dialect = new MySQLDialect({
  pool: createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    database: process.env.DB_NAME || 'crispy',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
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
  log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error']
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
export const withBigIntTransform = async <T>(
  query: Promise<T>
): Promise<T> => {
  const result = await query
  return transformBigInt(result)
}
````
