/**
 * AI smoke check (OpenAI-compatible LLM). Loads .env and tests API key + connectivity.
 *
 * Usage: pnpm verify:ai
 */
import 'dotenv/config'

import { openAiChatCompletion } from '../src/ai/providers/openaiCompatible'
import { resolveAiSettings } from '../src/ai/settings'

const BASE = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3333'

async function main() {
  console.log(`\nCrispy AI 验证 → ${BASE}\n`)

  const settings = await resolveAiSettings()

  if (!settings.apiKey) {
    console.error(`✗ 未读取到 API Key（${settings.provider}）`)
    console.error('  请确认 .env 中已配置 LLM_API_KEY 或对应提供商的环境变量')
    process.exit(1)
  }

  console.log(`• 提供商 ${settings.providerLabel} (${settings.provider}) … ✓`)
  console.log(`• API Key … ✓ (${settings.apiKey.slice(0, 7)}…)`)
  console.log(`• 模型 ${settings.model}`)
  console.log(`• API 地址 ${settings.baseUrl}/v1/chat/completions`)

  process.stdout.write('• LLM 直连润色 … ')
  try {
    const result = await openAiChatCompletion({
      baseUrl: settings.baseUrl,
      apiKey: settings.apiKey,
      model: settings.model,
      temperature: settings.temperature,
      maxTokens: 256,
      messages: [
        { role: 'system', content: '你是中文编辑，只输出润色后的文本。' },
        { role: 'user', content: '请润色：这是一个测试标题，需要润色。' },
      ],
    })
    console.log('✓')
    console.log(`  结果: ${result.content.slice(0, 80)}${result.content.length > 80 ? '…' : ''}`)
  } catch (err) {
    console.log('✗')
    console.error(' ', err instanceof Error ? err.message : err)
    process.exit(1)
  }

  for (const endpoint of ['/api/ai/complete', '/api/ai/stream'] as const) {
    process.stdout.write(`• Admin API ${endpoint} … `)
    try {
      const res = await fetch(`${BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'polish',
          collection: 'posts',
          fieldPath: 'title',
          input: '测试',
          context: { locale: 'zh-CN' },
        }),
      })

      if (res.status === 401) {
        console.log('✓ (未登录 401，路由正常；Admin 内按钮需登录后使用)')
      } else if (endpoint === '/api/ai/stream' && res.ok) {
        const reader = res.body?.getReader()
        let gotChunk = false
        if (reader) {
          const decoder = new TextDecoder()
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            if (decoder.decode(value).includes('"text"')) {
              gotChunk = true
              break
            }
          }
          reader.releaseLock()
        }
        console.log(gotChunk ? '✓ (SSE)' : '✓')
      } else if (res.ok) {
        console.log('✓')
      } else {
        const data = (await res.json()) as { error?: string }
        console.log('✗')
        console.error(' ', data.error ?? res.status)
        process.exit(1)
      }
    } catch (err) {
      console.log('✗')
      console.error(' ', err instanceof Error ? err.message : err)
      console.error('  请确认 pnpm dev 正在运行')
      process.exit(1)
    }
  }

  console.log('\n全部通过')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

export {}
