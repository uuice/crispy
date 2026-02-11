import { protectedProcedure, router } from '../trpc'
import { ruleService } from '../../services/ruleService'
import { TRPCError } from '@trpc/server'
import { createRuleSchema, ruleFiltersSchema, updateRuleSchema } from '@src/types'
import { z } from 'zod'

export const ruleRouter = router({
  // 获取rule列表
  list: protectedProcedure
    .input(
      ruleFiltersSchema.transform((data) => ({
        ...data,
        page: data.page,
        pageSize: data.pageSize
      }))
    )
    .query(async ({ input }) => {
      try {
        const result = await ruleService.getRules(input)
        return {
          success: true,
          data: result
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || '获取rule列表失败'
        })
      }
    }),

  // 获取单个rule
  getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    try {
      const result = await ruleService.getById(input.id)
      if (!result) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'rule不存在'
        })
      }
      return {
        success: true,
        data: result
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || '获取rule失败'
      })
    }
  }),

  // 创建rule
  create: protectedProcedure.input(createRuleSchema).mutation(async ({ input }) => {
    try {
      const result = await ruleService.create(input)
      return {
        success: true,
        data: result
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: error.message || '创建rule失败'
      })
    }
  }),

  // 更新rule
  update: protectedProcedure
    .input(
      updateRuleSchema.extend({
        id: z.number()
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updateFields } = input
      try {
        const result = await ruleService.update(id, updateFields)
        return {
          success: true,
          data: result
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message || '更新rule失败'
        })
      }
    }),

  // 删除rule
  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    try {
      await ruleService.delete(input.id)
      return {
        success: true,
        message: '删除成功'
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: error.message || '删除rule失败'
      })
    }
  })
})
