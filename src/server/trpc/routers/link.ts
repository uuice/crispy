import { protectedProcedure, router } from '../trpc'
import { linkService } from '../../services/linkService'
import { TRPCError } from '@trpc/server'
import { createLinkSchema, linkFiltersSchema, updateLinkSchema } from '@src/types'
import { z } from 'zod'

export const linkRouter = router({
  // 获取link列表
  list: protectedProcedure
    .input(
      linkFiltersSchema.transform((data) => ({
        ...data,
        page: data.page,
        pageSize: data.pageSize
      }))
    )
    .query(async ({ input }) => {
      try {
        const result = await linkService.getLinks(input)
        return {
          success: true,
          data: result
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || '获取link列表失败'
        })
      }
    }),

  // 获取单个link
  getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    try {
      const result = await linkService.getById(input.id)
      if (!result) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'link不存在'
        })
      }
      return {
        success: true,
        data: result
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || '获取link失败'
      })
    }
  }),

  // 创建link
  create: protectedProcedure.input(createLinkSchema).mutation(async ({ input }) => {
    try {
      const result = await linkService.create(input)
      return {
        success: true,
        data: result
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: error.message || '创建link失败'
      })
    }
  }),

  // 更新link
  update: protectedProcedure
    .input(
      updateLinkSchema.extend({
        id: z.number()
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updateFields } = input
      try {
        const result = await linkService.update(id, updateFields)
        return {
          success: true,
          data: result
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message || '更新link失败'
        })
      }
    }),

  // 删除link
  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    try {
      await linkService.delete(input.id)
      return {
        success: true,
        message: '删除成功'
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: error.message || '删除link失败'
      })
    }
  })
})
