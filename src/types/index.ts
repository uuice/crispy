import {
  AccessToken,
  Additions,
  AdItems,
  Ads,
  ApiLogs,
  Articles,
  Attrs,
  Caches,
  Categories,
  Comments,
  Configs,
  Enums,
  Holidays,
  Jobs,
  Keywords,
  Links,
  Menus,
  Notices,
  OperateLogs,
  Pages,
  Roles,
  Rules,
  Tags,
  Users,
  UserTypes,
  VoteItems,
  Votes
} from '@src/db/db'
import { Insertable, Selectable, Updateable } from 'kysely'
import z from 'zod'

export interface PaginationOptions {
  page: number
  pageSize: number
}

export interface PaginatedResult<T> {
  dataList: T[]
  pagination: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

export interface CreateSuccess {
  id: number
}

export interface UpdateSuccess {
  id: number
}

export type QueryFilter<T> = Partial<T> & {
  create_time_start?: number
  create_time_end?: number
  update_time_start?: number
  update_time_end?: number
} & PaginationOptions

export const commonFiltersSchema = z.object({
  create_time_start: z.number().optional(),
  create_time_end: z.number().optional(),
  update_time_start: z.number().optional(),
  update_time_end: z.number().optional(),
  page: z.number().default(1),
  pageSize: z.number().default(10)
})

// AccessToken
export const createAccessTokenSchema = z.object({
  app_name: z.string().min(1, 'app_name不能为空'),
  channel: z.string().min(1, 'channel不能为空'),
  user_id: z.number().min(1, 'user_id不能为空'),
  status: z.number().default(10)
})
export const updateAccessTokenSchema = createAccessTokenSchema.partial()
export type AccessTokenEntity = Selectable<AccessToken>
export type AccessTokenFilters = QueryFilter<Omit<AccessTokenEntity, 'token'>>
export type CreateAccessToken = Insertable<AccessToken>
export type UpdateAccessToken = Updateable<AccessToken>

export const accessTokenFiltersSchema = z
  .object({
    id: z.number().optional(),
    app_name: z.string().optional(),
    channel: z.string().optional(),
    user_id: z.number().optional(),
    token: z.string().optional(),
    status: z.number().optional(),
    is_delete: z.number().optional()
  })
  .extend(commonFiltersSchema.shape)

// Validation schemas
export const checkTokenSchema = z.object({
  app_name: z.string(),
  channel: z.string(),
  token: z.string()
})

export interface CheckAccessTokenData {
  app_name: string
  channel: string
  token: string
}

// Additions
export const createAdditionSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().min(0),
  type: z.number().default(1), // 1: 必选, 2: 可选
  status: z.number().default(10),
  sort: z.number().default(0),
  fields_json: z.string().min(1, 'fields_json不能为空')
})
export const updateAdditionSchema = createAdditionSchema.partial()
export type AdditionEntity = Selectable<Additions>
export type AdditionFilters = QueryFilter<AdditionEntity>
export type CreateAddition = Insertable<Additions>
export type UpdateAddition = Updateable<Additions>

export const additionFiltersSchema = z
  .object({
    id: z.number().optional(),
    fields_json: z.string().optional(),
    primary_id: z.number().optional(),
    status: z.number().optional(),
    is_delete: z.number().optional()
  })
  .extend(commonFiltersSchema.shape)

// AdItems
export const createAdItemSchema = z.object({
  ad_id: z.number(),
  title: z.string().min(1),
  content: z.string().optional(),
  image_url: z.string().optional(),
  link_url: z.string().optional(),
  sort: z.number().default(0),
  status: z.number().default(10)
})
export const updateAdItemSchema = createAdItemSchema.partial()
export type AdItemEntity = Selectable<AdItems>
export type AdItemFilters = QueryFilter<AdItemEntity>
export type CreateAdItem = Insertable<AdItems>
export type UpdateAdItem = Updateable<AdItems>

export const adItemFiltersSchema = z
  .object({
    id: z.number().optional(),
    ad_id: z.number().optional(),
    title: z.string().optional(),
    content: z.string().optional(),
    image_url: z.string().optional(),
    url: z.string().optional(),
    method: z.string().optional(),
    sort: z.number().optional(),
    status: z.number().optional(),
    is_delete: z.number().optional()
  })
  .extend(commonFiltersSchema.shape)

