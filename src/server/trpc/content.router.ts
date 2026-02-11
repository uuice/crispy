import { initTRPC, TRPCError } from '@trpc/server'
import { createContext } from './context'
import { tokenProtectedProcedure } from './trpc'
import { z } from 'zod'

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

// Import Zod schemas from index.ts
import {
  articleFiltersSchema,
  categoryFiltersSchema,
  commentFiltersSchema,
  configFiltersSchema,
  tagFiltersSchema,
  userFiltersSchema,
  adFiltersSchema,
  adItemFiltersSchema,
  linkFiltersSchema,
  menuFiltersSchema,
  pageFiltersSchema,
  roleFiltersSchema,
  ruleFiltersSchema,
  userTypeFiltersSchema,
  attrFiltersSchema,
  cacheFiltersSchema,
  enumFiltersSchema,
  holidayFiltersSchema,
  jobFiltersSchema,
  keywordFiltersSchema,
  noticeFiltersSchema,
  operateLogFiltersSchema,
  apiLogFiltersSchema
} from '@src/types'

// 初始化 tRPC 实例，使用 token 认证
const t = initTRPC.context<typeof createContext>().create()

// Content 路由的公共用户模块
export const publicUserRouter = t.router({
  // 获取用户列表
  list: tokenProtectedProcedure
    .input(
      userFiltersSchema.transform((data) => ({
        ...data,
        page: data.page,
        pageSize: data.pageSize
      }))
    )
    .query(async ({ input }) => {
      try {
        const result = await userService.getUsers(input)
        return {
          success: true,
          data: result.dataList,
          pagination: result.pagination
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || '获取用户列表失败'
        })
      }
    }),

  // 获取单个用户
  getById: tokenProtectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    try {
      const user = await userService.getById(input.id)
      return {
        success: true,
        data: user
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || '获取用户失败'
      })
    }
  })
})

// Content 路由的公共文章模块
export const publicArticleRouter = t.router({
  // 获取文章列表
  list: tokenProtectedProcedure
    .input(
      articleFiltersSchema.transform((data) => ({
        ...data,
        page: data.page,
        pageSize: data.pageSize
      }))
    )
    .query(async ({ input }) => {
      try {
        const result = await articleService.getArticles(input)
        return {
          success: true,
          data: result.dataList,
          pagination: result.pagination
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || '获取文章列表失败'
        })
      }
    }),

  // 获取单个文章
  getById: tokenProtectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    try {
      const article = await articleService.getById(input.id)
      return {
        success: true,
        data: article
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || '获取文章失败'
      })
    }
  }),

  // 根据 URL 获取文章
  getByUrl: tokenProtectedProcedure
    .input(z.object({ url: z.string() }))
    .query(async ({ input }) => {
      try {
        const article = await articleService.getArticleByUrl(input.url)
        return {
          success: true,
          data: article
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || '获取文章失败'
        })
      }
    })
})

// Content 路由的公共分类模块
export const publicCategoryRouter = t.router({
  // 获取分类列表
  list: tokenProtectedProcedure
    .input(
      categoryFiltersSchema.transform((data) => ({
        ...data,
        page: data.page,
        pageSize: data.pageSize
      }))
    )
    .query(async ({ input }) => {
      try {
        const result = await categoryService.getCategories(input)
        return {
          success: true,
          data: result.dataList,
          pagination: result.pagination
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || '获取分类列表失败'
        })
      }
    }),

  // 获取分类树形结构
  tree: tokenProtectedProcedure
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

  // 获取带文章计数的分类
  withCount: tokenProtectedProcedure
    .input(z.object({ parentAlias: z.string().optional() }))
    .query(async ({ input }) => {
      try {
        const categories = await categoryService.getCategoriesWithArticleCount(input.parentAlias)
        return {
          success: true,
          data: categories
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || '获取分类计数失败'
        })
      }
    }),

  // 获取单个分类
  getById: tokenProtectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    try {
      const category = await categoryService.getCategoryById(input.id)
      return {
        success: true,
        data: category
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || '获取分类失败'
      })
    }
  }),

  // 根据别名获取分类
  getByAlias: tokenProtectedProcedure
    .input(z.object({ alias: z.string() }))
    .query(async ({ input }) => {
      try {
        const category = await categoryService.getCategoryByAlias(input.alias)
        return {
          success: true,
          data: category
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || '获取分类失败'
        })
      }
    })
})

