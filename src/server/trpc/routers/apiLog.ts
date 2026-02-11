import { protectedProcedure, router } from '../trpc'
import { apiLogService } from '../../services/apiLogService'
import { TRPCError } from '@trpc/server'
import { apiLogFiltersSchema, createApiLogSchema, updateApiLogSchema } from '@src/types'
import { z } from 'zod'

export const apiLogRouter = router({
  // 获取apiLog列表
  list: protectedProcedure
    .input(
      apiLogFiltersSchema.transform((data) => ({
        ...data,
        page: data.page,
        pageSize: data.pageSize
      }))
    )
    .query(async ({ input }) => {
      try {
        const result = await apiLogService.getApiLogs(input)
        return {
          success: true,
          data: result
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || '获取apiLog列表失败'
        })
      }
    }),

  // 获取单个apiLog
  getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    try {
      const result = await apiLogService.getById(input.id)
      if (!result) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'apiLog不存在'
        })
      }
      return {
        success: true,
        data: result
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || '获取apiLog失败'
      })
    }
  }),

  // 创建apiLog
  create: protectedProcedure.input(createApiLogSchema).mutation(async ({ input }) => {
    try {
      const result = await apiLogService.create(input)
      return {
        success: true,
        data: result
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: error.message || '创建apiLog失败'
      })
    }
  }),

  // 更新apiLog
  update: protectedProcedure
    .input(
      updateApiLogSchema.extend({
        id: z.number()
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updateFields } = input
      try {
        const result = await apiLogService.update(id, updateFields)
        return {
          success: true,
          data: result
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message || '更新apiLog失败'
        })
      }
    }),

  // 删除apiLog
  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    try {
      await apiLogService.delete(input.id)
      return {
        success: true,
        message: '删除成功'
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: error.message || '删除apiLog失败'
      })
    }
  })
})
