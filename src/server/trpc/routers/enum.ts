import { protectedProcedure, router } from '../trpc'
import { enumService } from '../../services/enumService'
import { TRPCError } from '@trpc/server'
import { createEnumSchema, enumFiltersSchema, updateEnumSchema } from '@src/types'
import { z } from 'zod'

export const enumRouter = router({
  // 获取enum列表
  list: protectedProcedure
    .input(
      enumFiltersSchema.transform((data) => ({
        ...data,
        page: data.page,
        pageSize: data.pageSize
      }))
    )
    .query(async ({ input }) => {
      try {
        const result = await enumService.getEnums(input)
        return {
          success: true,
          data: result
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || '获取enum列表失败'
        })
      }
    }),

  // 获取单个enum
  getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    try {
      const result = await enumService.getById(input.id)
      if (!result) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'enum不存在'
        })
      }
      return {
        success: true,
        data: result
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || '获取enum失败'
      })
    }
  }),

  // 创建enum
  create: protectedProcedure.input(createEnumSchema).mutation(async ({ input }) => {
    try {
      const result = await enumService.create(input)
      return {
        success: true,
        data: result
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: error.message || '创建enum失败'
      })
    }
  }),

  // 更新enum
  update: protectedProcedure
    .input(
      updateEnumSchema.extend({
        id: z.number()
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updateFields } = input
      try {
        const result = await enumService.update(id, updateFields)
        return {
          success: true,
          data: result
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message || '更新enum失败'
        })
      }
    }),

  // 删除enum
  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    try {
      await enumService.delete(input.id)
      return {
        success: true,
        message: '删除成功'
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: error.message || '删除enum失败'
      })
    }
  })
})
