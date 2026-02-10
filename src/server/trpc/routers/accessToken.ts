import { router, protectedProcedure } from '../trpc'
import { accessTokenService } from '../../services/accessToken.Service'
import { TRPCError } from '@trpc/server'
import {
  createAccessTokenSchema,
  updateAccessTokenSchema,
  accessTokenFiltersSchema
} from '@src/types'
import { z } from 'zod'
import { generateRandomToken } from '@src/server/utils/token'

export const accessTokenRouter = router({
  // 获取accessToken列表
  list: protectedProcedure.input(accessTokenFiltersSchema).query(async ({ input }) => {
    try {
      const result = await accessTokenService.getAccessTokens(input)
      return {
        success: true,
        data: result
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || '获取accessToken列表失败'
      })
    }
  }),

  // 获取单个accessToken
  getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    try {
      const result = await accessTokenService.getById(input.id)
      if (!result) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'accessToken不存在'
        })
      }
      return {
        success: true,
        data: result
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || '获取accessToken失败'
      })
    }
  }),

  // 创建accessToken
  create: protectedProcedure.input(createAccessTokenSchema).mutation(async ({ input }) => {
    try {
      const randomToken = generateRandomToken()
      const result = await accessTokenService.create({
        ...input,
        token: randomToken
      })
      return {
        success: true,
        data: result
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: error.message || '创建accessToken失败'
      })
    }
  }),

  // 更新accessToken
  update: protectedProcedure
    .input(
      updateAccessTokenSchema.extend({
        id: z.number()
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updateFields } = input
      try {
        const result = await accessTokenService.update(id, updateFields)
        return {
          success: true,
          data: result
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message || '更新accessToken失败'
        })
      }
    }),

  // 删除accessToken
  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    try {
      await accessTokenService.delete(input.id)
      return {
        success: true,
        message: '删除成功'
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: error.message || '删除accessToken失败'
      })
    }
  })
})
