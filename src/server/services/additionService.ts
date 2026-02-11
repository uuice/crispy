import { db } from '@src/libs/db'
import { DELETE_STATUS } from '../config/const'
import {
  AdditionEntity,
  AdditionFilters,
  CreateAddition,
  createAdditionSchema,
  CreateSuccess,
  PaginatedResult,
  UpdateAddition,
  updateAdditionSchema,
  UpdateSuccess
} from '@src/types'

// Addition Service Class
export class AdditionService {
  /**
   * Get a single addition by ID
   * @param id Addition id
   * @returns Addition or null if not found
   */
  async getById(id: number): Promise<AdditionEntity | null> {
    const addition = await db
      .selectFrom('additions')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()
    return addition || null
  }

  /**
   * Get additions list with pagination and filters
   * @param filters Filter options
   * @param options Pagination options
   * @returns List of additions and pagination info
   */
  async getAdditions(filters: AdditionFilters): Promise<PaginatedResult<AdditionEntity>> {
    const page = Number(filters.page) || 1
    const pageSize = Number(filters.pageSize) || 10
    const { status } = filters
    const offset = (page - 1) * pageSize

    let query = db.selectFrom('additions').selectAll()

    if (status !== undefined) {
      query = query.where('status', '=', status)
    }

    // Default to only non-deleted additions
    query = query.where('is_delete', '=', DELETE_STATUS.UN_DELETE)

    const [additions, total] = await Promise.all([
      query.orderBy('create_time', 'desc').limit(pageSize).offset(offset).execute(),
      db
        .selectFrom('additions')
        .select((eb) => [eb.fn.count('id').as('count')])
        .$call((qb) => {
          // Apply same filters to count query

          if (status !== undefined) {
            qb = qb.where('status', '=', status)
          }
          qb = qb.where('is_delete', '=', DELETE_STATUS.UN_DELETE)
          return qb
        })
        .executeTakeFirst()
    ])

    return {
      dataList: additions,
      pagination: {
        total: Number(total?.count) || 0,
        page,
        pageSize,
        totalPages: Math.ceil((Number(total?.count) || 0) / pageSize)
      }
    }
  }

  /**
   * Create a new addition
   * @param createData Addition data without id
   * @returns Created addition id
   */
  async create(createData: CreateAddition): Promise<CreateSuccess> {
    // 验证
    const validatedData = createAdditionSchema.parse(createData)
    const now = Date.now()
    const newAddition = {
      ...validatedData,
      create_time: now,
      update_time: now,
      fields_json: validatedData.fields_json || '{}',
      is_delete: DELETE_STATUS.UN_DELETE
    }

    const result = await db.insertInto('additions').values(newAddition).executeTakeFirst()
    if (!result) throw new Error('创建附加项失败')
    return { id: Number(result.insertId) }
  }

  /**
   * Update an existing addition
   * @param id Addition id
   * @param updateData Data to update
   * @returns Updated addition id
   */
  async update(id: number, updateData: UpdateAddition): Promise<UpdateSuccess> {
    const validatedData = updateAdditionSchema.parse(updateData)
    const result = await db
      .updateTable('additions')
      .set({
        ...validatedData,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    if (!result) throw new Error('更新附加项失败')
    return { id }
  }

  /**
   * Soft delete addition
   * @param id Addition id
   * @returns true if deleted successfully
   */
  async delete(id: number): Promise<boolean> {
    const result = await db
      .updateTable('additions')
      .set({
        is_delete: DELETE_STATUS.DELETE,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()
    return Number(result.numUpdatedRows) > 0
  }
}

export const additionService = new AdditionService()
