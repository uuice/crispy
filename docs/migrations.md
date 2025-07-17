# Database Migrations Guide

This document explains how to use Kysely migrations in the Crispy CMS project.

## Overview

The project uses Kysely for database migrations and type generation. Migrations are stored in the `migrations/migrations/` directory and are executed using custom scripts.

## Prerequisites

1. Make sure your database connection is configured in `.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=crispy
DB_USER=root
DB_PASSWORD=your_password
```

2. Ensure the database exists:

```sql
CREATE DATABASE IF NOT EXISTS crispy CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## Available Commands

### 1. Setup Database (Recommended for first time)

This command will run all migrations and generate TypeScript types:

```bash
bun run migrate setup
```

Or use the individual commands:

```bash
bun run db:setup
```

### 2. Run Migrations Only

```bash
bun run migrate up
```

Or:

```bash
bun run db:migrate
```

### 3. Rollback Last Migration

```bash
bun run migrate down
```

Or:

```bash
bun run db:migrate:down
```

### 4. Generate TypeScript Types Only

```bash
bun run migrate generate
```

Or:

```bash
bun run db:generate
```

## Migration Files

### Current Migrations

1. **001_initial_schema.sql** - Creates all basic tables
   - users, roles, rules, categories, articles, pages, tags, comments
   - configs, menus, links, operate_logs, api_logs

2. **002_initial_data.sql** - Inserts basic data
   - Admin user (username: admin, password: admin123)
   - Default roles and permissions
   - Basic categories and tags
   - Sample articles and configurations

## Creating New Migrations

### 1. Create Migration File

Create a new SQL file in `migrations/migrations/` with the naming convention:

```
XXX_description.sql
```

Where `XXX` is a sequential number (e.g., 003, 004, etc.).

### 2. Write Migration SQL

Example migration file `003_add_new_table.sql`:

```sql
-- Add new table
CREATE TABLE IF NOT EXISTS `new_table` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL DEFAULT '',
  `description` text NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 10,
  `is_delete` tinyint(4) NOT NULL DEFAULT 0,
  `create_time` bigint(20) NOT NULL DEFAULT 0,
  `update_time` bigint(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data
INSERT INTO `new_table` (`name`, `description`, `status`, `create_time`, `update_time`) VALUES
('Sample Item', 'This is a sample item', 10, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000);
```

### 3. Run Migration

```bash
bun run migrate up
```

## Migration Best Practices

1. **Always use `IF NOT EXISTS`** for CREATE TABLE statements
2. **Use `ON DUPLICATE KEY UPDATE`** for INSERT statements to avoid errors
3. **Include proper indexes** for performance
4. **Use consistent naming conventions** for tables and columns
5. **Always include `is_delete`, `create_time`, `update_time`** fields for soft deletes and auditing
6. **Use `UNIX_TIMESTAMP() * 1000`** for timestamp fields to store milliseconds

## Database Schema

### Common Fields

Most tables include these standard fields:

- `id` - Primary key (auto increment)
- `is_delete` - Soft delete flag (0 = active, 1 = deleted)
- `create_time` - Creation timestamp (milliseconds)
- `update_time` - Last update timestamp (milliseconds)
- `status` - Status flag (10 = active, -10 = inactive)

### Indexes

Common indexes to include:

- `idx_status` - For status filtering
- `idx_create_time` - For time-based queries
- `idx_parent_id` - For hierarchical data
- `idx_user_id` - For user-related data

## Troubleshooting

### Common Issues

1. **Connection refused**: Check database connection settings in `.env`
2. **Permission denied**: Ensure database user has proper permissions
3. **Table already exists**: Use `IF NOT EXISTS` in CREATE statements
4. **Duplicate key error**: Use `ON DUPLICATE KEY UPDATE` in INSERT statements

### Reset Database

To completely reset the database:

```bash
# Drop and recreate database
mysql -u root -p -e "DROP DATABASE IF EXISTS crispy; CREATE DATABASE crispy CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Run migrations
bun run migrate setup
```

## Type Generation

After running migrations, TypeScript types are automatically generated in `src/db/db.d.ts`. These types are used throughout the application for type safety.

To manually regenerate types:

```bash
bun run db:generate
```

## Environment Variables

Make sure these environment variables are set in your `.env` file:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=crispy
DB_USER=root
DB_PASSWORD=your_password
NODE_ENV=development
```
