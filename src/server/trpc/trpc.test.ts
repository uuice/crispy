// 服务端直接测试 router
import { appRouter } from './trpc.router'

// tRPC 服务端测试函数
export async function testTRPCServer() {
  console.log('开始测试 tRPC Server...')

  // 创建 caller（直接调用 router，无需 HTTP 请求）
  const caller = appRouter.createCaller({})

  try {
    // 测试 getUser query
    console.log('测试 getUser...')
    const user = await caller.getUser('123')
    console.log('getUser 结果:', user)

    // 测试 createUser mutation
    console.log('测试 createUser...')
    const result = await caller.createUser({ name: 'TestUser' })
    console.log('createUser 结果:', result)

    console.log('tRPC Server 测试完成!')
    return { success: true, user, result }
  } catch (error) {
    console.error('tRPC Server 测试失败:', error)
    return { success: false, error }
  }
}

// 直接运行测试
if (import.meta.main) {
  testTRPCServer().then((result) => {
    process.exit(result.success ? 0 : 1)
  })
}