// Ads
export const createAdSchema = z.object({
  title: z.string().min(1),
  content: z.string().optional(),
  image_url: z.string().optional(),
  link_url: z.string().optional(),
  position: z.string().optional(),
  start_time: z.number().optional(),
  end_time: z.number().optional(),
  status: z.number().default(10),
  sort: z.number().default(0)
})
export const updateAdSchema = createAdSchema.partial()
export type AdEntity = Selectable<Ads>
export type AdFilters = QueryFilter<AdEntity>
export type CreateAd = Insertable<Ads>
export type UpdateAd = Updateable<Ads>

export const adFiltersSchema = z
  .object({
    id: z.number().optional(),
    title: z.string().optional(),
    alias: z.string().optional(),
    content: z.string().optional(),
    sort: z.number().optional(),
    type_id: z.number().optional(),
    status: z.number().optional(),
    start_time: z.number().optional(),
    end_time: z.number().optional(),
    is_delete: z.number().optional()
  })
  .extend(commonFiltersSchema.shape)

// ApiLogs
export const createApiLogSchema = z.object({
  user_id: z.number().optional(),
  method: z.string().default(''),
  query: z.string(),
  body: z.string(),
  ip: z.string().optional()
})
export const updateApiLogSchema = createApiLogSchema.partial()
export type ApiLogEntity = Selectable<ApiLogs>
export type ApiLogFilters = QueryFilter<ApiLogEntity>
export type CreateApiLog = Insertable<ApiLogs>
export type UpdateApiLog = Updateable<ApiLogs>

export const apiLogFiltersSchema = z
  .object({
    id: z.number().optional(),
    user_id: z.number().optional(),
    method: z.string().optional(),
    body: z.string().optional(),
    query: z.string().optional(),
    ip: z.string().optional(),
    is_delete: z.number().optional()
  })
  .extend(commonFiltersSchema.shape)

// Articles
export const createArticleSchema = z.object({
  title: z.string().min(1),
  sub_title: z.string().optional(),
  url: z.string().optional(),
  content: z.string().min(1),
  markdown_content: z.string().optional(),
  is_markdown: z.number().default(0),
  abstract: z.string().optional(),
  image: z.string().optional(),
  image_list: z.string().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  seo_keywords: z.string().optional(),
  remark: z.string().optional(),
  user_id: z.number().optional(),
  tags: z.string().optional(),
  attrs: z.string().optional(),
  type_id: z.number().optional(),
  type_ids: z.string().optional(),
  author_id: z.number().optional(),
  redirect_url: z.string().optional(),
  is_review: z.number().default(0),
  click: z.number().default(0),
  sort: z.number().default(0),
  status: z.number().default(10)
})
export const updateArticleSchema = createArticleSchema.partial()
export type ArticleEntity = Selectable<Articles>
export type ArticleFilters = QueryFilter<ArticleEntity>
export type CreateArticle = Insertable<Articles>
export type UpdateArticle = Updateable<Articles>

export interface ArticleWithCategory extends ArticleEntity {
  type_name?: string
  category?: string
  category_alias?: string
  tagRef?: { [key: string]: string }
}

export const articleFiltersSchema = z
  .object({
    id: z.number().optional(),
    title: z.string().optional(),
    sub_title: z.string().optional(),
    url: z.string().optional(),
    content: z.string().optional(),
    markdown_content: z.string().optional(),
    is_markdown: z.number().optional(),
    abstract: z.string().optional(),
    image: z.string().optional(),
    image_list: z.string().optional(),
    seo_title: z.string().optional(),
    seo_description: z.string().optional(),
    seo_keywords: z.string().optional(),
    remark: z.string().optional(),
    user_id: z.number().optional(),
    tags: z.string().optional(),
    attrs: z.string().optional(),
    type_id: z.number().optional(),
    type_ids: z.string().optional(),
    author_id: z.number().optional(),
    redirect_url: z.string().optional(),
    is_review: z.number().optional(),
    click: z.number().optional(),
    sort: z.number().optional(),
    status: z.number().optional(),
    is_delete: z.number().optional()
  })
  .extend(commonFiltersSchema.shape)

// Attrs
export const createAttrSchema = z.object({
  title: z.string().min(1),
  alias: z.string().optional(),
  sort: z.number().default(0),
  status: z.number().default(10)
})
export const updateAttrSchema = createAttrSchema.partial()
export type AttrEntity = Selectable<Attrs>
export type AttrFilters = QueryFilter<AttrEntity>
export type CreateAttr = Insertable<Attrs>
export type UpdateAttr = Updateable<Attrs>

