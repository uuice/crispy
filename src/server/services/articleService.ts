import { db } from '@src/libs/db'
import { ExpressionBuilder, sql } from 'kysely'
import type { DB } from '@src/db/db.d'
import { DELETE_STATUS, PUBLISH_STATUS } from '../config/const'
import { tagService } from './tagService'
import { titleToUrl } from '../utils/titleToUrl'
import { flexsearchService } from './flexsearch-index.service'
import {
  ArticleEntity,
  ArticleFilters,
  CreateArticle,
  createArticleSchema,
  CreateSuccess,
  UpdateArticle,
  updateArticleSchema,
  UpdateSuccess,
  PaginatedResult,
  PaginationOptions,
  ArticleWithCategory
} from '@src/types'

// Helper function to get tagRef object from tags string
async function getTagRef(tags: string): Promise<{ [key: string]: string }> {
  if (!tags) return {}

  const tagNames = tags
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)

  if (tagNames.length === 0) return {}

  const tagRef: { [key: string]: string } = {}

  for (const tagName of tagNames) {
    const tagValue = titleToUrl(tagName)
    tagRef[tagName] = tagValue
  }

  return tagRef
}

export class ArticleService {
  /**
   * Get a single article by ID
   */
  async getById(id: number): Promise<ArticleWithCategory | null> {
    const article = await db
      .selectFrom('articles')
      .leftJoin('categories', 'categories.id', 'articles.type_id')
      .selectAll('articles')
      .select(['categories.title as type_name'])
      .select(['categories.title as category'])
      .select(['categories.alias as category_alias'])
      .where('articles.id', '=', id)
      .where('articles.is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    if (article) {
      const tagRef = await getTagRef(article.tags || '')
      return {
        ...article,
        tagRef
      } as ArticleWithCategory
    }

    return null
  }

  // get article by url
  async getArticleByUrl(url: string): Promise<ArticleWithCategory | null> {
    const article = await db
      .selectFrom('articles')
      .leftJoin('categories', 'categories.id', 'articles.type_id')
      .selectAll('articles')
      .select(['categories.title as type_name'])
      .select(['categories.alias as category_alias'])
      .select(['categories.title as category'])
      .where('articles.url', '=', url)
      .where('articles.is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    if (article) {
      const tagRef = await getTagRef(article.tags || '')
      return {
        ...article,
        tagRef
      } as ArticleWithCategory
    }

    return null
  }

