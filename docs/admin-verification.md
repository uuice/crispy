# Admin 与 Phase 1 验证清单

## Admin 中文化

- [x] Payload 内置中文语言包（`fallbackLanguage: zh`）
- [x] 自定义 Collection / Global 中文标签
- [x] 角色、仪表盘、登录页中文文案
- [x] Live Preview 断点中文（手机 / 平板 / 桌面）

切换语言：Admin 右上角用户菜单 → **语言** → 中文 / English。

## 深色模式

### Admin

Payload Admin 自带浅色 / 深色主题，右上角用户菜单 → **主题** 切换。

### 前台

页脚 **ThemeSelector** 切换 `data-theme`（light / dark），Tailwind 通过 `@custom-variant dark` 响应。

验证步骤：

1. 打开 http://localhost:3333
2. 页脚点击主题切换
3. 确认背景、文字、卡片对比度正常

## Draft Preview / Live Preview

### 环境变量

`.env` 中设置：

```bash
PREVIEW_SECRET=preview-dev-secret
```

### Draft Preview（草稿预览）

1. Admin → 文章 → 创建或编辑草稿
2. 点击 **预览** 按钮
3. 应跳转到前台并显示草稿内容（需已登录 Admin）

### Live Preview（实时预览）

1. 编辑已发布文章
2. 点击 **Live Preview**
3. 侧边 iframe 应实时反映编辑内容

### 自动验证

`pnpm verify:phase1` 会检查 Preview 在错误密钥时返回 **403**。

## MCP 实测

1. `pnpm dev`
2. Admin → **填充示例数据**
3. 复制终端中的 `MCP API Key` 到 `.env` 的 `MCP_API_KEY`
4. 运行 `pnpm verify:phase1`

预期输出包含：

```
• MCP initialize … ✓
• MCP tools/list … ✓
  MCP tools: N 个
```

## 快捷命令

```bash
pnpm dev
pnpm verify:phase1
pnpm seed
pnpm mcp:key
MCP_API_KEY=xxx pnpm verify:phase1
```
