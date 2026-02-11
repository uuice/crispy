import { protectedProcedure, router } from '../trpc'
import { menuService } from '../../services/menuService'
import { TRPCError } from '@trpc/server'
import { createMenuSchema, menuFiltersSchema, updateMenuSchema } from '@src/types'
import { z } from 'zod'

export const menuRouter = router({
  // 获取menu列表
  list: protectedProcedure
    .input(
      menuFiltersSchema.transform((data) => ({
        ...data,
        page: data.page,
        pageSize: data.pageSize
      }))
    )
    .query(async ({ input }) => {
      try {
        const result = await menuService.getMenus(input)
        return {
          success: true,
          data: result
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || '获取menu列表失败'
        })
      }
    }),

  // 获取单个menu
  getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    try {
      const result = await menuService.getById(input.id)
      if (!result) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'menu不存在'
        })
      }
      return {
        success: true,
        data: result
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || '获取menu失败'
      })
    }
  }),

  // 创建menu
  create: protectedProcedure.input(createMenuSchema).mutation(async ({ input }) => {
    try {
      const result = await menuService.create(input)
      return {
        success: true,
        data: result
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: error.message || '创建menu失败'
      })
    }
  }),

  // 更新menu
  update: protectedProcedure
    .input(
      updateMenuSchema.extend({
        id: z.number()
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updateFields } = input
      try {
        const result = await menuService.update(id, updateFields)
        return {
          success: true,
          data: result
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message || '更新menu失败'
        })
      }
    }),

  // 删除menu
  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    try {
      await menuService.delete(input.id)
      return {
        success: true,
        message: '删除成功'
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: error.message || '删除menu失败'
      })
    }
  })
})
