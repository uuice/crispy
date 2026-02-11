import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from './trpc.router'

// export TEST_TOKEN=your_jwt_token

// # 运行测试
// bun src/server/trpc/trpc.router.test.ts

/**
 * tRPC 路由测试脚本
 * 测试所有 admin 和 content 端点
 */

// 创建测试客户端
const createTestClient = (token?: string) => {
  return createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        url: 'http://localhost:4200/trpc',
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
              'X-App-Name': 'admin',
              'X-Channel': 'app',
              'X-Access-Token': 'your_access_token',
              'X-App-Version': '1.0.0'
            }
          : {}
      })
    ]
  })
}

// 测试结果记录
interface TestResult {
  endpoint: string
  method: string
  status: 'success' | 'error' | 'skipped'
  error?: string
  duration: number
}

const results: TestResult[] = []

// 测试辅助函数
async function testEndpoint(
  name: string,
  method: string,
  testFn: () => Promise<any>
): Promise<void> {
  const start = Date.now()
  try {
    await testFn()
    results.push({
      endpoint: name,
      method,
      status: 'success',
      duration: Date.now() - start
    })
    console.log(`✅ ${name}.${method} - ${Date.now() - start}ms`)
  } catch (error: any) {
    results.push({
      endpoint: name,
      method,
      status: 'error',
      error: error.message,
      duration: Date.now() - start
    })
    console.log(`❌ ${name}.${method} - ${error.message}`)
  }
}

// ==================== Admin 路由测试 ====================

async function testAdminRouters(client: ReturnType<typeof createTestClient>) {
  console.log('\n========== Admin 路由测试 ==========\n')

  // Auth 路由
  await testEndpoint('auth', 'login', async () => {
    console.log('  跳过: 需要有效的登录凭证')
  })

  // User 路由
  await testEndpoint('user', 'list', () => client.user.list.query({ page: 1, pageSize: 10 }))
  await testEndpoint('user', 'getById', () => client.user.getById.query({ id: 1 }))

  // Category 路由
  await testEndpoint('category', 'list', () =>
    client.category.list.query({ page: 1, pageSize: 10 })
  )
  await testEndpoint('category', 'getById', () => client.category.getById.query({ id: 1 }))

  // Tag 路由
  await testEndpoint('tag', 'list', () => client.tag.list.query({ page: 1, pageSize: 10 }))
  await testEndpoint('tag', 'getById', () => client.tag.getById.query({ id: 1 }))
  await testEndpoint('tag', 'getByValue', () => client.tag.getByValue.query({ value: 'test' }))

  // Article 路由
  await testEndpoint('article', 'list', () => client.article.list.query({ page: 1, pageSize: 10 }))
  await testEndpoint('article', 'getById', () => client.article.getById.query({ id: 1 }))

  // Comment 路由
  await testEndpoint('comment', 'list', () => client.comment.list.query({ page: 1, pageSize: 10 }))
  await testEndpoint('comment', 'getById', () => client.comment.getById.query({ id: 1 }))

  // Config 路由
  await testEndpoint('config', 'list', () => client.config.list.query({ page: 1, pageSize: 10 }))
  await testEndpoint('config', 'getById', () => client.config.getById.query({ id: 1 }))

  // Link 路由
  await testEndpoint('link', 'list', () => client.link.list.query({ page: 1, pageSize: 10 }))
  await testEndpoint('link', 'getById', () => client.link.getById.query({ id: 1 }))

  // Menu 路由
  await testEndpoint('menu', 'list', () => client.menu.list.query({ page: 1, pageSize: 10 }))
  await testEndpoint('menu', 'getById', () => client.menu.getById.query({ id: 1 }))

  // Page 路由
  await testEndpoint('page', 'list', () => client.page.list.query({ page: 1, pageSize: 10 }))
  await testEndpoint('page', 'getById', () => client.page.getById.query({ id: 1 }))

  // Ad 路由
  await testEndpoint('ad', 'list', () => client.ad.list.query({ page: 1, pageSize: 10 }))
  await testEndpoint('ad', 'getById', () => client.ad.getById.query({ id: 1 }))

  // AdItem 路由
  await testEndpoint('adItem', 'list', () => client.adItem.list.query({ page: 1, pageSize: 10 }))
  await testEndpoint('adItem', 'getById', () => client.adItem.getById.query({ id: 1 }))

  // Role 路由
  await testEndpoint('role', 'list', () => client.role.list.query({ page: 1, pageSize: 10 }))
  await testEndpoint('role', 'getById', () => client.role.getById.query({ id: 1 }))

  // Rule 路由
  await testEndpoint('rule', 'list', () => client.rule.list.query({ page: 1, pageSize: 10 }))
  await testEndpoint('rule', 'getById', () => client.rule.getById.query({ id: 1 }))

  // UserType 路由
  await testEndpoint('userType', 'list', () =>
    client.userType.list.query({ page: 1, pageSize: 10 })
  )
  await testEndpoint('userType', 'getById', () => client.userType.getById.query({ id: 1 }))

  // Attr 路由
  await testEndpoint('attr', 'list', () => client.attr.list.query({ page: 1, pageSize: 10 }))
  await testEndpoint('attr', 'getById', () => client.attr.getById.query({ id: 1 }))

  // Cache 路由
  await testEndpoint('cache', 'list', () => client.cache.list.query({ page: 1, pageSize: 10 }))
  await testEndpoint('cache', 'getById', () => client.cache.getById.query({ id: 1 }))

  // Enum 路由
  await testEndpoint('enum', 'list', () => client.enum.list.query({ page: 1, pageSize: 10 }))
  await testEndpoint('enum', 'getById', () => client.enum.getById.query({ id: 1 }))

  // Holiday 路由
  await testEndpoint('holiday', 'list', () => client.holiday.list.query({ page: 1, pageSize: 10 }))
  await testEndpoint('holiday', 'getById', () => client.holiday.getById.query({ id: 1 }))

  // Job 路由
  await testEndpoint('job', 'list', () => client.job.list.query({ page: 1, pageSize: 10 }))
  await testEndpoint('job', 'getById', () => client.job.getById.query({ id: 1 }))

  // Keyword 路由
  await testEndpoint('keyword', 'list', () => client.keyword.list.query({ page: 1, pageSize: 10 }))
  await testEndpoint('keyword', 'getById', () => client.keyword.getById.query({ id: 1 }))

  // Notice 路由
  await testEndpoint('notice', 'list', () => client.notice.list.query({ page: 1, pageSize: 10 }))
  await testEndpoint('notice', 'getById', () => client.notice.getById.query({ id: 1 }))

  // OperateLog 路由
  await testEndpoint('operateLog', 'list', () =>
    client.operateLog.list.query({ page: 1, pageSize: 10 })
  )
  await testEndpoint('operateLog', 'getById', () => client.operateLog.getById.query({ id: 1 }))

  // ApiLog 路由
  await testEndpoint('apiLog', 'list', () => client.apiLog.list.query({ page: 1, pageSize: 10 }))
  await testEndpoint('apiLog', 'getById', () => client.apiLog.getById.query({ id: 1 }))

  // AccessToken 路由
  await testEndpoint('accessToken', 'list', () =>
    client.accessToken.list.query({ page: 1, pageSize: 10 })
  )
  await testEndpoint('accessToken', 'getById', () => client.accessToken.getById.query({ id: 1 }))
}

