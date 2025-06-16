# Swagger API 文档

## 概述

本项目已集成 Swagger 文档，提供了完整的 API 接口文档。通过 Swagger UI，你可以：

- 查看所有可用的 API 端点
- 测试 API 接口
- 查看请求和响应的数据结构
- 了解认证方式

## 访问方式

启动服务器后，访问以下地址查看 API 文档：

```
http://localhost:4000/api/docs
```

## API 模块

API 接口分为两个主要模块：

### Admin 模块

管理后台接口，使用 JWT 认证。

#### 认证方式

1. 点击右上角的 "Authorize" 按钮
2. 在 "bearerAuth" 字段中输入你的 JWT token
3. 格式：`Bearer your_jwt_token_here`
4. 点击 "Authorize" 确认

#### 获取 JWT Token

首先需要通过登录接口获取 JWT token：

1. 找到 `/admin/login` 接口
2. 点击 "Try it out"
3. 输入用户名和密码
4. 执行请求
5. 从响应中复制 `data.token` 字段的值

### Content 模块

内容接口，使用 Access Token 认证。

#### 认证方式

1. 点击右上角的 "Authorize" 按钮
2. 在 "accessTokenAuth" 字段中输入你的 Access Token
3. 点击 "Authorize" 确认
4. 在请求时需要在查询参数中提供：
   - `app_name`: 应用名称
   - `channel`: 渠道名称

#### 获取 Access Token

通过管理后台的 Access Token 管理接口创建：

1. 使用管理员账号登录管理后台
2. 访问 Access Token 管理页面
3. 创建新的 Access Token
4. 记录生成的 token 值

## API 分组

### Admin 模块接口组

- **Authentication**: 用户认证相关接口
- **Users**: 用户管理接口
- **Ads**: 广告管理接口
- **AdItems**: 广告项目接口
- **Additions**: 附加信息接口
- **ApiLogs**: API 日志接口
- **Articles**: 文章管理接口
- **Categories**: 分类管理接口
- **Attrs**: 属性管理接口
- **Caches**: 缓存管理接口
- **Configs**: 配置管理接口
- **Enums**: 枚举管理接口
- **Holidays**: 节假日管理接口
- **Jobs**: 任务管理接口
- **Keywords**: 关键词管理接口
- **Links**: 链接管理接口
- **Menus**: 菜单管理接口
- **Notices**: 通知管理接口
- **OperateLogs**: 操作日志接口
- **Pages**: 页面管理接口
- **Roles**: 角色管理接口
- **Rules**: 规则管理接口
- **Tags**: 标签管理接口
- **UserTypes**: 用户类型接口
- **Votes**: 投票管理接口
- **VoteItems**: 投票项目接口
- **AccessTokens**: Access Token 管理接口

### Content 模块接口组

- **Users**: 用户信息接口
- **Ads**: 广告内容接口
- **AdItems**: 广告项目接口
- **Articles**: 文章内容接口
- **Categories**: 分类信息接口
- **AccessTokens**: Access Token 验证接口

## 通用响应格式

所有 API 接口都遵循统一的响应格式：

### 成功响应

```json
{
  "success": true,
  "message": "操作成功",
  "data": {
    // 具体数据
  }
}
```

### 错误响应

```json
{
  "success": false,
  "message": "错误信息",
  "error": "详细错误描述"
}
```

## 分页接口

支持分页的接口使用以下查询参数：

- `page`: 页码（默认：1）
- `pageSize`: 每页数量（默认：10）

分页响应格式：

```json
{
  "data": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "pageSize": 10,
    "totalPages": 10
  }
}
```

## 开发说明

### 添加新的 API 接口

1. 在对应的控制器文件中实现接口逻辑
2. 根据模块选择在 `src/server/routes/admin/routes.ts` 或 `src/server/routes/content/routes.ts` 中添加路由
3. 为路由添加 Swagger 注释，格式如下：

#### Admin 模块接口

```typescript
/**
 * @swagger
 * /admin/your-endpoint:
 *   get:
 *     tags: [YourTag]
 *     summary: 接口描述
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 成功响应
 */
```

#### Content 模块接口

```typescript
/**
 * @swagger
 * /content/your-endpoint:
 *   get:
 *     tags: [YourTag]
 *     summary: 接口描述
 *     security:
 *       - accessTokenAuth: []
 *     parameters:
 *       - in: query
 *         name: app_name
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: channel
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 成功响应
 */
```

### 更新 Swagger 配置

如需修改 Swagger 配置，编辑 `src/server/config/swagger.ts` 文件。

## 注意事项

1. 确保服务器正在运行
2. Admin 模块：
   - 登录接口不需要认证
   - 其他接口都需要有效的 JWT token
3. Content 模块：
   - 所有接口都需要有效的 Access Token
   - 必须在查询参数中提供 app_name 和 channel
4. 删除操作通常是软删除（逻辑删除）
5. 所有时间戳使用毫秒级时间戳
