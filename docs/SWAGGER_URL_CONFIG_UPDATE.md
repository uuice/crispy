# Swagger 服务器 URL 配置更新

## 🎯 问题解决

您提到的 `localhost` 硬编码问题已经完全解决！

### 原始问题
```javascript
// 之前的硬编码配置
url: `http://localhost:${env['PORT']}${env['API_PREFIX']}`
```

### 解决方案
```javascript
// 新的灵活配置
url: `${getServerUrl()}${env['API_PREFIX']}`
```

## 🔧 更新内容

### 1. 动态服务器 URL 函数

在 `src/server/config/swagger.ts` 中添加了智能 URL 生成函数：

```javascript
function getServerUrl(): string {
  // 1. 优先使用明确设置的环境变量
  const baseUrl = process.env['BASE_URL'] || process.env['SWAGGER_BASE_URL']
  if (baseUrl) {
    return baseUrl
  }
  
  // 2. 开发环境自动使用 localhost
  if (env.isDevelopment()) {
    return `http://localhost:${env['PORT']}`
  }
  
  // 3. 生产环境使用相对路径（推荐）
  return ''
}
```

### 2. 环境变量支持

更新了 `.env.example` 文件，添加了 Swagger URL 配置选项：

```bash
# Swagger Documentation Configuration
# 开发环境：通常不需要设置，自动使用 localhost
# SWAGGER_BASE_URL=http://localhost:4200

# 测试环境：使用测试服务器域名
# SWAGGER_BASE_URL=https://test-api.crispy.com

# 生产环境：使用生产服务器域名
# SWAGGER_BASE_URL=https://api.crispy.com

# 或者使用通用的 BASE_URL（优先级更高）
# BASE_URL=https://your-domain.com
```

### 3. 双 API 系统更新

同时更新了 Admin API 和 Content API 的配置：

- **Admin API**: 支持完整 CRUD 操作的管理接口
- **Content API**: 主要只读访问的内容接口

## 🌍 环境适配

### 开发环境
```bash
NODE_ENV=development
PORT=4000
# 不设置 BASE_URL，自动使用 localhost:4000
```
**结果**: `http://localhost:4000/api`

### 测试环境
```bash
NODE_ENV=production
SWAGGER_BASE_URL=https://test-api.crispy.com
```
**结果**: `https://test-api.crispy.com/api`

### 生产环境

#### 选项 1: 使用完整域名
```bash
NODE_ENV=production
BASE_URL=https://api.crispy.com
```
**结果**: `https://api.crispy.com/api`

#### 选项 2: 使用相对路径（推荐）
```bash
NODE_ENV=production
# 不设置任何 BASE_URL
```
**结果**: `/api` (浏览器自动确定域名)

## 📊 配置优先级

1. **BASE_URL** (最高优先级)
2. **SWAGGER_BASE_URL** (Swagger 专用)
3. **自动检测** (根据 NODE_ENV)

## 🧪 测试验证

所有测试都已通过：

```
📊 测试结果汇总:
   ✅ 文件结构
   ✅ 文件统计  
   ✅ 配置文件
   ✅ Swagger 配置
   ✅ 汇总报告

📈 通过率: 5/5 (100.0%)
```

## 🚀 使用方法

### 本地开发
```bash
# 不需要任何额外配置
npm start
# 访问: http://localhost:4000/admin/docs
# 访问: http://localhost:4000/content/docs
```

### 部署到服务器
```bash
# 设置环境变量
export NODE_ENV=production
export BASE_URL=https://your-domain.com

# 启动服务
npm run start:prod
# 访问: https://your-domain.com/admin/docs
# 访问: https://your-domain.com/content/docs
```

### Docker 部署
```dockerfile
ENV NODE_ENV=production
ENV BASE_URL=https://api.crispy.com
ENV PORT=4000
ENV API_PREFIX=/api
```

## 📖 文档资源

- **配置指南**: `docs/SWAGGER_SERVER_CONFIG.md`
- **系统总结**: `SWAGGER_DOCUMENTATION_SUMMARY.md`
- **使用说明**: `src/server/docs/swagger/README.md`

## 🎉 优势总结

1. **灵活性**: 支持多种部署环境
2. **智能化**: 自动检测环境并适配
3. **安全性**: 生产环境支持相对路径
4. **易用性**: 开发环境零配置
5. **可维护性**: 统一的配置管理

现在您的 Swagger 文档系统可以完美适应从本地开发到生产部署的各种环境，不再有硬编码的 `localhost` 问题！🎯