export const attrFiltersSchema = z
  .object({
    id: z.number().optional(),
    title: z.string().optional(),
    alias: z.string().optional(),
    sort: z.number().optional(),
    status: z.number().optional(),
    is_delete: z.number().optional()
  })
  .extend(commonFiltersSchema.shape)

// Caches
export const createCacheSchema = z.object({
  hash: z.string().min(1),
  url: z.string().default(''),
  cache_data: z.string().min(1),
  status: z.number().default(10)
})
export const updateCacheSchema = createCacheSchema.partial()
export type CacheEntity = Selectable<Caches>
export type CacheFilters = QueryFilter<CacheEntity>
export type CreateCache = Insertable<Caches>
export type UpdateCache = Updateable<Caches>

export const cacheFiltersSchema = z
  .object({
    id: z.number().optional(),
    hash: z.string().optional(),
    url: z.string().optional(),
    cache_data: z.string().optional(),
    status: z.number().optional(),
    is_delete: z.number().optional()
  })
  .extend(commonFiltersSchema.shape)

// Categories
export const createCategorySchema = z.object({
  title: z.string().min(1, '标题不能为空'),
  alias: z.string().min(1, '别名不能为空'),
  des: z.string().optional(),
  parent_id: z.number().optional(),
  sort: z.number().default(0),
  status: z.number().default(10)
})
export const updateCategorySchema = createCategorySchema.partial()
export type CategoryEntity = Selectable<Categories>
export type CategoryFilters = QueryFilter<CategoryEntity>
export type CreateCategory = Insertable<Categories>
export type UpdateCategory = Updateable<Categories>
export type CategoryEntityNested = CategoryEntity & {
  children: CategoryEntityNested[]
}

export const categoryFiltersSchema = z
  .object({
    id: z.number().optional(),
    title: z.string().optional(),
    alias: z.string().optional(),
    des: z.string().optional(),
    parent_id: z.number().optional(),
    sort: z.number().optional(),
    status: z.number().optional(),
    is_delete: z.number().optional()
  })
  .extend(commonFiltersSchema.shape)

// Comments
export const createCommentSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  user_id: z.number(),
  parent_id: z.number().optional(),
  status: z.number().default(10),
  good_article: z.number().default(0),
  bad_article: z.number().default(0),
  not_article: z.number().default(0)
})
export const updateCommentSchema = createCommentSchema.partial()
export type CommentEntity = Selectable<Comments>
export type CommentFilters = QueryFilter<CommentEntity>
export type CreateComment = Insertable<Comments>
export type UpdateComment = Updateable<Comments>

export interface CommentWithAuthor extends CommentEntity {
  author_name: string
  author_email: string
  author_avatar: string
  parent_content: string
}

export const commentFiltersSchema = z
  .object({
    id: z.number().optional(),
    title: z.string().optional(),
    content: z.string().optional(),
    user_id: z.number().optional(),
    parent_id: z.number().optional(),
    good_article: z.number().optional(),
    bad_article: z.number().optional(),
    not_article: z.number().optional(),
    status: z.number().optional(),
    is_delete: z.number().optional()
  })
  .extend(commonFiltersSchema.shape)

// Configs
export const createConfigSchema = z.object({
  title: z.string().min(1),
  alias: z.string().optional(),
  value: z.string().min(1),
  type_id: z.number().optional(),
  type_ids: z.string().optional(),
  sort: z.number().default(0),
  status: z.number().default(10)
})
export const updateConfigSchema = createConfigSchema.partial()
export type ConfigEntity = Selectable<Configs>
export type ConfigFilters = QueryFilter<ConfigEntity>
export type CreateConfig = Insertable<Configs>
export type UpdateConfig = Updateable<Configs>

export const configFiltersSchema = z
  .object({
    id: z.number().optional(),
    title: z.string().optional(),
    alias: z.string().optional(),
    value: z.string().optional(),
    type_id: z.number().optional(),
    type_ids: z.string().optional(),
    sort: z.number().optional(),
    status: z.number().optional(),
    is_delete: z.number().optional()
  })
  .extend(commonFiltersSchema.shape)

