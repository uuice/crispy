# Swagger API 文档结构

## 概述

为了更好地管理和维护 API 文档，我们将 Swagger 文档从 `routes.ts` 文件中分离出来，按功能模块组织到独立的文件中。

## 文件结构

```
src/server/docs/swagger/
├── index.ts              # 主入口文件，导入所有模块
├── README.md            # 本说明文件
├── users.ts             # 用户认证和用户管理 API
├── ads.ts               # 广告和广告项目 API
├── articles.ts          # 文章管理 API
├── categories.ts        # 分类管理 API
├── configs.ts           # 配置管理 API
├── comments.ts          # 评论管理 API
├── upload.ts            # 文件上传 API
├── system.ts            # 系统信息 API
├── dashboard.ts         # 仪表板 API
└── ...                  # 其他模块文件
```

## 模块说明

| 文件名 | 模块 | 描述 |
|--------|------|------|
| `users.ts` | Authentication, Users | 用户认证（登录/登出）和用户管理 |
| `ads.ts` | Ads, AdItems | 广告管理和广告项目管理 |
| `articles.ts` | Articles | 文章管理相关接口 |
| `categories.ts` | Categories | 分类管理相关接口 |
| `configs.ts` | Configs | 系统配置管理接口 |
| `comments.ts` | Comments | 评论管理接口 |
| `upload.ts` | Upload | 文件上传接口 |
| `system.ts` | System | 系统信息接口 |
| `dashboard.ts` | Dashboard | 仪表板数据接口 |
| `access-tokens.ts` | AccessTokens | Access Token 管理 |
| `operate-logs.ts` | OperateLogs | 操作日志管理 |
| `roles.ts` | Roles | 角色管理 |
| `rules.ts` | Rules | 规则管理 |
| `tags.ts` | Tags | 标签管理 |
| `pages.ts` | Pages | 页面管理 |

## 优势

### 1. 文件管理
- **模块化**：每个功能模块的文档独立管理
- **可维护性**：修改某个模块的文档不影响其他模块
- **可读性**：文档结构清晰，易于查找和理解

### 2. 开发效率
- **并行开发**：多人可以同时编辑不同模块的文档
- **版本控制**：Git 冲突减少，变更历史更清晰
- **代码审查**：文档变更更容易审查

### 3. 性能优化
- **文件大小**：routes.ts 从 5606 行减少到 417 行
- **加载速度**：文档按需加载，提高构建速度
- **内存占用**：减少单个文件的内存占用

## 使用方法

### 查看文档
访问 `http://localhost:4000/admin/docs` 查看完整的 API 文档。

### 添加新的 API 文档

1. **确定模块**：根据 API 功能确定属于哪个模块
2. **编辑文件**：在对应的模块文件中添加 Swagger 注释
3. **更新索引**：如果是新模块，需要在 `index.ts` 中添加导入

示例：
```typescript
/**
 * @swagger
 * /admin/your-endpoint:
 *   get:
 *     tags: [YourModule]
 *     summary: 接口描述
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功响应
 */
```

### 修改现有文档
直接编辑对应模块文件中的 Swagger 注释即可。

## 自动化工具

### 提取工具
`scripts/extract-swagger-docs.js` - 从 routes.ts 提取 Swagger 文档到模块文件

### 清理工具
`scripts/clean-routes-swagger.js` - 从 routes.ts 移除 Swagger 注释

### 使用方法
```bash
# 提取 Swagger 文档
node scripts/extract-swagger-docs.js

# 清理 routes.ts 文件
node scripts/clean-routes-swagger.js
```

## 配置

在 `src/server/config/swagger.ts` 中，确保 `apis` 路径包含文档目录：

```typescript
apis: [
  './src/server/docs/swagger/**/*.ts',
  './src/server/docs/swagger/**/*.js',
  './src/server/routes/admin/**/*.ts', 
  './src/server/routes/admin/**/*.js'
]
```

## 注意事项

1. **文件命名**：使用小写字母和连字符，如 `user-types.ts`
2. **模块标签**：确保 Swagger 注释中的 `tags` 与模块对应
3. **导入顺序**：在 `index.ts` 中按字母顺序导入模块
4. **备份恢复**：清理工具会自动创建备份文件，如有问题可以恢复

## 维护

- 定期检查文档的准确性和完整性
- 新增 API 时及时添加对应的文档
- 保持文档格式的一致性
- 定期更新示例和描述