  /**
   * Get articles with pagination and filters
   */
  async getArticles(filters: ArticleFilters): Promise<PaginatedResult<ArticleWithCategory>> {
    const { page = 1, pageSize = 10 } = filters
    const offset = (page - 1) * pageSize

    let query = db
      .selectFrom('articles')
      .leftJoin('categories', 'categories.id', 'articles.type_id')
      .selectAll('articles')
      .select(['categories.title as type_name'])
      .select(['categories.title as category'])
      .select(['categories.alias as category_alias'])

    // Add filters if provided
    if (filters.title) {
      query = query.where(sql.ref('articles.title'), 'like', `%${filters.title}%`)
    }
    if (filters.sub_title) {
      query = query.where(sql.ref('articles.sub_title'), 'like', `%${filters.sub_title}%`)
    }
    if (filters.abstract) {
      query = query.where(sql.ref('articles.abstract'), 'like', `%${filters.abstract}%`)
    }
    if (filters.url) {
      query = query.where(sql.ref('articles.url'), 'like', `%${filters.url}%`)
    }
    if (filters.type_id !== undefined) {
      query = query.where(sql.ref('articles.type_id'), '=', filters.type_id)
    }
    if (filters.type_ids) {
      query = query.where(sql.ref('articles.type_ids'), 'like', `%${filters.type_ids}%`)
    }
    if (filters.status !== undefined) {
      query = query.where(sql.ref('articles.status'), '=', filters.status)
    }
    if (filters.tags) {
      query = query.where(sql.ref('articles.tags'), 'like', `%${filters.tags}%`)
    }
    if (filters.attrs) {
      query = query.where(sql.ref('articles.attrs'), 'like', `%${filters.attrs}%`)
    }
    if (filters.tags) {
      query = query.where(sql.ref('articles.tags'), 'like', `%${filters.tags}%`)
    }
    if (filters.author_id !== undefined) {
      query = query.where(sql.ref('articles.author_id'), '=', filters.author_id)
    }
    if (filters.user_id !== undefined) {
      query = query.where(sql.ref('articles.user_id'), '=', filters.user_id)
    }
    if (filters.is_review !== undefined) {
      query = query.where(sql.ref('articles.is_review'), '=', filters.is_review)
    }
    if (filters.click !== undefined) {
      query = query.where(sql.ref('articles.click'), '=', filters.click)
    }
    if (filters.sort !== undefined) {
      query = query.where(sql.ref('articles.sort'), '=', filters.sort)
    }

    query = query.where('articles.is_delete', '=', DELETE_STATUS.UN_DELETE)

    const [articles, total] = await Promise.all([
      query.orderBy('articles.create_time', 'desc').limit(pageSize).offset(offset).execute(),
      db
        .selectFrom('articles')
        .select((eb) => [eb.fn.count('articles.id').as('count')])
        .$call((qb) => {
          if (filters.title) {
            qb = qb.where(sql.ref('articles.title'), 'like', `%${filters.title}%`)
          }
          if (filters.sub_title) {
            qb = qb.where(sql.ref('articles.sub_title'), 'like', `%${filters.sub_title}%`)
          }
          if (filters.abstract) {
            qb = qb.where(sql.ref('articles.abstract'), 'like', `%${filters.abstract}%`)
          }
          if (filters.url) {
            qb = qb.where(sql.ref('articles.url'), 'like', `%${filters.url}%`)
          }
          if (filters.type_id !== undefined) {
            qb = qb.where(sql.ref('articles.type_id'), '=', filters.type_id)
          }
          if (filters.type_ids) {
            qb = qb.where(sql.ref('articles.type_ids'), 'like', `%${filters.type_ids}%`)
          }
          if (filters.status !== undefined) {
            qb = qb.where(sql.ref('articles.status'), '=', filters.status)
          }
          if (filters.tags) {
            qb = qb.where(sql.ref('articles.tags'), 'like', `%${filters.tags}%`)
          }
          if (filters.attrs) {
            qb = qb.where(sql.ref('articles.attrs'), 'like', `%${filters.attrs}%`)
          }
          if (filters.tags) {
            qb = qb.where(sql.ref('articles.tags'), 'like', `%${filters.tags}%`)
          }
          if (filters.author_id !== undefined) {
            qb = qb.where(sql.ref('articles.author_id'), '=', filters.author_id)
          }
          if (filters.user_id !== undefined) {
            qb = qb.where(sql.ref('articles.user_id'), '=', filters.user_id)
          }
          if (filters.is_review !== undefined) {
            qb = qb.where(sql.ref('articles.is_review'), '=', filters.is_review)
          }
          if (filters.click !== undefined) {
            qb = qb.where(sql.ref('articles.click'), '=', filters.click)
          }
          if (filters.sort !== undefined) {
            qb = qb.where(sql.ref('articles.sort'), '=', filters.sort)
          }
          qb = qb.where('articles.is_delete', '=', DELETE_STATUS.UN_DELETE)
          return qb
        })
        .executeTakeFirst()
    ])

    // Add tagRef for each article
    const articlesWithTagRef = await Promise.all(
      articles.map(async (article) => {
        const tagRef = await getTagRef(article.tags || '')
        return {
          ...article,
          tagRef
        }
      })
    )

    return {
      dataList: articlesWithTagRef as ArticleWithCategory[],
      pagination: {
        total: Number(total?.count) || 0,
        page,
        pageSize,
        totalPages: Math.ceil((Number(total?.count) || 0) / pageSize)
      }
    }
  }

  /**
   * Verify that a category exists
   */
  async verifyCategoryExists(categoryId: number): Promise<boolean> {
    const category = await db
      .selectFrom('categories')
      .select('id')
      .where('id', '=', categoryId)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()
    return !!category
  }

