import { db } from '@src/libs/db'
import { DELETE_STATUS } from '../config/const'
import {
  CreateSuccess,
  CreateVoteItem,
  createVoteItemSchema,
  PaginatedResult,
  UpdateSuccess,
  UpdateVoteItem,
  updateVoteItemSchema,
  VoteItemEntity,
  VoteItemFilters
} from '@src/types'

export class VoteItemService {
  /**
   * Get single vote item by ID
   * @param id Vote item id
   * @returns Vote item or null if not found
   */
  async getById(id: number): Promise<VoteItemEntity | null> {
    const item = await db
      .selectFrom('vote_items')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()
    return item || null
  }

  /**
   * Get vote items list with pagination and filters
   * @param filters Filter options
   * @param options Pagination options
   * @returns List of vote items and pagination info
   */
  async getVoteItems(filters: VoteItemFilters): Promise<PaginatedResult<VoteItemEntity>> {
    const page = Number(filters.page) || 1
    const pageSize = Number(filters.pageSize) || 10
    const { title, vote_id, status } = filters
    const offset = (page - 1) * pageSize

    let query = db.selectFrom('vote_items').selectAll()

    // Apply filters
    if (title) {
      query = query.where('title', 'like', `%${title}%`)
    }
    if (vote_id !== undefined) {
      query = query.where('vote_id', '=', vote_id)
    }
    if (status !== undefined) {
      query = query.where('status', '=', status)
    }

    // Default to only non-deleted items
    query = query.where('is_delete', '=', DELETE_STATUS.UN_DELETE)

    const [voteItems, total] = await Promise.all([
      query.orderBy('create_time', 'desc').limit(pageSize).offset(offset).execute(),
      db
        .selectFrom('vote_items')
        .select((eb) => [eb.fn.count('id').as('count')])
        .$call((qb) => {
          if (title) {
            qb = qb.where('title', 'like', `%${title}%`)
          }
          if (vote_id !== undefined) {
            qb = qb.where('vote_id', '=', vote_id)
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
      dataList: voteItems,
      pagination: {
        total: Number(total?.count) || 0,
        page,
        pageSize,
        totalPages: Math.ceil((Number(total?.count) || 0) / pageSize)
      }
    }
  }

  /**
   * Create new vote item
   * @param createData Vote item data
   * @returns Created vote item id
   */
  async create(createData: CreateVoteItem): Promise<CreateSuccess> {
    const validatedData = createVoteItemSchema.parse(createData)

    // Verify that the vote exists
    const vote = await db
      .selectFrom('votes')
      .select('id')
      .where('id', '=', validatedData.vote_id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    if (!vote) {
      throw new Error('投票不存在')
    }

    const now = Date.now()
    const newVoteItem = {
      ...validatedData,
      create_time: now,
      update_time: now,
      is_delete: DELETE_STATUS.UN_DELETE
    }

    const result = await db.insertInto('vote_items').values(newVoteItem).executeTakeFirst()
    if (!result) throw new Error('创建投票项失败')
    return { id: Number(result.insertId) }
  }

  /**
   * Update vote item by ID
   * @param id Vote item id
   * @param updateData Data to update
   * @returns Updated vote item id
   */
  async update(id: number, updateData: UpdateVoteItem): Promise<UpdateSuccess> {
    const validatedData = updateVoteItemSchema.parse(updateData)

    // If vote_id is being updated, verify that the new vote exists
    if (validatedData.vote_id !== undefined) {
      const vote = await db
        .selectFrom('votes')
        .select('id')
        .where('id', '=', validatedData.vote_id)
        .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
        .executeTakeFirst()

      if (!vote) {
        throw new Error('投票不存在')
      }
    }

    const result = await db
      .updateTable('vote_items')
      .set({
        ...validatedData,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    if (!result) throw new Error('更新投票项失败')
    return { id }
  }

  /**
   * Soft delete vote item
   * @param id Vote item id
   * @returns true if deleted successfully
   */
  async delete(id: number): Promise<boolean> {
    const result = await db
      .updateTable('vote_items')
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
   * Get vote items by vote ID
   * @param voteId Vote id
   * @returns List of vote items
   */
  async getVoteItemsByVoteId(voteId: number): Promise<VoteItemEntity[]> {
    return await db
      .selectFrom('vote_items')
      .selectAll()
      .where('vote_id', '=', voteId)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .orderBy('create_time', 'desc')
      .execute()
  }

  /**
   * Get vote items by status
   * @param status Vote item status
   * @returns List of vote items
   */
  async getVoteItemsByStatus(status: number): Promise<VoteItemEntity[]> {
    return await db
      .selectFrom('vote_items')
      .selectAll()
      .where('status', '=', status)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .orderBy('create_time', 'desc')
      .execute()
  }

  /**
   * Search vote items by title
   * @param searchTerm Search keyword
   * @returns List of vote items
   */
  async searchVoteItems(searchTerm: string): Promise<VoteItemEntity[]> {
    return await db
      .selectFrom('vote_items')
      .selectAll()
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .where('title', 'like', `%${searchTerm}%`)
      .orderBy('create_time', 'desc')
      .execute()
  }

  /**
   * Get vote items count by vote ID
   * @param voteId Vote id
   * @returns Item count
   */
  async getVoteItemsCountByVoteId(voteId: number): Promise<number> {
    const result = await db
      .selectFrom('vote_items')
      .select((eb) => [eb.fn.count('id').as('count')])
      .where('vote_id', '=', voteId)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()
    return Number(result?.count) || 0
  }

  /**
   * Get vote items count by status
   * @returns List of status counts
   */
  async getVoteItemsCountByStatus(): Promise<{ status: number; count: number }[]> {
    return (await db
      .selectFrom('vote_items')
      .select((eb) => ['status', eb.fn.count('id').as('count')])
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .groupBy('status')
      .execute()) as { status: number; count: number }[]
  }

  /**
   * Check if vote item exists by title in a specific vote
   * @param title Vote item title
   * @param voteId Vote id
   * @param excludeId Optional id to exclude
   * @returns true if exists
   */
  async checkVoteItemExistsByTitle(
    title: string,
    voteId: number,
    excludeId?: number
  ): Promise<boolean> {
    let query = db
      .selectFrom('vote_items')
      .select('id')
      .where('title', '=', title)
      .where('vote_id', '=', voteId)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)

    if (excludeId) {
      query = query.where('id', '!=', excludeId)
    }

    const result = await query.executeTakeFirst()
    return !!result
  }

  /**
   * Get vote items statistics
   * @returns Statistics data
   */
  async getVoteItemsStats(): Promise<{
    total: number
    active: number
    inactive: number
    deleted: number
  }> {
    const stats = await db
      .selectFrom('vote_items')
      .select((eb) => [
        eb.fn.count('id').as('total'),
        eb.fn.sum<number>(eb.case().when('status', '=', 10).then(1).else(0).end()).as('active'),
        eb.fn.sum<number>(eb.case().when('status', '=', 0).then(1).else(0).end()).as('inactive'),
        eb.fn
          .sum<number>(eb.case().when('is_delete', '=', DELETE_STATUS.DELETE).then(1).else(0).end())
          .as('deleted')
      ])
      .executeTakeFirst()

    return {
      total: Number(stats?.total) || 0,
      active: Number(stats?.active) || 0,
      inactive: Number(stats?.inactive) || 0,
      deleted: Number(stats?.deleted) || 0
    }
  }
}

export const voteItemService = new VoteItemService()
