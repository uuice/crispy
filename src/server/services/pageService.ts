import { db } from '@src/libs/db'
import { sql } from 'kysely'
import { tagService } from './tagService'
import { titleToUrl } from '../utils/titleToUrl'
import { flexsearchService } from './flexsearch-index.service'

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

// Data interfaces
export interface CreatePageData {
  title: string
  url?: string
  alias: string
  content: string
  abstract?: string
  sub_title?: string
  seo_title?: string
  seo_description?: string
  seo_keywords?: string
  image_list?: string
  tags?: string
  remark?: string
  type_id?: number
  author_id?: number
  user_id?: number
  status: number
}

export type UpdatePageData = Partial<CreatePageData>

export interface PageFilters {
  title?: string
  alias?: string
  sub_title?: string
  abstract?: string
  url?: string
  status?: number
  type_id?: number
  author_id?: number
  user_id?: number
  sort_min?: number
  sort_max?: number
  click_min?: number
  click_max?: number
  startTime?: number
  endTime?: number
  has_image?: boolean
  has_tags?: boolean
}

export interface PagePaginationParams {
  page: number
  pageSize: number
}

export interface Page {
  id: number
  title: string
  url?: string
  alias: string
  content: string
  des?: string
  keywords?: string
  cover_image?: string
  status: number
  create_time: number
  update_time: number
  is_delete: number
  // Additional fields from database
  abstract?: string
  author_id?: number
  click?: number
  image_list?: string
  remark?: string
  seo_description?: string
  seo_keywords?: string
  seo_title?: string
  sub_title?: string
  tags?: string
  type_id?: number
  user_id?: number
  tagRef?: { [key: string]: string }
}

export interface PaginatedPagesResult {
  dataList: Page[]
  pagination: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

export class PageService {
  /**
   * Get single page by ID
   */
  async getPageById(id: number): Promise<Page | null> {
    const result = await db
      .selectFrom('pages')
      .leftJoin('categories', 'categories.id', 'pages.type_id')
      .selectAll('pages')
      .select(['categories.id as type_id', 'categories.title as type_title'])
      .where('pages.id', '=', id)
      .where('pages.is_delete', '=', 0)
      .executeTakeFirst()

    if (!result) {
      return null
    }

    // Transform the result to include type information and tagRef
    const page = result as any
    const tagRef = await getTagRef(page.tags || '')

    return {
      ...page,
      type: page.type_id
        ? {
            id: page.type_id,
            title: page.type_title
          }
        : null,
      tagRef
    } as Page
  }

  // get page by url

  async getPageByUrl(url: string): Promise<Page | null> {
    const result = await db
      .selectFrom('pages')
      .leftJoin('categories', 'categories.id', 'pages.type_id')
      .selectAll('pages')
      .select(['categories.id as type_id', 'categories.title as type_title'])
      .where('pages.url', '=', url)
      .where('pages.is_delete', '=', 0)
      .executeTakeFirst()

    if (!result) {
      return null
    }

    // Transform the result to include type information and tagRef
    const page = result as any
    const tagRef = await getTagRef(page.tags || '')

    return {
      ...page,
      type: page.type_id
        ? {
            id: page.type_id,
            title: page.type_title
          }
        : null,
      tagRef
    } as Page
  }

  /**
   * Get page by alias
   */
  async getPageByAlias(alias: string): Promise<Page | null> {
    const result = await db
      .selectFrom('pages')
      .selectAll()
      .where('alias', '=', alias)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (!result) {
      return null
    }

    // Add tagRef
    const tagRef = await getTagRef(result.tags || '')
    return {
      ...result,
      tagRef
    } as unknown as Page
  }

