import { protectedProcedure, router } from '../trpc'
import { jobService } from '../../services/jobService'
import { TRPCError } from '@trpc/server'
import { createJobSchema, jobFiltersSchema, updateJobSchema } from '@src/types'
import { z } from 'zod'

export const jobRouter = router({
  // 获取job列表
  list: protectedProcedure
    .input(
      jobFiltersSchema.transform((data) => ({
        ...data,
        page: data.page,
        pageSize: data.pageSize
      }))
    )
    .query(async ({ input }) => {
      try {
        const result = await jobService.getJobs(input)
        return {
          success: true,
          data: result
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || '获取job列表失败'
        })
      }
    }),

  // 获取单个job
  getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    try {
      const result = await jobService.getById(input.id)
      if (!result) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'job不存在'
        })
      }
      return {
        success: true,
        data: result
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || '获取job失败'
      })
    }
  }),

  // 创建job
  create: protectedProcedure.input(createJobSchema).mutation(async ({ input }) => {
    try {
      const result = await jobService.create(input)
      return {
        success: true,
        data: result
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: error.message || '创建job失败'
      })
    }
  }),

  // 更新job
  update: protectedProcedure
    .input(
      updateJobSchema.extend({
        id: z.number()
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updateFields } = input
      try {
        const result = await jobService.update(id, updateFields)
        return {
          success: true,
          data: result
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message || '更新job失败'
        })
      }
    }),

  // 删除job
  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    try {
      await jobService.delete(input.id)
      return {
        success: true,
        message: '删除成功'
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: error.message || '删除job失败'
      })
    }
  })
})
