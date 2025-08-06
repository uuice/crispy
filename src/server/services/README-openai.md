# OpenAI Service

这个服务提供了与 OpenAI 兼容的 API 集成，支持 DeepSeek 和 OpenAI。

## 环境变量配置

在 `.env` 文件中添加以下配置：

```env
# DeepSeek API 配置（推荐）
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
DEEPSEEK_MODEL=deepseek-chat

# 或者使用 OpenAI API
OPENAI_API_KEY=your_openai_api_key_here
# OPENAI_BASE_URL=https://api.openai.com/v1  # 可选，默认使用官方地址
# OPENAI_MODEL=gpt-3.5-turbo  # 可选，默认模型
```

## 安装依赖

```bash
# 使用 bun
bun add openai

# 或者使用 npm
npm install openai
```

## 使用示例

### 1. 基本聊天完成

```typescript
import { openaiService } from './openaiService'

const messages = [
  { role: 'system', content: '你是一个专业的助手' },
  { role: 'user', content: '请介绍一下 TypeScript' }
]

const response = await openaiService.createChatCompletion(messages)
console.log(response.choices[0].message.content)
```

### 2. 流式聊天

```typescript
await openaiService.createStreamingChatCompletion(messages, (chunk) => {
  const content = chunk.choices[0]?.delta?.content
  if (content) {
    process.stdout.write(content)
  }
})
```

### 3. 生成文章摘要

```typescript
const summary = await openaiService.generateArticleSummary(
  '这里是文章内容...',
  200 // 最大长度
)
```

### 4. 生成文章标签

```typescript
const tags = await openaiService.generateArticleTags(
  '文章标题',
  '文章内容',
  5 // 最大标签数
)
```

### 5. 生成 SEO 描述

```typescript
const seoDescription = await openaiService.generateSEODescription(
  '文章标题',
  '文章内容',
  160 // 最大长度
)
```

### 6. 翻译文本

```typescript
const translation = await openaiService.translateText('Hello, world!', 'Chinese')
```

### 7. 代码解释

```typescript
const explanation = await openaiService.explainCode(
  'const arr = [1, 2, 3].map(x => x * 2)',
  'JavaScript'
)
```

### 8. 生成标题建议

```typescript
const titles = await openaiService.generateTitleSuggestions(
  '文章内容',
  5 // 建议数量
)
```

## API 方法

### `createChatCompletion(messages, options?)`

创建聊天完成请求

### `createStreamingChatCompletion(messages, onChunk, options?)`

创建流式聊天完成请求

### `generateCompletion(prompt, systemPrompt?, options?)`

生成简单的文本完成

### `generateArticleSummary(content, maxLength?)`

生成文章摘要

### `generateArticleTags(title, content, maxTags?)`

生成文章标签

### `generateSEODescription(title, content, maxLength?)`

生成 SEO 描述

### `translateText(text, targetLanguage?)`

翻译文本

### `explainCode(code, language?)`

解释代码

### `generateTitleSuggestions(content, count?)`

生成标题建议

### `isConfigured()`

检查服务是否已配置

### `getModelInfo()`

获取当前模型信息

### `testConnection()`

测试 API 连接

## 错误处理

服务会自动处理 API 错误并抛出有意义的错误信息。建议在使用时添加适当的错误处理：

```typescript
try {
  const response = await openaiService.generateCompletion('你好')
  console.log(response)
} catch (error) {
  console.error('AI 服务调用失败:', error.message)
}
```

## 注意事项

1. 确保 API 密钥安全，不要提交到版本控制系统
2. DeepSeek API 兼容 OpenAI 格式，但某些高级功能可能不支持
3. 建议设置合适的 token 限制以控制成本
4. 在生产环境中使用时，考虑添加重试机制和请求限制