// ==================== Content 路由测试 ====================

async function testContentRouters(client: ReturnType<typeof createTestClient>) {
  console.log('\n========== Content 路由测试 ==========\n')

  // PublicUser 路由
  await testEndpoint('content.publicUser', 'list', () =>
    client.content.publicUser.list.query({ page: 1, pageSize: 10 })
  )
  await testEndpoint('content.publicUser', 'getById', () =>
    client.content.publicUser.getById.query({ id: 1 })
  )

  // PublicArticle 路由
  await testEndpoint('content.publicArticle', 'list', () =>
    client.content.publicArticle.list.query({ page: 1, pageSize: 10 })
  )
  await testEndpoint('content.publicArticle', 'getById', () =>
    client.content.publicArticle.getById.query({ id: 1 })
  )
  await testEndpoint('content.publicArticle', 'getByUrl', () =>
    client.content.publicArticle.getByUrl.query({ url: 'test-article' })
  )

  // PublicCategory 路由
  await testEndpoint('content.publicCategory', 'list', () =>
    client.content.publicCategory.list.query({ page: 1, pageSize: 10 })
  )
  await testEndpoint('content.publicCategory', 'tree', () =>
    client.content.publicCategory.tree.query({})
  )
  await testEndpoint('content.publicCategory', 'withCount', () =>
    client.content.publicCategory.withCount.query({})
  )
  await testEndpoint('content.publicCategory', 'getById', () =>
    client.content.publicCategory.getById.query({ id: 1 })
  )
  await testEndpoint('content.publicCategory', 'getByAlias', () =>
    client.content.publicCategory.getByAlias.query({ alias: 'test' })
  )

  // PublicTag 路由
  await testEndpoint('content.publicTag', 'list', () =>
    client.content.publicTag.list.query({ page: 1, pageSize: 10 })
  )
  await testEndpoint('content.publicTag', 'getById', () =>
    client.content.publicTag.getById.query({ id: 1 })
  )
  await testEndpoint('content.publicTag', 'getByValue', () =>
    client.content.publicTag.getByValue.query({ value: 'test' })
  )

  // PublicComment 路由
  await testEndpoint('content.publicComment', 'list', () =>
    client.content.publicComment.list.query({ page: 1, pageSize: 10 })
  )
  await testEndpoint('content.publicComment', 'getById', () =>
    client.content.publicComment.getById.query({ id: 1 })
  )

  // PublicConfig 路由
  await testEndpoint('content.publicConfig', 'list', () =>
    client.content.publicConfig.list.query({ page: 1, pageSize: 10 })
  )
  await testEndpoint('content.publicConfig', 'getById', () =>
    client.content.publicConfig.getById.query({ id: 1 })
  )
  await testEndpoint('content.publicConfig', 'getByAlias', () =>
    client.content.publicConfig.getByAlias.query({ alias: 'test' })
  )
  await testEndpoint('content.publicConfig', 'siteSettings', () =>
    client.content.publicConfig.siteSettings.query()
  )

  // PublicAd 路由
  await testEndpoint('content.publicAd', 'list', () =>
    client.content.publicAd.list.query({ page: 1, pageSize: 10 })
  )
  await testEndpoint('content.publicAd', 'getById', () =>
    client.content.publicAd.getById.query({ id: 1 })
  )

  // PublicAdItem 路由
  await testEndpoint('content.publicAdItem', 'list', () =>
    client.content.publicAdItem.list.query({ page: 1, pageSize: 10 })
  )
  await testEndpoint('content.publicAdItem', 'getById', () =>
    client.content.publicAdItem.getById.query({ id: 1 })
  )

  // PublicLink 路由
  await testEndpoint('content.publicLink', 'list', () =>
    client.content.publicLink.list.query({ page: 1, pageSize: 10 })
  )
  await testEndpoint('content.publicLink', 'getById', () =>
    client.content.publicLink.getById.query({ id: 1 })
  )

  // PublicMenu 路由
  await testEndpoint('content.publicMenu', 'list', () =>
    client.content.publicMenu.list.query({ page: 1, pageSize: 10 })
  )
  await testEndpoint('content.publicMenu', 'tree', () => client.content.publicMenu.tree.query())
  await testEndpoint('content.publicMenu', 'getById', () =>
    client.content.publicMenu.getById.query({ id: 1 })
  )

  // PublicPage 路由
  await testEndpoint('content.publicPage', 'list', () =>
    client.content.publicPage.list.query({ page: 1, pageSize: 10 })
  )
  await testEndpoint('content.publicPage', 'getById', () =>
    client.content.publicPage.getById.query({ id: 1 })
  )
  await testEndpoint('content.publicPage', 'getByAlias', () =>
    client.content.publicPage.getByAlias.query({ alias: 'test' })
  )

  // PublicRole 路由
  await testEndpoint('content.publicRole', 'list', () =>
    client.content.publicRole.list.query({ page: 1, pageSize: 10 })
  )
  await testEndpoint('content.publicRole', 'getById', () =>
    client.content.publicRole.getById.query({ id: 1 })
  )

  // PublicRule 路由
  await testEndpoint('content.publicRule', 'list', () =>
    client.content.publicRule.list.query({ page: 1, pageSize: 10 })
  )
  await testEndpoint('content.publicRule', 'tree', () => client.content.publicRule.tree.query())
  await testEndpoint('content.publicRule', 'getById', () =>
    client.content.publicRule.getById.query({ id: 1 })
  )

  // PublicUserType 路由
  await testEndpoint('content.publicUserType', 'list', () =>
    client.content.publicUserType.list.query({ page: 1, pageSize: 10 })
  )
  await testEndpoint('content.publicUserType', 'getById', () =>
    client.content.publicUserType.getById.query({ id: 1 })
  )

  // PublicAttr 路由
  await testEndpoint('content.publicAttr', 'list', () =>
    client.content.publicAttr.list.query({ page: 1, pageSize: 10 })
  )
  await testEndpoint('content.publicAttr', 'getById', () =>
    client.content.publicAttr.getById.query({ id: 1 })
  )

  // PublicCache 路由
  await testEndpoint('content.publicCache', 'list', () =>
    client.content.publicCache.list.query({ page: 1, pageSize: 10 })
  )
  await testEndpoint('content.publicCache', 'getById', () =>
    client.content.publicCache.getById.query({ id: 1 })
  )

  // PublicEnum 路由
  await testEndpoint('content.publicEnum', 'list', () =>
    client.content.publicEnum.list.query({ page: 1, pageSize: 10 })
  )
  await testEndpoint('content.publicEnum', 'getById', () =>
    client.content.publicEnum.getById.query({ id: 1 })
  )

  // PublicHoliday 路由
  await testEndpoint('content.publicHoliday', 'list', () =>
    client.content.publicHoliday.list.query({ page: 1, pageSize: 10 })
  )
  await testEndpoint('content.publicHoliday', 'getById', () =>
    client.content.publicHoliday.getById.query({ id: 1 })
  )

  // PublicJob 路由
  await testEndpoint('content.publicJob', 'list', () =>
    client.content.publicJob.list.query({ page: 1, pageSize: 10 })
  )
  await testEndpoint('content.publicJob', 'getById', () =>
    client.content.publicJob.getById.query({ id: 1 })
  )

  // PublicKeyword 路由
  await testEndpoint('content.publicKeyword', 'list', () =>
    client.content.publicKeyword.list.query({ page: 1, pageSize: 10 })
  )
  await testEndpoint('content.publicKeyword', 'getById', () =>
    client.content.publicKeyword.getById.query({ id: 1 })
  )

  // PublicNotice 路由
  await testEndpoint('content.publicNotice', 'list', () =>
    client.content.publicNotice.list.query({ page: 1, pageSize: 10 })
  )
  await testEndpoint('content.publicNotice', 'getById', () =>
    client.content.publicNotice.getById.query({ id: 1 })
  )

  // PublicOperateLog 路由
  await testEndpoint('content.publicOperateLog', 'list', () =>
    client.content.publicOperateLog.list.query({ page: 1, pageSize: 10 })
  )
  await testEndpoint('content.publicOperateLog', 'getById', () =>
    client.content.publicOperateLog.getById.query({ id: 1 })
  )

  // PublicApiLog 路由
  await testEndpoint('content.publicApiLog', 'list', () =>
    client.content.publicApiLog.list.query({ page: 1, pageSize: 10 })
  )
  await testEndpoint('content.publicApiLog', 'getById', () =>
    client.content.publicApiLog.getById.query({ id: 1 })
  )
}