// Content 路由的公共标签模块
export const publicTagRouter = t.router({
  // 获取标签列表
  list: tokenProtectedProcedure
    .input(
      tagFiltersSchema.transform((data) => ({
        ...data,
        page: data.page,
        pageSize: data.pageSize
      }))
    )
    .query(async ({ input }) => {
      try {
        const result = await tagService.getTags(input)
        return {
          success: true,
          data: result.dataList,
          pagination: result.pagination
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || '获取标签列表失败'
        })
      }
    }),

  // 获取单个标签
  getById: tokenProtectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    try {
      const tag = await tagService.getById(input.id)
      return {
        success: true,
        data: tag
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || '获取标签失败'
      })
    }
  }),

  // 根据值获取标签
  getByValue: tokenProtectedProcedure
    .input(z.object({ value: z.string() }))
    .query(async ({ input }) => {
      try {
        const tag = await tagService.getTagByValue(input.value)
        return {
          success: true,
          data: tag
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || '获取标签失败'
        })
      }
    })
})

// Content 路由的公共评论模块
export const publicCommentRouter = t.router({
  // 获取评论列表
  list: tokenProtectedProcedure
    .input(
      commentFiltersSchema.transform((data) => ({
        ...data,
        page: data.page,
        pageSize: data.pageSize
      }))
    )
    .query(async ({ input }) => {
      try {
        const result = await commentService.getComments(input)
        return {
          success: true,
          data: result.dataList,
          pagination: result.pagination
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || '获取评论列表失败'
        })
      }
    }),

  // 获取单个评论
  getById: tokenProtectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    try {
      const comment = await commentService.getById(input.id)
      return {
        success: true,
        data: comment
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || '获取评论失败'
      })
    }
  })
})

// Content 路由的公共配置模块
export const publicConfigRouter = t.router({
  // 获取配置列表
  list: tokenProtectedProcedure
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
          data: result.dataList,
          pagination: result.pagination
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || '获取配置列表失败'
        })
      }
    }),

  // 获取单个配置
  getById: tokenProtectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    try {
      const config = await configService.getById(input.id)
      return {
        success: true,
        data: config
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || '获取配置失败'
      })
    }
  }),

  // 根据别名获取配置
  getByAlias: tokenProtectedProcedure
    .input(z.object({ alias: z.string() }))
    .query(async ({ input }) => {
      try {
        const config = await configService.getConfigByAlias(input.alias)
        return {
          success: true,
          data: config
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || '获取配置失败'
        })
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
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || '获取站点设置失败'
      })
    }
  })
})

// Content 路由的公共广告模块
export const publicAdRouter = t.router({
  // 获取广告列表
  list: tokenProtectedProcedure
    .input(
      adFiltersSchema.transform((data) => ({
        ...data,
        page: data.page,
        pageSize: data.pageSize
      }))
    )
    .query(async ({ input }) => {
      try {
        const result = await adService.getAds(input)
        return {
          success: true,
          data: result.dataList,
          pagination: result.pagination
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || '获取广告列表失败'
        })
      }
    }),

  // 获取单个广告
  getById: tokenProtectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    try {
      const ad = await adService.getById(input.id)
      return {
        success: true,
        data: ad
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || '获取广告失败'
      })
    }
  })
})

