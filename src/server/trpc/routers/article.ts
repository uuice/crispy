import { router, protectedProcedure } from '../trpc'
import { articleService } from '../../services/articleService'
import { TRPCError } from '@trpc/server'
import {
  createArticleSchema,
  updateArticleSchema,
  commonFiltersSchema,
  articleFiltersSchema
} from '@src/types'
import { z } from 'zod'

export const articleRouter = router({
  // 获取article列表
  list: protectedProcedure
    .input(
      articleFiltersSchema.transform((data) => ({
        ...data,
        page: data.page,
        pageSize: data.pageSize
      }))
    )
    .query(async ({ input }) => {
      try {
        const result = await articleService.getArticles(input)
        return {
          success: true,
          data: result
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || '获取article列表失败'
        })
      }
    }),

  // 获取单个article
  getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    try {
      const result = await articleService.getById(input.id)
      if (!result) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'article不存在'
        })
      }
      return {
        success: true,
        data: result
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || '获取article失败'
      })
    }
  }),

  // 创建article
  create: protectedProcedure.input(createArticleSchema).mutation(async ({ input }) => {
    try {
      const result = await articleService.create(input)
      return {
        success: true,
        data: result
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: error.message || '创建article失败'
      })
    }
  }),

  // 更新article
  update: protectedProcedure
    .input(
      updateArticleSchema.extend({
        id: z.number()
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updateFields } = input
      try {
        const result = await articleService.update(id, updateFields)
        return {
          success: true,
          data: result
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message || '更新article失败'
        })
      }
    }),

  // 删除article
  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    try {
      await articleService.delete(input.id)
      return {
        success: true,
        message: '删除成功'
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: error.message || '删除article失败'
      })
    }
  })
})
