/**
 * Phase 2 smoke checks: gallery, jobs, taxonomy pages, Chinese UI, access log API.
 *
 * Usage:
 *   pnpm dev   # in another terminal
 *   pnpm verify:phase2
 */

const BASE = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3333'
const ACCESS_LOG_SECRET = process.env.ACCESS_LOG_SECRET || process.env.PAYLOAD_SECRET

type Check = {
  name: string
  run: () => Promise<boolean>
}

async function getOk(path: string): Promise<boolean> {
  const res = await fetch(`${BASE}${path}`)
  return res.ok
}

async function getHtml(path: string): Promise<string> {
  const res = await fetch(`${BASE}${path}`)
  return res.text()
}

async function frontendHasChineseExplore(): Promise<boolean> {
  const html = await getHtml('/')
  return html.includes('站点导览') || html.includes('最新文章')
}

async function postsPageIsChinese(): Promise<boolean> {
  const html = await getHtml('/posts')
  return html.includes('文章') && !html.includes('<h1>Posts</h1>')
}

async function galleryPageIsChinese(): Promise<boolean> {
  const html = await getHtml('/gallery')
  return html.includes('图库')
}

async function jobsPageIsChinese(): Promise<boolean> {
  const html = await getHtml('/jobs')
  return html.includes('加入我们') || html.includes('招聘')
}

async function tagPageWorks(): Promise<boolean> {
  const res = await fetch(`${BASE}/tag/next-js`)
  if (!res.ok) return false
  const html = await res.text()
  return html.includes('标签') && !html.includes('singular is not defined')
}

async function categoryPageWorks(): Promise<boolean> {
  const res = await fetch(`${BASE}/category/engineering`)
  return res.ok
}

async function accessLogRejectsUnauthorized(): Promise<boolean> {
  const res = await fetch(`${BASE}/api/internal/access-log`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ method: 'GET', path: '/api/test' }),
  })
  return res.status === 401
}

async function accessLogAcceptsAuthorized(): Promise<boolean> {
  if (!ACCESS_LOG_SECRET) {
    console.log('  ⏭  跳过 access-log 写入（未设置 PAYLOAD_SECRET）')
    return true
  }

  const res = await fetch(`${BASE}/api/internal/access-log`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-log-secret': ACCESS_LOG_SECRET,
    },
    body: JSON.stringify({
      method: 'GET',
      path: '/api/verify-phase2',
      status: 200,
      durationMs: 1,
      authType: 'none',
    }),
  })

  if (!res.ok) {
    console.error(`  access-log POST 返回 ${res.status}`)
    return false
  }

  const data = (await res.json()) as { ok?: boolean }
  return data.ok === true
}

async function searchPageIsChinese(): Promise<boolean> {
  const html = await getHtml('/search')
  return html.includes('搜索')
}

const checks: Check[] = [
  { name: '图库页 /gallery', run: () => getOk('/gallery') },
  { name: '招聘页 /jobs', run: () => getOk('/jobs') },
  { name: '分类页 /category/engineering', run: categoryPageWorks },
  { name: '标签页 /tag/next-js', run: tagPageWorks },
  { name: '搜索页 /search', run: () => getOk('/search') },
  { name: '首页站点导览（中文）', run: frontendHasChineseExplore },
  { name: '文章列表中文标题', run: postsPageIsChinese },
  { name: '图库页中文', run: galleryPageIsChinese },
  { name: '招聘页中文', run: jobsPageIsChinese },
  { name: '搜索页中文', run: searchPageIsChinese },
  { name: 'access-log 拒绝未授权', run: accessLogRejectsUnauthorized },
  { name: 'access-log 接受合法密钥', run: accessLogAcceptsAuthorized },
]

async function main() {
  console.log(`\nCrispy Phase 2 验证 → ${BASE}\n`)

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

export {}
