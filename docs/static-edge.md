# 静态站 + Go 边缘服务（方案备忘）

> 状态：**仅文档，暂不改代码**
> 日期：2026-08-14
> 背景：生产 Node（Payload 3 + Next.js）空闲约 350MB+，不适合 1G 永久机常驻。阿里云 2G 到期后，个人博客改由本机编辑 + 1G 只读边缘承接访客。

## 1. 目标

- 1G 永久机 **不跑 Node**，只提供 HTTPS 访客站。
- 前台 HTML 尽量与当前主题一致（由现有 Next 渲染后导出，不用 Go 重写皮肤）。
- 短链、URL 重定向、前台 AI 浮窗在 1G 上仍可用。
- Payload `/admin`、后台 Agent 仍用当前 Crispy，仅在发文时于本机打开。

## 2. 架构

```
访客 ──HTTPS──► 1G
                  crispy-edge (Go :8080)
                    ① edge/redirects.json 命中 → 301
                    ② /s/{slug} → 302
                    ③ /api/ai/assistant → 检索索引 + LLM 流式
                    ④ 其余 → 磁盘静态 HTML

本机（发文才开）
  Payload /admin 写库
  → export:static
  → HTML + JSON
  → rsync 到 1G
  → 关掉 Node
```

2G 到期前：主站仍指向现有 PM2；1G 用子域验收。确认后再切 DNS、关 2G。

## 3. 代码边界

| 位置 | 职责 |
| --- | --- |
| 本仓库 Crispy | 增加导出命令：起站、按 sitemap 抓 HTML、写出跳转 / 短链 / AI 索引 JSON |
| 新建 `crispy-edge`（Go） | 读导出目录；跳转、短链、前台 AI、静态文件 |

Go **不**渲染 Lexical、不实现前台主题、不连 Payload、不实现后台 Agent。

## 4. 导出目录

同步到 1G 的目录示意：

```
/var/www/blog/
├── index.html
├── posts/
├── pages/
├── _next/static/              # 从运行中的 Next 拷贝
├── search-index.json          # 现有前台搜索可继续用
└── edge/
    ├── redirects.json
    ├── short-links.json
    └── assistant-index.json
```

### 4.1 `assistant-index.json`

前台 AI 用的公开检索索引，**不是整库导出**。

- `siteName`
- `items[]`：`type`, `title`, `slug`, `url`, `excerpt`, `keywords[]`
- 类型对齐现助手：`post` / `page` / `category` / `tag` / `link` / `gallery` / `navigation` / `section` 等
- **不含**正文、草稿、用户、评论后台、API Key、embedding

实现时可复用 `src/search/buildSearchIndex.ts`、`src/ai/frontend-assistant/publicContent.ts`。

### 4.2 `short-links.json`

`slug`, `target`, `enabled`（Collection `short-links`）。

### 4.3 `redirects.json`

`from`, `to`。来源：

- Redirects 插件（`src/redirects/loadRedirectMap.ts`）
- 历史路径（`src/frontend-cache/legacyFrontendRedirects.ts`：`/archives`、`/about`、`/authors/...`）

## 5. Go 服务行为

请求顺序：

1. pathname 命中 `redirects.json` → `301 Location`
2. `/s/{slug}` 且 `enabled` → `302 Location`（外链或站内路径）
3. `GET /api/ai/assistant` → `{ available, semanticSearch: false }`
4. `POST /api/ai/assistant` → 与现浮窗相同的 SSE（`data: {type,...}\n\n`）
5. 否则 `http.FileServer`：`/posts/foo` → `posts/foo/index.html`；没有则 404

前台 AI 第一版：

- 工具：`search_content` / `list_content` / `get_content`（关键词，不返回正文）
- **不做** `semantic_search` / pgvector
- LLM：环境变量中的 OpenAI 兼容接口（与 Admin 配置同类）
- 限流（按 IP）、超时；Key 不写进 JSON
- rsync 后 watch 或 SIGHUP 热加载 `edge/*.json`

内存预期：Go + 索引几十 MB。1G 上不装 1Panel / Docker / Node。

## 6. Crispy 导出实现要点

不要 `output: 'export'`，不要从 App Router 抽 RSC 到独立渲染器。

