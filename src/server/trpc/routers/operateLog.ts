import { protectedProcedure, router } from '../trpc'
import { operateLogService } from '../../services/operateLogService'
import { TRPCError } from '@trpc/server'
import { createOperateLogSchema, operateLogFiltersSchema, updateOperateLogSchema } from '@src/types'
import { z } from 'zod'

export const operateLogRouter = router({
  // 获取operateLog列表
  list: protectedProcedure
    .input(
      operateLogFiltersSchema.transform((data) => ({
        ...data,
        page: data.page,
        pageSize: data.pageSize
      }))
    )
    .query(async ({ input }) => {
      try {
        const result = await operateLogService.getOperateLogs(input)
        return {
          success: true,
          data: result
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || '获取operateLog列表失败'
        })
      }
    }),

  // 获取单个operateLog
  getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    try {
      const result = await operateLogService.getById(input.id)
      if (!result) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'operateLog不存在'
        })
      }
      return {
        success: true,
        data: result
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || '获取operateLog失败'
      })
    }
  }),

  // 创建operateLog
  create: protectedProcedure.input(createOperateLogSchema).mutation(async ({ input }) => {
    try {
      const result = await operateLogService.create(input)
      return {
        success: true,
        data: result
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: error.message || '创建operateLog失败'
      })
    }
  }),

  // 更新operateLog
  update: protectedProcedure
    .input(
      updateOperateLogSchema.extend({
        id: z.number()
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updateFields } = input
      try {
        const result = await operateLogService.update(id, updateFields)
        return {
          success: true,
          data: result
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message || '更新operateLog失败'
        })
      }
    }),

  // 删除operateLog
  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    try {
      await operateLogService.delete(input.id)
      return {
        success: true,
        message: '删除成功'
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: error.message || '删除operateLog失败'
      })
    }
  })
})
