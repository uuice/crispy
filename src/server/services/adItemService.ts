import { db } from '@src/libs/db'
import { DELETE_STATUS } from '../config/const'
import {
  AdItemEntity,
  AdItemFilters,
  CreateAdItem,
  createAdItemSchema,
  CreateSuccess,
  PaginatedResult,
  PaginationOptions,
  UpdateAdItem,
  updateAdItemSchema,
  UpdateSuccess
} from '@src/types'

// Ad Item Service Class
export class AdItemService {
  /**
   * Get a single ad item by ID
   * @param id Ad item id
   * @returns Ad item or null if not found
   */
  async getAdItemById(id: number): Promise<AdItemEntity | null> {
    const adItem = await db
      .selectFrom('ad_items')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()
    return adItem || null
  }

  /**
   * Get ad items list with pagination and filters
   * @param filters Filter options
   * @param options Pagination options
   * @returns List of ad items and pagination info
   */
  async getAdItems(filters: AdItemFilters): Promise<PaginatedResult<AdItemEntity>> {
    const { page = 1, pageSize = 10 } = filters
    const { ad_id, title, content, image_url, url, status } = filters
    const offset = (page - 1) * pageSize

    // Build query conditions
    let query = db.selectFrom('ad_items').selectAll()

    // Apply filters
    if (ad_id !== undefined) {
      query = query.where('ad_id', '=', ad_id)
    }

    if (title) {
      query = query.where('title', 'like', `%${title}%`)
    }

    if (content) {
      query = query.where('content', 'like', `%${content}%`)
    }

    if (image_url) {
      query = query.where('image_url', 'like', `%${image_url}%`)
    }

    if (url) {
      query = query.where('url', 'like', `%${url}%`)
    }

    if (status !== undefined) {
      query = query.where('status', '=', status)
    }

    // Default to only non-deleted items
    query = query.where('is_delete', '=', DELETE_STATUS.UN_DELETE)

    const [adItems, total] = await Promise.all([
      query
        .orderBy('sort', 'asc')
        .orderBy('create_time', 'desc')
        .limit(pageSize)
        .offset(offset)
        .execute(),
      db
        .selectFrom('ad_items')
        .select((eb) => [eb.fn.count('id').as('count')])
        .$call((qb) => {
          // Apply same filters to count query
          if (ad_id !== undefined) {
            qb = qb.where('ad_id', '=', ad_id)
          }
          if (title) {
            qb = qb.where('title', 'like', `%${title}%`)
          }
          if (content) {
            qb = qb.where('content', 'like', `%${content}%`)
          }
          if (image_url) {
            qb = qb.where('image_url', 'like', `%${image_url}%`)
          }
          if (url) {
            qb = qb.where('url', 'like', `%${url}%`)
          }
          if (status !== undefined) {
            qb = qb.where('status', '=', status)
          }
          qb = qb.where('is_delete', '=', DELETE_STATUS.UN_DELETE)
          return qb
        })
        .executeTakeFirst()
    ])

    return {
      dataList: adItems,
      pagination: {
        total: Number(total?.count) || 0,
        page,
        pageSize,
        totalPages: Math.ceil((Number(total?.count) || 0) / pageSize)
      }
    }
  }

  /**
   * Create a new ad item
   * @param createData Ad item data without id
   * @returns Created ad item id
   */
  async create(createData: CreateAdItem): Promise<CreateSuccess> {
    // 验证
    const validatedData = createAdItemSchema.parse(createData)

    // Verify that the ad exists
    const ad = await db
      .selectFrom('ads')
      .select('id')
      .where('id', '=', validatedData.ad_id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    if (!ad) {
      throw new Error('广告不存在')
    }

    const now = Date.now()
    const newAdItem = {
      ...validatedData,
      create_time: now,
      update_time: now,
      is_delete: DELETE_STATUS.UN_DELETE
    }

    const result = await db.insertInto('ad_items').values(newAdItem).executeTakeFirst()
    if (!result) throw new Error('创建广告项失败')
    return { id: Number(result.insertId) }
  }

  /**
   * Update an existing ad item
   * @param id Ad item id
   * @param updateData Data to update
   * @returns Updated ad item id
   */
  async update(id: number, updateData: UpdateAdItem): Promise<UpdateSuccess> {
    const validatedData = updateAdItemSchema.parse(updateData)

    // If ad_id is being updated, verify that the new ad exists
    if (validatedData.ad_id) {
      const ad = await db
        .selectFrom('ads')
        .select('id')
        .where('id', '=', validatedData.ad_id)
        .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
        .executeTakeFirst()

      if (!ad) {
        throw new Error('广告不存在')
      }
    }

    const result = await db
      .updateTable('ad_items')
      .set({
        ...validatedData,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    if (!result) throw new Error('更新广告项失败')
    return { id }
  }

  /**
   * Soft delete ad item
   * @param id Ad item id
   * @returns true if deleted successfully
   */
  async delete(id: number): Promise<boolean> {
    const result = await db
      .updateTable('ad_items')
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
   * Get ad items by ad_id
   * @param adId Ad id
   * @returns List of ad items
   */
  async getAdItemsByAdId(adId: number): Promise<AdItemEntity[]> {
    return await db
      .selectFrom('ad_items')
      .selectAll()
      .where('ad_id', '=', adId)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .where('status', '=', 10)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .execute()
  }

  /**
   * Check if ad item exists by title within the same ad
   * @param title Ad item title
   * @param adId Ad id
   * @returns true if exists
   */
  async adItemExistsByTitle(title: string, adId: number): Promise<boolean> {
    const adItem = await db
      .selectFrom('ad_items')
      .select('id')
      .where('title', '=', title)
      .where('ad_id', '=', adId)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()
    return !!adItem
  }
}

export const adItemService = new AdItemService()
