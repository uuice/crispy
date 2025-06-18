import { db } from '@src/libs/db'
import { sql } from 'kysely'

// Data interfaces
export interface CreatePageData {
  title: string
  alias: string
  content: string
  seo_description?: string
  seo_keywords?: string
  image_list?: string
  status: number
}

export type UpdatePageData = Partial<CreatePageData>

export interface PageFilters {
  title?: string
  alias?: string
  status?: number
  startTime?: number
  endTime?: number
}

export interface PagePaginationParams {
  page: number
  pageSize: number
}

export interface Page {
  id: number
  title: string
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
}

export interface PaginatedPagesResult {
  data: Page[]
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
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    return result as unknown as Page | null
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

    return result as unknown as Page | null
  }

  /**
   * Get pages list with pagination and filters
   */
  async getPages(
    pagination: PagePaginationParams,
    filters?: PageFilters
  ): Promise<PaginatedPagesResult> {
    const { page, pageSize } = pagination
    const offset = (page - 1) * pageSize

    let query = db.selectFrom('pages').selectAll().where('is_delete', '=', 0)

    // Apply filters
    if (filters) {
      if (filters.title) {
        query = query.where('title', 'like', `%${filters.title}%`)
      }
      if (filters.alias) {
        query = query.where('alias', 'like', `%${filters.alias}%`)
      }
      if (filters.status !== undefined) {
        query = query.where('status', '=', filters.status)
      }
      if (filters.startTime) {
        query = query.where('create_time', '>=', filters.startTime)
      }
      if (filters.endTime) {
        query = query.where('create_time', '<=', filters.endTime)
      }
    }

    // Order by create_time desc by default
    query = query.orderBy('create_time', 'desc')

    const [pages, total] = await Promise.all([
      query.limit(pageSize).offset(offset).execute(),
      query.select((eb) => [eb.fn.count('id').as('count')]).executeTakeFirst()
    ])

    return {
      data: pages as unknown as Page[],
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
    const now = Date.now()
    const newPage = {
      ...data,
      create_time: now,
      update_time: now,
      is_delete: 0
    }

    const result = await db.insertInto('pages').values(newPage).executeTakeFirst()

    return {
      id: Number(result.insertId),
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

    const result = await db
      .updateTable('pages')
      .set(updateData)
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    return result.numUpdatedRows > 0n
  }

  /**
   * Delete page (logical delete)
   */
  async deletePage(id: number): Promise<boolean> {
    const result = await db
      .updateTable('pages')
      .set({
        is_delete: 10,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

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

    return result as unknown as Page[]
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

    return result as unknown as Page[]
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

    return result as unknown as Page[]
  }
}

// Export singleton instance
export const pageService = new PageService()