// Enums
export const createEnumSchema = z.object({
  title: z.string().min(1),
  alias: z.string().optional(),
  code: z.string().min(1),
  value: z.string().min(1),
  sort: z.number().default(0),
  status: z.number().default(10)
})
export const updateEnumSchema = createEnumSchema.partial()
export type EnumEntity = Selectable<Enums>
export type EnumFilters = QueryFilter<EnumEntity>
export type CreateEnum = Insertable<Enums>
export type UpdateEnum = Updateable<Enums>

export const enumFiltersSchema = z
  .object({
    id: z.number().optional(),
    title: z.string().optional(),
    alias: z.string().optional(),
    code: z.string().optional(),
    value: z.string().optional(),
    sort: z.number().optional(),
    status: z.number().optional(),
    is_delete: z.number().optional()
  })
  .extend(commonFiltersSchema.shape)

// Holidays
export const createHolidaySchema = z.object({
  title: z.string().min(1, '标题不能为空'),
  value: z.string().min(1, '日期不能为空'),
  sort: z.number().default(0)
})
export const updateHolidaySchema = createHolidaySchema.partial()
export type HolidayEntity = Selectable<Holidays>
export type HolidayFilters = QueryFilter<HolidayEntity>
export type CreateHoliday = Insertable<Holidays>
export type UpdateHoliday = Updateable<Holidays>

export const holidayFiltersSchema = z
  .object({
    id: z.number().optional(),
    title: z.string().optional(),
    value: z.string().optional(),
    sort: z.number().optional(),
    is_delete: z.number().optional()
  })
  .extend(commonFiltersSchema.shape)

// Jobs
export const createJobSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  address: z.string().optional(),
  branch: z.string().optional(),
  email: z.string().email().optional(),
  nature: z.string().optional(),
  num: z.number().min(0),
  typeName: z.string().optional(),
  sort: z.number().default(0)
})
export const updateJobSchema = createJobSchema.partial()
export type JobEntity = Selectable<Jobs>
export type JobFilters = QueryFilter<JobEntity>
export type CreateJob = Insertable<Jobs>
export type UpdateJob = Updateable<Jobs>

export const jobFiltersSchema = z
  .object({
    id: z.number().optional(),
    title: z.string().optional(),
    content: z.string().optional(),
    address: z.string().optional(),
    branch: z.string().optional(),
    email: z.string().optional(),
    nature: z.string().optional(),
    num: z.number().optional(),
    typeName: z.string().optional(),
    sort: z.number().optional(),
    is_delete: z.number().optional()
  })
  .extend(commonFiltersSchema.shape)

// Keywords
export const createKeywordSchema = z.object({
  title: z.string().min(1),
  alias: z.string().min(1),
  value: z.string().optional(),
  url: z.string().optional(),
  type_id: z.number().optional(),
  status: z.number().default(10)
})
export const updateKeywordSchema = createKeywordSchema.partial()
export type KeywordEntity = Selectable<Keywords>
export type KeywordFilters = QueryFilter<KeywordEntity>
export type CreateKeyword = Insertable<Keywords>
export type UpdateKeyword = Updateable<Keywords>

export const keywordFiltersSchema = z
  .object({
    id: z.number().optional(),
    title: z.string().optional(),
    alias: z.string().optional(),
    value: z.string().optional(),
    url: z.string().optional(),
    type_id: z.number().optional(),
    count: z.number().optional(),
    status: z.number().optional(),
    is_delete: z.number().optional()
  })
  .extend(commonFiltersSchema.shape)

// Links
export const createLinkSchema = z.object({
  site_name: z.string().min(1, '站点名称不能为空'),
  des: z.string().min(1, '描述不能为空'),
  url: z.string().url('请输入有效的URL地址'),
  logo: z.string().optional(),
  method: z.string().optional(),
  type_id: z.number().default(0),
  sort: z.number().default(0),
  status: z.number().default(10)
})
export const updateLinkSchema = createLinkSchema.partial()
export type LinkEntity = Selectable<Links>
export type LinkFilters = QueryFilter<LinkEntity>
export type CreateLink = Insertable<Links>
export type UpdateLink = Updateable<Links>

// Extended link with type name from join
export interface LinkWithType extends LinkEntity {
  type_name?: string
}

