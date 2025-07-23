import { Router } from 'express'
import { articleService } from '../services/articleService'
import { categoryService } from '../services/categoryService'
import { tagService } from '../services/tagService'
import { configService } from '../services/configService'
import { pageService } from '../services/pageService'
import { AppError, catchAsync } from '../middleware/errorHandler'
import xml2js from 'xml2js'

import moment from 'moment'
import { env } from '../config/env'
import { join } from 'node:path'
const router = Router()

/**
 * 博客首页 - 文章列表
 */
router.get(
  '/blog',
  catchAsync(async (req, res) => {
    const page = parseInt(req.query['page'] as string) || 1
    const pageSize = 10
    const categoryId = req.query['category'] ? parseInt(req.query['category'] as string) : undefined
    const tagId = req.query['tag'] ? parseInt(req.query['tag'] as string) : undefined

    // 验证分页参数
    if (page < 1) {
      throw new AppError('页码必须大于0', 400)
    }

    // 获取文章列表
    const filters: any = { status: 10 } // 只获取已发布的文章
    if (categoryId && !isNaN(categoryId)) filters.type_id = categoryId
    if (tagId && !isNaN(tagId)) filters.tag = tagId

    const articlesResult = await articleService.getArticles(filters, { page, pageSize })

    // 获取分类和标签用于侧边栏
    const [categories, tags, siteConfig] = await Promise.all([
      categoryService.getCategoryTree(),
      tagService.getTags({ page: 1, pageSize: 20 }, { status: 10 }),
      configService.getConfigs({}, { page: 1, pageSize: 100 })
    ])

    // 构建分页信息
    const pagination = {
      currentPage: page,
      totalPages: articlesResult.pagination.totalPages,
      totalItems: articlesResult.pagination.total,
      itemsPerPage: pageSize,
      hasPrev: page > 1,
      hasNext: page < articlesResult.pagination.totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < articlesResult.pagination.totalPages ? page + 1 : null
    }

    res.render('blog/index.njk', {
      articles: articlesResult.dataList,
      categories,
      tags: tags.dataList,
      pagination,
      currentCategory: categoryId,
      currentTag: tagId,
      siteConfig,
      currentYear: new Date().getFullYear()
    })
  })
)

/**
 * 文章详情页
 */
router.get(
  '/blog/article/:id',
  catchAsync(async (req, res) => {
    const articleId = parseInt(req.params['id'])
    if (isNaN(articleId) || articleId <= 0) {
      throw new AppError('文章不存在', 404)
    }

    // 获取文章详情
    const article = await articleService.getArticleById(articleId)
    if (!article || article.status !== 10) {
      throw new AppError('文章不存在', 404)
    }

    // 获取相关文章
    const relatedArticles = await articleService.getArticlesByCategory(article.type_id, 5)

    // 获取分类和标签信息
    const [category, tags, siteConfig] = await Promise.all([
      categoryService.getCategoryById(article.type_id),
      tagService.getTags({ page: 1, pageSize: 20 }, { status: 10 }),
      configService.getConfigs({}, { page: 1, pageSize: 100 })
    ])

    // 增加点击量（异步执行，不影响页面渲染）
    articleService.incrementViewCount(articleId).catch((error) => {
      console.error('Failed to increment view count:', error)
    })

    res.render('blog/article.njk', {
      article,
      category,
      relatedArticles: relatedArticles.filter((a) => a.id !== articleId),
      tags: tags.dataList,
      siteConfig,
      currentYear: new Date().getFullYear()
    })
  })
)

/**
 * 分类页面
 */
router.get(
  '/blog/category/:id',
  catchAsync(async (req, res) => {
    const categoryId = parseInt(req.params['id'])
    const page = parseInt(req.query['page'] as string) || 1
    const pageSize = 10

    if (isNaN(categoryId) || categoryId <= 0) {
      throw new AppError('分类不存在', 404)
    }

    if (page < 1) {
      throw new AppError('页码必须大于0', 400)
    }

    // 获取分类信息
    const category = await categoryService.getCategoryById(categoryId)
    if (!category) {
      throw new AppError('分类不存在', 404)
    }

    // 获取该分类下的文章
    const articlesResult = await articleService.getArticles(
      { status: 10, type_id: categoryId },
      { page, pageSize }
    )

    // 获取所有分类和标签
    const [categories, tags, siteConfig] = await Promise.all([
      categoryService.getCategoryTree(),
      tagService.getTags({ page: 1, pageSize: 20 }, { status: 10 }),
      configService.getConfigs({}, { page: 1, pageSize: 100 })
    ])

    const pagination = {
      currentPage: page,
      totalPages: articlesResult.pagination.totalPages,
      totalItems: articlesResult.pagination.total,
      itemsPerPage: pageSize,
      hasPrev: page > 1,
      hasNext: page < articlesResult.pagination.totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < articlesResult.pagination.totalPages ? page + 1 : null
    }

    res.render('blog/category.njk', {
      category,
      articles: articlesResult.dataList,
      categories,
      tags: tags.dataList,
      pagination,
      siteConfig,
      currentYear: new Date().getFullYear()
    })
  })
)

