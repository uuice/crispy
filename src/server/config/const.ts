export const STATUS_PUBLISHED = 10
export const STATUS_DRAFT = -10
export const STATUS_DELETED = -100
export const STATUS_TRASH = -20
export const STATUS_TRUE = 1
export const STATUS_FALSE = 0

export const STATUS_MAP = {
  [STATUS_PUBLISHED]: '已发布',
  [STATUS_DRAFT]: '待发布',
  [STATUS_DELETED]: '已删除',
  [STATUS_TRASH]: '回收站'
}

export const PUBLISH_STATUS = {
  PUBLISHED: STATUS_PUBLISHED,
  DRAFT: STATUS_DRAFT,
  DELETED: STATUS_DELETED,
  TRASH: STATUS_TRASH
} as const

export const DELETE_STATUS = {
  DELETE: STATUS_TRUE,
  UN_DELETE: STATUS_FALSE
} as const

export const USER_STATUS = {
  ENABLE: STATUS_PUBLISHED,
  DISABLE: STATUS_DRAFT
} as const
