# Admin AI 助手使用指南

Crispy 后台内置基于 **DeepSeek** 的 AI 写作助手，仅在 Payload Admin 内使用，**前台不暴露**任何 AI 接口。

面向编辑、作者与管理员；开发配置见文末「开发与扩展」。

---

## 启用条件

1. 在 `.env` 中配置 `DEEPSEEK_API_KEY`
2. （可选）`DEEPSEEK_BASE_URL`、`DEEPSEEK_MODEL`
3. Admin → **AI 设置**（`ai-settings` Global）中保持 **启用**

未配置 Key 或全局关闭时，点击 AI 会提示「AI 未启用」。

验证连通性：

```bash
pnpm verify:ai
```

---

## 交互方式

所有 AI 入口统一为 **行末 ✨ 图标 + 浮动弹框**（Lexical 富文本为 **选中文字 → 浮动工具栏 ✨**）。

弹框内通常包含：

- **快捷操作**：润色、扩写、精简（Lexical 另有「改写」）
- **自定义指令**：预设或自行输入（如「中文改英文」「修正错别字」）
- **对比预览**：原文 vs AI 结果，确认后 **应用** 或 **取消**

流式生成时弹框不会误触关闭。

---

## 能力一览

| 能力 | 说明 |
|------|------|
| 润色 / 扩写 / 精简 | 改善表达，保持原意 |
| 自定义指令 | 任意自然语言修改需求 |
| Lexical 选区助手 | 仅处理选中片段，替换选区 |
| SEO 优化 | 生成 meta 标题 / 描述 |
| 智能填充 | 根据正文建议标题、描述、SEO、分类/标签 |
| 代码助手 | Code Block 内代码的 AI 编辑（含代码向预设） |

---

## 各内容类型支持情况

| Collection | 标题 AI | 描述/文本 AI | Lexical 选区 AI | SEO 弹框 | 智能填充 |
|------------|---------|--------------|-----------------|----------|----------|
| **posts** 文章 | ✅ title | — | ✅ 正文 + Block | ✅ | ✅ 分类/标签/SEO |
| **pages** 单页 | ✅ title | — | ✅ hero 富文本 | ✅ | ✅ |
| **jobs** 招聘 | ✅ title | — | ✅ 描述、任职要求 | — | — |
| **categories** 分类 | ✅ title | — | — | — | — |
| **tags** 标签 | ✅ title | ✅ description | — | — | ✅ 描述 |
| **gallery-items** 图库 | ✅ title | ✅ description | — | — | ✅ 描述 |
| **links** 链接 | ✅ title | ✅ description | — | — | ✅ 描述 |
| **ads** 广告 | ✅ title | ✅ alt | — | — | — |
| **ad-slots** 广告位 | ✅ title | ✅ description | — | — | ✅ 描述 |
| **media** 媒体 | ✅ alt | — | ✅ caption | — | — |

**未启用 AI**：`users`、`api-access-logs`、`audit-logs`

---

## 文章（Posts）专项

### 正文 Lexical

- 全文编辑器支持 **选区 AI**（润色 / 扩写 / 精简 / 改写 / 自定义）
- **内容** 标签页顶部有 **AI 智能填充**（✨）
- **SEO** 标签页顶部有 **AI SEO 优化**（✨）

### 内嵌 Block

在正文中插入以下 Block 时，块内也可使用 AI：

| Block | AI 支持 |
|-------|---------|
| **Banner** | `content` 富文本选区 AI |
| **Code** | 代码编辑器 ✨ 弹框（含「添加注释」「重构优化」等预设） |
| **Media Block** | 可选 **Caption** 富文本选区 AI；未填时前台仍使用媒体库 caption |

---

## 单页（Pages）

- **Hero** 富文本支持选区 AI
- **内容** 标签页：**AI 智能填充**
- **SEO** 标签页：**AI SEO 优化**

上下文默认取自 `hero.richText` 纯文本。

---

## 权限

| 角色 | 权限 |
|------|------|
| **super-admin** / **editor** | 所有已启用 Collection 均可使用 AI |
| **author** 作者 | 仅 **posts**，且只能编辑 **自己为作者** 的文章 |
| 其他 | 不可用 |

---

## AI 设置（Global）

路径：Admin → **AI 设置**

可配置：

- 总开关
- API Base URL、模型名
- Temperature、Max Tokens
- **Prompt 模板**（按 action 覆盖默认 system/user prompt）

默认模板定义见代码：`src/ai/defaultTemplates.ts`。

---

## 常见问题

**点击 ✨ 无反应或报错 503？**  
检查 `.env` 中 `DEEPSEEK_API_KEY`，以及 AI 设置 Global 是否启用。

**作者无法在某些文章使用 AI？**  
作者仅限自己的 posts；编辑/管理员无此限制。

**智能填充分类/标签不准？**  
分类与标签 **只能从已有条目标题中匹配**，不会编造新名称。请先建好分类/标签。

**SEO 应用后字段没变化？**  
在 SEO 弹框中生成并 **应用**；若 meta 字段在另一 Tab，保存文档后刷新查看。

**自定义指令无效？**  
需输入非空指令；生成后在对比预览中确认再应用。

---

## 开发与扩展

### API 路由

| 路由 | 用途 |
|------|------|
| `POST /api/ai/stream` | 流式文本（SSE，主入口） |
| `POST /api/ai/complete` | 非流式文本 |
| `POST /api/ai/structured` | JSON（智能填充） |

### 核心目录

```
src/ai/                    # Provider、模板、流式、权限、Collection Profile
src/fields/ai/             # withAiTextField、withAiRewriteFeatures 等
src/components/AdminAi/  # 弹框、Lexical Feature、Field 组件
src/AiSettings/            # ai-settings Global 配置
```

### 为新 Collection 启用 AI

1. 在 `src/ai/collectionProfiles.ts` 增加 profile
2. 在 Collection 字段上使用 `withAiTextField` / `withAiTextareaField` / `withAiRewriteFeatures` 等
3. 按需添加 `aiSeoAssistField`、`aiSuggestAssistField`
4. 运行 `pnpm generate:importmap`

### 与 MCP 的区别

| | Admin AI 助手 | MCP |
|--|---------------|-----|
| 用途 | 后台编辑时润色、SEO、填充 | 外部 Agent 读写 CMS 数据 |
| 用户 | 登录 Admin 的编辑/作者 | API Key + MCP 客户端 |
| 文档 | 本文档 | [mcp-guide.md](./mcp-guide.md) |

---

## 相关文档

- [Admin 使用指南](./admin-guide.md)
- [Admin 验证清单](./admin-verification.md)（含 `pnpm verify:ai`）
- [架构 — AI / MCP](./crispy-v3-architecture.md#7-ai--mcp-集成)
- [MCP 连接指南](./mcp-guide.md)
