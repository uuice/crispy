import { router, protectedProcedure } from '../trpc'
import { categoryService } from '../../services/categoryService'
import { TRPCError } from '@trpc/server'
import { createCategorySchema, updateCategorySchema, categoryFiltersSchema } from '@src/types'
import { z } from 'zod'

export const categoryRouter = router({
  // 获取分类列表
  list: protectedProcedure.input(categoryFiltersSchema).query(async ({ input }) => {
    try {
      const result = await categoryService.getCategories(input)
      return {
        success: true,
        data: result
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || '获取分类列表失败'
      })
    }
  }),

  // 获取分类树形结构
  tree: protectedProcedure
    .input(
      z.object({
        id: z.number().optional(),
        alias: z.string().optional()
      })
    )
    .query(async ({ input }) => {
      try {
        const tree = await categoryService.getCategoryTree({
          rootId: input.id,
          rootAlias: input.alias
        })
        return {
          success: true,
          data: tree
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || '获取分类树失败'
        })
      }
    }),

  // 获取单个分类
  getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    try {
      const result = await categoryService.getCategoryById(input.id)
      if (!result) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: '分类不存在'
        })
      }
      return {
        success: true,
        data: result
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || '获取分类失败'
      })
    }
  }),

  // 创建分类
  create: protectedProcedure.input(createCategorySchema).mutation(async ({ input }) => {
    try {
      // 确保 des 字段有默认值
      const createData = {
        ...input,
        des: input.des || ''
      }
      const result = await categoryService.create(createData)
      return {
        success: true,
        data: result
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: error.message || '创建分类失败'
      })
    }
  }),

  // 更新分类
  update: protectedProcedure
    .input(
      updateCategorySchema.extend({
        id: z.number()
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updateFields } = input
      try {
        const result = await categoryService.update(id, updateFields)
        return {
          success: true,
          data: result
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message || '更新分类失败'
        })
      }
    }),

  // 删除分类
  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    try {
      await categoryService.delete(input.id)
      return {
        success: true,
        message: '删除成功'
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: error.message || '删除分类失败'
      })
    }
  })
})
