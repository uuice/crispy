# Mock Data with MockJS

使用 MockJS 实现的简单 mock 数据系统，用于向数据库添加示例页面数据。

## 功能

- 使用 MockJS 生成随机的中文页面数据
- 包含常见的页面类型（About, Contact, Privacy Policy）
- 自动检查重复数据，避免重复创建
- 在开发环境下自动运行

## 安装依赖

```bash
pnpm add mockjs @types/mockjs
```

## 使用方法

### 自动运行

在开发环境下启动服务器时，mock 数据会自动添加到数据库：

```bash
pnpm start
```

### 手动运行

```typescript
import { seedPagesData } from './src/server/mock/pages.mock'

// 手动添加 mock 数据
await seedPagesData()
```

## 生成的数据

- **5个随机页面**: 使用 MockJS 生成随机中文内容
- **3个常见页面**: About Us, Contact, Privacy Policy
- **总计8个页面**: 包含标题、别名、内容、描述、关键词等

## 数据字段

根据数据库表结构，生成的页面包含以下字段：

- `title` - 页面标题
- `alias` - URL 别名
- `content` - 页面内容
- `seo_description` - SEO 描述
- `seo_keywords` - SEO 关键词
- `image_list` - 图片列表
- `status` - 页面状态 (10=激活, 0=未激活)

## MockJS 特性

- `@ctitle(5, 10)` - 生成5-10个字符的中文标题
- `@cparagraph(3, 7)` - 生成3-7段中文段落
- `@csentence(10, 20)` - 生成10-20个字符的中文句子
- `@word(5, 10)` - 生成5-10个字符的随机单词
- `@image()` - 生成图片 URL

## 注意事项

- 只在开发环境下运行
- 自动检查重复数据
- 使用 pageService 进行数据库操作
- 所有注释使用英文
- 字段名与数据库表结构匹配
