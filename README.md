# Crispy

公司官网内容管理系统（CMS）：前台展示官网内容，后台维护页面、文章、分类、招聘、广告与站点配置。

- 前端：Angular 21 + PrimeNG + TailwindCSS，支持 SSR
- 后端：Bun + Express + Kysely
- 数据库：MariaDB / MySQL
- API 文档：Swagger（Admin / Content）

## 本地开发

```bash
bun install
cp .env.example .env   # 配置数据库等
bun run db:setup       # 迁移 + 生成 db.d.ts
bun run start
```

浏览器访问 `http://localhost:4200/`。后台入口 `/backstage`（默认账号 admin / 111111）。

## 常用脚本

| 命令 | 说明 |
|------|------|
| `bun run start` | 开发服务器 |
| `bun run build` | 生产构建（会先执行 swagger:generate） |
| `bun run build:tar:prod` | 构建并打包 `crispy-prod-*.tar.gz` |
| `bun run serve:ssr:crispy` | 运行 SSR 生产服务 |
| `bun run db:migrate` | 执行数据库迁移 |
| `bun run db:setup` | 迁移 + `db:generate` + 文档数据模型 |
| `bun run doc:tables` | 从 `db.d.ts` 生成文档页 `table-metadata.ts` |
| `bun run swagger:generate` | 生成 Swagger 文档 |

## 文档

在线演示：[https://crispy.uuice.com](https://crispy.uuice.com)

| 页面 | 路径 |
|------|------|
| 项目文档 | [/doc](https://crispy.uuice.com/doc) |
| API 说明 | [/doc/api-docs](https://crispy.uuice.com/doc/api-docs) |
| 数据模型 | [/doc/data-models](https://crispy.uuice.com/doc/data-models) |
| 数据库迁移 | [/doc/migration](https://crispy.uuice.com/doc/migration) |
| Swagger Admin | [/doc/admin/docs](https://crispy.uuice.com/doc/admin/docs) |
| Swagger Content | [/doc/content/docs](https://crispy.uuice.com/doc/content/docs) |

## 部署

```bash
bun run build:tar:prod
# 解压后在服务器上：
bun run serve:ssr:crispy
```

## License

MIT · [UUICE](https://github.com/uuice/crispy)
