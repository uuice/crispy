import { Router } from 'express'
import { articleService } from '../services/articleService'
import { categoryService } from '../services/categoryService'
import { tagService } from '../services/tagService'
import { configService } from '../services/configService'
import { pageService } from '../services/pageService'
import { linkService } from '../services/linkService'
import { AppError, catchAsync } from '../middleware/errorHandler'
import xml2js from 'xml2js'

import moment from 'moment'
import { env } from '../config/env'
import { join } from 'node:path'
import { ViewData } from '../utils/viewData'
import { getConfigByAlias } from './admin/configs'
import { sampleSize } from 'lodash'
import { Links } from '../nunjucks/tag/link'

const router = Router()

/**
 * 获取公共视图数据
 */
async function getCommonViewData(pageType: string) {
  const viewData = new ViewData()
  viewData.assign('pageType', pageType)

  // 获取网站设置
  const siteConfig = await configService.getConfigByAlias('SITE_SETTINGS')
  viewData.assign('siteConfig', siteConfig ? JSON.parse(siteConfig.value) : {})

  const recordSettings = await configService.getConfigByAlias('RECORD_SETTINGS')
  viewData.assign('recordSettings', recordSettings ? JSON.parse(recordSettings.value) : {})

  // 获取分类列表
  const categoryList = await categoryService.getCategoriesWithArticleCount('POST_SYS_CAT')
  viewData.assign('categories', categoryList || [])

  // 获取标签列表
  const { dataList: tagList } = await tagService.getTags({ page: 1, pageSize: 100 }, { status: 10 })
  viewData.assign('tags', sampleSize(tagList, 18) || [])

  viewData.assign('currentYear', new Date().getFullYear())

  viewData.assign('baseUrl', env['BASE_URL'])
  return viewData
}

/**
 * 博客首页 - 文章列表
 */
router.get(
  '/',
  catchAsync(async (req, res) => {
    const viewData = await getCommonViewData('Index')
    const hotArticleList = await articleService.getArticles(
      {
        status: 10,
        attrs: 'hot'
      },
      {
        page: 1,
        pageSize: 100
      }
    )
    viewData.assign('hotArticleList', hotArticleList.dataList || [])
    res.render('blog/index.html', viewData.assign())
  })
)

/**
 * 归档页面
 */
router.get(
  '/archives',
  catchAsync(async (req, res) => {
    const viewData = await getCommonViewData('Archive')

    const { dataList } = await articleService.getArticles(
      { status: 10 },
      { page: 1, pageSize: 1000 }
    )

    const groups: { [year: string]: any[] } = {}
    for (const article of dataList) {
      const year = moment(article.create_time as unknown as string).format('YYYY')
      if (!groups[year]) groups[year] = []
      groups[year].push(article)
    }

    const archiveGroups = Object.keys(groups)
      .sort((a, b) => Number(b) - Number(a))
      .map((year) => ({ year, items: groups[year] }))

    viewData.assign('archiveGroups', archiveGroups)

    res.render('blog/archives.html', viewData.assign())
  })
)

/**
 * 归档详情页面
 */
router.get(
  '/archives/:url',
  catchAsync(async (req, res) => {
    const viewData = await getCommonViewData('Post')
    const url = req.params['url']!

    const article = await articleService.getArticleByUrl(url)

    // Get previous and next articles based on id offset
    let previousArticle: any = undefined
    let nextArticle: any = undefined

    if (article) {
      const typeId = article.type_id as number
      previousArticle = await articleService.getPreviousArticle(article.id, typeId)
      nextArticle = await articleService.getNextArticle(article.id, typeId)
    }
    viewData.assign('article', article)
    viewData.assign('previousArticle', previousArticle)
    viewData.assign('nextArticle', nextArticle)

    res.render('blog/archive.html', viewData.assign())
  })
)

/**
 * 分类页面（通过别名）
 */
router.get(
  '/categories/:alias',
  catchAsync(async (req, res) => {
    const viewData = await getCommonViewData('Category')
    const alias = req.params['alias']!

    // Get category by alias
    const category = await categoryService.getCategoryByAlias(alias)

    // When category not found, render with empty list
    let articleList: any[] = []
    if (category) {
      const { dataList } = await articleService.getArticles(
        { status: 10, type_id: category.id },
        { page: 1, pageSize: 1000 }
      )
      articleList = dataList || []
    }

    viewData.assign('currentCategory', category)
    viewData.assign('articleList', articleList)

    res.render('blog/categories.html', viewData.assign())
  })
)

