# JSX 模板引擎测试服务

这是一个基于 React JSX 和 Express 的模板引擎测试服务。

## 文件结构

```
src/
├── libs/
│   └── express_jsx.ts          # JSX 模板引擎核心实现
├── views/
│   ├── HomePage.tsx            # 首页组件
│   ├── AboutPage.tsx           # 关于页面组件
│   └── NotFoundPage.tsx        # 404 页面组件
└── server_jsx.ts               # Express 服务主文件
```

## 功能特性

- ✅ 基于 React JSX 的服务端渲染
- ✅ 组件化模板开发
- ✅ 模板缓存机制
- ✅ 错误处理和 404 页面
- ✅ API 路由支持
- ✅ 参数传递和查询字符串处理

## 运行测试

```bash
# 启动服务
npx tsx src/server_jsx.ts

# 测试 API
curl http://localhost:3000/api/info

# 测试首页
curl http://localhost:3000/

# 测试关于页面
curl "http://localhost:3000/about?name=测试用户"

# 测试 404 页面
curl http://localhost:3000/nonexistent
```

## 使用方法

### 1. 创建 JSX 组件

在 `src/views/` 目录下创建 `.tsx` 文件：

```tsx
import React from 'react'

interface Props {
  title: string
  message: string
}

export default function MyComponent({ title, message }: Props) {
  return (
    <html>
      <head>
        <title>{title}</title>
        <meta charSet="utf-8" />
      </head>
      <body>
        <h1>{title}</h1>
        <p>{message}</p>
      </body>
    </html>
  )
}
```

### 2. 在路由中使用

```typescript
app.get('/my-route', async (req, res) => {
  await res.renderJSX('MyComponent', {
    title: '我的页面',
    message: 'Hello World!'
  })
})
```

### 3. 使用 renderJSXString 直接渲染组件

```typescript
import MyComponent from './views/MyComponent'

app.get('/direct', (req, res) => {
  res.renderJSXString(MyComponent, {
    title: '直接渲染',
    message: '不通过文件加载'
  })
})
```

## API

### JSXEngine 类

```typescript
const engine = new JSXEngine({
  viewsDir: './src/views', // 组件目录
  extension: '.tsx', // 文件扩展名
  cache: true // 是否启用缓存
})
```

### 中间件方法

- `res.renderJSX(templatePath, props)` - 渲染模板文件
- `res.renderJSXString(component, props)` - 直接渲染组件

## 依赖要求

- React 18+
- React DOM Server
- Express 4+
- TypeScript 5+

## 注意事项

1. 组件文件必须使用 `.tsx` 扩展名
2. 组件必须导出为默认导出
3. 服务端渲染使用 `renderToStaticMarkup`
4. 模板缓存可以提高性能但会占用内存
