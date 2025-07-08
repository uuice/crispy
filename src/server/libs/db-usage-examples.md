# Kysely 过滤 undefined 字段使用指南

## 概述

我们为 Kysely 数据库实例添加了自动过滤 `undefined` 字段的功能，通过插件和扩展方法实现。

## 功能特性

### 1. 工具函数
- `filterUndefined()`: 手动过滤对象中的 undefined 字段

### 2. 扩展方法
- `safeInsertInto()`: 自动过滤 undefined 字段的插入方法
- `safeUpdateTable()`: 自动过滤 undefined 字段的更新方法

### 3. 插件支持
- `FilterUndefinedPlugin`: Kysely 插件，为未来扩展预留

## 使用方法

### 手动过滤（工具函数）

```typescript
import { db, filterUndefined } from '../libs/db'

const userData = {
  name: 'John',
  email: 'john@example.com',
  age: undefined,
  phone: undefined
}

// 手动过滤后插入
const filteredData = filterUndefined(userData)
await db.insertInto('users').values(filteredData).execute()

// 手动过滤后更新
await db.updateTable('users')
  .set(filterUndefined(userData))
  .where('id', '=', userId)
  .execute()
```

### 自动过滤（扩展方法）

```typescript
import { db } from '../libs/db'

const userData = {
  name: 'John',
  email: 'john@example.com',
  age: undefined,      // 会被自动过滤
  phone: undefined     // 会被自动过滤
}

// 使用 safeInsertInto - 自动过滤 undefined 字段
await db.safeInsertInto('users')
  .values(userData)
  .execute()

// 使用 safeUpdateTable - 自动过滤 undefined 字段
await db.safeUpdateTable('users')
  .set(userData)
  .where('id', '=', userId)
  .execute()
```

## 实际应用示例

### 在服务类中使用

```typescript
// src/server/services/user.service.ts
export class UserService {
  async createUser(userData: Partial<Users>) {
    // 自动过滤 undefined 字段
    const result = await db.safeInsertInto('users')
      .values(userData)
      .executeTakeFirstOrThrow()
    
    return result
  }

  async updateUser(userId: number, userData: Partial<Users>) {
    // 自动过滤 undefined 字段
    const result = await db.safeUpdateTable('users')
      .set(userData)
      .where('id', '=', userId)
      .executeTakeFirstOrThrow()
    
    return result
  }
}
```

### 在 API 路由中使用

```typescript
// src/server/api/users.ts
export async function POST(request: Request) {
  const body = await request.json()
  
  const userData = {
    name: body.name,
    email: body.email,
    age: body.age,        // 可能是 undefined
    phone: body.phone,    // 可能是 undefined
    avatar: body.avatar   // 可能是 undefined
  }
  
  // 自动过滤 undefined 字段后插入
  const user = await db.safeInsertInto('users')
    .values(userData)
    .executeTakeFirstOrThrow()
  
  return Response.json({ success: true, data: user })
}
```

## 对比传统方法

### 传统方法（需要手动处理）

```typescript
// ❌ 传统方法 - 需要手动过滤
const userData = {
  name: 'John',
  email: 'john@example.com',
  age: undefined,
  phone: undefined
}

// 手动过滤 undefined 字段
const filteredData: any = {}
Object.keys(userData).forEach(key => {
  if (userData[key] !== undefined) {
    filteredData[key] = userData[key]
  }
})

await db.insertInto('users').values(filteredData).execute()
```

### 新方法（自动过滤）

```typescript
// ✅ 新方法 - 自动过滤
const userData = {
  name: 'John',
  email: 'john@example.com',
  age: undefined,
  phone: undefined
}

// 直接使用，自动过滤 undefined 字段
await db.safeInsertInto('users').values(userData).execute()
```

## 注意事项

### 1. 类型安全
- 扩展方法保持了 Kysely 的类型安全特性
- 使用 `as any` 进行类型断言以避免复杂的类型推导

### 2. 性能考虑
- 过滤操作在内存中进行，对性能影响很小
- 避免了数据库层面的错误和不必要的字段更新

### 3. 兼容性
- 完全兼容现有的 Kysely 查询方法
- 可以混合使用传统方法和新的扩展方法

### 4. 调试
- 在开发环境中，可以通过日志查看过滤前后的数据差异

## 最佳实践

### 1. 优先使用扩展方法
```typescript
// ✅ 推荐
await db.safeInsertInto('users').values(userData).execute()

// ⚠️ 只在需要更复杂逻辑时使用
const filtered = filterUndefined(userData)
await db.insertInto('users').values(filtered).execute()
```

### 2. 在服务层统一使用
```typescript
export class BaseService {
  protected async safeCreate<T extends keyof DB>(
    table: T, 
    data: any
  ) {
    return await db.safeInsertInto(table).values(data).execute()
  }
  
  protected async safeUpdate<T extends keyof DB>(
    table: T, 
    data: any, 
    where: any
  ) {
    return await db.safeUpdateTable(table).set(data).where(where).execute()
  }
}
```

### 3. 类型定义
```typescript
// 为常用操作定义类型
type SafeInsert<T extends keyof DB> = Partial<DB[T]>
type SafeUpdate<T extends keyof DB> = Partial<DB[T]>
```

## 总结

通过插件和扩展方法的组合，我们实现了：
- ✅ 自动过滤 undefined 字段
- ✅ 保持类型安全
- ✅ 向后兼容
- ✅ 简化代码
- ✅ 提高开发效率

这个解决方案让您可以专注于业务逻辑，而不用担心 undefined 字段导致的数据库错误。
