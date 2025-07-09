# Swagger 服务器 URL 配置指南

## 概述

Crispy 应用的 Swagger 文档系统现在支持灵活的服务器 URL 配置，可以适应不同的部署环境。

## 配置方式

### 环境变量优先级

系统按以下优先级确定服务器 URL：

1. **BASE_URL** - 通用基础 URL（最高优先级）
2. **SWAGGER_BASE_URL** - 专门用于 Swagger 文档的 URL
3. **自动检测** - 根据环境自动生成

### 配置逻辑

```javascript
function getServerUrl() {
  // 1. 优先使用明确设置的 BASE_URL
  const baseUrl = process.env.BASE_URL || process.env.SWAGGER_BASE_URL;
  if (baseUrl) {
    return baseUrl;
  }
  
  // 2. 开发环境自动使用 localhost
  if (process.env.NODE_ENV === 'development') {
    return `http://localhost:${process.env.PORT}`;
  }
  
  // 3. 生产环境使用相对路径（推荐）
  return '';
}
```

## 不同环境的配置示例

### 开发环境

```bash
# .env.development
NODE_ENV=development
PORT=4000
API_PREFIX=/api

# 不需要设置 BASE_URL，自动使用 localhost
# 结果：http://localhost:4000/api
```

### 测试环境

```bash
# .env.test
NODE_ENV=production
PORT=4000
API_PREFIX=/api
SWAGGER_BASE_URL=https://test-api.crispy.com

# 结果：https://test-api.crispy.com/api
```

### 生产环境

#### 方式 1：使用完整域名（推荐用于外部 API）

```bash
# .env.production
NODE_ENV=production
PORT=4000
API_PREFIX=/api
BASE_URL=https://api.crispy.com

# 结果：https://api.crispy.com/api
```

#### 方式 2：使用相对路径（推荐用于内部部署）

```bash
# .env.production
NODE_ENV=production
PORT=4000
API_PREFIX=/api

# 不设置任何 BASE_URL
# 结果：/api （相对路径，浏览器自动确定域名）
```

## Swagger UI 访问地址

根据配置，Swagger 文档的访问地址为：

### Admin API
- **开发环境**: `http://localhost:4000/admin/docs`
- **生产环境**: `https://your-domain.com/admin/docs`

### Content API
- **开发环境**: `http://localhost:4000/content/docs`
- **生产环境**: `https://your-domain.com/content/docs`

## 配置建议

### 开发环境
- ✅ 不设置任何 BASE_URL
- ✅ 使用默认的 localhost 配置
- ✅ 便于本地开发和调试

### 测试环境
- ✅ 设置 `SWAGGER_BASE_URL` 为测试服务器域名
- ✅ 便于团队共享测试文档
- ✅ 支持外部访问测试 API

### 生产环境

#### 内部部署（推荐）
```bash
# 使用相对路径，让浏览器自动确定域名
NODE_ENV=production
# 不设置 BASE_URL
```

#### 外部 API 服务
```bash
# 使用完整域名，便于第三方集成
NODE_ENV=production
BASE_URL=https://api.crispy.com
```

## 故障排除

### 常见问题

1. **Swagger UI 显示错误的服务器地址**
   - 检查环境变量设置
   - 确认 NODE_ENV 值正确
   - 验证 BASE_URL 格式

2. **API 请求失败**
   - 确认服务器 URL 可访问
   - 检查 CORS 配置
   - 验证 API_PREFIX 设置

3. **开发环境无法访问**
   - 确认 PORT 环境变量
   - 检查防火墙设置
   - 验证服务器启动状态

### 调试方法

1. **查看当前配置**
   ```bash
   node -e "
   require('dotenv').config();
   console.log('NODE_ENV:', process.env.NODE_ENV);
   console.log('PORT:', process.env.PORT);
   console.log('BASE_URL:', process.env.BASE_URL);
   console.log('SWAGGER_BASE_URL:', process.env.SWAGGER_BASE_URL);
   "
   ```

2. **测试 Swagger 配置**
   ```bash
   node scripts/test-content-swagger.js
   node scripts/test-all-swagger.js
   ```

## 安全考虑

### 生产环境
- 🔒 使用 HTTPS 协议
- 🔒 配置适当的 CORS 策略
- 🔒 限制 Swagger UI 访问权限
- 🔒 不在 URL 中暴露敏感信息

### 示例安全配置
```bash
# 生产环境安全配置
NODE_ENV=production
BASE_URL=https://api.crispy.com
API_PREFIX=/api/v1

# 可选：限制 Swagger 访问
SWAGGER_ENABLED=false  # 生产环境可禁用
SWAGGER_AUTH_REQUIRED=true  # 需要认证才能访问文档
```

## 部署检查清单

### 部署前
- [ ] 确认环境变量正确设置
- [ ] 测试 Swagger 配置加载
- [ ] 验证 API 端点可访问
- [ ] 检查认证配置

### 部署后
- [ ] 访问 Swagger UI 界面
- [ ] 测试 API 请求功能
- [ ] 验证认证流程
- [ ] 检查错误处理

## 更新历史

- **v1.1.0**: 添加灵活的服务器 URL 配置
- **v1.0.0**: 初始 Swagger 文档系统

---

通过这种灵活的配置方式，Crispy 应用的 Swagger 文档可以适应各种部署环境，从本地开发到生产部署都能提供最佳的用户体验。
