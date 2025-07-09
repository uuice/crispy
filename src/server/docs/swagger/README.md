# Crispy API Swagger 文档结构

## 概述

Crispy 应用提供两套 API 系统，每套都有完整的 Swagger 文档：

1. **Admin API** - 管理后台 API，提供完整的 CRUD 操作
2. **Content API** - 内容访问 API，主要提供只读访问

## 文档结构

```
src/server/docs/swagger/
├── README.md                    # 本说明文件
├── admin/                       # Admin API 文档
│   ├── index.ts                # Admin API 文档入口
│   ├── users.ts                # 用户管理 API
│   ├── articles.ts             # 文章管理 API
│   ├── comments.ts             # 评论管理 API
│   └── ...                     # 其他 29 个模块文件
└── content/                     # Content API 文档
    ├── index.ts                # Content API 文档入口
    ├── users.ts                # 用户信息 API
    ├── articles.ts             # 文章内容 API
    ├── categories.ts           # 分类信息 API
    └── ...                     # 其他 27 个模块文件
```

## API 对比

| 特性 | Admin API | Content API |
|------|-----------|-------------|
| **用途** | 管理后台操作 | 内容访问和展示 |
| **认证方式** | JWT Bearer Token | Access Token + App Name + Channel |
| **操作类型** | 完整 CRUD (GET/POST/PUT/DELETE) | 主要只读 (GET + 少量 POST) |
| **访问权限** | 管理员权限 | 受限的内容访问 |
| **目标用户** | 管理员 | 外部应用/第三方集成 |
| **路径前缀** | `/admin/*` | `/content/*` |
| **文档地址** | `/admin/docs` | `/content/docs` |

## Admin API 详情

### 认证方式
```http
Authorization: Bearer <JWT_TOKEN>
```

### 主要功能模块
- **用户管理**: 用户 CRUD、角色管理、权限控制
- **内容管理**: 文章、分类、标签、评论管理
- **系统管理**: 配置、菜单、通知、日志管理
- **广告管理**: 广告位、广告项目管理
- **投票管理**: 投票活动、投票项目管理

### 统计信息
- **API 路径**: 68 个
- **功能标签**: 31 个
- **文档文件**: 29 个
- **总文档大小**: ~150 KB

## Content API 详情

### 认证方式
```http
x-access-token: <ACCESS_TOKEN>
x-app-name: <APP_NAME>
x-channel: <CHANNEL_NAME>
```

### 主要功能模块
- **内容获取**: 文章、分类、标签内容
- **用户信息**: 用户基本信息查询
- **配置信息**: 系统配置、菜单结构
- **广告内容**: 广告展示数据
- **投票信息**: 投票活动和结果

### 统计信息
- **API 路径**: 57 个
- **功能标签**: 26 个
- **文档文件**: 27 个
- **总文档大小**: ~50 KB
- **请求类型**: 56 个 GET + 1 个 POST

## 使用方法

### 查看文档

1. **Admin API 文档**
   ```
   http://localhost:4000/admin/docs
   ```

2. **Content API 文档**
   ```
   http://localhost:4000/content/docs
   ```

### 认证测试

#### Admin API 认证
1. 使用 `/admin/login` 接口获取 JWT Token
2. 在 Swagger UI 中点击 "Authorize" 按钮
3. 输入 `Bearer <token>` 格式的认证信息

#### Content API 认证
1. 获取有效的 Access Token、App Name 和 Channel
2. 在 Swagger UI 中分别配置三个认证头部
3. 测试 `/content/access-token/check` 接口验证认证

## 开发指南

### 添加新的 API 文档

#### Admin API
1. 在 `src/server/docs/swagger/admin/` 目录下找到对应模块文件
2. 添加 Swagger 注释
3. 确保使用 `bearerAuth` 安全配置

#### Content API
1. 在 `src/server/docs/swagger/content/` 目录下找到对应模块文件
2. 添加 Swagger 注释
3. 确保使用 `accessTokenAuth` 安全配置

### 文档格式示例

```typescript
/**
 * @swagger
 * /admin/users:
 *   get:
 *     tags: [Users]
 *     summary: 获取用户列表
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: 页码
 *     responses:
 *       200:
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
```

## 自动化工具

### 生成工具
- `scripts/extract-swagger-docs.js` - 从路由文件提取 Admin API 文档
- `scripts/generate-content-swagger.js` - 生成 Content API 文档
- `scripts/clean-routes-swagger.js` - 清理路由文件中的文档注释

### 测试工具
- `scripts/test-swagger-config.js` - 测试 Admin API 配置
- `scripts/test-content-swagger.js` - 测试 Content API 配置

### 使用方法
```bash
# 生成 Content API 文档
node scripts/generate-content-swagger.js

# 测试配置
node scripts/test-swagger-config.js
node scripts/test-content-swagger.js
```

## 配置文件

### Swagger 配置
- 文件位置: `src/server/config/swagger.ts`
- 包含两套独立的配置: `adminOptions` 和 `contentOptions`
- 支持不同的认证方式和文档路径

### 路径配置
```typescript
// Admin API
apis: [
  './src/server/docs/swagger/admin/**/*.ts',
  './src/server/routes/admin/**/*.ts'
]

// Content API  
apis: [
  './src/server/docs/swagger/content/**/*.ts',
  './src/server/routes/content/**/*.ts'
]
```

## 维护建议

1. **定期更新**: 新增 API 时及时添加文档
2. **保持一致**: 使用统一的文档格式和描述风格
3. **测试验证**: 使用自动化工具验证文档配置
4. **版本管理**: 重要变更时更新版本号
5. **权限检查**: 确保文档中的安全配置正确

## 故障排除

### 常见问题
1. **文档不显示**: 检查文件路径和导入语句
2. **认证失败**: 验证安全配置和 token 格式
3. **路径错误**: 确认 API 路径与实际路由匹配
4. **格式错误**: 检查 Swagger 注释语法

### 调试工具
- 使用测试脚本验证配置
- 检查服务器控制台错误信息
- 验证 JSON Schema 格式
