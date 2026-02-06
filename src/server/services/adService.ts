import { db } from '@src/libs/db'
import { DELETE_STATUS } from '../config/const'
import {
  AdEntity,
  AdFilters,
  CreateAd,
  createAdSchema,
  CreateSuccess,
  PaginatedResult,
  PaginationOptions,
  UpdateAd,
  updateAdSchema,
  UpdateSuccess
} from '@src/types'

// Ad Service Class
export class AdService {
  /**
   * Get a single ad by ID
   * @param id Ad id
   * @returns Ad or null if not found
   */
  async getById(id: number): Promise<AdEntity | null> {
    const ad = await db
      .selectFrom('ads')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()
    return ad || null
  }

  /**
   * Get ads list with pagination and filters
   * @param filters Filter options
   * @param options Pagination options
   * @returns List of ads and pagination info
   */
  async getAds(filters: AdFilters): Promise<PaginatedResult<AdEntity>> {
    const page = Number(filters.page) || 1
    const pageSize = Number(filters.pageSize) || 10
    const { title, content, status } = filters
    const offset = (page - 1) * pageSize

    let query = db.selectFrom('ads').selectAll()

    // Apply filters
    if (title) {
      query = query.where('title', 'like', `%${title}%`)
    }

    if (content) {
      query = query.where('content', 'like', `%${content}%`)
    }

    if (status !== undefined) {
      query = query.where('status', '=', status)
    }

    // Default to only non-deleted ads
    query = query.where('is_delete', '=', DELETE_STATUS.UN_DELETE)

    const [ads, total] = await Promise.all([
      query
        .orderBy('sort', 'asc')
        .orderBy('create_time', 'desc')
        .limit(pageSize)
        .offset(offset)
        .execute(),
      db
        .selectFrom('ads')
        .select((eb) => [eb.fn.count('id').as('count')])
        .$call((qb) => {
          // Apply same filters to count query
          if (title) {
            qb = qb.where('title', 'like', `%${title}%`)
          }
          if (content) {
            qb = qb.where('content', 'like', `%${content}%`)
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
      dataList: ads,
      pagination: {
        total: Number(total?.count) || 0,
        page,
        pageSize,
        totalPages: Math.ceil((Number(total?.count) || 0) / pageSize)
      }
    }
  }

  /**
   * Create a new ad
   * @param createData Ad data without id
   * @returns Created ad id
   */
  async create(createData: CreateAd): Promise<CreateSuccess> {
    // 验证
    const validatedData = createAdSchema.parse(createData)
    const now = Date.now()
    const newAd = {
      ...validatedData,
      create_time: now,
      update_time: now,
      is_delete: DELETE_STATUS.UN_DELETE
    }

    const result = await db.insertInto('ads').values(newAd).executeTakeFirst()
    if (!result) throw new Error('创建广告失败')
    return { id: Number(result.insertId) }
  }

  /**
   * Update an existing ad
   * @param id Ad id
   * @param updateData Data to update
   * @returns Updated ad id
   */
  async update(id: number, updateData: UpdateAd): Promise<UpdateSuccess> {
    const validatedData = updateAdSchema.parse(updateData)
    const result = await db
      .updateTable('ads')
      .set({
        ...validatedData,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    if (!result) throw new Error('更新广告失败')
    return { id }
  }

  /**
   * Soft delete ad
   * @param id Ad id
   * @returns true if deleted successfully
   */
  async delete(id: number): Promise<boolean> {
    const result = await db
      .updateTable('ads')
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
   * Get active ads (within time range and status = 10)
   * @returns List of active ads
   */
  async getActiveAds(): Promise<AdEntity[]> {
    const now = Date.now()
    return await db
      .selectFrom('ads')
      .selectAll()
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .where('status', '=', 10)
      .where((eb) => eb.or([eb('start_time', 'is', null), eb('start_time', '<=', now)]))
      .where((eb) => eb.or([eb('end_time', 'is', null), eb('end_time', '>=', now)]))
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .execute()
  }

  /**
   * Check if ad exists by title
   * @param title Ad title
   * @returns true if exists
   */
  async adExistsByTitle(title: string): Promise<boolean> {
    const ad = await db
      .selectFrom('ads')
      .select('id')
      .where('title', '=', title)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()
    return !!ad
  }

  /**
   * Get ads with their items
   * @param adId Ad id
   * @returns Ad with items
   */
  async getAdWithItems(adId: number) {
    const ad = await this.getById(adId)
    if (!ad) return null

    const adItems = await db
      .selectFrom('ad_items')
      .selectAll()
      .where('ad_id', '=', adId)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .orderBy('sort', 'asc')
      .execute()

    return {
      ...ad,
      items: adItems
    }
  }
}

export const adService = new AdService()
