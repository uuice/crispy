# MCP 连接指南

通过 Payload 官方 `@payloadcms/plugin-mcp`，AI Agent 可直接读写 CMS 内容。

## 前置条件

1. 开发服务已启动：`pnpm dev`
2. 已运行 **填充示例数据**（Admin 仪表盘按钮）或手动 Seed
3. 已在 Admin 创建 **MCP API Key**（见下文）

## 获取 MCP API Key

### 方式一：Seed / CLI 自动生成（推荐本地开发）

1. Admin → **填充示例数据**，或运行 `pnpm seed`
2. 查看终端日志中的 `MCP API Key` 行；若需单独轮换：`pnpm mcp:key`
3. 写入 `.env`：`MCP_API_KEY=xxx`

### 方式二：Admin 手动创建

1. Admin → **MCP** → **API Keys** → 新建
2. 关联用户：选择 `agent@example.com`（editor 角色）
3. 勾选需要开放的 collection 操作（posts / pages / tags 等）
4. 保存并复制 API Key（仅显示一次）

## MCP 端点

```
POST http://localhost:3333/api/mcp
```

鉴权 Header（Bearer 方式）：

```
Authorization: Bearer <mcp-api-key>
```

## 验证连接

```bash
# 设置密钥后运行
MCP_API_KEY=your-key pnpm verify:phase1
```

或手动测试 initialize：

```bash
curl -s -X POST http://localhost:3333/api/mcp \
  -H "Authorization: Bearer $MCP_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}'
```

## Cursor 配置

在项目 `.cursor/mcp.json` 中添加：

```json
{
  "mcpServers": {
    "crispy": {
      "url": "http://localhost:3333/api/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_MCP_API_KEY"
      }
    }
  }
}
```

## Claude Desktop 配置

```json
{
  "mcpServers": {
    "crispy": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "http://localhost:3333/api/mcp",
        "--header",
        "Authorization: Bearer YOUR_MCP_API_KEY"
      ]
    }
  }
}
```

## 演示账号（Seed 后可用）

| 邮箱 | 密码 | 角色 |
|------|------|------|
| `agent@example.com` | `password` | 编辑（MCP 关联用户） |
| `editor@example.com` | `password` | 编辑 |
| `author@example.com` | `password` | 作者 |
| `demo-author@example.com` | `password` | 作者 |

## 可用 MCP 能力

| Collection | find | create | update | delete |
|------------|------|--------|--------|--------|
| posts | ✅ | ✅ | ✅ | ✅ |
| pages | ✅ | ✅ | ✅ | ✅ |
| categories | ✅ | ✅ | ✅ | ✅ |
| tags | ✅ | ✅ | ✅ | ✅ |
| media | ✅ | ✅ | ✅ | ❌ |
| users | — | — | — | — |

具体权限以 MCP API Key 文档中的勾选为准。

## 安全建议

- 生产环境必须使用 MCP API Key，不要使用空密钥
- 为 AI 使用独立 `agent` 用户，权限控制在 editor
- 定期轮换 MCP API Key
- 不要将 `MCP_API_KEY` 提交到 Git

## 参考

- [Payload MCP Plugin 文档](https://payloadcms.com/docs/plugins/mcp)
- [架构文档 — AI / MCP](./crispy-v3-architecture.md#7-ai--mcp-集成)
