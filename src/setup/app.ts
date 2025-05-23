// 初始化标志
let isInitialized = false

// 应用初始化配置
export async function initializeApp() {
  // 如果已经初始化过，直接返回
  if (isInitialized) {
    console.log('应用已经初始化过，跳过初始化')
    return
  }

  // 这里可以放置需要在应用启动时执行的代码
  // 例如：
  // - 初始化第三方服务
  // - 加载必要的配置
  // - 检查用户登录状态
  // - 预加载数据
  console.log('应用初始化中...')

  try {
    // 示例：初始化配置
    // await initializeConfig()

    // 示例：检查用户状态
    // await checkUserStatus()

    // 标记为已初始化
    isInitialized = true
    console.log('应用初始化完成')
  } catch (error) {
    console.error('应用初始化失败:', error)
    // 初始化失败时重置标志，允许重试
    isInitialized = false
  }
}

// 导出其他初始化相关的函数
export const appConfig = {
  // 应用配置
  version: '1.0.0',
  // 其他配置项...
}

// 导出初始化状态检查函数
export function isAppInitialized() {
  return isInitialized
}
