import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from './trpc.router'

// 创建 tRPC 客户端
export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: '/api/trpc',
      headers: () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('jwt_token') : null
        return token ? { Authorization: `Bearer ${token}` } : {}
      }
    })
  ]
})

// 导出类型
export type { AppRouter }
