import { initTRPC } from '@trpc/server'
import { createContext } from './context'
import { tokenProtectedProcedure } from './trpc'

// Import services
import { userService } from '../services/userService'
import { articleService } from '../services/articleService'
import { categoryService } from '../services/categoryService'
import { tagService } from '../services/tagService'
import { commentService } from '../services/commentService'
import { configService } from '../services/configService'
import { linkService } from '../services/linkService'
import { menuService } from '../services/menuService'
import { pageService } from '../services/pageService'
import { adService } from '../services/adService'
import { adItemService } from '../services/adItemService'
import { roleService } from '../services/roleService'
import { ruleService } from '../services/ruleService'
import { userTypeService } from '../services/userTypeService'
import { attrService } from '../services/attrService'
import { cacheService } from '../services/cacheService'
import { enumService } from '../services/enumService'
import { holidayService } from '../services/holidayService'
import { jobService } from '../services/jobService'
import { keywordService } from '../services/keywordService'
import { noticeService } from '../services/noticeService'
import { operateLogService } from '../services/operateLogService'
import { apiLogService } from '../services/apiLogService'
import { accessTokenService } from '../services/accessToken.Service'

// 初始化 tRPC 实例，使用 token 认证
const t = initTRPC.context<typeof createContext>().create()

// Content 路由的公共用户模块
export const publicUserRouter = t.router({
  // 获取用户列表
  list: tokenProtectedProcedure.query(async ({ input }: any) => {
    try {
      const page = Number(input?.page) || 1
      const pageSize = Number(input?.pageSize) || 10
      const filters = { ...input, page, pageSize }
      const result = await userService.getUsers(filters)
      return {
        success: true,
        data: result.dataList,
        pagination: result.pagination
      }
    } catch (error) {
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : '获取用户列表失败'
      }
    }
  }),

  // 获取单个用户
  getById: tokenProtectedProcedure.query(async ({ input }: any) => {
    try {
      const user = await userService.getById(Number(input?.id))
      return {
        success: true,
        data: user
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : '获取用户失败'
      }
    }
  })
})

// Content 路由的公共文章模块
export const publicArticleRouter = t.router({
  // 获取文章列表
  list: tokenProtectedProcedure.query(async ({ input }: any) => {
    try {
      const page = Number(input?.page) || 1
      const pageSize = Number(input?.pageSize) || 10
      const filters = { ...input, page, pageSize }
      const result = await articleService.getArticles(filters)
      return {
        success: true,
        data: result.dataList,
        pagination: result.pagination
      }
    } catch (error) {
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : '获取文章列表失败'
      }
    }
  }),

  // 获取单个文章
  getById: tokenProtectedProcedure.query(async ({ input }: any) => {
    try {
      const article = await articleService.getById(Number(input?.id))
      return {
        success: true,
        data: article
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : '获取文章失败'
      }
    }
  }),

  // 根据 URL 获取文章
  getByUrl: tokenProtectedProcedure.query(async ({ input }: any) => {
    try {
      const article = await articleService.getArticleByUrl(input?.url)
      return {
        success: true,
        data: article
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : '获取文章失败'
      }
    }
  })
})

// Content 路由的公共分类模块
export const publicCategoryRouter = t.router({
  // 获取分类列表
  list: tokenProtectedProcedure.query(async ({ input }: any) => {
    try {
      const page = Number(input?.page) || 1
      const pageSize = Number(input?.pageSize) || 10
      const filters = { ...input, page, pageSize }
      const result = await categoryService.getCategories(filters)
      return {
        success: true,
        data: result.dataList,
        pagination: result.pagination
      }
    } catch (error) {
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : '获取分类列表失败'
      }
    }
  }),

  // 获取分类树形结构
  tree: tokenProtectedProcedure.query(async () => {
    try {
      const tree = await categoryService.getCategoryTree()
      return {
        success: true,
        data: tree
      }
    } catch (error) {
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : '获取分类树失败'
      }
    }
  }),

  // 获取带文章计数的分类
  withCount: tokenProtectedProcedure.query(async ({ input }: any) => {
    try {
      const categories = await categoryService.getCategoriesWithArticleCount(input?.parentAlias)
      return {
        success: true,
        data: categories
      }
    } catch (error) {
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : '获取分类计数失败'
      }
    }
  }),

  // 获取单个分类
  getById: tokenProtectedProcedure.query(async ({ input }: any) => {
    try {
      const category = await categoryService.getCategoryById(Number(input?.id))
      return {
        success: true,
        data: category
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : '获取分类失败'
      }
    }
  }),

  // 根据别名获取分类
  getByAlias: tokenProtectedProcedure.query(async ({ input }: any) => {
    try {
      const category = await categoryService.getCategoryByAlias(input?.alias)
      return {
        success: true,
        data: category
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : '获取分类失败'
      }
    }
  })
})

