import { protectedProcedure, router } from '../trpc'
import { holidayService } from '../../services/holidayService'
import { TRPCError } from '@trpc/server'
import { createHolidaySchema, holidayFiltersSchema, updateHolidaySchema } from '@src/types'
import { z } from 'zod'

export const holidayRouter = router({
  // 获取holiday列表
  list: protectedProcedure
    .input(
      holidayFiltersSchema.transform((data) => ({
        ...data,
        page: data.page,
        pageSize: data.pageSize
      }))
    )
    .query(async ({ input }) => {
      try {
        const result = await holidayService.getHolidays(input)
        return {
          success: true,
          data: result
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || '获取holiday列表失败'
        })
      }
    }),

  // 获取单个holiday
  getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    try {
      const result = await holidayService.getById(input.id)
      if (!result) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'holiday不存在'
        })
      }
      return {
        success: true,
        data: result
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || '获取holiday失败'
      })
    }
  }),

  // 创建holiday
  create: protectedProcedure.input(createHolidaySchema).mutation(async ({ input }) => {
    try {
      const result = await holidayService.create(input)
      return {
        success: true,
        data: result
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: error.message || '创建holiday失败'
      })
    }
  }),

  // 更新holiday
  update: protectedProcedure
    .input(
      updateHolidaySchema.extend({
        id: z.number()
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updateFields } = input
      try {
        const result = await holidayService.update(id, updateFields)
        return {
          success: true,
          data: result
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message || '更新holiday失败'
        })
      }
    }),

  // 删除holiday
  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    try {
      await holidayService.delete(input.id)
      return {
        success: true,
        message: '删除成功'
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: error.message || '删除holiday失败'
      })
    }
  })
})
