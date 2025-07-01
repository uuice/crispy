import { db } from '@src/libs/db'
import { z } from 'zod'

// Validation schemas
const createTagSchema = z.object({
  title: z.string().min(1),
  des: z.string().optional(),
  sort: z.number().default(0),
  status: z.number().default(10),
  type_id: z.number().default(0),
  value: z.string().optional()
})

const updateTagSchema = createTagSchema.partial()

// Types
export interface CreateTagData {
  title: string
  des?: string
  sort?: number
  status?: number
  type_id?: number
  value?: string
}

export type UpdateTagData = Partial<CreateTagData>

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
  title?: string
  type_id?: number
  status?: number
  value?: string
}

// Tag Service Class
export class TagService {
  /**
   * Get a single tag by ID
   */
  async getTagById(id: number): Promise<any> {
    const tag = await db
      .selectFrom('tags')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (!tag) {
      throw new Error('Tag not found')
    }

    return tag
  }

  /**
   * Get tags list with pagination and filters
   */
  async getTags(
    options: PaginationOptions,
    filters?: FilterOptions
  ): Promise<PaginatedResult<any>> {
    const { page, pageSize } = options
    const offset = (page - 1) * pageSize

    let query = db.selectFrom('tags').selectAll().where('is_delete', '=', 0)

    // Add filters if provided
    if (filters?.title) {
      query = query.where('title', 'like', `%${filters.title}%`)
    }
    if (filters?.type_id !== undefined) {
      query = query.where('type_id', '=', filters.type_id)
    }
    if (filters?.status !== undefined) {
      query = query.where('status', '=', filters.status)
    }
    if (filters?.value) {
      query = query.where('value', 'like', `%${filters.value}%`)
    }

    // Order by sort asc, create_time desc by default
    query = query.orderBy('sort', 'asc').orderBy('create_time', 'desc')

    const [tags, total] = await Promise.all([
      query.limit(pageSize).offset(offset).execute(),
      query.select((eb) => [eb.fn.count('id').as('count')]).executeTakeFirst()
    ])

    return {
      data: tags,
      pagination: {
        total: Number(total?.count) || 0,
        page,
        pageSize,
        totalPages: Math.ceil((Number(total?.count) || 0) / pageSize)
      }
    }
  }

  /**
   * Create a new tag
   */
  async createTag(tagData: CreateTagData): Promise<any> {
    // Validate input data
    const validatedData = createTagSchema.parse(tagData)

    const now = Date.now()
    const newTag = {
      ...validatedData,
      create_time: now,
      update_time: now,
      is_delete: 0
    }

    const result = await db.safeInsertInto('tags').values(newTag).executeTakeFirst()

    return {
      id: Number(result.insertId),
      ...newTag
    }
  }

  /**
   * Update an existing tag
   */
  async updateTag(id: number, tagData: UpdateTagData): Promise<any> {
    // Validate input data
    const validatedData = updateTagSchema.parse(tagData)

    const updateData = {
      ...validatedData,
      update_time: Date.now()
    }

    const result = await db
      .safeUpdateTable('tags')
      .set(updateData)
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
      throw new Error('Tag not found')
    }

    return { id, ...updateData }
  }

  /**
   * Delete a tag (logical delete)
   */
  async deleteTag(id: number): Promise<void> {
    const result = await db
      .safeUpdateTable('tags')
      .set({
        is_delete: 10,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (result.numUpdatedRows === 0n) {
      throw new Error('Tag not found')
    }
  }

  /**
   * Check if tag exists by title
   */
  async tagExistsByTitle(title: string): Promise<boolean> {
    const tag = await db
      .selectFrom('tags')
      .select(['id'])
      .where('title', '=', title)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    return !!tag
  }

  /**
   * Check if tag exists by value
   */
  async tagExistsByValue(value: string): Promise<boolean> {
    const tag = await db
      .selectFrom('tags')
      .select(['id'])
      .where('value', '=', value)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    return !!tag
  }

  /**
   * Get tags by type_id
   */
  async getTagsByTypeId(typeId: number): Promise<any[]> {
    return await db
      .selectFrom('tags')
      .selectAll()
      .where('type_id', '=', typeId)
      .where('is_delete', '=', 0)
      .where('status', '=', 10)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .execute()
  }
}

// Export service instance
export const tagService = new TagService()

// Export schemas for validation
export { createTagSchema, updateTagSchema }
