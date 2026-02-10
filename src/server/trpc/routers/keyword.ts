import { router, protectedProcedure } from '../trpc'
import { keywordService } from '../../services/keywordService'
import { TRPCError } from '@trpc/server'
import {
  createKeywordSchema,
  updateKeywordSchema,
  commonFiltersSchema,
  keywordFiltersSchema
} from '@src/types'
import { z } from 'zod'

export const keywordRouter = router({
  // 获取keyword列表
  list: protectedProcedure
    .input(
      keywordFiltersSchema.transform((data) => ({
        ...data,
        page: data.page,
        pageSize: data.pageSize
      }))
    )
    .query(async ({ input }) => {
      try {
        const result = await keywordService.getKeywords(input)
        return {
          success: true,
          data: result
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || '获取keyword列表失败'
        })
      }
    }),

  // 获取单个keyword
  getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    try {
      const result = await keywordService.getById(input.id)
      if (!result) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'keyword不存在'
        })
      }
      return {
        success: true,
        data: result
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || '获取keyword失败'
      })
    }
  }),

  // 创建keyword
  create: protectedProcedure.input(createKeywordSchema).mutation(async ({ input }) => {
    try {
      const result = await keywordService.create(input)
      return {
        success: true,
        data: result
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: error.message || '创建keyword失败'
      })
    }
  }),

  // 更新keyword
  update: protectedProcedure
    .input(
      updateKeywordSchema.extend({
        id: z.number()
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updateFields } = input
      try {
        const result = await keywordService.update(id, updateFields)
        return {
          success: true,
          data: result
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message || '更新keyword失败'
        })
      }
    }),

  // 删除keyword
  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    try {
      await keywordService.delete(input.id)
      return {
        success: true,
        message: '删除成功'
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: error.message || '删除keyword失败'
      })
    }
  })
})
