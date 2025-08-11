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

  // 获取分类列表
  const { dataList: categoryList } = await categoryService.getCategories(
    { status: 10 },
    { page: 1, pageSize: 100 }
  )
  viewData.assign('categories', categoryList || [])

  // 获取标签列表
  const { dataList: tagList } = await tagService.getTags({ page: 1, pageSize: 100 }, { status: 10 })
  viewData.assign('tags', tagList || [])

  return viewData
}

/**
 * 博客首页 - 文章列表
 */
router.get(
  '/',
  catchAsync(async (req, res) => {
    const viewData = await getCommonViewData('Index')
    console.log(viewData, 'viewData')
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
    res.render('blog/categories.html', viewData.assign())
  })
)

/**
 * 标签页面（通过值）
 */
router.get(
  '/tags/:value',
  catchAsync(async (req, res) => {
    console.log(req.params['value'])
    const viewData = await getCommonViewData('Tag')
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
    res.render('blog/about.html', viewData.assign())
  })
)

router.get(
  '/rss.xml',
  catchAsync(async (req, res) => {
    const { dataList: postList } = await articleService.getArticles(
      { status: 10 },
      { page: 1, pageSize: 100 }
    )
    const jsonRss = {
      rss: {
        $: {
          version: '2.0'
        },
        channel: {
          title: 'UUICE',
          link: req.get('host'),
          description: 'UUICE',
          item: (postList || []).map((post) => {
            return {
              title: '<![CDATA[' + post.title + ']]',
              link: env['BASE_URL'] + '/archives/' + post.url,
              description: '<![CDATA[' + (post.excerpt || post.title) + ']]',
              guid: '/archives/' + post.url,
              pubDate: moment(post.created_time as string).format('ddd, DD MMM YYYY HH:mm:ss [GMT]')
            }
          })
        }
      }
    }

    const builder = new xml2js.Builder()
    const xml = builder.buildObject(jsonRss)
    res.set('Content-Type', 'application/xml')
    res.set('Cache-Control', 'no-cache')
    return res.send(xml)
  })
)

router.get(
  '/sitemap.xml',
  catchAsync(async (req, res) => {
    const { dataList: postList } = await articleService.getArticles(
      { status: 10 },
      { page: 1, pageSize: 100 }
    )
    const { dataList: categoryList } = await categoryService.getCategories(
      { status: 10 },
      { page: 1, pageSize: 100 }
    )
    const { dataList: tagList } = await tagService.getTags(
      { page: 1, pageSize: 20 },
      { status: 10 }
    )
    const { dataList: pageList } = await pageService.getPages(
      { page: 1, pageSize: 100 },
      { status: 10 }
    )

    const jsonRss = {
      urlset: {
        $: {
          xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
          'xmlns:news': 'http://www.google.com/schemas/sitemap-news/0.9',
          'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
          'xsi:schemaLocation':
            'http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd',
          'xmlns:mobile': 'http://www.google.com/schemas/sitemap-mobile/1.0',
          'xmlns:image': 'http://www.google.com/schemas/sitemap-image/1.1',
          'xmlns:video': 'http://www.google.com/schemas/sitemap-video/1.1'
        },
        url: [
          ...postList.map((post) => {
            return {
              loc: join(env['BASE_URL'], 'archives', post.url as string),
              lastmod: moment(post.updated_time as string).format(),
              changefreq: 'daily',
              priority: '0.7'
            }
          }),
          ...categoryList.map((cate) => {
            return {
              loc: join(env['BASE_URL'], 'categories', cate.alias || cate.title),
              lastmod: '',
              changefreq: 'daily',
              priority: '0.7'
            }
          }),

          ...tagList.map((tag) => {
            return {
              loc: join(env['BASE_URL'], 'tags', tag.title),
              lastmod: '',
              changefreq: 'daily',
              priority: '0.7'
            }
          }),

          ...pageList.map((page) => {
            return {
              loc: join(env['BASE_URL'], 'pages', (page.url || page.alias) as string),
              lastmod: moment(page.update_time as unknown as string).format(),
              changefreq: 'daily',
              priority: '0.7'
            }
          }),

          {
            loc: join(env['BASE_URL'], 'tags'),
            lastmod: '',
            changefreq: 'daily',
            priority: '0.5'
          },
          {
            loc: join(env['BASE_URL'], 'categories'),
            lastmod: '',
            changefreq: 'daily',
            priority: '0.5'
          },
          {
            loc: join(env['BASE_URL'], 'archives'),
            lastmod: '',
            changefreq: 'daily',
            priority: '0.5'
          }
        ]
      }
    }

    const builder = new xml2js.Builder()
    const xml = builder.buildObject(jsonRss)
    res.set('Content-Type', 'application/xml')
    res.set('Cache-Control', 'no-cache')
    return res.send(xml)
  })
)

// router.get(
//   '/:path',
//   catchAsync(async (req, res) => {
//     res.render('404.html', {})
//   })
// )

export default router
