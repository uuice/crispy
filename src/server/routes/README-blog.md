# Blog 路由系统

本文档说明了 blog.ts 路由系统的功能和使用方法。

## 概述

`blog.ts` 路由文件替换了原来的 `template-demo.ts`，提供了完整的博客功能，包括文章列表、文章详情、分类浏览、标签浏览、搜索和归档等功能。

## 路由列表

### 1. 博客首页 - `/blog`
- **功能**: 显示文章列表，支持分页
- **参数**: 
  - `page`: 页码（可选，默认为1）
  - `category`: 分类ID（可选）
  - `tag`: 标签ID（可选）
- **模板**: `blog/index.html`

### 2. 文章详情 - `/blog/article/:id`
- **功能**: 显示单篇文章的详细内容
- **参数**: 
  - `id`: 文章ID（必需）
- **模板**: `blog/article.html`
- **特性**: 
  - 自动增加阅读量
  - 显示相关文章
  - 生成文章目录

### 3. 分类页面 - `/blog/category/:id`
- **功能**: 显示指定分类下的文章列表
- **参数**: 
  - `id`: 分类ID（必需）
  - `page`: 页码（可选，默认为1）
- **模板**: `blog/category.html`

### 4. 标签页面 - `/blog/tag/:id`
- **功能**: 显示指定标签下的文章列表
- **参数**: 
  - `id`: 标签ID（必需）
  - `page`: 页码（可选，默认为1）
- **模板**: `blog/tag.html`

### 5. 搜索页面 - `/blog/search`
- **功能**: 根据关键词搜索文章
- **参数**: 
  - `q`: 搜索关键词（可选）
  - `page`: 页码（可选，默认为1）
- **模板**: `blog/search.html`

### 6. 归档页面 - `/blog/archives`
- **功能**: 按时间顺序显示所有文章
- **参数**: 
  - `page`: 页码（可选，默认为1）
- **模板**: `blog/archives.html`

## 模板文件

所有模板文件位于 `src/server/templates/blog/` 目录下：

- `index.html` - 博客首页模板
- `article.html` - 文章详情页模板
- `category.html` - 分类页面模板
- `tag.html` - 标签页面模板
- `search.html` - 搜索页面模板
- `archives.html` - 归档页面模板

## 数据结构

### 文章数据 (Article)
```javascript
{
  id: number,
  title: string,
  content: string,
  summary: string,
  author: string,
  cover_image: string,
  tags: string, // 逗号分隔的标签
  type_id: number, // 分类ID
  status: number, // 状态：10=已发布
  click: number, // 阅读量
  create_time: Date,
  update_time: Date
}
```

### 分页数据 (Pagination)
```javascript
{
  currentPage: number,
  totalPages: number,
  totalItems: number,
  itemsPerPage: number,
  hasPrev: boolean,
  hasNext: boolean,
  prevPage: number | null,
  nextPage: number | null
}
```

## 特性

### 1. 响应式设计
- 使用 Tailwind CSS 构建
- 支持移动端和桌面端
- 网格布局，主内容区和侧边栏

### 2. SEO 优化
- 每个页面都有独特的标题和描述
- 结构化的 HTML 标记
- 语义化的标签使用

### 3. 用户体验
- 分页导航
- 面包屑导航
- 相关文章推荐
- 搜索功能
- 标签云
- 文章目录自动生成

### 4. 性能优化
- 数据库查询优化
- 分页加载
- 缓存友好的结构

## 使用的服务

- `articleService` - 文章相关操作
- `categoryService` - 分类相关操作
- `tagService` - 标签相关操作
- `configService` - 配置相关操作

## 错误处理

- 404 错误：文章不存在、分类不存在、标签不存在
- 500 错误：服务器内部错误
- 参数验证：ID 必须为有效数字

## 扩展建议

1. **评论系统**: 可以添加文章评论功能
2. **点赞功能**: 为文章添加点赞/收藏功能
3. **RSS 订阅**: 生成 RSS feed
4. **文章推荐**: 基于阅读历史的智能推荐
5. **全文搜索**: 集成 Elasticsearch 或其他搜索引擎
6. **缓存优化**: 添加 Redis 缓存
7. **图片优化**: 自动压缩和 CDN 集成

## 注意事项

1. 确保数据库中有足够的测试数据
2. 文章状态为 10 的才会在前端显示
3. 分页大小可以根据需要调整
4. 搜索功能目前是简单的标题匹配，可以扩展为全文搜索
5. 模板中使用了一些自定义的 Nunjucks 过滤器，确保它们已正确定义
