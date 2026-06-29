# Crispy Admin 使用指南

面向编辑、运营与管理员的后台操作说明。开发环境默认地址：**http://localhost:3333/admin**。

---

## 登录与角色

| 角色 | 说明 | Seed 演示账号 |
|------|------|---------------|
| 超级管理员 | 用户管理、全部内容 | `admin@example.com` / `password` |
| 编辑 | 发布任意内容、管理运营模块与站点配置 | `editor@example.com` / `password` |
| 作者 | 仅创建/编辑**自己的文章**（保存为草稿）；可上传媒体，不可删媒体、不可改单页/分类/导航 | `author@example.com` / `password` |

右上角用户菜单可切换 **语言**（中文 / English）与 **主题**（浅色 / 深色）。

---

## 内容管理

### 文章（Posts）

1. **文章 → 新建**
2. 填写标题、正文（Lexical 富文本）
3. 选择分类、标签、作者
4. 在 **SEO** 标签页设置摘要与分享图
5. 作者角色保存后为 **草稿**；编辑/管理员可点击 **发布**

**预览**：编辑页点击 **预览**（草稿）或 **Live Preview**（实时 iframe）。

### 单页（Pages）

用于首页、联系我们等固定页面。首页 slug 固定为 `home`，由多个 **区块（Blocks）** 组成：

- 内容区块、媒体区块、归档区块、表单区块、行动号召

### 分类与标签

- **分类**：文章主 taxonomy，前台路径 `/category/[slug]`
- **标签**：更细粒度标记，前台路径 `/tag/[slug]`

标题支持中文；**Slug** 会根据标题自动生成拼音（可手动修改）。

---

## 运营模块

### 图库（Gallery Items）

1. 先在 **媒体** 上传图片
2. **图库条目** 关联图片，勾选 **启用** 后才会在前台 `/gallery` 与首页导览中显示
3. 用 **排序** 字段控制展示顺序

### 招聘（Jobs）

- 勾选 **启用** 的条目出现在 `/jobs`
- 职位描述、任职要求使用富文本
- 支持部门、地点、雇佣类型、薪资等字段

### 友情链接（Links）

- 在 **链接** 中维护标题、URL、Logo、是否新窗口打开
- 前台页脚自动展示已启用条目

### 广告（Ad Slots + Ads）

1. **广告位**：定义 slug（如 `home-banner`、`post-list-top`）
2. **广告**：关联广告位，设置图片/链接、启用状态与有效期
3. 前台对应位置通过 `<AdSlot slot="..." />` 渲染

### 站点设置（Site Settings）

全局配置：站点名称、描述、Logo、社交链接、RSS 开关、Admin 主题色相等。保存后前台 Header/Footer 自动更新。

### Header / Footer

- **Header**：主导航（留空时前台使用中文默认导航）
- **Footer**：补充链接（页脚还会自动展示分类、标签与快捷入口）

---

## 工具与集成

### 搜索

Payload Search 插件已启用；前台 `/search` 可搜索已发布文章。

### 重定向

**重定向** 集合管理 URL 跳转（301/302），适用于改版或 slug 变更。

### 导入 / 导出

**导入**、**导出** 集合支持批量数据迁移（CSV 等），适合备份或环境间同步。

### 审计日志（Audit Logs）

内容变更会自动写入 **审计日志**（仅超级管理员可读），记录操作者、集合、文档 ID 与变更摘要。

### API 访问日志

开发环境默认通过 middleware 记录 `/api/*` 请求。可在 **API 访问日志** 中查看（超级管理员）。环境变量：

```bash
API_ACCESS_LOG_ENABLED=false   # 关闭
ACCESS_LOG_SECRET=...          # 可选，默认用 PAYLOAD_SECRET
```

### MCP / AI Agent

1. Admin → **填充示例数据**（或 `pnpm seed`）
2. 终端复制 `MCP_API_KEY`，写入 `.env`
3. 详见 [mcp-guide.md](./mcp-guide.md)

### Admin AI 写作助手

基于 DeepSeek 的后台 AI（润色、SEO、智能填充、Lexical 选区等），需配置 `DEEPSEEK_API_KEY`。详见 **[AI 助手指南](./ai-admin-guide.md)**。

验证：`pnpm verify:phase1`（MCP + 预览 + RSS）、`pnpm verify:phase2`（图库/招聘/中文前台）、`pnpm verify:ai`（DeepSeek 连通与流式）。

---

## 媒体存储

- **本地开发**：文件保存在 `public/media/` 或 SQLite 关联路径
- **生产（S3）**：配置 `.env` 中 `S3_*` 变量后自动启用 `@payloadcms/storage-s3`

---

## 常用命令

```bash
pnpm dev              # 启动开发服务器（端口 3333）
pnpm seed             # CLI 填充示例数据
pnpm build            # 生产构建
pnpm verify:phase1    # Phase 1 冒烟测试
pnpm verify:phase2    # Phase 2 冒烟测试
pnpm verify:ai        # Admin AI（DeepSeek）验证
pnpm mcp:key          # 重新生成 MCP API Key
pnpm generate:types   # 更新 TypeScript 类型
```

---

## 常见问题

**新增集合后 SQLite 报错？**  
重启 `pnpm dev`，必要时删除 `.data/` 后重新 seed（会清空本地数据）。

**前台导航还是英文？**  
在 **Header** 全局中更新导航，或重新执行 seed。

**图库/招聘前台看不到？**  
确认条目已 **启用** 且（图库）已关联媒体。

**作者无法发布？**  
设计如此：作者只能提交草稿，需编辑或管理员审核发布。

**作者看不到单页草稿？**  
作者仅可查看已发布单页；编辑/管理员可管理全部单页与草稿。

**作者无法删除媒体？**  
作者可上传、编辑 alt/caption，删除媒体需编辑或管理员权限。

---

## 相关文档

- [架构说明](./crispy-v3-architecture.md)
- [实施路线图](./implementation-roadmap.md)
- [Admin 验证清单](./admin-verification.md)
- [AI 助手指南](./ai-admin-guide.md)
- [MCP 指南](./mcp-guide.md)