export const linkFiltersSchema = z
  .object({
    id: z.number().optional(),
    site_name: z.string().optional(),
    des: z.string().optional(),
    url: z.string().optional(),
    logo: z.string().optional(),
    method: z.string().optional(),
    type_id: z.number().optional(),
    sort: z.number().optional(),
    status: z.number().optional(),
    is_delete: z.number().optional()
  })
  .extend(commonFiltersSchema.shape)

// Menus
export const createMenuSchema = z.object({
  title: z.string().min(1),
  alias: z.string().min(1),
  parent_id: z.number().default(0),
  icon: z.string().optional(),
  url: z.string().optional(),
  image_url: z.string().optional(),
  method: z.string().optional(),
  sort: z.number().default(0),
  status: z.number().default(10)
})
export const updateMenuSchema = createMenuSchema.partial()
export type MenuEntity = Selectable<Menus>
export type MenuFilters = QueryFilter<MenuEntity>
export type CreateMenu = Insertable<Menus>
export type UpdateMenu = Updateable<Menus>

export interface MenuTreeItem extends MenuEntity {
  children?: MenuTreeItem[]
}

export const menuFiltersSchema = z
  .object({
    id: z.number().optional(),
    title: z.string().optional(),
    alias: z.string().optional(),
    parent_id: z.number().optional(),
    icon: z.string().optional(),
    url: z.string().optional(),
    image_url: z.string().optional(),
    method: z.string().optional(),
    sort: z.number().optional(),
    status: z.number().optional(),
    is_delete: z.number().optional()
  })
  .extend(commonFiltersSchema.shape)

// Notices
export const createNoticeSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  from_user_id: z.number().min(1),
  publish_time: z.number().optional(),
  tolds: z.string().optional(),
  status: z.number().default(10)
})
export const updateNoticeSchema = createNoticeSchema.partial()
export type NoticeEntity = Selectable<Notices>
export type NoticeFilters = QueryFilter<NoticeEntity>
export type CreateNotice = Insertable<Notices>
export type UpdateNotice = Updateable<Notices>

export const noticeFiltersSchema = z
  .object({
    id: z.number().optional(),
    title: z.string().optional(),
    content: z.string().optional(),
    from_user_id: z.number().optional(),
    publish_time: z.number().optional(),
    tolds: z.string().optional(),
    status: z.number().optional(),
    is_delete: z.number().optional()
  })
  .extend(commonFiltersSchema.shape)

// OperateLogs
export const createOperateLogSchema = z.object({
  code: z.string().min(1),
  content: z.string().min(1),
  type_id: z.number().default(0),
  user_id: z.number().min(1)
})
export const updateOperateLogSchema = createOperateLogSchema.partial()
export type OperateLogEntity = Selectable<OperateLogs>
export type OperateLogFilters = QueryFilter<OperateLogEntity>
export type CreateOperateLog = Insertable<OperateLogs>
export type UpdateOperateLog = Updateable<OperateLogs>

export const operateLogFiltersSchema = z
  .object({
    id: z.number().optional(),
    code: z.string().optional(),
    content: z.string().optional(),
    type_id: z.number().optional(),
    user_id: z.number().optional(),
    is_delete: z.number().optional()
  })
  .extend(commonFiltersSchema.shape)

// Pages
export const createPageSchema = z.object({
  title: z.string().min(1, '标题不能为空'),
  url: z.string().optional(),
  alias: z.string().min(1, '别名不能为空'),
  content: z.string().min(1, '内容不能为空'),
  markdown_content: z.string().optional(),
  is_markdown: z.number().default(0),
  abstract: z
    .string()
    .optional()
    .transform((val) => val || ''),
  sub_title: z
    .string()
    .optional()
    .transform((val) => val || ''),
  seo_title: z
    .string()
    .optional()
    .transform((val) => val || ''),
  seo_keywords: z
    .string()
    .optional()
    .transform((val) => val || ''),
  seo_description: z
    .string()
    .optional()
    .transform((val) => val || ''),
  image_list: z.string().optional(),
  tags: z.string().optional(),
  author_id: z.number().optional(),
  user_id: z.number().optional(),
  type_id: z.number().optional(),
  click: z.number().default(0),
  status: z.number().default(10),
  remark: z.string().optional()
})
export const updatePageSchema = createPageSchema.partial()
export type PageEntity = Selectable<Pages>
export type PageFilters = QueryFilter<PageEntity>
export type CreatePage = Insertable<Pages>
export type UpdatePage = Updateable<Pages>