// Content 路由的公共广告项模块
export const publicAdItemRouter = t.router({
  // 获取广告项列表
  list: tokenProtectedProcedure
    .input(
      adItemFiltersSchema.transform((data) => ({
        ...data,
        page: data.page,
        pageSize: data.pageSize
      }))
    )
    .query(async ({ input }) => {
      try {
        const result = await adItemService.getAdItems(input)
        return {
          success: true,
          data: result.dataList,
          pagination: result.pagination
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || '获取广告项列表失败'
        })
      }
    }),

  // 获取单个广告项
  getById: tokenProtectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    try {
      const adItem = await adItemService.getById(input.id)
      return {
        success: true,
        data: adItem
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || '获取广告项失败'
      })
    }
  })
})

// Content 路由的公共链接模块
export const publicLinkRouter = t.router({
  // 获取链接列表
  list: tokenProtectedProcedure
    .input(
      linkFiltersSchema.transform((data) => ({
        ...data,
        page: data.page,
        pageSize: data.pageSize
      }))
    )
    .query(async ({ input }) => {
      try {
        const result = await linkService.getLinks(input)
        return {
          success: true,
          data: result.dataList,
          pagination: result.pagination
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || '获取链接列表失败'
        })
      }
    }),

  // 获取单个链接
  getById: tokenProtectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    try {
      const link = await linkService.getById(input.id)
      return {
        success: true,
        data: link
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || '获取链接失败'
      })
    }
  })
})

// Content 路由的公共菜单模块
export const publicMenuRouter = t.router({
  // 获取菜单列表
  list: tokenProtectedProcedure
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
          data: result.dataList,
          pagination: result.pagination
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || '获取菜单列表失败'
        })
      }
    }),

  // 获取菜单树形结构
  tree: tokenProtectedProcedure.query(async () => {
    try {
      const tree = await menuService.getMenuTree()
      return {
        success: true,
        data: tree
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || '获取菜单树失败'
      })
    }
  }),

  // 获取单个菜单
  getById: tokenProtectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    try {
      const menu = await menuService.getById(input.id)
      return {
        success: true,
        data: menu
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || '获取菜单失败'
      })
    }
  })
})

// Content 路由的公共页面模块
export const publicPageRouter = t.router({
  // 获取页面列表
  list: tokenProtectedProcedure
    .input(
      pageFiltersSchema.transform((data) => ({
        ...data,
        page: data.page,
        pageSize: data.pageSize
      }))
    )
    .query(async ({ input }) => {
      try {
        const result = await pageService.getPages(input)
        return {
          success: true,
          data: result.dataList,
          pagination: result.pagination
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || '获取页面列表失败'
        })
      }
    }),

  // 获取单个页面
  getById: tokenProtectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    try {
      const page = await pageService.getById(input.id)
      return {
        success: true,
        data: page
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || '获取页面失败'
      })
    }
  }),

  // 根据别名获取页面
  getByAlias: tokenProtectedProcedure
    .input(z.object({ alias: z.string() }))
    .query(async ({ input }) => {
      try {
        const page = await pageService.getPageByAlias(input.alias)
        return {
          success: true,
          data: page
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || '获取页面失败'
        })
      }
    })
})

// Content 路由的公共角色模块
export const publicRoleRouter = t.router({
  // 获取角色列表
  list: tokenProtectedProcedure
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
          data: result.dataList,
          pagination: result.pagination
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || '获取角色列表失败'
        })
      }
    }),

  // 获取单个角色
  getById: tokenProtectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    try {
      const role = await roleService.getById(input.id)
      return {
        success: true,
        data: role
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || '获取角色失败'
      })
    }
  })
})

// Content 路由的公共规则模块
export const publicRuleRouter = t.router({
  // 获取规则列表
  list: tokenProtectedProcedure
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
          data: result.dataList,
          pagination: result.pagination
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || '获取规则列表失败'
        })
      }
    }),

  // 获取规则树形结构
  tree: tokenProtectedProcedure.query(async () => {
    try {
      const tree = await ruleService.getRuleTree()
      return {
        success: true,
        data: tree
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || '获取规则树失败'
      })
    }
  }),

  // 获取单个规则
  getById: tokenProtectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    try {
      const rule = await ruleService.getById(input.id)
      return {
        success: true,
        data: rule
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || '获取规则失败'
      })
    }
  })
})

