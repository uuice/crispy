import { router, protectedProcedure } from '../trpc'
import { noticeService } from '../../services/noticeService'
import { TRPCError } from '@trpc/server'
import {
  createNoticeSchema,
  updateNoticeSchema,
  commonFiltersSchema,
  noticeFiltersSchema
} from '@src/types'
import { z } from 'zod'

export const noticeRouter = router({
  // 获取notice列表
  list: protectedProcedure
    .input(
      noticeFiltersSchema.transform((data) => ({
        ...data,
        page: data.page,
        pageSize: data.pageSize
      }))
    )
    .query(async ({ input }) => {
      try {
        const result = await noticeService.getNotices(input)
        return {
          success: true,
          data: result
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || '获取notice列表失败'
        })
      }
    }),

  // 获取单个notice
  getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    try {
      const result = await noticeService.getById(input.id)
      if (!result) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'notice不存在'
        })
      }
      return {
        success: true,
        data: result
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || '获取notice失败'
      })
    }
  }),

  // 创建notice
  create: protectedProcedure.input(createNoticeSchema).mutation(async ({ input }) => {
    try {
      const result = await noticeService.create(input)
      return {
        success: true,
        data: result
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: error.message || '创建notice失败'
      })
    }
  }),

  // 更新notice
  update: protectedProcedure
    .input(
      updateNoticeSchema.extend({
        id: z.number()
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updateFields } = input
      try {
        const result = await noticeService.update(id, updateFields)
        return {
          success: true,
          data: result
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message || '更新notice失败'
        })
      }
    }),

  // 删除notice
  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    try {
      await noticeService.delete(input.id)
      return {
        success: true,
        message: '删除成功'
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: error.message || '删除notice失败'
      })
    }
  })
})
