# 减少 Admin / AI 定制面（决策备忘）

> 状态：决策备忘；部分项已落地（Canvases / Unsplash / 列表刷新 / **字段 AI**）
> 日期：2026-07-19（修订至 2026-08-27）
> 背景：个人精力有限；Payload 4.0 将加重 Admin 定制迁移成本；站内 Agent 已覆盖大部分运营操作。

## 1. 原则

1. **后台内置 Agent 必留**（浮窗 + `/admin/ai-agent` + tools 运行时）。
   相对 MCP / Cursor：链路更短、贴 Admin 编辑场景，日常效率更高。MCP 是开发侧副通道，不替代站内 Agent。
2. **少造第二套后台产品**。官方或 Agent 已能覆盖的运营页 / 工作流，优先删或迁出。
3. **新需求默认不开工**：先问「Agent 能否一次完成」；能则记 wishlist，不写 UI。
4. **跟升 Payload 是主航道**；自建只补 Agent / 业务缺口，不扩 Admin 壳。

## 2. 结论摘要

| 方向 | 决策 |
|------|------|
| Admin Agent | **Keep**（主入口） |
| MCP plugin | **Keep**（副通道） |
| 字段 AI（Field Assist / Suggest / SEO 面板 / Lexical rewrite） | **已删**（2026-08-27；个人博客不用内联字段按钮） |
| AI Canvases | **已删**（2026-08-27；与 Agent + Prompt 三重叠） |
| Unsplash 图库引用 | **已删**（2026-08-27；配图走 Media / OSS 上传） |
| Stats / Dev Docs 内嵌 | **建议删或迁出** |
| **自研 Admin Nav** | **建议回归官方 Nav**（分组嵌入损失可接受） |
| 侧栏自定义入口（现 4 条） | **清理**；需要时 Agent 快捷方式 / 问 Agent 指路 |
| Cache **引擎** | **Keep**；管理 UI 可瘦或删页 |
| Themes / 业务 Collection / OSS Media | **Keep**（本地/OSS 上传仍是主路径） |

## 3. 分层清单

### 3.1 必留

| 能力 | 路径（示意） | 说明 |
|------|----------------|------|
| Admin AI Agent | `src/ai/agent/`、`src/components/AdminAiAgent/`、`admin/ai-agent/`、`AiChatSessions`、`api/ai/agent/**` | 运营主通道 |
| LLM 配置中心 | `LlmProviders`、`AiSettings`、`PromptTemplates`、`src/ai/resolveLlmClient.ts` 等 | Agent / 前台助手共用底座 |
| MCP | `@payloadcms/plugin-mcp`、`mcpCustomTools` | Cursor / 外部 Agent |
| Frontend cache 引擎 | `src/frontend-cache/`、middleware | 性能 critical path |
| 业务与前台 | `src/themes/`、collections、OSS uploads | 产品本体 |

### 3.2 已删：字段 AI

2026-08-27 去掉挂在 Collection / Block 上的 `withAi*`，Admin 编辑页回到官方字段。润色、分类、SEO 改走 **Agent 对话**。

| 模块 | 路径（示意） | 结果 |
|------|----------------|------|
| 字段包装 | `src/fields/ai/`、`withAiTextField` / `withAiRewriteFeatures` | 已删；Posts/Pages/Jobs/… 无内联 AI 按钮 |
| Admin 字段 UI | `src/components/AdminAi/`（Suggest / SEO / Assist / Lexical rewrite） | 已删；`AiIcon` 挪到 `src/components/AiIcon.tsx`（Agent / 前台助手仍用） |
| Completion API | `api/ai/complete` / `stream` / `structured` | 已删（仅字段 AI 使用） |

保留：`resolveLlmClient` / providers / `AiSettings` / `PromptTemplates`（Agent 仍需要）。

### 3.3 建议删 / 迁出（不碰 Agent 核心）

| 能力 | 路径（示意） | 理由 |
|------|----------------|------|
| AI Canvases | `src/ai/canvas/`、`AdminAiCanvases/`、`AiCanvases`、`admin/ai-canvases/`、`api/ai/canvases/**` | **已删**（2026-08-27） |
| **Unsplash 图库** | `src/unsplash/`、`api/admin/unsplash/**`、`UnsplashImportPill`、`ai/agent/stockImages.ts`、`AgentStockImageResults`、IntegrationSettings / credentials 中 Unsplash 相关 | **已删**（2026-08-27）；已导入 Media 保留 |
| 内容统计页 | `admin/stats/`、`admin-stats/` | Agent 已有 `get_site_stats` |
| 二次开发文档 | `docs/dev-docs.md` | **已迁出**（2026-08-14）；Admin `/dev-docs` 已删除 |

### 3.3.1 自研 Nav → 回归官方（已定调）

当前为把自定义 View **塞进**运营/配置/开发等分组，整棵替换了 `admin.components.Nav`（`AdminNav` + `mergeCustomNavIntoGroups`）。升级时 Nav 分叉成本最高。