/**
 * 标签页面（通过值）
 */
router.get(
  '/tags/:value',
  catchAsync(async (req, res) => {
    const viewData = await getCommonViewData('Tag')
    const value = req.params['value']!
    const tag = await tagService.getTagByValue(value)

    // Get articles by tag
    const { dataList: articleList } = await articleService.getArticles(
      { status: 10, tag: tag.title },
      { page: 1, pageSize: 1000 }
    )

    viewData.assign('currentTag', tag)
    viewData.assign('articleList', articleList || [])

    res.render('blog/tags.html', viewData.assign())
  })
)

/**
 * 友情链接页面
 */
router.get(
  '/links',
  catchAsync(async (req, res) => {
    const viewData = await getCommonViewData('Link')
    const { dataList: linkCategories } = await categoryService.getCategories(
      { alias: 'LINK_SYS_CAT' },
      { page: 1, pageSize: 100 }
    )
    const { dataList: links } = await linkService.getLinks(
      { page: 1, pageSize: 1000 },
      {
        status: 10
      }
    )

    // Group links by category
    const groupedLinks: { [key: string]: any[] } = {}

    if (links && links.length > 0) {
      links.forEach((link) => {
        const categoryName = link.type_name || '未分类'
        if (!groupedLinks[categoryName]) {
          groupedLinks[categoryName] = []
        }
        groupedLinks[categoryName].push(link)
      })
    }

    viewData.assign('linkCategories', linkCategories || [])
    viewData.assign('groupedLinks', groupedLinks)
    viewData.assign('links', links || [])

    res.render('blog/links.html', viewData.assign())
  })
)

/**
 * 每日库页面
 */
router.get(
  '/daily-libs',
  catchAsync(async (req, res) => {
    const viewData = await getCommonViewData('DailyLib')
    const category = await categoryService.getCategoryByAlias('daily-libs')!
    const { dataList: articleList } = await articleService.getArticles(
      {
        type_id: category!.id,
        status: 10
      },
      {
        page: 1,
        pageSize: 100
      }
    )

    const groups: { [year: string]: any[] } = {}
    for (const article of articleList) {
      const year = moment(article.create_time as unknown as string).format('YYYY')
      if (!groups[year]) groups[year] = []
      groups[year].push(article)
    }

    const archiveGroups = Object.keys(groups)
      .sort((a, b) => Number(b) - Number(a))
      .map((year) => ({ year, items: groups[year] }))

    viewData.assign('archiveGroups', archiveGroups)
    viewData.assign('category', category)
    res.render('blog/daily-libs.html', viewData.assign())
  })
)

/**
 * 每日库详情页面
 */
router.get(
  '/daily-libs/:url',
  catchAsync(async (req, res) => {
    const viewData = await getCommonViewData('DailyLib')

    const url = req.params['url']!

    const article = await articleService.getArticleByUrl(url)

    // Get previous and next articles based on id offset
    let previousArticle: any = undefined
    let nextArticle: any = undefined
    const category = await categoryService.getCategoryByAlias('daily-libs')!

    if (article) {
      previousArticle = await articleService.getPreviousArticle(article.id)
      nextArticle = await articleService.getNextArticle(article.id)
    }
    viewData.assign('article', article)
    viewData.assign('previousArticle', previousArticle)
    viewData.assign('nextArticle', nextArticle)

    res.render('blog/daily-lib.html', viewData.assign())
  })
)

/**
 * 页面详情
 */
router.get(
  '/pages/:url',
  catchAsync(async (req, res) => {
    const viewData = await getCommonViewData('Page')
    const url = req.params['url']!

    const page = await pageService.getPageByUrl(url)
    viewData.assign('page', page!)
    res.render('blog/pages.html', viewData.assign())
  })
)

/**
 * 关于页面
 */
router.get(
  '/about',
  catchAsync(async (req, res) => {
    const viewData = await getCommonViewData('Page')
    const page = await pageService.getPageByUrl('about')
    viewData.assign('page', page!)
    res.render('blog/about.html', viewData.assign())
  })
)

export default router
