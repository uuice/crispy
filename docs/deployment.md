# 部署与数据库迁移

Crispy 3.0 推荐：**本地 SQLite 开发**，**生产 PostgreSQL + 显式迁移**。

---

## 环境变量（生产最小集）

```bash
DATABASE_DRIVER=postgres
DATABASE_URL=postgresql://user:password@host:5432/crispy
PAYLOAD_SECRET=...          # openssl rand -hex 32
NEXT_PUBLIC_SERVER_URL=https://your-domain.com
PREVIEW_SECRET=...
CRON_SECRET=...               # 定时发布
```

可选：S3（`S3_*`）、DeepSeek AI（`DEEPSEEK_API_KEY`）、访问日志等见 `.env.example`。

---

## PostgreSQL 迁移流程

### 1. 首次生成迁移（仅需一次）

需本机 Docker 或可用的 PostgreSQL：

```bash
pnpm docker:up
pnpm migrate:create:initial
git add src/migrations
git commit -m "chore: add initial postgres migration"
```

或：

```bash
bash scripts/bootstrap-postgres-migration.sh
```

### 2. 部署时执行迁移

在启动应用**之前**：

```bash
export DATABASE_DRIVER=postgres
export DATABASE_URL=postgresql://...
export PAYLOAD_SECRET=...
pnpm migrate
pnpm migrate:status
pnpm build
pnpm start
```

### 3. Schema 变更后

```bash
pnpm migrate:create describe_your_change
# 审查 src/migrations/ 中新文件
pnpm migrate
git add src/migrations && git commit
```

### Push 行为

| 环境 | `push` | 说明 |
|------|--------|------|
| 生产 `NODE_ENV=production` | **关闭** | 仅通过 `pnpm migrate` |
| 开发 Postgres | 默认开启 | 可设 `DATABASE_PUSH=false` 强制走迁移 |
| SQLite | N/A | 自动建表 |

---

## CI

GitHub Actions [`.github/workflows/ci.yml`](../.github/workflows/ci.yml)：

- **quality**：`lint` → `tsc` → `test:int`（SQLite）→ `build`
- **postgres-migrations**：Postgres 服务上 `migrate` + `test:int`

**首次启用 CI 前**须提交 `src/migrations/*.ts`，否则 postgres job 会失败并提示运行 `pnpm migrate:create:initial`。

---

## Docker

`Dockerfile` 依赖 Next.js `output: 'standalone'`（已在 `next.config.ts` 启用）。

```bash
docker build -t crispy .
docker run -p 3333:3333 \
  -e DATABASE_URL=postgresql://... \
  -e PAYLOAD_SECRET=... \
  -e NEXT_PUBLIC_SERVER_URL=http://localhost:3333 \
  crispy
```

容器启动前应在 entrypoint 或部署脚本中执行 `pnpm migrate`（需将 Payload CLI 纳入镜像或使用 init 容器）。

---

## 备份与恢复

### PostgreSQL

```bash
pg_dump "$DATABASE_URL" -Fc -f crispy-$(date +%Y%m%d).dump
pg_restore -d "$DATABASE_URL" --clean --if-exists crispy-YYYYMMDD.dump
```

### SQLite（本地）

复制 `.data/payload.db`；恢复时停止应用后替换文件。

### 媒体

- 本地：`public/media/`
- 生产 S3：按 bucket 策略做版本/生命周期备份

---

## 相关文档

- [架构 — 数据库](crispy-v3-architecture.md)
- [实施路线图 — Phase 3](implementation-roadmap.md)
- [Admin 验证清单](admin-verification.md)
