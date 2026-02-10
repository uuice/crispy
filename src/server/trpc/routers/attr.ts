import { router, protectedProcedure } from '../trpc'
import { attrService } from '../../services/attrService'
import { TRPCError } from '@trpc/server'
import {
  createAttrSchema,
  updateAttrSchema,
  commonFiltersSchema,
  attrFiltersSchema
} from '@src/types'
import { z } from 'zod'

export const attrRouter = router({
  // 获取attr列表
  list: protectedProcedure
    .input(
      attrFiltersSchema.transform((data) => ({
        ...data,
        page: data.page,
        pageSize: data.pageSize
      }))
    )
    .query(async ({ input }) => {
      try {
        const result = await attrService.getAttrs(input)
        return {
          success: true,
          data: result
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || '获取attr列表失败'
        })
      }
    }),

  // 获取单个attr
  getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    try {
      const result = await attrService.getById(input.id)
      if (!result) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'attr不存在'
        })
      }
      return {
        success: true,
        data: result
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || '获取attr失败'
      })
    }
  }),

  // 创建attr
  create: protectedProcedure.input(createAttrSchema).mutation(async ({ input }) => {
    try {
      const result = await attrService.create(input)
      return {
        success: true,
        data: result
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: error.message || '创建attr失败'
      })
    }
  }),

  // 更新attr
  update: protectedProcedure
    .input(
      updateAttrSchema.extend({
        id: z.number()
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updateFields } = input
      try {
        const result = await attrService.update(id, updateFields)
        return {
          success: true,
          data: result
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message || '更新attr失败'
        })
      }
    }),

  // 删除attr
  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    try {
      await attrService.delete(input.id)
      return {
        success: true,
        message: '删除成功'
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: error.message || '删除attr失败'
      })
    }
  })
})
