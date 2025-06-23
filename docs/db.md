# Database Documentation

## Overview

This document describes the database setup and usage with Kysely ORM in our application.

## Database Connection Pool Optimization

### Current Configuration

The database connection pool is configured in `src/libs/db.ts` with the following optimized settings:

```typescript
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
```

### Key Optimizations

1. **Reduced Connection Limit**: From 20 to 10 connections to prevent overwhelming the database
2. **Unlimited Queue**: `queueLimit: 0` allows unlimited queuing of connection requests
3. **Wait for Connections**: `waitForConnections: true` ensures requests wait for available connections

### Troubleshooting "Many Connection" Errors

If you encounter "many connection" errors, try the following:

1. **Check Current Connections**:

   ```sql
   SHOW PROCESSLIST;
   ```

2. **Monitor Pool Status**:

   ```typescript
   import { getPoolStatus } from '@src/libs/db'
   console.log('Pool status:', getPoolStatus())
   ```

3. **Reduce Connection Limit Further**:

   ```typescript
   connectionLimit: 5, // Reduce if still having issues
   ```

4. **Add Connection Timeout**:

   ```typescript
   acquireTimeout: 30000, // 30 seconds timeout
   ```

5. **Check for Connection Leaks**:
   - Ensure all database operations are properly awaited
   - Use transactions when multiple operations are needed
   - Close connections explicitly if using raw connections

### Best Practices

1. **Use Transactions**: Group related operations in transactions to reduce connection usage
2. **Avoid N+1 Queries**: Use joins or batch operations instead of multiple queries
3. **Proper Error Handling**: Always handle database errors to prevent connection leaks
4. **Connection Monitoring**: Monitor connection pool status in development

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