  /**
   * Get pages list with pagination and filters
   */
  async getPages(pagination: PagePaginationParams, filters?: PageFilters): Promise<any> {
    const { page, pageSize } = pagination
    const offset = (page - 1) * pageSize

    let query = db
      .selectFrom('pages')
      .leftJoin('categories', 'categories.id', 'pages.type_id')
      .selectAll('pages')
      .select(['categories.id as type_id', 'categories.title as type_title'])
      .where('pages.is_delete', '=', 0)

    // Apply filters
    if (filters) {
      if (filters.title) {
        query = query.where('pages.title', 'like', `%${filters.title}%`)
      }
      if (filters.alias) {
        query = query.where('pages.alias', 'like', `%${filters.alias}%`)
      }
      if (filters.sub_title) {
        query = query.where('pages.sub_title', 'like', `%${filters.sub_title}%`)
      }
      if (filters.abstract) {
        query = query.where('pages.abstract', 'like', `%${filters.abstract}%`)
      }
      if (filters.url) {
        query = query.where('pages.url', 'like', `%${filters.url}%`)
      }
      if (filters.status !== undefined) {
        query = query.where('pages.status', '=', filters.status)
      }
      if (filters.type_id !== undefined) {
        query = query.where('pages.type_id', '=', filters.type_id)
      }
      if (filters.author_id !== undefined && !isNaN(filters.author_id)) {
        query = query.where('pages.author_id', '=', filters.author_id)
      }
      if (filters.user_id !== undefined && !isNaN(filters.user_id)) {
        query = query.where('pages.user_id', '=', filters.user_id)
      }
      if (filters.sort_min !== undefined && !isNaN(filters.sort_min)) {
        query = query.where(sql.ref('pages.sort'), '>=', filters.sort_min)
      }
      if (filters.sort_max !== undefined && !isNaN(filters.sort_max)) {
        query = query.where(sql.ref('pages.sort'), '<=', filters.sort_max)
      }
      if (filters.click_min !== undefined && !isNaN(filters.click_min)) {
        query = query.where('pages.click', '>=', filters.click_min)
      }
      if (filters.click_max !== undefined && !isNaN(filters.click_max)) {
        query = query.where('pages.click', '<=', filters.click_max)
      }
      if (filters.startTime !== undefined) {
        query = query.where('pages.create_time', '>=', filters.startTime)
      }
      if (filters.endTime !== undefined) {
        query = query.where('pages.create_time', '<=', filters.endTime)
      }
      if (filters.has_image === true) {
        query = query.where('pages.image_list', 'is not', null)
      }
      if (filters.has_image === false) {
        query = query.where('pages.image_list', 'is', null)
      }
      if (filters.has_tags === true) {
        query = query.where('pages.tags', 'is not', null)
      }
      if (filters.has_tags === false) {
        query = query.where('pages.tags', 'is', null)
      }
    }

    // Order by create_time desc by default
    query = query.orderBy('pages.create_time', 'desc')

    const [pages, total] = await Promise.all([
      query.limit(pageSize).offset(offset).execute(),
      query.select((eb) => [eb.fn.count('pages.id').as('count')]).executeTakeFirst()
    ])

    // Transform the result to include type information and tagRef
    const transformedPages = await Promise.all(
      pages.map(async (page: any) => {
        const tagRef = await getTagRef(page.tags || '')
        return {
          ...page,
          type: page.type_id
            ? {
                id: page.type_id,
                title: page.type_title
              }
            : null,
          tagRef
        }
      })
    )

    return {
      dataList: transformedPages as unknown as Page[],
      pagination: {
        total: Number(total?.count) || 0,
        page,
        pageSize,
        totalPages: Math.ceil((Number(total?.count) || 0) / pageSize)
      }
    }
  }

  /**
   * Create new page
   */
  async createPage(data: CreatePageData): Promise<Page> {
    // 新增：处理 tags
    if (data.tags) {
      const tagsArr = data.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
      await tagService.upsertTags(tagsArr)
    }

    if (!data.url && data.title) {
      data.url = titleToUrl(data.title)
    }

    const now = Date.now()
    const newPage = {
      ...data,
      create_time: now,
      update_time: now,
      is_delete: 0
    }

    const result = await db.safeInsertInto('pages').values(newPage).executeTakeFirst()

    const pageId = Number(result.insertId)

    // Sync with flexsearch index
    try {
      const createdPage = await this.getPageById(pageId)
      if (createdPage) {
        await flexsearchService.addPage({
          ...createdPage,
          id: pageId.toString(),
          title: createdPage.title || '',
          sub_title: createdPage.sub_title || '',
          abstract: createdPage.abstract || '',
          content: createdPage.content || ''
        })
      }
    } catch (error) {
      console.error('Failed to sync page to flexsearch index:', error)
    }

    return {
      id: pageId,
      ...newPage
    }
  }

  /**
   * Update page by ID
   */
  async updatePage(id: number, data: UpdatePageData): Promise<boolean> {
    const updateData = {
      ...data,
      update_time: Date.now()
    }

    if (updateData.tags) {
      const tagsArr = updateData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
      await tagService.upsertTags(tagsArr)
    }

    if (!updateData.url && updateData.title) {
      updateData.url = titleToUrl(updateData.title)
    }

    const result = await db
      .safeUpdateTable('pages')
      .set(updateData)
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    // Sync with flexsearch index
    if (result.numUpdatedRows > 0) {
      try {
        const updatedPage = await this.getPageById(id)
        if (updatedPage) {
          await flexsearchService.updatePage({
            ...updatedPage,
            id: id.toString(),
            title: updatedPage.title || '',
            sub_title: updatedPage.sub_title || '',
            abstract: updatedPage.abstract || '',
            content: updatedPage.content || ''
          })
        }
      } catch (error) {
        console.error('Failed to sync updated page to flexsearch index:', error)
      }
    }

    return result.numUpdatedRows > 0n
  }

