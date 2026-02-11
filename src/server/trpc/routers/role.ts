import { protectedProcedure, router } from '../trpc'
import { roleService } from '../../services/roleService'
import { TRPCError } from '@trpc/server'
import { createRoleSchema, roleFiltersSchema, updateRoleSchema } from '@src/types'
import { z } from 'zod'

export const roleRouter = router({
  // 获取role列表
  list: protectedProcedure
    .input(
      roleFiltersSchema.transform((data) => ({
        ...data,
        page: data.page,
        pageSize: data.pageSize
      }))
    )
    .query(async ({ input }) => {
      try {
        const result = await roleService.getRoles(input)
        return {
          success: true,
          data: result
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || '获取role列表失败'
        })
      }
    }),

  // 获取单个role
  getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    try {
      const result = await roleService.getById(input.id)
      if (!result) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'role不存在'
        })
      }
      return {
        success: true,
        data: result
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || '获取role失败'
      })
    }
  }),

  // 创建role
  create: protectedProcedure.input(createRoleSchema).mutation(async ({ input }) => {
    try {
      const result = await roleService.create(input)
      return {
        success: true,
        data: result
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: error.message || '创建role失败'
      })
    }
  }),

  // 更新role
  update: protectedProcedure
    .input(
      updateRoleSchema.extend({
        id: z.number()
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updateFields } = input
      try {
        const result = await roleService.update(id, updateFields)
        return {
          success: true,
          data: result
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message || '更新role失败'
        })
      }
    }),

  // 删除role
  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    try {
      await roleService.delete(input.id)
      return {
        success: true,
        message: '删除成功'
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: error.message || '删除role失败'
      })
    }
  })
})
