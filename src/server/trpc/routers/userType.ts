import { protectedProcedure, router } from '../trpc'
import { userTypeService } from '../../services/userTypeService'
import { TRPCError } from '@trpc/server'
import { createUserTypeSchema, updateUserTypeSchema, userTypeFiltersSchema } from '@src/types'
import { z } from 'zod'

export const userTypeRouter = router({
  // 获取userType列表
  list: protectedProcedure
    .input(
      userTypeFiltersSchema.transform((data) => ({
        ...data,
        page: data.page,
        pageSize: data.pageSize
      }))
    )
    .query(async ({ input }) => {
      try {
        const result = await userTypeService.getUserTypes(input)
        return {
          success: true,
          data: result
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || '获取userType列表失败'
        })
      }
    }),

  // 获取单个userType
  getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    try {
      const result = await userTypeService.getById(input.id)
      if (!result) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'userType不存在'
        })
      }
      return {
        success: true,
        data: result
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || '获取userType失败'
      })
    }
  }),

  // 创建userType
  create: protectedProcedure.input(createUserTypeSchema).mutation(async ({ input }) => {
    try {
      const result = await userTypeService.create(input)
      return {
        success: true,
        data: result
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: error.message || '创建userType失败'
      })
    }
  }),

  // 更新userType
  update: protectedProcedure
    .input(
      updateUserTypeSchema.extend({
        id: z.number()
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updateFields } = input
      try {
        const result = await userTypeService.update(id, updateFields)
        return {
          success: true,
          data: result
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message || '更新userType失败'
        })
      }
    }),

  // 删除userType
  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    try {
      await userTypeService.delete(input.id)
      return {
        success: true,
        message: '删除成功'
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: error.message || '删除userType失败'
      })
    }
  })
})
