/**
 * Phase 1 smoke checks: MCP endpoint, preview guard, RSS, archive routes.
 *
 * Usage:
 *   pnpm dev   # in another terminal
 *   MCP_API_KEY=xxx pnpm verify:phase1
 */

const BASE = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3333'
const MCP_API_KEY = process.env.MCP_API_KEY

type Check = {
  name: string
  run: () => Promise<boolean>
}

type McpJson = {
  result?: Record<string, unknown>
  error?: { message?: string }
}

const MCP_HEADERS = {
  Authorization: MCP_API_KEY ? `Bearer ${MCP_API_KEY}` : '',
  'Content-Type': 'application/json',
  Accept: 'application/json, text/event-stream',
}

function parseMcpBody(text: string): McpJson | null {
  const trimmed = text.trim()
  if (!trimmed) return null

  if (trimmed.startsWith('event:')) {
    const dataLine = trimmed.split('\n').find((line) => line.startsWith('data: '))
    if (!dataLine) return null
    return JSON.parse(dataLine.slice(6)) as McpJson
  }

  return JSON.parse(trimmed) as McpJson
}

async function mcpRequest(method: string, params: Record<string, unknown>, id: number): Promise<McpJson> {
  const res = await fetch(`${BASE}/api/mcp`, {
    method: 'POST',
    headers: MCP_HEADERS,
    body: JSON.stringify({ jsonrpc: '2.0', id, method, params }),
  })

  const text = await res.text()
  const data = parseMcpBody(text)

  if (!res.ok || !data) {
    throw new Error(`MCP ${method} HTTP ${res.status}: ${text.slice(0, 200)}`)
  }

  if (data.error) {
    throw new Error(`MCP ${method}: ${data.error.message ?? JSON.stringify(data.error)}`)
  }

  return data
}

async function mcpInitialize(): Promise<boolean> {
  if (!MCP_API_KEY) {
    console.log('  ⏭  跳过 MCP（未设置 MCP_API_KEY，运行 pnpm mcp:key 获取）')
    return true
  }

  const data = await mcpRequest(
    'initialize',
    {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'crispy-verify', version: '1.0.0' },
    },
    1,
  )

  return Boolean(data.result)
}

async function mcpToolsList(): Promise<boolean> {
  if (!MCP_API_KEY) return true

  const data = await mcpRequest('tools/list', {}, 2)
  const tools = data.result?.tools

  if (!Array.isArray(tools) || tools.length === 0) {
    console.error('  MCP tools/list 返回空列表')
    return false
  }

  console.log(`  MCP tools: ${tools.length} 个`)
  return true
}

async function mcpPostsCrud(): Promise<boolean> {
  if (!MCP_API_KEY) return true

  const findData = await mcpRequest(
    'tools/call',
    {
      name: 'findPosts',
      arguments: { limit: 5, depth: 0 },
    },
    3,
  )

  const findText = ((findData.result as { content?: { text?: string }[] })?.content?.[0]?.text) ?? ''
  if (!findText.includes('Collection: "posts"')) {
    console.error('  MCP findPosts 响应异常')
    return false
  }

  const slug = `mcp-verify-${Date.now()}`
  const createData = await mcpRequest(
    'tools/call',
    {
      name: 'createPosts',
      arguments: {
        title: 'MCP 验证文章',
        slug,
        draft: true,
        _status: 'draft',
        content: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                version: 1,
                children: [{ type: 'text', text: 'Created by verify:phase1', version: 1 }],
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
      },
    },
    4,
  )

  const createText = ((createData.result as { content?: { text?: string }[] })?.content?.[0]?.text) ?? ''
  const idMatch = createText.match(/"id":(\d+)/)
  const createdId = idMatch ? Number(idMatch[1]) : null

  if (!createText.includes('Resource created successfully') || !createdId) {
    console.error('  MCP createPosts 未成功')
    return false
  }

  const updateData = await mcpRequest(
    'tools/call',
    {
      name: 'updatePosts',
      arguments: {
        id: createdId,
        title: 'MCP 验证文章（已更新）',
      },
    },
    5,
  )

  const updateText = ((updateData.result as { content?: { text?: string }[] })?.content?.[0]?.text) ?? ''
  if (!updateText.includes('MCP 验证文章（已更新）')) {
    console.error('  MCP updatePosts 标题未更新')
    return false
  }

  console.log(`  MCP posts CRUD: create=${createdId} update=ok`)
  return true
}

async function previewRejectsBadSecret(): Promise<boolean> {
  const res = await fetch(
    `${BASE}/next/preview?path=/posts/welcome&previewSecret=wrong-secret`,
    { redirect: 'manual' },
  )
  return res.status === 403
}

async function frontendHasThemeSelector(): Promise<boolean> {
  const res = await fetch(`${BASE}/`)
  const html = await res.text()
  return html.includes('ThemeSelector') || html.includes('theme-selector') || html.includes('data-theme')
}

async function getOk(path: string): Promise<boolean> {
  const res = await fetch(`${BASE}${path}`)
  return res.ok
}

const checks: Check[] = [
  { name: '前台首页', run: () => getOk('/') },
  { name: '归档页', run: () => getOk('/archive') },
  { name: 'RSS', run: () => getOk('/rss.xml') },
  { name: 'Admin 登录页', run: () => getOk('/admin/login') },
  { name: '前台深色模式入口', run: frontendHasThemeSelector },
  { name: 'Preview 拒绝错误密钥', run: previewRejectsBadSecret },
  { name: 'MCP initialize', run: mcpInitialize },
  { name: 'MCP tools/list', run: mcpToolsList },
  { name: 'MCP posts find/create/update', run: mcpPostsCrud },
]

async function main() {
  console.log(`\nCrispy Phase 1 验证 → ${BASE}\n`)

  let failed = 0
  for (const check of checks) {
    process.stdout.write(`• ${check.name} … `)
    try {
      const ok = await check.run()
      if (ok) {
        console.log('✓')
      } else {
        console.log('✗')
        failed++
      }
    } catch (err) {
      console.log('✗')
      console.error(' ', err)
      failed++
    }
  }

  console.log('')
  if (failed > 0) {
    console.error(`${failed} 项检查失败`)
    process.exit(1)
  }
  console.log('全部通过')
}

main()
