import { db } from '@src/libs/db'
import { DELETE_STATUS } from '../config/const'
import {
  CreateLink,
  createLinkSchema,
  CreateSuccess,
  LinkFilters,
  LinkWithType,
  PaginatedResult,
  UpdateLink,
  updateLinkSchema,
  UpdateSuccess
} from '@src/types'
import { sql } from 'kysely'

export class LinkService {
  /**
   * Get single link by ID
   * @param id Link id
   * @returns Link with type name or null if not found
   */
  async getById(id: number): Promise<LinkWithType | null> {
    const link = await db
      .selectFrom('links')
      .leftJoin('categories', 'links.type_id', 'categories.id')
      .selectAll('links')
      .select('categories.title as type_name')
      .where('links.id', '=', id)
      .where('links.is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()
    return (link as LinkWithType) || null
  }

  /**
   * Get links list with pagination and filters
   * @param filters Filter options
   * @param options Pagination options
   * @returns List of links with type names and pagination info
   */
  async getLinks(filters: LinkFilters): Promise<PaginatedResult<LinkWithType>> {
    const page = Number(filters.page) || 1
    const pageSize = Number(filters.pageSize) || 10
    const {
      site_name,
      url,
      des,
      logo,
      method,
      status,
      type_id,
      create_time_start,
      create_time_end,
      update_time_start,
      update_time_end
    } = filters
    const offset = (page - 1) * pageSize

    let query = db
      .selectFrom('links')
      .leftJoin('categories', 'links.type_id', 'categories.id')
      .selectAll('links')
      .select('categories.title as type_name')

    // Apply filters（title 与 site_name 等价，按站点名称搜索）
    if (site_name) {
      query = query.where('links.site_name', 'like', `%${site_name}%`)
    }

    if (url) {
      query = query.where('links.url', 'like', `%${url}%`)
    }

    if (des) {
      query = query.where('links.des', 'like', `%${des}%`)
    }

    if (logo) {
      query = query.where('links.logo', 'like', `%${logo}%`)
    }

    if (method) {
      query = query.where('links.method', '=', method)
    }

    if (status !== undefined) {
      query = query.where('links.status', '=', status)
    }

    if (type_id !== undefined) {
      query = query.where('links.type_id', '=', type_id)
    }

    if (create_time_start !== undefined) {
      query = query.where('links.create_time', '>=', create_time_start)
    }

    if (create_time_end !== undefined) {
      query = query.where('links.create_time', '<=', create_time_end)
    }

    if (update_time_start !== undefined) {
      query = query.where('links.update_time', '>=', update_time_start)
    }

    if (update_time_end !== undefined) {
      query = query.where('links.update_time', '<=', update_time_end)
    }

    // Default to only non-deleted links
    query = query.where('links.is_delete', '=', DELETE_STATUS.UN_DELETE)

    const [links, total] = await Promise.all([
      query.orderBy('links.create_time', 'desc').limit(pageSize).offset(offset).execute(),
      db
        .selectFrom('links')
        .select((eb) => [eb.fn.count('id').as('count')])
        .$call((qb) => {
          // Apply same filters to count query
          if (site_name) {
            qb = qb.where('site_name', 'like', `%${site_name}%`)
          }
          if (url) {
            qb = qb.where('url', 'like', `%${url}%`)
          }
          if (des) {
            qb = qb.where('des', 'like', `%${des}%`)
          }
          if (logo) {
            qb = qb.where('logo', 'like', `%${logo}%`)
          }
          if (method) {
            qb = qb.where('method', '=', method)
          }
          if (status !== undefined) {
            qb = qb.where('status', '=', status)
          }
          if (type_id !== undefined) {
            qb = qb.where('type_id', '=', type_id)
          }
          if (create_time_start !== undefined) {
            qb = qb.where('create_time', '>=', create_time_start)
          }
          if (create_time_end !== undefined) {
            qb = qb.where('create_time', '<=', create_time_end)
          }
          if (update_time_start !== undefined) {
            qb = qb.where('update_time', '>=', update_time_start)
          }
          if (update_time_end !== undefined) {
            qb = qb.where('update_time', '<=', update_time_end)
          }
          qb = qb.where('is_delete', '=', DELETE_STATUS.UN_DELETE)
          return qb
        })
        .executeTakeFirst()
    ])

    return {
      dataList: links as LinkWithType[],
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
   * @param createData Link data without id
   * @returns Created link id
   */
  async create(createData: CreateLink): Promise<CreateSuccess> {
    // 验证
    const validatedData = createLinkSchema.parse(createData)
    const now = Date.now()
    const newLink = {
      ...validatedData,
      create_time: now,
      update_time: now,
      is_delete: DELETE_STATUS.UN_DELETE
    }

    const result = await db.insertInto('links').values(newLink).executeTakeFirst()
    if (!result) throw new Error('创建链接失败')
    return { id: Number(result.insertId) }
  }

  /**
   * Update link by ID
   * @param id Link id
   * @param updateData Data to update
   * @returns Updated link id
   */
  async update(id: number, updateData: UpdateLink): Promise<UpdateSuccess> {
    const validatedData = updateLinkSchema.parse(updateData)
    const result = await db
      .updateTable('links')
      .set({
        ...validatedData,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    if (!result) throw new Error('更新链接失败')
    return { id }
  }

  /**
   * Soft delete link
   * @param id Link id
   * @returns true if deleted successfully
   */
  async delete(id: number): Promise<boolean> {
    const result = await db
      .updateTable('links')
      .set({
        is_delete: DELETE_STATUS.DELETE,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()
    return Number(result.numUpdatedRows) > 0
  }

  /**
   * Get links by status
   * @param status Link status
   * @returns List of links with type names
   */
  async getLinksByStatus(status: number): Promise<LinkWithType[]> {
    return (await db
      .selectFrom('links')
      .leftJoin('categories', 'links.type_id', 'categories.id')
      .selectAll('links')
      .select('categories.title as type_name')
      .where('links.status', '=', status)
      .where('links.is_delete', '=', DELETE_STATUS.UN_DELETE)
      .orderBy('links.sort', 'asc')
      .orderBy('links.create_time', 'desc')
      .execute()) as LinkWithType[]
  }

  /**
   * Get links by type
   * @param typeId Type id
   * @returns List of links with type names
   */
  async getLinksByType(typeId: number): Promise<LinkWithType[]> {
    return (await db
      .selectFrom('links')
      .leftJoin('categories', 'links.type_id', 'categories.id')
      .selectAll('links')
      .select('categories.title as type_name')
      .where('links.type_id', '=', typeId)
      .where('links.is_delete', '=', DELETE_STATUS.UN_DELETE)
      .orderBy('links.sort', 'asc')
      .orderBy('links.create_time', 'desc')
      .execute()) as LinkWithType[]
  }

  /**
   * Search links by site name or URL
   * @param searchTerm Search term
   * @returns List of links with type names
   */
  async searchLinks(searchTerm: string): Promise<LinkWithType[]> {
    return (await db
      .selectFrom('links')
      .leftJoin('categories', 'links.type_id', 'categories.id')
      .selectAll('links')
      .select('categories.title as type_name')
      .where('links.is_delete', '=', DELETE_STATUS.UN_DELETE)
      .where((eb) =>
        eb.or([
          eb('links.site_name', 'like', `%${searchTerm}%`),
          eb('links.url', 'like', `%${searchTerm}%`)
        ])
      )
      .orderBy('links.sort', 'asc')
      .orderBy('links.create_time', 'desc')
      .execute()) as LinkWithType[]
  }

  /**
   * Get links count by status
   * @returns Count by status
   */
  async getLinksCountByStatus(): Promise<{ status: number; count: number }[]> {
    return await db
      .selectFrom('links')
      .select(['status', sql<number>`count(*)`.as('count')])
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .groupBy('status')
      .execute()
  }

  /**
   * Get links count by type
   * @returns Count by type
   */
  async getLinksCountByType(): Promise<{ type_id: number; count: number }[]> {
    return await db
      .selectFrom('links')
      .select(['type_id', sql<number>`count(*)`.as('count')])
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .groupBy('type_id')
      .execute()
  }

  /**
   * Check if link exists by URL
   * @param url Link URL
   * @param excludeId Link id to exclude from check
   * @returns true if exists
   */
  async checkLinkExistsByUrl(url: string, excludeId?: number): Promise<boolean> {
    let query = db
      .selectFrom('links')
      .select('id')
      .where('url', '=', url)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)

    if (excludeId) {
      query = query.where('id', '!=', excludeId)
    }

    const result = await query.executeTakeFirst()
    return !!result
  }
}

export const linkService = new LinkService()