// Content 路由的公共用户类型模块
export const publicUserTypeRouter = t.router({
  // 获取用户类型列表
  list: tokenProtectedProcedure
    .input(
      userTypeFiltersSchema.transform((data) => ({
        ...data,
        page: data.page,
        pageSize: data.pageSize
      }))
    )
    .query(async ({ input }) => {
      try {
        const result = await userTypeService.getUserTypes(input)
        return {
          success: true,
          data: result.dataList,
          pagination: result.pagination
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || '获取用户类型列表失败'
        })
      }
    }),

  // 获取单个用户类型
  getById: tokenProtectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    try {
      const userType = await userTypeService.getById(input.id)
      return {
        success: true,
        data: userType
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || '获取用户类型失败'
      })
    }
  })
})

// Content 路由的公共属性模块
export const publicAttrRouter = t.router({
  // 获取属性列表
  list: tokenProtectedProcedure
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
          data: result.dataList,
          pagination: result.pagination
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || '获取属性列表失败'
        })
      }
    }),

  // 获取单个属性
  getById: tokenProtectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    try {
      const attr = await attrService.getById(input.id)
      return {
        success: true,
        data: attr
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || '获取属性失败'
      })
    }
  })
})

// Content 路由的公共缓存模块
export const publicCacheRouter = t.router({
  // 获取缓存列表
  list: tokenProtectedProcedure
    .input(
      cacheFiltersSchema.transform((data) => ({
        ...data,
        page: data.page,
        pageSize: data.pageSize
      }))
    )
    .query(async ({ input }) => {
      try {
        const result = await cacheService.getCaches(input)
        return {
          success: true,
          data: result.dataList,
          pagination: result.pagination
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || '获取缓存列表失败'
        })
      }
    }),

  // 获取单个缓存
  getById: tokenProtectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    try {
      const cache = await cacheService.getById(input.id)
      return {
        success: true,
        data: cache
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || '获取缓存失败'
      })
    }
  })
})

// Content 路由的公共枚举模块
export const publicEnumRouter = t.router({
  // 获取枚举列表
  list: tokenProtectedProcedure
    .input(
      enumFiltersSchema.transform((data) => ({
        ...data,
        page: data.page,
        pageSize: data.pageSize
      }))
    )
    .query(async ({ input }) => {
      try {
        const result = await enumService.getEnums(input)
        return {
          success: true,
          data: result.dataList,
          pagination: result.pagination
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || '获取枚举列表失败'
        })
      }
    }),

  // 获取单个枚举
  getById: tokenProtectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    try {
      const enumItem = await enumService.getById(input.id)
      return {
        success: true,
        data: enumItem
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || '获取枚举失败'
      })
    }
  })
})

// Content 路由的公共节假日模块
export const publicHolidayRouter = t.router({
  // 获取节假日列表
  list: tokenProtectedProcedure
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
          data: result.dataList,
          pagination: result.pagination
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || '获取节假日列表失败'
        })
      }
    }),

  // 获取单个节假日
  getById: tokenProtectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    try {
      const holiday = await holidayService.getById(input.id)
      return {
        success: true,
        data: holiday
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || '获取节假日失败'
      })
    }
  })
})

// Content 路由的公共任务模块
export const publicJobRouter = t.router({
  // 获取任务列表
  list: tokenProtectedProcedure
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
          data: result.dataList,
          pagination: result.pagination
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || '获取任务列表失败'
        })
      }
    }),

  // 获取单个任务
  getById: tokenProtectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    try {
      const job = await jobService.getById(input.id)
      return {
        success: true,
        data: job
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || '获取任务失败'
      })
    }
  })
})