// Content 路由的公共标签模块
export const publicTagRouter = t.router({
  // 获取标签列表
  list: tokenProtectedProcedure.query(async ({ input }: any) => {
    try {
      const page = Number(input?.page) || 1
      const pageSize = Number(input?.pageSize) || 10
      const filters = { ...input, page, pageSize }
      const result = await tagService.getTags(filters)
      return {
        success: true,
        data: result.dataList,
        pagination: result.pagination
      }
    } catch (error) {
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : '获取标签列表失败'
      }
    }
  }),

  // 获取单个标签
  getById: tokenProtectedProcedure.query(async ({ input }: any) => {
    try {
      const tag = await tagService.getById(Number(input?.id))
      return {
        success: true,
        data: tag
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : '获取标签失败'
      }
    }
  }),

  // 根据值获取标签
  getByValue: tokenProtectedProcedure.query(async ({ input }: any) => {
    try {
      const tag = await tagService.getTagByValue(input?.value)
      return {
        success: true,
        data: tag
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : '获取标签失败'
      }
    }
  })
})

// Content 路由的公共评论模块
export const publicCommentRouter = t.router({
  // 获取评论列表
  list: tokenProtectedProcedure.query(async ({ input }: any) => {
    try {
      const page = Number(input?.page) || 1
      const pageSize = Number(input?.pageSize) || 10
      const filters = { ...input, page, pageSize }
      const result = await commentService.getComments(filters)
      return {
        success: true,
        data: result.dataList,
        pagination: result.pagination
      }
    } catch (error) {
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : '获取评论列表失败'
      }
    }
  }),

  // 获取单个评论
  getById: tokenProtectedProcedure.query(async ({ input }: any) => {
    try {
      const comment = await commentService.getById(Number(input?.id))
      return {
        success: true,
        data: comment
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : '获取评论失败'
      }
    }
  })
})

// Content 路由的公共配置模块
export const publicConfigRouter = t.router({
  // 获取配置列表
  list: tokenProtectedProcedure.query(async ({ input }: any) => {
    try {
      const page = Number(input?.page) || 1
      const pageSize = Number(input?.pageSize) || 10
      const filters = { ...input, page, pageSize }
      const result = await configService.getConfigs(filters)
      return {
        success: true,
        data: result.dataList,
        pagination: result.pagination
      }
    } catch (error) {
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : '获取配置列表失败'
      }
    }
  }),

  // 获取单个配置
  getById: tokenProtectedProcedure.query(async ({ input }: any) => {
    try {
      const config = await configService.getById(Number(input?.id))
      return {
        success: true,
        data: config
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : '获取配置失败'
      }
    }
  }),

  // 根据别名获取配置
  getByAlias: tokenProtectedProcedure.query(async ({ input }: any) => {
    try {
      const config = await configService.getConfigByAlias(input?.alias)
      return {
        success: true,
        data: config
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : '获取配置失败'
      }
    }
  }),

  // 获取站点设置
  siteSettings: tokenProtectedProcedure.query(async () => {
    try {
      // TODO: 实现获取站点设置逻辑
      return {
        success: true,
        data: {
          siteName: 'Crispy CMS',
          siteDescription: '现代化的内容管理系统',
          siteKeywords: 'CMS,内容管理,博客系统'
        }
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : '获取站点设置失败'
      }
    }
  })
})

// Content 主路由器 - 包含所有公共模块
export const contentRouter = t.router({
  // 用户相关模块
  publicUser: publicUserRouter,
  // 文章相关模块
  publicArticle: publicArticleRouter,
  // 分类相关模块
  publicCategory: publicCategoryRouter,
  // 标签相关模块
  publicTag: publicTagRouter,
  // 评论相关模块
  publicComment: publicCommentRouter,
  // 配置相关模块
  publicConfig: publicConfigRouter
  // 其他模块可以根据需要继续添加...
})

// 导出类型定义
export type ContentRouter = typeof contentRouter
