import { db } from '@src/libs/db'
import { sql } from 'kysely'

// Data interfaces
export interface CreateLinkData {
  site_name: string
  des: string
  url: string
  logo?: string
  method?: string
  type_id: number
  sort: number
  status: number
}

export type UpdateLinkData = Partial<CreateLinkData>

export interface LinkFilters {
  siteName?: string
  url?: string
  status?: number
  typeId?: number
  startTime?: number
  endTime?: number
}

export interface LinkPaginationParams {
  page: number
  pageSize: number
}

export interface Link {
  id: number
  site_name: string
  des: string
  url: string
  logo?: string
  method?: string
  type_id: number
  sort: number
  status: number
  create_time: number
  update_time: number
  is_delete: number
}

export interface PaginatedLinksResult {
  dataList: Link[]
  pagination: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

export class LinkService {
  /**
   * Get single link by ID
   */
  async getLinkById(id: number): Promise<Link | null> {
    const result = await db
      .selectFrom('links')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    return result as Link | null
  }

  /**
   * Get links list with pagination and filters
   */
  async getLinks(
    pagination: LinkPaginationParams,
    filters?: LinkFilters
  ): Promise<PaginatedLinksResult> {
    const { page, pageSize } = pagination
    const offset = (page - 1) * pageSize

    let query = db.selectFrom('links').selectAll().where('is_delete', '=', 0)

    // Apply filters
    if (filters) {
      if (filters.siteName) {
        query = query.where('site_name', 'like', `%${filters.siteName}%`)
      }
      if (filters.url) {
        query = query.where('url', 'like', `%${filters.url}%`)
      }
      if (filters.status !== undefined) {
        query = query.where('status', '=', filters.status)
      }
      if (filters.typeId !== undefined) {
        query = query.where('type_id', '=', filters.typeId)
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

    const [links, total] = await Promise.all([
      query.limit(pageSize).offset(offset).execute(),
      query.select((eb) => [eb.fn.count('id').as('count')]).executeTakeFirst()
    ])

    return {
      dataList: links as Link[],
      pagination: {
        total: Number(total?.count) || 0,
        page,
        pageSize,
        totalPages: Math.ceil((Number(total?.count) || 0) / pageSize)
      }
    }
  }

  /**
   * Create new link
   */
  async createLink(data: CreateLinkData): Promise<Link> {
    const now = Date.now()
    const newLink = {
      ...data,
      create_time: now,
      update_time: now,
      is_delete: 0
    }

    const result = await db.insertInto('links').values(newLink).executeTakeFirst()

    return {
      id: Number(result.insertId),
      ...newLink
    }
  }

  /**
   * Update link by ID
   */
  async updateLink(id: number, data: UpdateLinkData): Promise<boolean> {
    const updateData = {
      ...data,
      update_time: Date.now()
    }

    const result = await db
      .updateTable('links')
      .set(updateData)
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    return result.numUpdatedRows > 0n
  }

  /**
   * Delete link (logical delete)
   */
  async deleteLink(id: number): Promise<boolean> {
    const result = await db
      .updateTable('links')
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
   * Get links by status
   */
  async getLinksByStatus(status: number): Promise<Link[]> {
    const result = await db
      .selectFrom('links')
      .selectAll()
      .where('status', '=', status)
      .where('is_delete', '=', 0)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .execute()

    return result as Link[]
  }

  /**
   * Get links by type
   */
  async getLinksByType(typeId: number): Promise<Link[]> {
    const result = await db
      .selectFrom('links')
      .selectAll()
      .where('type_id', '=', typeId)
      .where('is_delete', '=', 0)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .execute()

    return result as Link[]
  }

  /**
   * Search links by site name or URL
   */
  async searchLinks(searchTerm: string): Promise<Link[]> {
    const result = await db
      .selectFrom('links')
      .selectAll()
      .where('is_delete', '=', 0)
      .where((eb) =>
        eb.or([eb('site_name', 'like', `%${searchTerm}%`), eb('url', 'like', `%${searchTerm}%`)])
      )
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .execute()

    return result as Link[]
  }

  /**
   * Get links count by status
   */
  async getLinksCountByStatus(): Promise<{ status: number; count: number }[]> {
    return await db
      .selectFrom('links')
      .select(['status', sql<number>`count(*)`.as('count')])
      .where('is_delete', '=', 0)
      .groupBy('status')
      .execute()
  }

  /**
   * Get links count by type
   */
  async getLinksCountByType(): Promise<{ type_id: number; count: number }[]> {
    return await db
      .selectFrom('links')
      .select(['type_id', sql<number>`count(*)`.as('count')])
      .where('is_delete', '=', 0)
      .groupBy('type_id')
      .execute()
  }

  /**
   * Check if link exists by URL
   */
  async checkLinkExistsByUrl(url: string, excludeId?: number): Promise<boolean> {
    let query = db
      .selectFrom('links')
      .select('id')
      .where('url', '=', url)
      .where('is_delete', '=', 0)

    if (excludeId) {
      query = query.where('id', '!=', excludeId)
    }

    const result = await query.executeTakeFirst()
    return !!result
  }

  /**
   * Get links statistics
   */
  async getLinksStats(): Promise<{
    total: number
    active: number
    inactive: number
    deleted: number
    byType: { type_id: number; count: number }[]
  }> {
    const [stats, byType] = await Promise.all([
      db
        .selectFrom('links')
        .select([
          sql<number>`count(*)`.as('total'),
          sql<number>`sum(case when status = 10 then 1 else 0 end)`.as('active'),
          sql<number>`sum(case when status = 0 then 1 else 0 end)`.as('inactive'),
          sql<number>`sum(case when is_delete = 10 then 1 else 0 end)`.as('deleted')
        ])
        .executeTakeFirst(),
      this.getLinksCountByType()
    ])

    return {
      total: Number(stats?.total) || 0,
      active: Number(stats?.active) || 0,
      inactive: Number(stats?.inactive) || 0,
      deleted: Number(stats?.deleted) || 0,
      byType
    }
  }
}

// Export singleton instance
export const linkService = new LinkService()
