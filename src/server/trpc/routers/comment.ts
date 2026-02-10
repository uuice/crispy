import { router, protectedProcedure } from '../trpc'
import { commentService } from '../../services/commentService'
import { TRPCError } from '@trpc/server'
import {
  createCommentSchema,
  updateCommentSchema,
  commonFiltersSchema,
  commentFiltersSchema
} from '@src/types'
import { z } from 'zod'

export const commentRouter = router({
  // 获取comment列表
  list: protectedProcedure
    .input(
      commentFiltersSchema.transform((data) => ({
        ...data,
        page: data.page,
        pageSize: data.pageSize
      }))
    )
    .query(async ({ input }) => {
      try {
        const result = await commentService.getComments(input)
        return {
          success: true,
          data: result
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || '获取comment列表失败'
        })
      }
    }),

  // 获取单个comment
  getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    try {
      const result = await commentService.getById(input.id)
      if (!result) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'comment不存在'
        })
      }
      return {
        success: true,
        data: result
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || '获取comment失败'
      })
    }
  }),

  // 创建comment
  create: protectedProcedure.input(createCommentSchema).mutation(async ({ input }) => {
    try {
      const result = await commentService.create(input)
      return {
        success: true,
        data: result
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: error.message || '创建comment失败'
      })
    }
  }),

  // 更新comment
  update: protectedProcedure
    .input(
      updateCommentSchema.extend({
        id: z.number()
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updateFields } = input
      try {
        const result = await commentService.update(id, updateFields)
        return {
          success: true,
          data: result
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message || '更新comment失败'
        })
      }
    }),

  // 删除comment
  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    try {
      await commentService.delete(input.id)
      return {
        success: true,
        message: '删除成功'
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: error.message || '删除comment失败'
      })
    }
  })
})
