import { CreateExpressContextOptions } from '@trpc/server/adapters/express'
import { env } from '../config/env'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

// 用户信息接口
export interface UserInfo {
  id: number
  user_name: string
  role_id?: number
  is_admin?: number
  is_super_admin?: number
}

// Token 信息接口
export interface TokenInfo {
  app_name: string
  channel: string
}

// tRPC 上下文
export interface Context {
  user?: UserInfo
  tokenInfo?: TokenInfo
  req: Request
  res: Response
}

// 创建上下文
export async function createContext({ req, res }: CreateExpressContextOptions): Promise<Context> {
  const ctx: Context = { req, res }

  // 开发环境日志
  if (env.isDevelopment()) {
    console.log(`[tRPC] ${req.method} ${req.path}`)
  }

  // 从 JWT token 解析用户信息
  const authHeader = req.headers.authorization
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    try {
      // 验证 JWT token 并解析用户信息
      const decoded = jwt.verify(token, env.JWT_SECRET) as UserInfo
      ctx.user = decoded
    } catch (e) {
      // Token 无效，不设置用户
      console.log('[tRPC] JWT verification failed:', (e as Error).message)
    }
  }

  // 从 headers 解析 access token 信息
  const accessToken = req.headers['x-access-token'] as string
  const appName = req.headers['x-app-name'] as string
  const channel = req.headers['x-channel'] as string

  if (accessToken && appName && channel) {
    ctx.tokenInfo = {
      app_name: appName,
      channel: channel
    }
  }

  return ctx
}