  /**
   * Create a new article
   */
  async create(createData: CreateArticle): Promise<CreateSuccess> {
    const validatedData = createArticleSchema.parse(createData)

    // If type_id is provided, verify that the category exists
    if (validatedData.type_id) {
      const categoryExists = await this.verifyCategoryExists(validatedData.type_id)
      if (!categoryExists) {
        throw new Error('Category not found')
      }
    }

    // 处理 tags
    if (validatedData.tags) {
      const tagsArr = validatedData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
      await tagService.upsertTags(tagsArr)
    }

    if (!validatedData.url && validatedData.title) {
      validatedData.url = titleToUrl(validatedData.title)
    }

    const now = Date.now()
    const newArticle = {
      ...validatedData,
      create_time: now,
      update_time: now,
      is_delete: DELETE_STATUS.UN_DELETE
    }

    const result = await db.insertInto('articles').values(newArticle).executeTakeFirst()
    if (!result) throw new Error('创建文章失败')

    const articleId = Number(result.insertId)

    // Sync with flexsearch index
    try {
      const createdArticle = await this.getById(articleId)
      if (createdArticle) {
        await flexsearchService.addArticle({
          ...createdArticle,
          id: articleId.toString(),
          title: createdArticle.title || '',
          sub_title: createdArticle.sub_title || '',
          abstract: createdArticle.abstract || '',
          content: createdArticle.content || '',
          category: createdArticle.type_name || '',
          category_alias: createdArticle.category_alias || ''
        })
      }
    } catch (error) {
      console.error('Failed to sync article to flexsearch index:', error)
    }

    return { id: articleId }
  }

  /**
   * Update an article
   */
  async update(id: number, updateData: UpdateArticle): Promise<UpdateSuccess> {
    const validatedData = updateArticleSchema.parse(updateData)

    // If type_id is being updated, verify that the new category exists
    if (validatedData.type_id) {
      const categoryExists = await this.verifyCategoryExists(validatedData.type_id)
      if (!categoryExists) {
        throw new Error('Category not found')
      }
    }

    if (validatedData.tags) {
      const tagsArr = validatedData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
      await tagService.upsertTags(tagsArr)
    }

    if (!validatedData.url && validatedData.title) {
      validatedData.url = titleToUrl(validatedData.title)
    }

    const result = await db
      .updateTable('articles')
      .set({ ...validatedData, update_time: Date.now() })
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    // Sync with flexsearch index
    if (result.numUpdatedRows > 0) {
      try {
        const updatedArticle = await this.getById(id)
        if (updatedArticle) {
          await flexsearchService.updateArticle({
            ...updatedArticle,
            id: id.toString(),
            title: updatedArticle.title || '',
            sub_title: updatedArticle.sub_title || '',
            abstract: updatedArticle.abstract || '',
            content: updatedArticle.content || '',
            category: updatedArticle.type_name || '',
            category_alias: updatedArticle.category_alias || ''
          })
        }
      } catch (error) {
        console.error('Failed to sync updated article to flexsearch index:', error)
      }
    }

    if (!result) throw new Error('更新文章失败')
    return { id }
  }

