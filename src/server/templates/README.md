# Nunjucks 模板引擎使用指南

本项目已集成 Nunjucks 模板引擎，用于服务端渲染 HTML 页面。

## 配置

Nunjucks 已在 `src/server/config/nunjucks.ts` 中配置，包含以下功能：

- 自动转义 HTML 内容
- 开发环境下启用模板监听和缓存禁用
- 自定义过滤器
- Express 集成

## 模板目录

所有模板文件存放在 `src/server/templates/` 目录下，使用 `.njk` 扩展名。

## 自定义过滤器

### dateFormat
格式化日期显示：
```njk
{{ post.created_at | dateFormat('YYYY-MM-DD') }}
{{ post.created_at | dateFormat('YYYY-MM-DD HH:mm') }}
{{ post.created_at | dateFormat('MM-DD') }}
```

### truncate
截断文本并添加省略号：
```njk
{{ post.content | truncate(100) }}
```

### stripHtml
移除 HTML 标签：
```njk
{{ post.content | stripHtml }}
```

## 使用方法

### 1. 在路由中使用 Express render 方法

```typescript
app.get('/blog', (req, res) => {
  res.render('blog-list.njk', {
    posts: blogPosts,
    currentYear: new Date().getFullYear()
  })
})
```

### 2. 使用 renderTemplate 函数

```typescript
import { renderTemplate } from '../config/nunjucks'

const html = await renderTemplate('blog-list.njk', {
  posts: blogPosts,
  currentYear: new Date().getFullYear()
})
res.send(html)
```

### 3. 使用 renderString 渲染字符串模板

```typescript
import { renderString } from '../config/nunjucks'

const html = renderString('Hello {{ name }}!', { name: 'World' })
```

## 模板继承

使用 `base.njk` 作为基础模板：

```njk
{% extends "base.njk" %}

{% block title %}页面标题{% endblock %}

{% block content %}
<h1>页面内容</h1>
{% endblock %}
```

## 演示页面

访问以下 URL 查看模板演示：

- `/template-demo` - 博客列表演示页面
- `/template-demo-2` - 使用 renderTemplate 函数的演示
- `/template-filters` - 过滤器演示

## 最佳实践

1. **模板组织**：将相关模板放在子目录中
2. **数据传递**：确保传递给模板的数据结构清晰
3. **错误处理**：在路由中添加适当的错误处理
4. **性能优化**：生产环境启用模板缓存
5. **安全性**：利用 Nunjucks 的自动转义功能防止 XSS

## 常用语法

### 变量输出
```njk
{{ variable }}
{{ object.property }}
{{ array[0] }}
```

### 条件语句
```njk
{% if condition %}
  内容
{% elif otherCondition %}
  其他内容
{% else %}
  默认内容
{% endif %}
```

### 循环
```njk
{% for item in items %}
  <li>{{ item.name }}</li>
{% endfor %}
```

### 包含其他模板
```njk
{% include "partials/header.njk" %}
```

### 设置变量
```njk
{% set title = "页面标题" %}
```

## 注意事项

1. 模板文件必须使用 `.njk` 扩展名
2. 开发环境下模板会自动重新加载
3. 生产环境下模板会被缓存以提高性能
4. 所有用户输入都会被自动转义，防止 XSS 攻击
