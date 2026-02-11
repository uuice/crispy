import { protectedProcedure, router } from '../trpc'
import { tagService } from '../../services/tagService'
import { TRPCError } from '@trpc/server'
import { createTagSchema, tagFiltersSchema, updateTagSchema } from '@src/types'
import { z } from 'zod'

export const tagRouter = router({
  // 获取标签列表
  list: protectedProcedure
    .input(
      tagFiltersSchema.transform((data) => ({
        ...data,
        page: data.page,
        pageSize: data.pageSize
      }))
    )
    .query(async ({ input }) => {
      try {
        const result = await tagService.getTags(input)
        return {
          success: true,
          data: result
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || '获取标签列表失败'
        })
      }
    }),

  // 获取单个标签
  getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    try {
      const result = await tagService.getById(input.id)
      if (!result) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: '标签不存在'
        })
      }
      return {
        success: true,
        data: result
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || '获取标签失败'
      })
    }
  }),

  // 根据值获取标签
  getByValue: protectedProcedure.input(z.object({ value: z.string() })).query(async ({ input }) => {
    try {
      const result = await tagService.getTagByValue(input.value)
      if (!result) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: '标签不存在'
        })
      }
      return {
        success: true,
        data: result
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || '获取标签失败'
      })
    }
  }),

  // 创建标签
  create: protectedProcedure.input(createTagSchema).mutation(async ({ input }) => {
    try {
      const result = await tagService.create(input)
      return {
        success: true,
        data: result
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: error.message || '创建标签失败'
      })
    }
  }),

  // 更新标签
  update: protectedProcedure
    .input(
      updateTagSchema.extend({
        id: z.number()
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updateFields } = input
      try {
        const result = await tagService.update(id, updateFields)
        return {
          success: true,
          data: result
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message || '更新标签失败'
        })
      }
    }),

  // 删除标签
  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    try {
      await tagService.delete(input.id)
      return {
        success: true,
        message: '删除成功'
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: error.message || '删除标签失败'
      })
    }
  })
})
