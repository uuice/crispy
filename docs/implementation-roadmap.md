# Crispy 3.0 实施路线图

> 跟踪 Payload 版通用 CMS 的分阶段交付。完成项打 `[x]`。

---

## Phase 0 — 脚手架与基础扩展

**目标**：可运行的 Payload 项目 + 核心文档 + MVP 数据模型扩展。

- [x] 创建 orphan 分支 `v3-payload`
- [x] 初始化 Payload Website 模板
- [x] 本地 SQLite / 生产 PostgreSQL 双驱动（`src/database/adapter.ts`）
- [x] 编写架构文档 `docs/crispy-v3-architecture.md`
- [x] 新增 `tags` collection
- [x] 新增 `site-settings` global
- [x] 新增 `src/access/roles.ts` 角色 helpers
- [x] 扩展 `users`：roles + API Key
- [x] 扩展 `posts`：tags 关系
- [x] 启用 `@payloadcms/plugin-mcp`
- [x] 更新 `docker-compose.yml`（PostgreSQL，可选）
- [x] 更新 `.env.example`、开发端口 3333
- [x] 首次启动验证（SQLite，无需 Docker）
- [x] Admin 面板中文化（labels / i18n）
- [x] 运行 seed 并验证前台

---

## Phase 1 — 前台与协作

**目标**：通用 CMS 前台路由齐全，编辑协作可用。

### 前台路由

- [x] `/category/[slug]` 分类归档页
- [x] `/tag/[slug]` 标签归档页
- [x] `/archive` 按年月归档
- [x] `/rss.xml` RSS feed
- [x] 前台读取 `site-settings`（站点名、Logo、社交链接）
- [x] Posts 列表/详情展示 tags

### 权限细化

- [x] `author` 仅能编辑自己的 posts（access 按 author 过滤）
- [x] `author` 无法直接发布（beforeChange 强制 draft）
- [x] `editor` 可发布任意内容
- [x] Seed 演示账号：editor / author / agent

### AI / MCP

- [x] Seed `agent@example.com` 用户（editor 角色）
- [x] 文档：MCP 连接说明 `docs/mcp-guide.md`
- [x] 验证 MCP：find / create / update posts

### 体验

- [x] 替换模板默认文案为 Crispy 品牌
- [x] 深色模式检查
- [x] Live Preview / Draft Preview 验证（Preview 403 守卫 + 文档清单）

---

## Phase 2 — 业务扩展（第 4–5 周）

**目标**：覆盖 2.x 常见运营模块。

- [x] `links` collection（友情链接）
- [x] `ad-slots` + `ads`（广告位）
- [x] `jobs` collection（招聘）
- [x] Audit log 插件或自建 `audit-logs` collection
- [x] `@payloadcms/plugin-import-export`
- [x] `@payloadcms/storage-s3` 生产媒体
- [x] API 访问日志 middleware（可选）
- [x] 中文 slug 自动生成（pinyin hook）
- [x] 前台中文化与站点导览
- [x] `pnpm verify:phase2` 冒烟脚本
- [x] Admin 使用指南 `docs/admin-guide.md`
- [x] Seed 示例文章中文化

---

## Phase 3 — 生产就绪（第 6 周）

**目标**：可部署、可维护。

- [ ] Postgres migrations 流程（`push: false`）
- [ ] CI：lint + build + test
- [ ] `@payloadcms/plugin-sentry`
- [ ] Dockerfile / 部署文档
- [ ] 备份与恢复说明
- [ ] 性能：revalidation 策略审查

---

## 快捷命令

```bash
pnpm dev                    # SQLite 本地开发
pnpm docker:up              # 可选：本地 PostgreSQL
pnpm verify:phase1           # Phase 1 冒烟（需 dev + MCP_API_KEY）
pnpm verify:phase2           # Phase 2 冒烟（图库/招聘/中文前台/access-log）
pnpm seed                    # CLI 填充示例数据
pnpm mcp:key                 # 重新生成 MCP API Key
pnpm generate:types         # 更新 payload-types.ts
pnpm payload migrate:create # 生产迁移
pnpm build                  # 生产构建
```

---

## 决策记录

| 日期 | 决策 | 原因 |
|------|------|------|
| 2026-06-29 | 基于 Payload Website 模板 greenfield | 官方已含 SEO/Search/Preview/Revalidation |
| 2026-06-29 | 本地 SQLite / 生产 PostgreSQL | 本地零依赖，生产用 PG + migrate |
| 2026-06-29 | PostgreSQL 作为生产库 | Payload 3 官方主推 |
| 2026-06-29 | RBAC 用 roles 字段，不做 Rule 树 | Payload 原生模式，够用且 AI 可改 |
| 2026-06-29 | MCP 作为 AI 操作主通道 | 官方插件，优于自研 Content API |
