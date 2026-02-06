import { db } from '@src/libs/db'
import { DELETE_STATUS } from '../config/const'
import {
  CreateSuccess,
  CreateTag,
  createTagSchema,
  PaginatedResult,
  PaginationOptions,
  TagEntity,
  TagFilters,
  UpdateSuccess,
  UpdateTag,
  updateTagSchema
} from '@src/types'
import { titleToUrl } from '../utils/titleToUrl'

// Tag Service Class
export class TagService {
  /**
   * Get a single tag by ID
   * @param id Tag id
   * @returns Tag or null if not found
   */
  async getById(id: number): Promise<TagEntity | null> {
    const tag = await db
      .selectFrom('tags')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()
    return tag || null
  }

  /**
   * Get tag by value
   * @param value Tag value
   * @returns Tag or null if not found
   */
  async getTagByValue(value: string): Promise<TagEntity | null> {
    const tag = await db
      .selectFrom('tags')
      .selectAll()
      .where('value', '=', value)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()
    return tag || null
  }

  // /**
  //  * Get a single tag by alias
  //  */
  // async getTagByAlias(alias: string): Promise<any> {
  //   const tag = await db
  //     .selectFrom('tags')
  //     .selectAll()
  //     .where('alias', '=', alias)
  //     .where('is_delete', '=', 0)
  //     .executeTakeFirst()

  //   if (!tag) {
  //     throw new Error('Tag not found')
  //   }

  //   return tag
  // }

  /**
   * Get tags list with pagination and filters
   * @param filters Filter options
   * @param options Pagination options
   * @returns List of tags and pagination info
   */
  async getTags(filters: TagFilters): Promise<PaginatedResult<TagEntity>> {
    const page = Number(filters.page) || 1
    const pageSize = Number(filters.pageSize) || 10
    const { title, des, value, type_id, status } = filters
    const offset = (page - 1) * pageSize

    let query = db.selectFrom('tags').selectAll()

    // Apply filters
    if (title) {
      query = query.where('title', 'like', `%${title}%`)
    }

    if (des) {
      query = query.where('des', 'like', `%${des}%`)
    }

    if (value) {
      query = query.where('value', 'like', `%${value}%`)
    }

    if (type_id !== undefined) {
      query = query.where('type_id', '=', type_id)
    }

    if (status !== undefined) {
      query = query.where('status', '=', status)
    }

    // Default to only non-deleted tags
    query = query.where('is_delete', '=', DELETE_STATUS.UN_DELETE)

    const [tags, total] = await Promise.all([
      query
        .orderBy('sort', 'asc')
        .orderBy('create_time', 'desc')
        .limit(pageSize)
        .offset(offset)
        .execute(),
      db
        .selectFrom('tags')
        .select((eb) => [eb.fn.count('id').as('count')])
        .$call((qb) => {
          // Apply same filters to count query
          if (title) {
            qb = qb.where('title', 'like', `%${title}%`)
          }
          if (des) {
            qb = qb.where('des', 'like', `%${des}%`)
          }
          if (value) {
            qb = qb.where('value', 'like', `%${value}%`)
          }
          if (type_id !== undefined) {
            qb = qb.where('type_id', '=', type_id)
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
      dataList: tags,
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
   * @param createData Tag data without id
   * @returns Created tag id
   */
  async create(createData: CreateTag): Promise<CreateSuccess> {
    // 验证
    const validatedData = createTagSchema.parse(createData)
    const now = Date.now()
    const newTag = {
      ...validatedData,
      create_time: now,
      update_time: now,
      is_delete: DELETE_STATUS.UN_DELETE
    }

    const result = await db.insertInto('tags').values(newTag).executeTakeFirst()
    if (!result) throw new Error('创建标签失败')
    return { id: Number(result.insertId) }
  }

  /**
   * Update an existing tag
   * @param id Tag id
   * @param updateData Data to update
   * @returns Updated tag id
   */
  async update(id: number, updateData: UpdateTag): Promise<UpdateSuccess> {
    const validatedData = updateTagSchema.parse(updateData)
    const result = await db
      .updateTable('tags')
      .set({
        ...validatedData,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    if (!result) throw new Error('更新标签失败')
    return { id }
  }

  /**
   * Soft delete tag
   * @param id Tag id
   * @returns true if deleted successfully
   */
  async delete(id: number): Promise<boolean> {
    const result = await db
      .updateTable('tags')
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
   * Check if tag exists by title
   * @param title Tag title
   * @returns true if exists
   */
  async tagExistsByTitle(title: string): Promise<boolean> {
    const tag = await db
      .selectFrom('tags')
      .select('id')
      .where('title', '=', title)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()
    return !!tag
  }

  /**
   * Check if tag exists by value
   * @param value Tag value
   * @returns true if exists
   */
  async tagExistsByValue(value: string): Promise<boolean> {
    const tag = await db
      .selectFrom('tags')
      .select('id')
      .where('value', '=', value)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()
    return !!tag
  }

  /**
   * Get tags by type_id
   * @param typeId Type id
   * @returns List of tags
   */
  async getTagsByTypeId(typeId: number): Promise<TagEntity[]> {
    return await db
      .selectFrom('tags')
      .selectAll()
      .where('type_id', '=', typeId)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .where('status', '=', 10)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .execute()
  }

  /**
   * Upsert tags by name array. Insert if not exists. type_id=7, title/value/des all use name.
   * @param names Tag names to upsert
   */
  async upsertTags(names: string[]): Promise<void> {
    const uniqueNames = Array.from(new Set(names.map((t) => t.trim()).filter(Boolean)))
    if (uniqueNames.length === 0) return

    // change name to value  titleToUrl
    const uniqueValues = uniqueNames.map((name) => titleToUrl(name))

    // 查询已存在的 name
    const existRows = await db
      .selectFrom('tags')
      .select('title')
      .where('value', 'in', uniqueValues)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .execute()
    const existNames = new Set(existRows.map((row) => row.title))

    // 过滤出不存在的
    const toInsert = uniqueNames.filter((name) => !existNames.has(name))
    if (toInsert.length === 0) return

    await db
      .insertInto('tags')
      .values(
        toInsert.map((name) => ({
          title: name,
          value: titleToUrl(name),
          des: name,
          type_id: 7,
          status: 10,
          create_time: Date.now(),
          update_time: Date.now(),
          is_delete: DELETE_STATUS.UN_DELETE
        }))
      )
      .execute()
  }
}

export const tagService = new TagService()