export const pageFiltersSchema = z
  .object({
    id: z.number().optional(),
    title: z.string().optional(),
    url: z.string().optional(),
    alias: z.string().optional(),
    content: z.string().optional(),
    markdown_content: z.string().optional(),
    is_markdown: z.number().optional(),
    abstract: z.string().optional(),
    sub_title: z.string().optional(),
    seo_title: z.string().optional(),
    seo_keywords: z.string().optional(),
    seo_description: z.string().optional(),
    image_list: z.string().optional(),
    tags: z.string().optional(),
    author_id: z.number().optional(),
    user_id: z.number().optional(),
    type_id: z.number().optional(),
    click: z.number().optional(),
    remark: z.string().optional(),
    status: z.number().optional(),
    is_delete: z.number().optional()
  })
  .extend(commonFiltersSchema.shape)

// Roles
export const createRoleSchema = z.object({
  title: z.string().min(1, '角色名称不能为空'),
  des: z.string().optional(),
  module_id: z.number().default(0),
  rule_ids: z.string().default(''),
  sort: z.number().default(0),
  status: z.number().default(10),
  type_id: z.number().default(0)
})
export const updateRoleSchema = createRoleSchema.partial()
export type RoleEntity = Selectable<Roles>
export type RoleFilters = QueryFilter<RoleEntity>
export type CreateRole = Insertable<Roles>
export type UpdateRole = Updateable<Roles>

export const roleFiltersSchema = z
  .object({
    id: z.number().optional(),
    title: z.string().optional(),
    des: z.string().optional(),
    module_id: z.number().optional(),
    rule_ids: z.string().optional(),
    sort: z.number().optional(),
    type_id: z.number().optional(),
    status: z.number().optional(),
    is_delete: z.number().optional()
  })
  .extend(commonFiltersSchema.shape)

// Rules
export const createRuleSchema = z.object({
  title: z.string().min(1, '规则名称不能为空'),
  alias: z.string().min(1, '规则别名不能为空'),
  condition: z.string().optional(),
  des: z.string().optional(),
  icon: z.string().optional(),
  module_id: z.number().default(0),
  parent_id: z.number().default(0),
  sort: z.number().default(0),
  status: z.number().default(10),
  type_id: z.number().default(0)
})
export const updateRuleSchema = createRuleSchema.partial()
export type RuleEntity = Selectable<Rules>
export type RuleFilters = QueryFilter<RuleEntity>
export type CreateRule = Insertable<Rules>
export type UpdateRule = Updateable<Rules>

export const ruleFiltersSchema = z
  .object({
    id: z.number().optional(),
    title: z.string().optional(),
    alias: z.string().optional(),
    condition: z.string().optional(),
    des: z.string().optional(),
    icon: z.string().optional(),
    module_id: z.number().optional(),
    parent_id: z.number().optional(),
    sort: z.number().optional(),
    type_id: z.number().optional(),
    status: z.number().optional(),
    is_delete: z.number().optional()
  })
  .extend(commonFiltersSchema.shape)

export interface RuleTreeItem extends RuleEntity {
  children?: RuleTreeItem[]
}

// Tags
export const createTagSchema = z.object({
  title: z.string().min(1),
  des: z.string().optional(),
  sort: z.number().default(0),
  status: z.number().default(10),
  type_id: z.number().default(0),
  value: z.string().optional()
})
export const updateTagSchema = createTagSchema.partial()
export type TagEntity = Selectable<Tags>
export type TagFilters = QueryFilter<TagEntity>
export type CreateTag = Insertable<Tags>
export type UpdateTag = Updateable<Tags>

export const tagFiltersSchema = z
  .object({
    id: z.number().optional(),
    title: z.string().optional(),
    des: z.string().optional(),
    sort: z.number().optional(),
    type_id: z.number().optional(),
    value: z.string().optional(),
    status: z.number().optional(),
    is_delete: z.number().optional()
  })
  .extend(commonFiltersSchema.shape)

// Users
export const createUserSchema = z.object({
  user_name: z.string().min(1, '用户名不能为空').max(32, '用户名不能超过30个字符'),
  password: z.string().min(6, '密码至少6个字符'),
  email: z.string().email('邮箱格式不正确').optional(),
  phone: z.string().min(11, '手机号不能为空').max(11, '手机号不能超过11个字符').optional(),
  real_name: z.string().optional(),
  nick_name: z.string().optional(),
  avatar_url: z.string().optional(),
  role_id: z.number().optional(),
  type_id: z.number().optional(),
  status: z.number().default(10),
  is_admin: z.number().default(0),
  is_super_admin: z.number().default(0),
  is_black: z.number().default(0)
})
export const updateUserSchema = createUserSchema.partial()