**产品判断：** 回归官方后「进不了细分组 / 排序变默认 / 少一条管理首页链」**问题不大**，可接受。

现有 4 条自定义侧栏项的处置：

| 项 | 处置 |
|----|------|
| AI 画布 / 内容统计 / 二次开发文档 | 随能力删除，侧栏一并去掉 |
| 缓存管理 / Swagger API | 可删侧栏与独立页；需要时 **问 Agent**（清缓存、改 TTL、文档入口）或 Agent UI 内快捷方式 |
| AI 内容助手 | **不依赖侧栏**：保留全局浮窗；全屏页可选保留，用浮窗进入即可 |

将来实施（本文件不执行）：

1. 去掉 `payload.config.ts` 的 `Nav: '@/components/AdminNav'`，恢复官方 Nav。  
2. 删除或停用 `src/components/AdminNav/`、`src/admin-nav/`（`customItems` / `mergeCustomNavIntoGroups` 等）。  
3. **不必**再上 `afterNavLinks` 硬挂一堆入口（除非极少数常点页）；默认「问 Agent / Agent 快捷方式」。  
4. 可选：在 Agent 系统提示或聊天欢迎区写明常用能力（清缓存、看统计、打开某配置），代替侧栏发现。

**Unsplash 已删（2026-08-27）：** Media 列表 Unsplash 入口、Agent stock 工具、API、`src/unsplash/**`、`integration-credentials` / `integration-settings` 均已移除。已导入的 Media 文件保留。

### 3.4 可瘦身 / 可删页（入口交给 Agent）

| 能力 | 建议 |
|------|------|
| Cache 管理页 `admin/cache/` | **引擎 Keep**；页与侧栏可删，清缓存 / 改 TTL 走 Agent（或 MCP） |
| Swagger `admin/api-docs/` | 可选删页；需要时问 Agent 或直接打开 URL / 仓库文档 |
| 前台访客助手 | 与 Admin Agent 无重叠；按产品要不要单独决定 |
| Embeddings / 语义搜 | 若生产在用则留；Agent/MCP 的 `semantic_search` 依赖它时勿删 |

### 3.5 削减后仍可能留下的 Admin 定制（品牌壳 + 业务字段）

按 §2～§3.4 做完后，importMap 里「还剩一半」主要来自下面这些——**不是 Agent**。Agent 自绘、少用 `@payloadcms/ui` 只影响耦合，几乎不减少条数。

#### 品牌壳（`payload.config.ts` → `admin.*`）

| 项 | 路径 | 作用 | 默认定调 |
|----|------|------|----------|
| Logo | `src/components/AdminLogo/` | 登录页 / 顶栏 Logo | Keep（品牌） |
| Icon | `src/components/AdminIcon/` | 浏览器图标等小图标 | Keep |
| Avatar | `src/components/AdminAvatar/` | 用户头像（Media，不依赖 Gravatar） | Keep |
| ThemeProvider | `src/components/AdminThemeProvider/` + `src/brand/admin-theme*`、`AdminAccountSettings` | 注入 Admin 主题色 / hue | Keep（多为样式） |
| BeforeLogin | `src/components/BeforeLogin/` | 登录页额外说明/区块 | 可评估删，改回官方空白 |
| BeforeDashboard | `src/components/BeforeDashboard/` | 仪表盘顶部提示（含 Seed 等） | 可评估删或极简 |
| CollectionCards | `src/components/AdminCollectionCards/` | 仪表盘 Collection 卡片 widget | 可评估改回官方 `CollectionCards` |
| （已定删）Nav | `src/components/AdminNav/`、`src/admin-nav/` | 自研侧栏 | **删，回归官方** |

#### 业务 / 列表字段（Collection 挂载）

| 项 | 路径 | 作用 | 默认定调 |
|----|------|------|----------|
| Gallery 封面字段 | `src/components/Galleries/GalleryCoverUploadField` | Galleries 封面上传 UX | Keep（业务） |
| Gallery 图片 Join | `src/components/Galleries/GalleryItemsJoinField` | 相册内图片关联编辑 | Keep（业务） |
| 主题预览字段 | `src/components/FrontendThemePreview/` | 站点设置里主题卡片预览 | Keep（配置 UX） |
| Header / Footer RowLabel | `src/Header/RowLabel`、`src/Footer/RowLabel` | 导航行标签显示 | Keep（小） |
| AdminListView | `src/components/AdminListView/` + 刷新按钮 | 曾注入刷新 | **已删**（2026-08-27）；列表回官方 DefaultListView |

#### 与壳相关、但不在 Admin importMap 主路径

| 项 | 路径 | 说明 |
|----|------|------|
| 前台 AdminBar | `src/components/AdminBar/` | 挂在前台 layout，预览/快捷进后台；跟升影响小 |

#### 削减后 importMap 自建条数（示意）

