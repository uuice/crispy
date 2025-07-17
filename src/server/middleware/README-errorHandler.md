# 错误处理系统

本文档说明了项目中的错误处理机制和使用方法。

## 概述

错误处理系统包含以下组件：
- 自定义错误类 `AppError`
- 异步错误捕获包装器 `catchAsync`
- 404 错误处理中间件 `notFoundHandler`
- 全局错误处理中间件 `globalErrorHandler`
- 通用错误页面模板 `error.njk`

## 组件说明

### 1. AppError 类

自定义错误类，用于创建可预期的业务错误：

```typescript
class AppError extends Error {
  public statusCode: number
  public isOperational: boolean
}
```

**使用示例：**
```typescript
// 404 错误
throw new AppError('文章不存在', 404)

// 400 错误
throw new AppError('页码必须大于0', 400)

// 500 错误
throw new AppError('数据库连接失败', 500)
```

### 2. catchAsync 包装器

用于包装异步路由处理函数，自动捕获异步错误：

```typescript
router.get('/blog', catchAsync(async (req, res) => {
  // 异步操作
  const articles = await articleService.getArticles()
  res.render('blog/index.njk', { articles })
}))
```

### 3. 错误处理中间件

#### notFoundHandler
处理 404 错误，当没有路由匹配时触发：

```typescript
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(`页面不存在: ${req.originalUrl}`, 404)
  next(error)
}
```

#### globalErrorHandler
全局错误处理中间件，处理所有未捕获的错误：

```typescript
export const globalErrorHandler = (
  error: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // 错误处理逻辑
}
```

## 错误类型

### 1. 客户端错误 (4xx)

- **400 Bad Request**: 请求参数错误
  ```typescript
  throw new AppError('页码必须大于0', 400)
  ```

- **404 Not Found**: 资源不存在
  ```typescript
  throw new AppError('文章不存在', 404)
  ```

### 2. 服务器错误 (5xx)

- **500 Internal Server Error**: 服务器内部错误
  ```typescript
  throw new AppError('数据库操作失败', 500)
  ```

## 错误页面

### 错误页面模板 (error.njk)

提供用户友好的错误页面，包含：
- 错误状态码和图标
- 错误标题和描述
- 操作按钮（返回上页、回到首页）
- 搜索功能（404 页面）
- 自动重试功能（500 错误）

### 错误页面特性

1. **响应式设计**: 适配移动端和桌面端
2. **图标显示**: 根据错误类型显示不同图标
3. **操作建议**: 提供解决问题的建议
4. **自动重试**: 服务器错误时自动重试
5. **错误报告**: 自动发送错误报告到服务器

## 使用指南

### 1. 在路由中使用

```typescript
import { AppError, catchAsync } from '../middleware/errorHandler'

// 使用 catchAsync 包装异步路由
router.get('/blog/article/:id', catchAsync(async (req, res) => {
  const articleId = parseInt(req.params.id)
  
  // 参数验证
  if (isNaN(articleId) || articleId <= 0) {
    throw new AppError('文章不存在', 404)
  }
  
  // 业务逻辑
  const article = await articleService.getArticleById(articleId)
  if (!article) {
    throw new AppError('文章不存在', 404)
  }
  
  res.render('blog/article.njk', { article })
}))
```

### 2. 在服务中使用

```typescript
// 在服务层抛出业务错误
export class ArticleService {
  async getArticleById(id: number) {
    try {
      const article = await db.query('SELECT * FROM articles WHERE id = ?', [id])
      return article
    } catch (error) {
      // 数据库错误转换为业务错误
      throw new AppError('获取文章失败', 500)
    }
  }
}
```

### 3. 数据库错误处理

```typescript
import { handleDatabaseError } from '../middleware/errorHandler'

try {
  await db.query('INSERT INTO articles ...')
} catch (error) {
  throw handleDatabaseError(error)
}
```

## 配置

### 1. 在 server.ts 中注册中间件

```typescript
import { notFoundHandler, globalErrorHandler } from './server/middleware/errorHandler'

// 注册路由...

// 404 处理（必须在所有路由之后）
app.use(notFoundHandler)

// 全局错误处理（必须最后注册）
app.use(globalErrorHandler)
```

### 2. 环境配置

- **开发环境**: 显示详细错误信息和堆栈跟踪
- **生产环境**: 显示用户友好的错误页面

## 最佳实践

### 1. 错误分类

- 使用合适的 HTTP 状态码
- 提供清晰的错误消息
- 区分可预期和不可预期的错误

### 2. 错误日志

- 记录详细的错误信息
- 包含请求上下文（URL、方法、IP等）
- 使用结构化日志格式

### 3. 用户体验

- 提供友好的错误页面
- 给出解决问题的建议
- 提供替代操作选项

### 4. 安全考虑

- 不在生产环境暴露敏感信息
- 记录安全相关的错误
- 防止错误信息泄露系统信息

## 扩展功能

### 1. 错误报告

客户端自动发送错误报告：
```javascript
// 错误页面中的 JavaScript
function reportError() {
  const errorData = {
    statusCode: 404,
    message: '页面不存在',
    url: window.location.href,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString()
  }
  
  navigator.sendBeacon('/api/error-report', JSON.stringify(errorData))
}
```

### 2. 监控集成

可以集成第三方监控服务：
- Sentry
- LogRocket
- Bugsnag

### 3. 自定义错误页面

可以为不同类型的错误创建专门的页面：
- 404.njk
- 500.njk
- maintenance.njk
