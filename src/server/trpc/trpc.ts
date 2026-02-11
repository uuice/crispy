import { initTRPC, TRPCError } from '@trpc/server'
import { Context } from './context'
import { env } from '../config/env'

// 初始化 tRPC
const t = initTRPC.context<Context>().create()

// 导出基础构建块
export const router = t.router
export const publicProcedure = t.procedure

// 认证中间件 - 用于 admin 路由
const isAuthed = t.middleware(({ ctx, next }) => {
  // 登录和登出接口不需要认证
  const path = ctx.req.path
  if (
    path === '/login' ||
    path === '/logout' ||
    path.includes('/trpc/auth.login') ||
    path.includes('/trpc/auth.logout')
  ) {
    return next()
  }

  // 开发环境跳过认证
  if (env.isDevelopment() && env.TRPC_SKIP_AUTH === 'true') {
    return next()
  }

  // 检查 JWT 用户
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: '请先登录'
    })
  }

  return next({
    ctx: {
      user: ctx.user
    }
  })
})

// Access Token 认证中间件 - 用于 content 路由
const hasValidToken = t.middleware(async ({ ctx, next }) => {
  // 开发环境跳过认证
  if (env.isDevelopment() && env.TRPC_SKIP_AUTH === 'true') {
    return next()
  }

  // 检查 access token
  if (!ctx.tokenInfo) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Access token is required'
    })
  }

  // TODO: 验证 access token 有效性
  // const accessTokenService = new AccessTokenService()
  // const isValid = await accessTokenService.checkToken({
  //   app_name: ctx.tokenInfo.app_name,
  //   channel: ctx.tokenInfo.channel,
  //   token: ctx.req.headers['x-access-token'] as string
  // })
  //
  // if (!isValid) {
  //   throw new TRPCError({
  //     code: 'UNAUTHORIZED',
  //     message: 'Invalid access token'
  //   })
  // }

  return next({
    ctx: {
      tokenInfo: ctx.tokenInfo
    }
  })
})

// 导出受保护的 procedures
export const protectedProcedure = t.procedure.use(isAuthed)
export const tokenProtectedProcedure = t.procedure.use(hasValidToken)

// 日志中间件
export const loggerMiddleware = t.middleware(async ({ path, type, next }) => {
  const start = Date.now()
  const result = await next()
  const duration = Date.now() - start

  if (env.isDevelopment()) {
    console.log(`[tRPC] ${type} ${path} - ${duration}ms`)
  }

  return result
})

// 带日志的 procedures
export const loggedPublicProcedure = t.procedure.use(loggerMiddleware)
export const loggedProtectedProcedure = protectedProcedure.use(loggerMiddleware)
export const loggedTokenProtectedProcedure = tokenProtectedProcedure.use(loggerMiddleware)
