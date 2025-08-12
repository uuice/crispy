# Templates Build System - Quick Guide

## 🚀 快速开始

### 1. 安装依赖

```bash
bun install
```

### 2. 开发模式

```bash
# 构建一次
bun run templates:build

# 监听模式（自动重新构建）
bun run templates:watch

# 开发模式（构建 + 监听）
bun run templates:dev
```

### 3. 生产构建

```bash
# 生产构建（压缩）
bun run templates:build:prod

# 清理构建文件
bun run templates:clean
```

## 📁 文件结构

```
src/server/templates/
├── styles/
│   ├── templates-input.css    # Tailwind CSS 输入文件
│   └── templates.less         # Less 样式文件
├── demo.html                   # 演示模板
└── README.md                  # 详细文档

src/styles/
├── templates.css              # Tailwind CSS 输出
└── templates.compiled.css     # Less 编译输出
```

## 🎨 使用方法

### 在模板中使用 Tailwind CSS

```njk
<div class="bg-blue-500 text-white p-4 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-4">标题</h2>
    <p class="text-gray-700">内容</p>
</div>
```

### 在模板中使用自定义 Less 类

```njk
<div class="template-container">
    <header class="template-header">
        <h1>自定义样式标题</h1>
    </header>

    <main class="template-content">
        <h2>内容区域</h2>
    </main>
</div>
```

## ⚙️ 配置

### Tailwind CSS 配置

编辑 `tailwind.templates.config.js`：

```javascript
module.exports = {
  content: ['./src/server/templates/**/*.{njk,html,js,ts}'],
  theme: {
    extend: {
      // 自定义主题
    }
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')]
}
```

### Less 变量

编辑 `src/server/templates/styles/templates.less`：

```less
// 自定义变量
@primary-color: #3b82f6;
@secondary-color: #64748b;

// 使用变量
.custom-class {
  color: @primary-color;
  background: @secondary-color;
}
```

## 🔧 命令行工具

| 命令                           | 描述         |
| ------------------------------ | ------------ |
| `bun run templates:build`      | 构建模板样式 |
| `bun run templates:watch`      | 监听模式     |
| `bun run templates:build:prod` | 生产构建     |
| `bun run templates:clean`      | 清理构建文件 |
| `bun run templates:dev`        | 开发模式     |

## 📝 示例模板

查看 `src/server/templates/demo.html` 了解完整的使用示例。

## 🔍 故障排除

### 构建失败

1. 检查依赖：`bun install`
2. 清理并重新构建：`bun run templates:clean && bun run templates:build`

### 监听模式不工作

1. 重启监听器：`bun run templates:dev`
2. 检查文件权限

### 样式不生效

1. 确保在模板中引入了正确的 CSS 文件：
   ```html
   <link rel="stylesheet" href="/assets/styles/templates.css" />
   <link rel="stylesheet" href="/assets/styles/templates.compiled.css" />
   ```

## 🎯 最佳实践

1. **使用 Tailwind CSS 进行快速原型设计**
2. **使用 Less 定义可重用的组件样式**
3. **在开发时使用监听模式**
4. **在生产环境中使用压缩构建**
5. **保持样式文件的结构化组织**

## 📚 更多信息

- 详细文档：`src/server/templates/README.md`
- Tailwind CSS 文档：https://tailwindcss.com/docs
- Less 文档：https://lesscss.org/
