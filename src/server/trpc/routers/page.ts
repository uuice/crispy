import { protectedProcedure, router } from '../trpc'
import { pageService } from '../../services/pageService'
import { TRPCError } from '@trpc/server'
import { createPageSchema, pageFiltersSchema, updatePageSchema } from '@src/types'
import { z } from 'zod'

export const pageRouter = router({
  // 获取page列表
  list: protectedProcedure
    .input(
      pageFiltersSchema.transform((data) => ({
        ...data,
        page: data.page,
        pageSize: data.pageSize
      }))
    )
    .query(async ({ input }) => {
      try {
        const result = await pageService.getPages(input)
        return {
          success: true,
          data: result
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || '获取page列表失败'
        })
      }
    }),

  // 获取单个page
  getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    try {
      const result = await pageService.getById(input.id)
      if (!result) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'page不存在'
        })
      }
      return {
        success: true,
        data: result
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || '获取page失败'
      })
    }
  }),

  // 创建page
  create: protectedProcedure.input(createPageSchema).mutation(async ({ input }) => {
    try {
      const result = await pageService.create(input)
      return {
        success: true,
        data: result
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: error.message || '创建page失败'
      })
    }
  }),

  // 更新page
  update: protectedProcedure
    .input(
      updatePageSchema.extend({
        id: z.number()
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updateFields } = input
      try {
        const result = await pageService.update(id, updateFields)
        return {
          success: true,
          data: result
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message || '更新page失败'
        })
      }
    }),

  // 删除page
  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    try {
      await pageService.delete(input.id)
      return {
        success: true,
        message: '删除成功'
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: error.message || '删除page失败'
      })
    }
  })
})