| 类别 | 约略条数 |
|------|----------|
| 品牌壳（Logo/Icon/Avatar/Theme/Before*/Cards） | ~7 |
| 业务字段（图库×2、主题预览、RowLabel×2） | ~5 |
| AdminListView | **0**（已删） |
| Agent（Provider ± 全屏 View） | 1～2 |
| **合计** | **~11～14**（相对现在 ~27；约砍一半） |

Unsplash 本身还带走：`UnsplashImportPill`、API、`src/unsplash/**`、Agent stock tools —— **不主要体现在 importMap 条数**，但少一整条外站集成链路，维护量再降一截。

若再激进：品牌壳改回官方 + 只留 Agent 浮窗 Provider + 图库刚需字段 → 自建可收到 **个位数**。

## 4. 明确不做的事（本阶段）

- **不删除、不停更 Admin Agent。**
- **不把 MCP 当成站内 Agent 的替代品。**

## 5. 将来实施顺序（Payload 4.0 升级时一并做）

1. Stats 按 §3.3 删除（AI Canvases、字段 AI、Dev Docs、Unsplash 已删）。
2. Cache（及可选 Swagger）管理页删除或停用；能力留在 Agent tools。
3. **Nav 回归官方**：去掉自研 `AdminNav` / `admin-nav`；不强制 `afterNavLinks`。
4. （可选）Agent 欢迎语 / systemPrompt 补充「清缓存、统计、配置」等快捷说明。
5. 回归：Agent 浮窗与常用工具、MCP、Media 上传、前台缓存、官方侧栏冒烟。

## 6. 最终剩余（按本文全做完）

| 口径 | 现在 | 做完后 |
|------|------|--------|
| importMap 自建条目 | ~27 | **~11～14**（约一半） |
| 自定义侧栏项 | 4（已去掉二次开发文档与 AI 画布） | **0** |
| 自定义 View | 4（已去掉 dev-docs 与 AI 画布） | **0～1**（可选只留 Agent 全屏；浮窗即可） |
| 自研 Nav | 有 | **无**（官方） |
| 字段 AI 等 | **无** | **无** |

**还留的 Admin UI 定制（按块）：**

1. **Agent**（必留）：浮窗 Provider ± 全屏页 —— 升级主要适配面  
2. **品牌壳**（~7）：Logo / Icon / Avatar / Theme / BeforeLogin·Dashboard / CollectionCards  
3. **业务字段**（~5）：图库×2、主题预览、Header/Footer RowLabel  

非 Admin 壳但 Keep：MCP、LLM 配置、cache 引擎、themes、OSS、业务 Collection。

## 7. 与 Payload 4.0 的关系

- 4.0 贵在 **Admin UI 定制厚度**，不是 Local API / Collection 模型。
- 去掉字段 AI + 画布 + Unsplash + 多余运营页 + **自研 Nav** 后，迁移面明显缩小；**Agent UI（浮窗/全屏）仍是主要定制资产**，主题多为样式回归；这是接受的成本。  
- 正式动手升 4.0 前：等官方 migration guide + 稳定版。剩余削减可与 4.0 升级一并做。

## 8. 相关入口（便于将来删改）

- Admin 自定义导航：`src/admin-nav/customItems.ts`
- Admin 组件注册：`src/payload.config.ts` → `admin.components` / `admin.avatar`
- AI 开关与配置：`AiSettings` / `src/ai/settings.ts`

---

修订记录：

- 2026-07-19 初稿 — Agent Keep；字段 AI 理论可删；Canvases/Stats/Dev Docs 建议删；暂不改代码。
- 2026-07-19 — 补充 Unsplash 图库为建议删（非必须）。
- 2026-07-19 — Nav 回归官方；自定义侧栏可清理，入口改 Agent 快捷方式或问了再告诉。
- 2026-07-19 — 补充 §3.5：削减后剩余的品牌壳 + 业务字段清单。
- 2026-07-19 — Unsplash 删后 AdminListView 建议整段去掉（仅剩刷新无必要）。
- 2026-07-19 — 增加 §6 最终剩余汇总。
- 2026-08-14 — 二次开发文档已迁至 `docs/dev-docs.md`，Admin `/dev-docs` 与侧栏入口已删除。
- 2026-08-20 — 精简（含 AI Canvases）改到 Payload 4.0 升级时再删，当前不改代码。
- 2026-08-27 — AI Canvases 已删除（Collection / View / API / Agent 工具 / @xyflow/react）；Postgres 迁移 `20260827_120000_drop_ai_canvases`。
- 2026-08-27 — Unsplash 已删除（API / Agent stock 工具 / 凭证 Catalog / Global）；Postgres 迁移 `20260827_140000_drop_unsplash_integrations`。
- 2026-08-27 — 列表刷新按钮与 AdminListView 包装已删，列表回官方 DefaultListView。
- 2026-08-27 — 字段 AI 已删除（`withAi*` / Assist·SEO 面板 / Lexical rewrite / `/api/ai/complete|stream|structured`）；Agent 与 LLM 配置中心保留。
