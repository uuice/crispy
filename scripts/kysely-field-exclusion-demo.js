#!/usr/bin/env node

/**
 * Kysely 字段排除方法演示
 */

console.log('🔍 Kysely 字段排除方法演示\n');

// 方法1: 使用常量定义安全字段（推荐）
console.log('方法1: 使用常量定义安全字段（推荐）');
console.log('=====================================');
console.log(`
// 定义安全字段常量
const SAFE_USER_FIELDS = [
  'id', 'user_name', 'email', 'phone', 'real_name', 
  'nick_name', 'avatar_url', 'role_id', 'type_id', 
  'status', 'is_admin', 'is_super_admin', 'is_black',
  'create_time', 'update_time', 'last_login_time', 'is_delete'
] as const;

// 使用方式
const user = await db
  .selectFrom('users')
  .select(SAFE_USER_FIELDS)
  .where('id', '=', id)
  .executeTakeFirst();

优点:
✅ 类型安全
✅ 代码复用
✅ 易于维护
✅ 性能好（只查询需要的字段）
`);

// 方法2: 使用 TypeScript 类型操作
console.log('\n方法2: 使用 TypeScript 类型操作');
console.log('=====================================');
console.log(`
// 定义安全用户类型
type SafeUser = Omit<User, 'password'>;

// 创建字段选择器
function getSafeUserFields<T extends keyof SafeUser>(...fields: T[]): T[] {
  return fields;
}

// 或者使用所有安全字段
const SAFE_USER_KEYS = Object.keys({} as SafeUser).filter(key => key !== 'password');

优点:
✅ 编译时类型检查
✅ 自动排除敏感字段
✅ IDE 智能提示
`);

// 方法3: 使用辅助函数
console.log('\n方法3: 使用辅助函数');
console.log('=====================================');
console.log(`
// 创建字段排除辅助函数
function excludeFields<T, K extends keyof T>(obj: T, ...keys: K[]): Omit<T, K> {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
}

// 查询后排除字段
const user = await db
  .selectFrom('users')
  .selectAll()
  .where('id', '=', id)
  .executeTakeFirst();

const safeUser = excludeFields(user, 'password');

缺点:
❌ 仍然查询了敏感字段
❌ 网络传输包含敏感数据
❌ 性能略差
`);

// 方法4: 使用 Kysely 的动态查询
console.log('\n方法4: 使用 Kysely 的动态查询构建');
console.log('=====================================');
console.log(`
// 动态构建安全查询
function createSafeUserQuery(db) {
  return db
    .selectFrom('users')
    .select([
      'id', 'user_name', 'email', 'phone', 'real_name',
      'nick_name', 'avatar_url', 'role_id', 'type_id',
      'status', 'is_admin', 'is_super_admin', 'is_black',
      'create_time', 'update_time', 'last_login_time', 'is_delete'
    ]);
}

// 使用方式
const user = await createSafeUserQuery(db)
  .where('id', '=', id)
  .executeTakeFirst();

优点:
✅ 查询复用
✅ 类型安全
✅ 只查询安全字段
`);

// 方法5: 使用 Kysely 插件（高级）
console.log('\n方法5: 使用 Kysely 插件（高级）');
console.log('=====================================');
console.log(`
// 创建字段过滤插件
class FieldFilterPlugin {
  transformQuery(args) {
    // 自动过滤敏感字段的插件逻辑
    return args.node;
  }
}

// 在数据库配置中使用
const db = new Kysely({
  dialect: new PostgresDialect(config),
  plugins: [new FieldFilterPlugin()]
});

优点:
✅ 全局生效
✅ 自动化处理
✅ 透明操作

缺点:
❌ 复杂度高
❌ 调试困难
`);

// 推荐的最佳实践
console.log('\n🎯 推荐的最佳实践');
console.log('=====================================');
console.log(`
1. 使用常量定义安全字段（方法1）
   - 简单直接，性能最好
   - 类型安全，易于维护

2. 为不同场景创建不同的字段集合:
   const USER_LIST_FIELDS = ['id', 'user_name', 'email', 'status'];
   const USER_DETAIL_FIELDS = [...USER_LIST_FIELDS, 'phone', 'real_name'];
   const USER_PROFILE_FIELDS = [...USER_DETAIL_FIELDS, 'avatar_url'];

3. 使用 TypeScript 类型确保安全:
   type SafeUser = Omit<User, 'password' | 'salt'>;

4. 在服务层统一处理:
   class UserService {
     private readonly safeFields = SAFE_USER_FIELDS;
     
     async getUser(id: number): Promise<SafeUser> {
       return db.selectFrom('users')
         .select(this.safeFields)
         .where('id', '=', id)
         .executeTakeFirst();
     }
   }
`);

// 性能对比
console.log('\n📊 性能对比');
console.log('=====================================');
console.log(`
查询方式                    | 网络传输 | 数据库负载 | 安全性 | 推荐度
---------------------------|----------|------------|--------|--------
selectAll() + 后端过滤      | 高       | 高         | 低     | ❌
明确字段选择               | 低       | 低         | 高     | ✅
常量定义字段               | 低       | 低         | 高     | ✅
动态字段构建               | 低       | 低         | 高     | ✅
`);

console.log('\n✅ 总结: 使用常量定义安全字段是最佳实践！');
console.log('   - 性能最优');
console.log('   - 安全性最高');
console.log('   - 代码最清晰');
console.log('   - 维护最简单');

console.log('\n🔧 在您的项目中已经实现了最佳实践:');
console.log('   - SAFE_USER_FIELDS 常量定义');
console.log('   - SAFE_USER_FIELDS_WITH_PREFIX 用于 JOIN 查询');
console.log('   - 所有用户查询方法都使用安全字段');
console.log('   - 类型安全且性能优化');

module.exports = {
  SAFE_USER_FIELDS: [
    'id', 'user_name', 'email', 'phone', 'real_name',
    'nick_name', 'avatar_url', 'role_id', 'type_id',
    'status', 'is_admin', 'is_super_admin', 'is_black',
    'create_time', 'update_time', 'last_login_time', 'is_delete'
  ]
};