// ==================== 主测试函数 ====================

async function runTests() {
  console.log('🚀 开始 tRPC 路由测试\n')

  const token =
    process.env['TEST_TOKEN'] ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VyX25hbWUiOiJhZG1pbiIsInJlYWxfbmFtZSI6Iuezu-e7n-euoeeQhuWRmCIsIm5pY2tfbmFtZSI6IueuoeeQhuWRmCIsImF2YXRhcl91cmwiOiIvYXNzZXRzL2ltYWdlcy9hdmF0YXIucG5nIiwiaWF0IjoxNzcwNzc3ODc2LCJleHAiOjE3NzEzODI2NzZ9.2ToGz_7y0D_iSWxS40RCCdetxkHw8RldMtNpqojdJ2w'
  const client = createTestClient(token)

  try {
    await testAdminRouters(client)
    await testContentRouters(client)

    // 输出测试报告
    console.log('\n========== 测试报告 ==========\n')

    const successCount = results.filter((r) => r.status === 'success').length
    const errorCount = results.filter((r) => r.status === 'error').length
    const skippedCount = results.filter((r) => r.status === 'skipped').length
    const totalDuration = results.reduce((sum, r) => sum + r.duration, 0)

    console.log(`总测试数: ${results.length}`)
    console.log(`✅ 成功: ${successCount}`)
    console.log(`❌ 失败: ${errorCount}`)
    console.log(`⏭️  跳过: ${skippedCount}`)
    console.log(`⏱️  总耗时: ${totalDuration}ms`)
    console.log(`平均耗时: ${Math.round(totalDuration / results.length)}ms`)

    if (errorCount > 0) {
      console.log('\n失败的测试:')
      results
        .filter((r) => r.status === 'error')
        .forEach((r) => {
          console.log(`  - ${r.endpoint}.${r.method}: ${r.error}`)
        })
    }

    console.log('\n✨ 测试完成')
  } catch (error: any) {
    console.error('测试执行失败:', error.message)
    process.exit(1)
  }
}

// 运行测试
runTests()
