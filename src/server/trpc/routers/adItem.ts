import { protectedProcedure, router } from '../trpc'
import { adItemService } from '../../services/adItemService'
import { TRPCError } from '@trpc/server'
import { adItemFiltersSchema, createAdItemSchema, updateAdItemSchema } from '@src/types'
import { z } from 'zod'

export const adItemRouter = router({
  // 获取adItem列表
  list: protectedProcedure
    .input(
      adItemFiltersSchema.transform((data) => ({
        ...data,
        page: data.page,
        pageSize: data.pageSize
      }))
    )
    .query(async ({ input }) => {
      try {
        const result = await adItemService.getAdItems(input)
        return {
          success: true,
          data: result
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || '获取adItem列表失败'
        })
      }
    }),

  // 获取单个adItem
  getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    try {
      const result = await adItemService.getById(input.id)
      if (!result) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'adItem不存在'
        })
      }
      return {
        success: true,
        data: result
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || '获取adItem失败'
      })
    }
  }),

  // 创建adItem
  create: protectedProcedure.input(createAdItemSchema).mutation(async ({ input }) => {
    try {
      const result = await adItemService.create(input)
      return {
        success: true,
        data: result
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: error.message || '创建adItem失败'
      })
    }
  }),

  // 更新adItem
  update: protectedProcedure
    .input(
      updateAdItemSchema.extend({
        id: z.number()
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updateFields } = input
      try {
        const result = await adItemService.update(id, updateFields)
        return {
          success: true,
          data: result
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message || '更新adItem失败'
        })
      }
    }),

  // 删除adItem
  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    try {
      await adItemService.delete(input.id)
      return {
        success: true,
        message: '删除成功'
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: error.message || '删除adItem失败'
      })
    }
  })
})