export const loginSchema = z.object({
  user_name: z.string().min(1, '用户名不能为空'),
  password: z.string().min(1, '密码不能为空')
})

// Reset password schema
export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, '原密码至少6个字符').optional(),
    new_password: z.string().min(6, '新密码至少6个字符'),
    confirm_password: z.string().min(6, '确认密码至少6个字符')
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: '新密码和确认密码不一致',
    path: ['confirm_password']
  })

export interface LoginData {
  user_name: string
  password: string
}

export interface ResetPasswordData {
  password: string
  new_password: string
  confirm_password: string
}

export interface LoginResult {
  user: any
  token: string
  menus: any[]
}

export type UserEntity = Selectable<Users>
export type UserFilters = QueryFilter<UserEntity> & {
  last_login_start?: number
  last_login_end?: number
}
export type CreateUser = Insertable<Users>
export type UpdateUser = Updateable<Users>

export const userFiltersSchema = z
  .object({
    id: z.number().optional(),
    user_name: z.string().optional(),
    password: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    real_name: z.string().optional(),
    nick_name: z.string().optional(),
    avatar_url: z.string().optional(),
    role_id: z.number().optional(),
    type_id: z.number().optional(),
    status: z.number().optional(),
    is_admin: z.number().optional(),
    is_super_admin: z.number().optional(),
    is_black: z.number().optional(),
    last_login_ip: z.string().optional(),
    last_login_time: z.number().optional(),
    last_login_start: z.number().optional(),
    last_login_end: z.number().optional(),
    is_delete: z.number().optional()
  })
  .extend(commonFiltersSchema.shape)

// UserTypes
export const createUserTypeSchema = z.object({
  type_name: z.string().min(1),
  alias: z.string().min(1),
  remark: z.string().optional(),
  status: z.number().default(10)
})
export const updateUserTypeSchema = createUserTypeSchema.partial()
export type UserTypeEntity = Selectable<UserTypes>
export type UserTypeFilters = QueryFilter<UserTypeEntity>
export type CreateUserType = Insertable<UserTypes>
export type UpdateUserType = Updateable<UserTypes>

export const userTypeFiltersSchema = z
  .object({
    id: z.number().optional(),
    type_name: z.string().optional(),
    alias: z.string().optional(),
    remark: z.string().optional(),
    status: z.number().optional(),
    is_delete: z.number().optional()
  })
  .extend(commonFiltersSchema.shape)

// VoteItems
export const createVoteItemSchema = z.object({
  title: z.string().min(1),
  vote_id: z.number(),
  status: z.number().default(10)
})
export const updateVoteItemSchema = createVoteItemSchema.partial()
export type VoteItemEntity = Selectable<VoteItems>
export type VoteItemFilters = QueryFilter<VoteItemEntity>
export type CreateVoteItem = Insertable<VoteItems>
export type UpdateVoteItem = Updateable<VoteItems>

export const voteItemFiltersSchema = z
  .object({
    id: z.number().optional(),
    vote_id: z.number().optional(),
    title: z.string().optional(),
    status: z.number().optional(),
    is_delete: z.number().optional()
  })
  .extend(commonFiltersSchema.shape)

// Votes
export const createVoteSchema = z.object({
  title: z.string().min(1),
  is_multiple: z.number().default(0),
  start_time: z.number(),
  end_time: z.number(),
  status: z.number().default(10),
  vote_items: z.string().optional()
})
export const updateVoteSchema = createVoteSchema.partial()
export type VoteEntity = Selectable<Votes>
export type VoteFilters = QueryFilter<VoteEntity>
export type CreateVote = Insertable<Votes>
export type UpdateVote = Updateable<Votes>

export const voteFiltersSchema = z
  .object({
    id: z.number().optional(),
    title: z.string().optional(),
    is_multiple: z.number().optional(),
    start_time: z.number().optional(),
    end_time: z.number().optional(),
    count: z.number().optional(),
    vote_items: z.string().optional(),
    status: z.number().optional(),
    is_delete: z.number().optional()
  })
  .extend(commonFiltersSchema.shape)
