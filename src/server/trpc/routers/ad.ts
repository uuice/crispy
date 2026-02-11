import { protectedProcedure, router } from '../trpc'
import { adService } from '../../services/adService'
import { TRPCError } from '@trpc/server'
import { adFiltersSchema, createAdSchema, updateAdSchema } from '@src/types'
import { z } from 'zod'

export const adRouter = router({
  // 获取ad列表
  list: protectedProcedure
    .input(
      adFiltersSchema.transform((data) => ({
        ...data,
        page: data.page,
        pageSize: data.pageSize
      }))
    )
    .query(async ({ input }) => {
      try {
        const result = await adService.getAds(input)
        return {
          success: true,
          data: result
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || '获取ad列表失败'
        })
      }
    }),

  // 获取单个ad
  getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    try {
      const result = await adService.getById(input.id)
      if (!result) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'ad不存在'
        })
      }
      return {
        success: true,
        data: result
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || '获取ad失败'
      })
    }
  }),

  // 创建ad
  create: protectedProcedure.input(createAdSchema).mutation(async ({ input }) => {
    try {
      const result = await adService.create(input)
      return {
        success: true,
        data: result
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: error.message || '创建ad失败'
      })
    }
  }),

  // 更新ad
  update: protectedProcedure
    .input(
      updateAdSchema.extend({
        id: z.number()
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updateFields } = input
      try {
        const result = await adService.update(id, updateFields)
        return {
          success: true,
          data: result
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message || '更新ad失败'
        })
      }
    }),

  // 删除ad
  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    try {
      await adService.delete(input.id)
      return {
        success: true,
        message: '删除成功'
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: error.message || '删除ad失败'
      })
    }
  })
})
