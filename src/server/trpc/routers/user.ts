import { router, protectedProcedure } from '../trpc'
import { userService } from '../../services/userService'
import { TRPCError } from '@trpc/server'
import { createUserSchema, commonFiltersSchema, userFiltersSchema } from '@src/types'
import { z } from 'zod'

const updateUserSchema = createUserSchema.partial().extend({
  id: z.number()
})

export const userRouter = router({
  // 获取用户列表
  list: protectedProcedure
    .input(
      userFiltersSchema.transform((data) => ({
        ...data,
        page: data.page,
        pageSize: data.pageSize
      }))
    )
    .query(async ({ input }) => {
      try {
        const result = await userService.getUsers(input)
        return {
          success: true,
          data: result
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || '获取用户列表失败'
        })
      }
    }),

  // 获取单个用户
  getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    try {
      const result = await userService.getById(input.id)
      if (!result) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: '用户不存在'
        })
      }
      return {
        success: true,
        data: result
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || '获取用户失败'
      })
    }
  }),

  // 创建用户
  create: protectedProcedure.input(createUserSchema).mutation(async ({ input }) => {
    try {
      const result = await userService.create(input)
      return {
        success: true,
        data: result
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: error.message || '创建用户失败'
      })
    }
  }),

  // 更新用户
  update: protectedProcedure.input(updateUserSchema).mutation(async ({ input }) => {
    const { id, ...updateFields } = input
    try {
      const result = await userService.update(id, updateFields)
      return {
        success: true,
        data: result
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: error.message || '更新用户失败'
      })
    }
  }),

  // 删除用户
  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    try {
      await userService.delete(input.id)
      return {
        success: true,
        message: '删除成功'
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: error.message || '删除用户失败'
      })
    }
  })
})
