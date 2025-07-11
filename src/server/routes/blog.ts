import { Router } from 'express'
import { articleService } from '../services/articleService'
import { categoryService } from '../services/categoryService'
import { tagService } from '../services/tagService'
import { configService } from '../services/configService'
import { AppError, catchAsync } from '../middleware/errorHandler'

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

export default router