// Content 路由的公共关键词模块
export const publicKeywordRouter = t.router({
  // 获取关键词列表
  list: tokenProtectedProcedure
    .input(
      keywordFiltersSchema.transform((data) => ({
        ...data,
        page: data.page,
        pageSize: data.pageSize
      }))
    )
    .query(async ({ input }) => {
      try {
        const result = await keywordService.getKeywords(input)
        return {
          success: true,
          data: result.dataList,
          pagination: result.pagination
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || '获取关键词列表失败'
        })
      }
    }),

  // 获取单个关键词
  getById: tokenProtectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    try {
      const keyword = await keywordService.getById(input.id)
      return {
        success: true,
        data: keyword
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || '获取关键词失败'
      })
    }
  })
})

// Content 路由的公共通知模块
export const publicNoticeRouter = t.router({
  // 获取通知列表
  list: tokenProtectedProcedure
    .input(
      noticeFiltersSchema.transform((data) => ({
        ...data,
        page: data.page,
        pageSize: data.pageSize
      }))
    )
    .query(async ({ input }) => {
      try {
        const result = await noticeService.getNotices(input)
        return {
          success: true,
          data: result.dataList,
          pagination: result.pagination
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || '获取通知列表失败'
        })
      }
    }),

  // 获取单个通知
  getById: tokenProtectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    try {
      const notice = await noticeService.getById(input.id)
      return {
        success: true,
        data: notice
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || '获取通知失败'
      })
    }
  })
})

// Content 路由的公共操作日志模块
export const publicOperateLogRouter = t.router({
  // 获取操作日志列表
  list: tokenProtectedProcedure
    .input(
      operateLogFiltersSchema.transform((data) => ({
        ...data,
        page: data.page,
        pageSize: data.pageSize
      }))
    )
    .query(async ({ input }) => {
      try {
        const result = await operateLogService.getOperateLogs(input)
        return {
          success: true,
          data: result.dataList,
          pagination: result.pagination
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || '获取操作日志列表失败'
        })
      }
    }),

  // 获取单个操作日志
  getById: tokenProtectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    try {
      const operateLog = await operateLogService.getById(input.id)
      return {
        success: true,
        data: operateLog
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || '获取操作日志失败'
      })
    }
  })
})

// Content 路由的公共API日志模块
export const publicApiLogRouter = t.router({
  // 获取API日志列表
  list: tokenProtectedProcedure
    .input(
      apiLogFiltersSchema.transform((data) => ({
        ...data,
        page: data.page,
        pageSize: data.pageSize
      }))
    )
    .query(async ({ input }) => {
      try {
        const result = await apiLogService.getApiLogs(input)
        return {
          success: true,
          data: result.dataList,
          pagination: result.pagination
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || '获取API日志列表失败'
        })
      }
    }),

  // 获取单个API日志
  getById: tokenProtectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    try {
      const apiLog = await apiLogService.getById(input.id)
      return {
        success: true,
        data: apiLog
      }
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || '获取API日志失败'
      })
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
  publicConfig: publicConfigRouter,
  // 广告相关模块
  publicAd: publicAdRouter,
  // 广告项相关模块
  publicAdItem: publicAdItemRouter,
  // 链接相关模块
  publicLink: publicLinkRouter,
  // 菜单相关模块
  publicMenu: publicMenuRouter,
  // 页面相关模块
  publicPage: publicPageRouter,
  // 角色相关模块
  publicRole: publicRoleRouter,
  // 规则相关模块
  publicRule: publicRuleRouter,
  // 用户类型相关模块
  publicUserType: publicUserTypeRouter,
  // 属性相关模块
  publicAttr: publicAttrRouter,
  // 缓存相关模块
  publicCache: publicCacheRouter,
  // 枚举相关模块
  publicEnum: publicEnumRouter,
  // 节假日相关模块
  publicHoliday: publicHolidayRouter,
  // 任务相关模块
  publicJob: publicJobRouter,
  // 关键词相关模块
  publicKeyword: publicKeywordRouter,
  // 通知相关模块
  publicNotice: publicNoticeRouter,
  // 操作日志相关模块
  publicOperateLog: publicOperateLogRouter,
  // API日志相关模块
  publicApiLog: publicApiLogRouter
})

// 导出类型定义
export type ContentRouter = typeof contentRouter
