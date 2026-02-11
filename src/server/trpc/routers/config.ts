import { protectedProcedure, router } from '../trpc'
import { configService } from '../../services/configService'
import { TRPCError } from '@trpc/server'
import { configFiltersSchema, createConfigSchema, updateConfigSchema } from '@src/types'
import { z } from 'zod'

export const configRouter = router({
  // 获取config列表
  list: protectedProcedure
    .input(
      configFiltersSchema.transform((data) => ({
        ...data,
        page: data.page,
        pageSize: data.pageSize
      }))
    )
    .query(async ({ input }) => {
      try {
        const result = await configService.getConfigs(input)
        return {
          success: true,
          data: result
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || '获取config列表失败'
        })
      }
    }),

  // 获取单个config
  getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    try {
      const result = await configService.getById(input.id)
      if (!result) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'config不存在'
        })
      }
      return {
        success: true,
        data: result
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || '获取config失败'
      })
    }
  }),

  // 创建config
  create: protectedProcedure.input(createConfigSchema).mutation(async ({ input }) => {
    try {
      const result = await configService.create(input)
      return {
        success: true,
        data: result
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: error.message || '创建config失败'
      })
    }
  }),

  // 更新config
  update: protectedProcedure
    .input(
      updateConfigSchema.extend({
        id: z.number()
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updateFields } = input
      try {
        const result = await configService.update(id, updateFields)
        return {
          success: true,
          data: result
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message || '更新config失败'
        })
      }
    }),

  // 删除config
  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    try {
      await configService.delete(input.id)
      return {
        success: true,
        message: '删除成功'
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: error.message || '删除config失败'
      })
    }
  })
})
