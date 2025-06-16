import { db } from '@src/libs/db'
import { z } from 'zod'

// Validation schemas
const createAdItemSchema = z.object({
  ad_id: z.number(),
  title: z.string().min(1),
  content: z.string().optional(),
  image_url: z.string().optional(),
  link_url: z.string().optional(),
  sort: z.number().default(0),
  status: z.number().default(10)
})

const updateAdItemSchema = createAdItemSchema.partial()

// Types
export interface CreateAdItemData {
  ad_id: number
  title: string
  content?: string
  image_url?: string
  link_url?: string
  sort?: number
  status?: number
}

export type UpdateAdItemData = Partial<CreateAdItemData>

export interface PaginationOptions {
  page: number
  pageSize: number
}

export interface PaginatedResult<T> {
  data: T[]
  pagination: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

export interface FilterOptions {
  ad_id?: number
}

// Ad Item Service Class
export class AdItemService {
  /**
   * Get a single ad item by ID
   */
  async getAdItemById(id: number): Promise<any> {
    const adItem = await db
      .selectFrom('ad_items')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (!adItem) {
      throw new Error('Ad item not found')
    }

    return adItem
  }

  /**
   * Get ad items list with pagination and filters
   */
  async getAdItems(
    options: PaginationOptions,
    filters?: FilterOptions
  ): Promise<PaginatedResult<any>> {
    const { page, pageSize } = options
    const offset = (page - 1) * pageSize

    let query = db.selectFrom('ad_items').selectAll().where('is_delete', '=', 0)

    // Add ad_id filter if provided
    if (filters?.ad_id !== undefined) {
      query = query.where('ad_id', '=', filters.ad_id)
    }

    const [adItems, total] = await Promise.all([
      query.limit(pageSize).offset(offset).execute(),
      query.select((eb) => [eb.fn.count('id').as('count')]).executeTakeFirst()
    ])

    return {
      data: adItems,
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
   */
  async createAdItem(adItemData: CreateAdItemData): Promise<any> {
    // Validate input data
    const validatedData = createAdItemSchema.parse(adItemData)

    // Verify that the ad exists
    const ad = await db
      .selectFrom('ads')
      .select('id')
      .where('id', '=', validatedData.ad_id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (!ad) {
      throw new Error('Ad not found')
    }

    const now = Date.now()
    const newAdItem = {
      ...validatedData,
      create_time: now,
      update_time: now,
      is_delete: 0
    }

    const result = await db.insertInto('ad_items').values(newAdItem).executeTakeFirst()

    return {
      id: Number(result.insertId),
      ...newAdItem
    }
  }

  /**
   * Update an existing ad item
   */
  async updateAdItem(id: number, adItemData: UpdateAdItemData): Promise<any> {
    // Validate input data
    const validatedData = updateAdItemSchema.parse(adItemData)

    // If ad_id is being updated, verify that the new ad exists
    if (validatedData.ad_id !== undefined) {
      const ad = await db
        .selectFrom('ads')
        .select('id')
        .where('id', '=', validatedData.ad_id)
        .where('is_delete', '=', 0)
        .executeTakeFirst()

      if (!ad) {
        throw new Error('Ad not found')
      }
    }

    const updateData = {
      ...validatedData,
      update_time: Date.now()
    }

    const result = await db
      .updateTable('ad_items')
      .set(updateData)
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
      throw new Error('Ad item not found')
    }

    return { id, ...updateData }
  }

  /**
   * Delete an ad item (logical delete)
   */
  async deleteAdItem(id: number): Promise<void> {
    const result = await db
      .updateTable('ad_items')
      .set({
        is_delete: 10,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
      throw new Error('Ad item not found')
    }
  }

  /**
   * Get ad items by ad_id
   */
  async getAdItemsByAdId(adId: number): Promise<any[]> {
    return await db
      .selectFrom('ad_items')
      .selectAll()
      .where('ad_id', '=', adId)
      .where('is_delete', '=', 0)
      .where('status', '=', 10)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .execute()
  }

  /**
   * Check if ad item exists by title within the same ad
   */
  async adItemExistsByTitle(title: string, adId: number): Promise<boolean> {
    const adItem = await db
      .selectFrom('ad_items')
      .select(['id'])
      .where('title', '=', title)
      .where('ad_id', '=', adId)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    return !!adItem
  }
}

// Export service instance
export const adItemService = new AdItemService()

// Export schemas for validation
export { createAdItemSchema, updateAdItemSchema }