1. 本机 `next start`（或 dev）+ 现有数据库
2. URL 列表 = `buildBlogSitemapEntries()` + 固定页（`/`、`/posts`、`/links`、`/rss`、分页等）
3. GET 每个 URL，写入对应 `index.html`
4. 拷贝 `.next/static`、favicon
5. 写出 `edge/*.json`
6. 对账：expected URL 必须都有文件，缺页 `exit 1`；下线内容删除多余文件

路径规格以 `src/utilities/frontendPaths.ts` 为准，勿另发明 URL。

导出 HTML **保留** `FrontendAiAssistant`（请求仍打 `/api/ai/assistant`，由 1G Go 承接）。P3 之前若 Go 尚未接 AI，导出应关掉浮窗，或 Go 对 GET 返回 `available: false`。

评论提交、表单 POST、草稿预览、Live Preview：**1G 不做**。

## 7. 1G 机器

1. 加 1G swap
2. 卸载 1Panel、Docker、snapd（面板本身可占 150MB+）
3. 只留 ssh（禁止密码登录）、可选 fail2ban、Caddy 或 nginx（仅证书 + 反代 `127.0.0.1:8080`）
4. **不在 1G 上跑 Postgres**（库在本机；边缘只读 JSON）
5. systemd 运行 `crispy-edge`，站点目录 `/var/www/blog`
6. 防火墙只开 22 / 80 / 443

## 8. 日常发文

```bash
# 本机
pnpm cli dev:dev              # /admin 写完保存
pnpm cli export:static        # 待实现
rsync -av --delete ./export/ user@1g:/var/www/blog/
```

访客始终打 1G，不经过 Node。

## 9. 分期

| 阶段 | 完成标准 |
| --- | --- |
| **P0 1G 瘦身** | 无 1Panel / Docker，空闲内存明显下降 |
| **P1 导出 HTML** | 子域能打开首页、文章、静态资源，观感与现站一致 |
| **P2 跳转 + Go FileServer** | `/s/xxx`、旧 URL 301、缺页对账通过 |
| **P3 前台 AI** | 浮窗能问、回答带站内链接（仅关键词检索） |
| **P4 切流** | DNS 指 1G，观察后关 2G |

不要并行做 P1–P3。

## 10. 明确不做

- 1G 上 PM2 + Crispy / SQLite 常驻整站
- Go 解析 Lexical、实现前台主题
- 导出整库、在 Go 里当 CMS
- 语义搜索、后台 Agent 上 1G
- 评论 / 表单 / Live Preview 上 1G

## 11. 风险

| 风险 | 对策 |
| --- | --- |
| 漏页 | sitemap + `frontendPaths` 为 expected，生成后 diff，缺则失败 |
| 浮窗在但 API 404 | P3 前关助手，或 Go 先返回 `available: false` |
| LLM Key 在 1G | 仅环境变量、防火墙、限流 |
| 改短链未导出 | 与发文同一流水线 |
| HTML 中其它 `/api/*` | 导出后抽查；非助手 API 不实现 |

## 12. 相关代码（现状，供实现时对照）

| 用途 | 路径 |
| --- | --- |
| 前台路由 | `src/app/(frontend)/**/page.tsx` |
| URL 生成 | `src/utilities/frontendPaths.ts` |
| Sitemap | `src/utilities/buildBlogSitemap.ts` |
| 路由发现 | `src/frontend-cache/discoverFrontendRoutes.ts` |
| 短链 | `src/app/(frontend)/s/[slug]/page.tsx`、`src/collections/ShortLinks/` |
| 重定向 | `src/redirects/`、`src/frontend-cache/legacyFrontendRedirects.ts` |
| 前台 AI | `src/app/(frontend)/api/ai/assistant/route.ts`、`src/ai/frontend-assistant/` |
| 前台搜索索引 | `src/search/buildSearchIndex.ts` |
| 现有 HTML 缓存 | `src/frontend-cache/`（导出抓页时可顺带利用，但 1G 不跑这套） |

## 13. 下一步（未开工）

1. P0：1G 卸面板
2. P1：本仓库增加 `export:static`（先只出 HTML + 静态资源）
3. 新建 `crispy-edge`：FileServer + JSON 跳转
4. P3：Go 实现 `/api/ai/assistant` 协议对齐现浮窗