  /**
   * Delete an article (logical delete)
   */
  async delete(id: number): Promise<boolean> {
    const result = await db
      .updateTable('articles')
      .set({
        is_delete: DELETE_STATUS.DELETE,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    // Sync with flexsearch index
    if (result.numUpdatedRows > 0) {
      try {
        await flexsearchService.removeArticle(id.toString())
      } catch (error) {
        console.error('Failed to remove article from flexsearch index:', error)
      }
    }

    return Number(result.numUpdatedRows) > 0
  }

  /**
   * Get articles by category ID
   */
  async getArticlesByCategory(type_id: number, limit = 10): Promise<ArticleWithCategory[]> {
    const articles = await db
      .selectFrom('articles')
      .selectAll()
      .where(sql.ref('type_id'), '=', type_id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .orderBy('create_time', 'desc')
      .limit(limit)
      .execute()

    // Add tagRef for each article
    const articlesWithTagRef = await Promise.all(
      articles.map(async (article) => {
        const tagRef = await getTagRef(article.tags || '')
        return {
          ...article,
          tagRef
        }
      })
    )

    return articlesWithTagRef as ArticleWithCategory[]
  }

  /**
   * Get articles by status
   */
  async getArticlesByStatus(status: number, limit = 10): Promise<ArticleWithCategory[]> {
    const articles = await db
      .selectFrom('articles')
      .selectAll()
      .where('status', '=', status)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .orderBy('create_time', 'desc')
      .limit(limit)
      .execute()

    // Add tagRef for each article
    const articlesWithTagRef = await Promise.all(
      articles.map(async (article) => {
        const tagRef = await getTagRef(article.tags || '')
        return {
          ...article,
          tagRef
        }
      })
    )

    return articlesWithTagRef as ArticleWithCategory[]
  }

  /**
   * Get articles by tag
   */
  async getArticlesByTag(tag: string, limit = 10): Promise<ArticleWithCategory[]> {
    const articles = await db
      .selectFrom('articles')
      .selectAll()
      .where('tags', 'like', `%${tag}%`)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .orderBy('create_time', 'desc')
      .limit(limit)
      .execute()

    // Add tagRef for each article
    const articlesWithTagRef = await Promise.all(
      articles.map(async (article) => {
        const tagRef = await getTagRef(article.tags || '')
        return {
          ...article,
          tagRef
        }
      })
    )

    return articlesWithTagRef as ArticleWithCategory[]
  }

  /**
   * Increment view count for an article
   */
  async incrementViewCount(id: number) {
    return await db
      .updateTable('articles')
      .set({
        click: sql`${sql.ref('click')} + 1`,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()
  }

  // 统计文章总数
  async countArticles(): Promise<number> {
    const result = await db
      .selectFrom('articles')
      .select((eb) => [eb.fn.count('id').as('count')])
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()
    return Number(result?.count) || 0
  }

  // 统计所有文章浏览量总和
  async sumArticleViews(): Promise<number> {
    const result = await db
      .selectFrom('articles')
      .select((eb) => [eb.fn.sum(sql.ref('click')).as('views')])
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()
    return Number(result?.views) || 0
  }

  // 按分类统计文章数
  async countArticlesByCategoryId(typeId: number): Promise<number> {
    const result = await db
      .selectFrom('articles')
      .select((eb) => [eb.fn.count('id').as('count')])
      .where('type_id', '=', typeId)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()
    return Number(result?.count) || 0
  }

  // 获取最新文章
  async getRecentArticles(limit: number = 5): Promise<ArticleWithCategory[]> {
    const articles = await db
      .selectFrom('articles')
      .selectAll()
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .orderBy('create_time', 'desc')
      .limit(limit)
      .execute()

    // Add tagRef for each article
    const articlesWithTagRef = await Promise.all(
      articles.map(async (article) => {
        const tagRef = await getTagRef(article.tags || '')
        return {
          ...article,
          tagRef
        }
      })
    )

    return articlesWithTagRef as ArticleWithCategory[]
  }

  /**
   * Get previous article by current article id
   * @param currentId Current article id
   * @returns Previous article or null
   */
  async getPreviousArticle(
    currentId: number,
    typeId?: number
  ): Promise<ArticleWithCategory | null> {
    let query = db
      .selectFrom('articles')
      .leftJoin('categories', 'categories.id', 'articles.type_id')
      .selectAll('articles')
      .select(['categories.title as type_name'])
      .select(['categories.alias as category_alias'])
      .select(['categories.title as category'])
      .where('articles.id', '<', currentId)
      .where('articles.status', '=', PUBLISH_STATUS.PUBLISHED)
      .where('articles.is_delete', '=', DELETE_STATUS.UN_DELETE)

    if (typeof typeId === 'number') {
      query = query.where('articles.type_id', '=', typeId)
    }

    const article = await query.orderBy('articles.id', 'desc').limit(1).executeTakeFirst()

    if (article) {
      const tagRef = await getTagRef(article.tags || '')
      return {
        ...article,
        tagRef
      } as ArticleWithCategory
    }

    return null
  }

  /**
   * Get next article by current article id
   * @param currentId Current article id
   * @returns Next article or null
   */
  async getNextArticle(currentId: number, typeId?: number): Promise<ArticleWithCategory | null> {
    let query = db
      .selectFrom('articles')
      .leftJoin('categories', 'categories.id', 'articles.type_id')
      .selectAll('articles')
      .select(['categories.title as type_name'])
      .select(['categories.alias as category_alias'])
      .select(['categories.title as category'])
      .where('articles.id', '>', currentId)
      .where('articles.status', '=', PUBLISH_STATUS.PUBLISHED)
      .where('articles.is_delete', '=', DELETE_STATUS.UN_DELETE)

    if (typeof typeId === 'number') {
      query = query.where('articles.type_id', '=', typeId)
    }

    const article = await query.orderBy('articles.id', 'asc').limit(1).executeTakeFirst()

    if (article) {
      const tagRef = await getTagRef(article.tags || '')
      return {
        ...article,
        tagRef
      } as ArticleWithCategory
    }

    return null
  }
}

export const articleService = new ArticleService()
