# JavaScript 文章自动生成定时任务

这个定时任务会每2小时自动生成一篇 JavaScript 相关的技术文章。

## 功能特性

- 🤖 **AI 驱动**：使用 OpenAI/DeepSeek API 生成高质量内容
- 📝 **完整文章**：包含标题、摘要、Markdown 内容和标签
- 🎯 **专业内容**：覆盖25个常见 JavaScript 技术主题
- ⏰ **定时执行**：每2小时自动运行一次
- 🔄 **自动同步**：生成的文章自动同步到 FlexSearch 索引

## 技术主题池

定时任务会从以下25个 JavaScript 技术主题中随机选择：

- JavaScript ES6+ 新特性
- JavaScript 异步编程
- JavaScript 闭包和作用域
- JavaScript 原型链和继承
- JavaScript 事件循环机制
- JavaScript Promise 和 async/await
- JavaScript 数组方法详解
- JavaScript 对象操作技巧
- JavaScript 函数式编程
- JavaScript 模块化开发
- JavaScript 正则表达式
- JavaScript DOM 操作
- JavaScript 性能优化
- JavaScript 错误处理
- JavaScript 设计模式
- JavaScript Web API
- JavaScript 内存管理
- JavaScript 调试技巧
- JavaScript 测试方法
- JavaScript 框架对比
- JavaScript TypeScript 入门
- JavaScript Node.js 基础
- JavaScript Webpack 配置
- JavaScript Babel 使用
- JavaScript 前端工程化

## 生成的文章结构

每篇自动生成的文章包含：

### 1. 基本信息

- **标题**：吸引人的技术标题（不超过30字）
- **摘要**：简洁的内容概要（150字以内）
- **标签**：5个相关技术标签

### 2. 内容特点

- **格式**：完整的 Markdown 格式
- **长度**：1500-2500字
- **代码**：包含完整可运行的代码示例
- **结构**：清晰的标题层级和逻辑结构

### 3. 文章结构

- 简介
- 核心概念解释
- 代码示例和解析
- 实际应用场景
- 最佳实践
- 总结

## 配置说明

### 环境变量要求

确保在 `.env` 文件中配置了 AI 服务：

```env
# DeepSeek API 配置（推荐）
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
DEEPSEEK_MODEL=deepseek-chat

# 或者使用 OpenAI API
OPENAI_API_KEY=your_openai_api_key_here
```

### 数据库配置

需要调整以下配置以适合你的数据库结构：

```typescript
const createData = {
  // ...
  type_id: 1, // JavaScript 分类 ID，需要根据实际情况调整
  user_id: 1, // 系统用户 ID，需要根据实际情况调整
  author_id: 1 // 系统作者 ID，需要根据实际情况调整
  // ...
}
```

## 使用方法

### 自动运行

服务启动后，定时任务会自动运行，每2小时生成一篇文章。

### 手动执行

你也可以手动执行生成任务：

```typescript
import { generateAndSaveArticle } from './crons/generateJSArticle'

// 立即生成一篇文章
await generateAndSaveArticle()
```

### 获取随机主题

```typescript
import { getRandomTopic } from './crons/generateJSArticle'

const topic = getRandomTopic()
console.log('Random topic:', topic)
```

### 仅生成内容（不保存）

```typescript
import { generateArticleContent } from './crons/generateJSArticle'

const content = await generateArticleContent('JavaScript 闭包和作用域')
console.log(content)
```

## 日志输出

定时任务会输出详细的执行日志：

```
[JS Article Generator] Scheduled to run every 2 hours
[JS Article Generator] Starting article generation...
[JS Article Generator] Generating article for topic: JavaScript 异步编程
[JS Article Generator] Successfully created article: "深入理解 JavaScript 异步编程：从回调到 Promise" (ID: 123)
```

## 错误处理

- 如果 AI 服务未配置，任务会跳过执行
- 如果内容生成失败，会记录错误日志但不会中断服务
- 如果数据库保存失败，会记录详细的错误信息

## 性能考虑

- **执行频率**：每2小时执行一次，避免过于频繁
- **内容长度**：控制在合理范围内（1500-2500字）
- **API 调用**：每次生成需要4次 AI API 调用
- **数据库影响**：每次只插入一条记录，影响最小

## 自定义配置

### 修改执行频率

```typescript
// 修改为每4小时执行一次
setInterval(
  async () => {
    await generateAndSaveArticle()
  },
  4 * 60 * 60 * 1000 // 4 hours
)
```

### 添加新主题

```typescript
const jsTopics = [
  // 现有主题...
  '你的新主题1',
  '你的新主题2'
  // ...
]
```

### 修改文章分类

```typescript
const createData = {
  // ...
  type_id: 2 // 修改为其他分类 ID
  // ...
}
```

## 注意事项

1. **API 成本**：每次生成需要消耗 AI API 配额，请注意成本控制
2. **内容质量**：AI 生成的内容可能需要人工审核
3. **数据库空间**：长期运行会产生大量文章数据
4. **重复内容**：虽然有随机主题，但可能产生相似内容
5. **分类设置**：确保 `type_id` 对应的分类存在于数据库中

## 故障排除

### 常见问题

1. **任务不执行**
   - 检查 AI 服务配置
   - 查看控制台错误日志

2. **文章保存失败**
   - 检查数据库连接
   - 确认分类 ID 存在
   - 检查用户 ID 权限

3. **内容质量不佳**
   - 调整 AI 模型参数
   - 优化提示词（prompt）
   - 考虑使用更高级的 AI 模型

### 调试模式

可以取消注释以下代码来立即执行一次生成任务进行调试：

```typescript
// Run immediately on startup (optional)
generateAndSaveArticle()
```