/**
 * 标签页面
 */
router.get(
  '/blog/tag/:id',
  catchAsync(async (req, res) => {
    const tagId = parseInt(req.params['id'])
    const page = parseInt(req.query['page'] as string) || 1
    const pageSize = 10

    if (isNaN(tagId) || tagId <= 0) {
      throw new AppError('标签不存在', 404)
    }

    if (page < 1) {
      throw new AppError('页码必须大于0', 400)
    }

    // 获取标签信息
    const tag = await tagService.getTagById(tagId)
    if (!tag) {
      throw new AppError('标签不存在', 404)
    }

    // 获取该标签下的文章
    const articlesResult = await articleService.getArticles(
      { status: 10, tag: tag.value },
      { page, pageSize }
    )

    // 获取所有分类和标签
    const [categories, tags, siteConfig] = await Promise.all([
      categoryService.getCategoryTree(),
      tagService.getTags({ page: 1, pageSize: 20 }, { status: 10 }),
      configService.getConfigs({}, { page: 1, pageSize: 100 })
    ])

    const pagination = {
      currentPage: page,
      totalPages: articlesResult.pagination.totalPages,
      totalItems: articlesResult.pagination.total,
      itemsPerPage: pageSize,
      hasPrev: page > 1,
      hasNext: page < articlesResult.pagination.totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < articlesResult.pagination.totalPages ? page + 1 : null
    }

    res.render('blog/tag.njk', {
      tag,
      articles: articlesResult.dataList,
      categories,
      tags: tags.dataList,
      pagination,
      siteConfig,
      currentYear: new Date().getFullYear()
    })
  })
)

/**
 * 搜索页面
 */
router.get(
  '/blog/search',
  catchAsync(async (req, res) => {
    const keyword = (req.query['q'] as string) || ''
    const page = parseInt(req.query['page'] as string) || 1
    const pageSize = 10

    if (page < 1) {
      throw new AppError('页码必须大于0', 400)
    }

    // 验证搜索关键词长度
    if (keyword.length > 100) {
      throw new AppError('搜索关键词过长', 400)
    }

    let articlesResult: any = { dataList: [], pagination: { total: 0, totalPages: 0 } }

    if (keyword.trim()) {
      // 搜索文章
      articlesResult = await articleService.getArticles(
        { status: 10, title: keyword },
        { page, pageSize }
      )
    }

    // 获取分类和标签
    const [categories, tags, siteConfig] = await Promise.all([
      categoryService.getCategoryTree(),
      tagService.getTags({ page: 1, pageSize: 20 }, { status: 10 }),
      configService.getConfigs({}, { page: 1, pageSize: 100 })
    ])

    const pagination = {
      currentPage: page,
      totalPages: articlesResult.pagination.totalPages,
      totalItems: articlesResult.pagination.total,
      itemsPerPage: pageSize,
      hasPrev: page > 1,
      hasNext: page < articlesResult.pagination.totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < articlesResult.pagination.totalPages ? page + 1 : null
    }

    res.render('blog/search.njk', {
      keyword,
      articles: articlesResult.dataList,
      categories,
      tags: tags.dataList,
      pagination,
      siteConfig,
      currentYear: new Date().getFullYear()
    })
  })
)

/**
 * 归档页面
 */
router.get(
  '/blog/archives',
  catchAsync(async (req, res) => {
    const page = parseInt(req.query['page'] as string) || 1
    const pageSize = 20

    if (page < 1) {
      throw new AppError('页码必须大于0', 400)
    }

    // 获取所有已发布的文章用于归档
    const articlesResult = await articleService.getArticles({ status: 10 }, { page, pageSize })

    // 获取配置
    const siteConfig = await configService.getConfigs({}, { page: 1, pageSize: 100 })

    // 构建分页信息
    const pagination = {
      currentPage: page,
      totalPages: articlesResult.pagination.totalPages,
      totalItems: articlesResult.pagination.total,
      itemsPerPage: pageSize,
      hasPrev: page > 1,
      hasNext: page < articlesResult.pagination.totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < articlesResult.pagination.totalPages ? page + 1 : null
    }

    res.render('blog/archives.njk', {
      articles: articlesResult.dataList,
      pagination,
      siteConfig,
      currentYear: new Date().getFullYear()
    })
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
              loc: join(env['BASE_URL'], 'categories', cate.title),
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
              loc: join(env['BASE_URL'], (page.alias || page.url) as string),
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

export default router
