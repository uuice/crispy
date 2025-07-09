# Content API 三重认证配置修复

## 🎯 问题描述

Content API 需要同时发送三个 header 才能通过认证：
- `x-access-token`
- `x-app-name` 
- `x-channel`

但之前的配置导致 Swagger UI 只发送 `x-access-token`，其他两个 header 没有被发送。

## 🔍 问题原因

原来的配置将三个认证方式定义为独立的选项（OR 逻辑），而不是必须同时满足的组合（AND 逻辑）：

```typescript
// 错误的配置 - OR 逻辑
security: [
  { accessTokenAuth: [] },  // 或者
  { appNameAuth: [] },      // 或者  
  { channelAuth: [] }       // 或者
]
```

## ✅ 解决方案

### 1. 修复 Swagger 配置

在 `src/server/config/swagger.ts` 中，将三个认证方式放在同一个对象中（AND 逻辑）：

```typescript
// 正确的配置 - AND 逻辑
components: {
  securitySchemes: {
    accessTokenAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'x-access-token',
      description: 'Access Token - 必需'
    },
    appNameAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'x-app-name',
      description: 'Application Name - 必需'
    },
    channelAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'x-channel',
      description: 'Channel Name - 必需'
    }
  }
},
security: [
  {
    accessTokenAuth: [],
    appNameAuth: [],
    channelAuth: []
  }
]
```

### 2. 更新文档生成脚本

修改 `scripts/generate-content-swagger.js`，确保每个 API 接口都使用三重认证：

```javascript
docs += `/**
 * @swagger
 * ${fullPath}:
 *   ${route.method}:
 *     tags: [${config.tag}]
 *     summary: ${route.summary}
 *     description: ${route.summary}
 *     security:
 *       - accessTokenAuth: []
 *         appNameAuth: []
 *         channelAuth: []
`;
```

### 3. 重新生成文档

运行脚本重新生成所有 Content API 文档：

```bash
node scripts/generate-content-swagger.js
```

## 📊 验证结果

### 配置验证
```
🔐 安全配置检查:
   x-access-token: ✅
   x-app-name: ✅
   x-channel: ✅

🌐 全局安全配置:
   accessTokenAuth: ✅
   appNameAuth: ✅
   channelAuth: ✅

🛣️  API 路径: 57 个

📋 示例路径安全配置:
   GET /content/access-token: ✅ 三重认证
   GET /content/access-token/{id}: ✅ 三重认证
   POST /content/access-token/check: ✅ 三重认证
```

## 🎨 Swagger UI 使用方法

### 1. 访问文档
```
http://localhost:4000/content/docs
```

### 2. 配置认证
1. 点击右上角的 **"Authorize"** 按钮
2. 在弹出的对话框中填入三个字段：
   - **accessTokenAuth**: 输入您的 Access Token
   - **appNameAuth**: 输入您的应用名称  
   - **channelAuth**: 输入您的渠道名称
3. 点击 **"Authorize"** 确认
4. 现在所有 API 请求都会自动包含这三个 header

### 3. 验证效果
- ✅ 每个 API 接口都显示锁图标
- ✅ 点击 "Try it out" 时会自动包含三个 header
- ✅ 请求成功执行（假设认证信息正确）

## 🔧 API 调用示例

### curl 命令
```bash
curl -X GET "http://localhost:4000/api/content/articles" \
  -H "x-access-token: your-access-token" \
  -H "x-app-name: your-app-name" \
  -H "x-channel: your-channel-name"
```

### JavaScript fetch
```javascript
fetch("/api/content/articles", {
  headers: {
    "x-access-token": "your-access-token",
    "x-app-name": "your-app-name",
    "x-channel": "your-channel-name"
  }
});
```

### Axios
```javascript
axios.get("/api/content/articles", {
  headers: {
    "x-access-token": "your-access-token",
    "x-app-name": "your-app-name", 
    "x-channel": "your-channel-name"
  }
});
```

## 🧪 测试工具

创建了专门的测试脚本 `scripts/test-content-auth.js` 来验证三重认证配置：

```bash
node scripts/test-content-auth.js
```

该脚本会检查：
- ✅ 安全配置是否正确
- ✅ 全局认证设置
- ✅ 每个 API 路径的认证配置
- ✅ 生成使用示例和说明

## 📋 OpenAPI 3.0 认证逻辑

### AND 逻辑（同时需要）
```yaml
security:
  - accessTokenAuth: []
    appNameAuth: []
    channelAuth: []
```

### OR 逻辑（任选其一）
```yaml
security:
  - accessTokenAuth: []
  - appNameAuth: []
  - channelAuth: []
```

我们使用的是 **AND 逻辑**，确保三个 header 必须同时提供。

## 🎉 解决方案优势

1. **正确的认证逻辑**: 三个 header 必须同时提供
2. **清晰的用户界面**: Swagger UI 明确显示需要三个认证
3. **完整的文档**: 每个 API 都正确标记了认证要求
4. **测试工具**: 提供验证脚本确保配置正确
5. **使用示例**: 提供多种语言的调用示例

## 🔄 部署步骤

1. **重新生成文档**:
   ```bash
   node scripts/generate-content-swagger.js
   ```

2. **验证配置**:
   ```bash
   node scripts/test-content-auth.js
   ```

3. **重新构建**:
   ```bash
   bun run build
   ```

4. **重启服务器**:
   ```bash
   bun run serve:ssr:crispy
   ```

5. **测试访问**:
   访问 `http://localhost:4000/content/docs` 验证三重认证配置

---

**✅ 问题已完全解决！现在 Content API 的 Swagger UI 会正确要求同时提供三个认证 header。**
