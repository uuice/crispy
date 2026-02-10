import { router, protectedProcedure } from '../trpc'
import { cacheService } from '../../services/cacheService'
import { TRPCError } from '@trpc/server'
import {
  createCacheSchema,
  updateCacheSchema,
  commonFiltersSchema,
  cacheFiltersSchema
} from '@src/types'
import { z } from 'zod'

export const cacheRouter = router({
  // 获取cache列表
  list: protectedProcedure
    .input(
      cacheFiltersSchema.transform((data) => ({
        ...data,
        page: data.page,
        pageSize: data.pageSize
      }))
    )
    .query(async ({ input }) => {
      try {
        const result = await cacheService.getCaches(input)
        return {
          success: true,
          data: result
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || '获取cache列表失败'
        })
      }
    }),

  // 获取单个cache
  getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    try {
      const result = await cacheService.getById(input.id)
      if (!result) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'cache不存在'
        })
      }
      return {
        success: true,
        data: result
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || '获取cache失败'
      })
    }
  }),

  // 创建cache
  create: protectedProcedure.input(createCacheSchema).mutation(async ({ input }) => {
    try {
      const result = await cacheService.create(input)
      return {
        success: true,
        data: result
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: error.message || '创建cache失败'
      })
    }
  }),

  // 更新cache
  update: protectedProcedure
    .input(
      updateCacheSchema.extend({
        id: z.number()
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updateFields } = input
      try {
        const result = await cacheService.update(id, updateFields)
        return {
          success: true,
          data: result
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message || '更新cache失败'
        })
      }
    }),

  // 删除cache
  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    try {
      await cacheService.delete(input.id)
      return {
        success: true,
        message: '删除成功'
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: error.message || '删除cache失败'
      })
    }
  })
})
