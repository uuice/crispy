import { db } from '@src/server/libs/db'
import { z } from 'zod'
import { sql } from 'kysely'

// Validation schemas
const createAdSchema = z.object({
  title: z.string().min(1),
  content: z.string().optional(),
  image_url: z.string().optional(),
  link_url: z.string().optional(),
  position: z.string().optional(),
  start_time: z.number().optional(),
  end_time: z.number().optional(),
  status: z.number().default(10),
  sort: z.number().default(0)
})

const updateAdSchema = createAdSchema.partial()

// Types
export interface CreateAdData {
  title: string
  content?: string
  image_url?: string
  link_url?: string
  position?: string
  start_time?: number
  end_time?: number
  status?: number
  sort?: number
}

export type UpdateAdData = Partial<CreateAdData>

export interface PaginationOptions {
  page: number
  pageSize: number
}

export interface PaginatedResult<T> {
  dataList: T[]
  pagination: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

export interface FilterOptions {
  position?: string
  status?: number
  start_time?: number
  end_time?: number
}

// Ad Service Class
export class AdService {
  /**
   * Get a single ad by ID
   */
  async getAdById(id: number): Promise<any> {
    const ad = await db
      .selectFrom('ads')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (!ad) {
      throw new Error('Ad not found')
    }

    return ad
  }

  /**
   * Get ads list with pagination and filters
   */
  async getAds(options: PaginationOptions, filters?: FilterOptions): Promise<PaginatedResult<any>> {
    const { page, pageSize } = options
    const offset = (page - 1) * pageSize

    let query = db.selectFrom('ads').selectAll().where('is_delete', '=', 0)

    // Add filters if provided
    if (filters?.position) {
      query = query.where(sql.ref('position'), '=', filters.position)
    }
    if (filters?.status !== undefined) {
      query = query.where('status', '=', filters.status)
    }
    if (filters?.start_time) {
      query = query.where(sql.ref('start_time'), '>=', filters.start_time)
    }
    if (filters?.end_time) {
      query = query.where(sql.ref('end_time'), '<=', filters.end_time)
    }

    // Order by sort asc, create_time desc by default
    query = query.orderBy(sql.ref('sort'), 'asc').orderBy('create_time', 'desc')

    const [ads, total] = await Promise.all([
      query.limit(pageSize).offset(offset).execute(),
      query.select((eb) => [eb.fn.count('id').as('count')]).executeTakeFirst()
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
   */
  async createAd(adData: CreateAdData): Promise<any> {
    // Validate input data
    const validatedData = createAdSchema.parse(adData)

    const now = Date.now()
    const newAd = {
      ...validatedData,
      create_time: now,
      update_time: now,
      is_delete: 0
    }

    const result = await db.safeInsertInto('ads').values(newAd).executeTakeFirst()

    return {
      id: Number(result.insertId),
      ...newAd
    }
  }

  /**
   * Update an existing ad
   */
  async updateAd(id: number, adData: UpdateAdData): Promise<any> {
    // Validate input data
    const validatedData = updateAdSchema.parse(adData)

    const updateData = {
      ...validatedData,
      update_time: Date.now()
    }

    const result = await db
      .safeUpdateTable('ads')
      .set(updateData)
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
      throw new Error('Ad not found')
    }

    return { id, ...updateData }
  }

  /**
   * Delete an ad (logical delete)
   */
  async deleteAd(id: number): Promise<void> {
    const result = await db
      .safeUpdateTable('ads')
      .set({
        is_delete: 10,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
      throw new Error('Ad not found')
    }
  }

  /**
   * Get ads by position
   */
  async getAdsByPosition(position: string): Promise<any[]> {
    return await db
      .selectFrom('ads')
      .selectAll()
      .where(sql.ref('position'), '=', position)
      .where('is_delete', '=', 0)
      .where('status', '=', 10)
      .orderBy(sql.ref('sort'), 'asc')
      .orderBy('create_time', 'desc')
      .execute()
  }

  /**
   * Get active ads (within time range and status = 10)
   */
  async getActiveAds(): Promise<any[]> {
    const now = Date.now()
    return await db
      .selectFrom('ads')
      .selectAll()
      .where('is_delete', '=', 0)
      .where('status', '=', 10)
      .where((eb) =>
        eb.or([eb(sql.ref('start_time'), 'is', null), eb(sql.ref('start_time'), '<=', now)])
      )
      .where((eb) =>
        eb.or([eb(sql.ref('end_time'), 'is', null), eb(sql.ref('end_time'), '>=', now)])
      )
      .orderBy(sql.ref('sort'), 'asc')
      .orderBy('create_time', 'desc')
      .execute()
  }

  /**
   * Check if ad exists by title
   */
  async adExistsByTitle(title: string): Promise<boolean> {
    const ad = await db
      .selectFrom('ads')
      .select(['id'])
      .where(sql.ref('title'), '=', title)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    return !!ad
  }

  /**
   * Get ads with their items
   */
  async getAdWithItems(adId: number): Promise<any> {
    const ad = await this.getAdById(adId)

    const adItems = await db
      .selectFrom('ad_items')
      .selectAll()
      .where('ad_id', '=', adId)
      .where('is_delete', '=', 0)
      .orderBy(sql.ref('sort'), 'asc')
      .execute()

    return {
      ...ad,
      items: adItems
    }
  }
}

// Export service instance
export const adService = new AdService()

// Export schemas for validation
export { createAdSchema, updateAdSchema }