  /**
   * Delete page (logical delete)
   */
  async deletePage(id: number): Promise<boolean> {
    const result = await db
      .safeUpdateTable('pages')
      .set({
        is_delete: 10,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    // Sync with flexsearch index
    if (result.numUpdatedRows > 0) {
      try {
        await flexsearchService.removePage(id.toString())
      } catch (error) {
        console.error('Failed to remove page from flexsearch index:', error)
      }
    }

    return result.numUpdatedRows > 0n
  }

  /**
   * Get pages by status
   */
  async getPagesByStatus(status: number): Promise<Page[]> {
    const result = await db
      .selectFrom('pages')
      .selectAll()
      .where('status', '=', status)
      .where('is_delete', '=', 0)
      .orderBy('create_time', 'desc')
      .execute()

    // Add tagRef for each page
    const pagesWithTagRef = await Promise.all(
      result.map(async (page: any) => {
        const tagRef = await getTagRef(page.tags || '')
        return {
          ...page,
          tagRef
        }
      })
    )

    return pagesWithTagRef as unknown as Page[]
  }

  /**
   * Search pages by title, alias, content or seo_keywords
   */
  async searchPages(searchTerm: string): Promise<Page[]> {
    const result = await db
      .selectFrom('pages')
      .selectAll()
      .where('is_delete', '=', 0)
      .where((eb) =>
        eb.or([
          eb('title', 'like', `%${searchTerm}%`),
          eb('alias', 'like', `%${searchTerm}%`),
          eb('content', 'like', `%${searchTerm}%`),
          eb('seo_keywords', 'like', `%${searchTerm}%`)
        ])
      )
      .orderBy('create_time', 'desc')
      .execute()

    // Add tagRef for each page
    const pagesWithTagRef = await Promise.all(
      result.map(async (page: any) => {
        const tagRef = await getTagRef(page.tags || '')
        return {
          ...page,
          tagRef
        }
      })
    )

    return pagesWithTagRef as unknown as Page[]
  }

  /**
   * Get pages count by status
   */
  async getPagesCountByStatus(): Promise<{ status: number; count: number }[]> {
    return await db
      .selectFrom('pages')
      .select(['status', sql<number>`count(*)`.as('count')])
      .where('is_delete', '=', 0)
      .groupBy('status')
      .execute()
  }

  /**
   * Check if page exists by alias
   */
  async checkPageExistsByAlias(alias: string, excludeId?: number): Promise<boolean> {
    let query = db
      .selectFrom('pages')
      .select('id')
      .where('alias', '=', alias)
      .where('is_delete', '=', 0)

    if (excludeId) {
      query = query.where('id', '!=', excludeId)
    }

    const result = await query.executeTakeFirst()
    return !!result
  }

  /**
   * Get pages statistics
   */
  async getPagesStats(): Promise<{
    total: number
    active: number
    inactive: number
    deleted: number
  }> {
    const stats = await db
      .selectFrom('pages')
      .select([
        sql<number>`count(*)`.as('total'),
        sql<number>`sum(case when status = 10 then 1 else 0 end)`.as('active'),
        sql<number>`sum(case when status = 0 then 1 else 0 end)`.as('inactive'),
        sql<number>`sum(case when is_delete = 10 then 1 else 0 end)`.as('deleted')
      ])
      .executeTakeFirst()

    return {
      total: Number(stats?.total) || 0,
      active: Number(stats?.active) || 0,
      inactive: Number(stats?.inactive) || 0,
      deleted: Number(stats?.deleted) || 0
    }
  }

  /**
   * Get recent pages
   */
  async getRecentPages(limit: number = 10): Promise<Page[]> {
    const result = await db
      .selectFrom('pages')
      .selectAll()
      .where('is_delete', '=', 0)
      .orderBy('create_time', 'desc')
      .limit(limit)
      .execute()

    // Add tagRef for each page
    const pagesWithTagRef = await Promise.all(
      result.map(async (page: any) => {
        const tagRef = await getTagRef(page.tags || '')
        return {
          ...page,
          tagRef
        }
      })
    )

    return pagesWithTagRef as unknown as Page[]
  }
}

// Export singleton instance
export const pageService = new PageService()
