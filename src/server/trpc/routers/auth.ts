import { z } from 'zod'
import { router, publicProcedure, protectedProcedure } from '../trpc'
import { userService } from '../../services/userService'
import { TRPCError } from '@trpc/server'
import { loginSchema, resetPasswordSchema } from '@src/types'

export const authRouter = router({
  // 用户登录
  login: publicProcedure.input(loginSchema).mutation(async ({ input }) => {
    try {
      const result = await userService.login(input)
      return {
        success: true,
        data: result
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: error.message || '登录失败'
      })
    }
  }),

  // 用户登出
  logout: protectedProcedure.mutation(async () => {
    return {
      success: true,
      message: '登出成功'
    }
  }),

  // 重置密码
  resetPassword: protectedProcedure
    .input(
      resetPasswordSchema.extend({
        id: z.number()
      })
    )
    .mutation(async ({ input }) => {
      const { id, password, new_password, confirm_password } = input

      if (new_password !== confirm_password) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: '新密码和确认密码不一致'
        })
      }

      try {
        // TODO: 获取当前用户ID
        const currentUserId = 0
        await userService.resetPassword(
          id,
          {
            password: password || '',
            new_password,
            confirm_password
          },
          currentUserId
        )
        return {
          success: true,
          message: '密码重置成功'
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message || '重置密码失败'
        })
      }
    })
})
