import { Router } from 'express'
import { catchAsync } from '../middleware/errorHandler'

// 导入模板组件
import {
  BlogIndex,
  BlogArchive,
  BlogArchives,
  BlogCategories,
  BlogDailyLib,
  BlogDailyLibs,
  BlogLinks,
  BlogPages,
  BlogTags,
  BlogAbout
} from '../templates'

import moment from 'moment'
import { env } from '../config/env'
import { ViewData } from '../utils/viewData'
import { sampleSize } from 'lodash'

const router = Router()

/**
 * 博客首页 - 文章列表
 */
router.get(
  '/',
  catchAsync(async (req, res) => {
    await res.renderJSX(BlogIndex, new ViewData().assign())
  })
)

/**
 * 归档页面
 */
router.get(
  '/archives',
  catchAsync(async (req, res) => {
    await res.renderJSX(BlogArchives, new ViewData().assign())
  })
)

/**
 * 归档详情页面
 */
router.get(
  '/archives/:url',
  catchAsync(async (req, res) => {
    await res.renderJSX(BlogArchive, new ViewData().assign())
  })
)

/**
 * 分类页面（通过别名）
 */
router.get(
  '/categories/:alias',
  catchAsync(async (req, res) => {
    await res.renderJSX(BlogCategories, new ViewData().assign())
  })
)

/**
 * 标签页面（通过值）
 */
router.get(
  '/tags/:value',
  catchAsync(async (req, res) => {
    await res.renderJSX(BlogTags, new ViewData().assign())
  })
)

/**
 * 友情链接页面
 */
router.get(
  '/links',
  catchAsync(async (req, res) => {
    await res.renderJSX(BlogLinks, new ViewData().assign())
  })
)

/**
 * 每日库页面
 */
router.get(
  '/daily-libs',
  catchAsync(async (req, res) => {
    await res.renderJSX(BlogDailyLibs, new ViewData().assign())
  })
)

/**
 * 每日库详情页面
 */
router.get(
  '/daily-libs/:url',
  catchAsync(async (req, res) => {
    await res.renderJSX(BlogDailyLib, new ViewData().assign())
  })
)

/**
 * 页面详情
 */
router.get(
  '/pages/:url',
  catchAsync(async (req, res) => {
    await res.renderJSX(BlogPages, new ViewData().assign())
  })
)

/**
 * 关于页面
 */
router.get(
  '/about',
  catchAsync(async (req, res) => {
    await res.renderJSX(BlogAbout, new ViewData().assign())
  })
)

export default router
