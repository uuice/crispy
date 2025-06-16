import { db } from '@src/libs/db'
import { sql } from 'kysely'

// Data interfaces
export interface CreateVoteItemData {
  title: string
  vote_id: number
  status: number
}

export type UpdateVoteItemData = Partial<CreateVoteItemData>

export interface VoteItemFilters {
  title?: string
  vote_id?: number
  status?: number
  startTime?: number
  endTime?: number
}

export interface VoteItemPaginationParams {
  page: number
  pageSize: number
}

export interface VoteItem {
  id: number
  title: string
  vote_id: number
  status: number
  create_time: number
  update_time: number
  is_delete: number
}

export interface PaginatedVoteItemsResult {
  data: VoteItem[]
  pagination: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

export class VoteItemService {
  /**
   * Get single vote item by ID
   */
  async getVoteItemById(id: number): Promise<VoteItem | null> {
    const result = await db
      .selectFrom('vote_items')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    return result as unknown as VoteItem | null
  }

  /**
   * Get vote items list with pagination and filters
   */
  async getVoteItems(
    pagination: VoteItemPaginationParams,
    filters?: VoteItemFilters
  ): Promise<PaginatedVoteItemsResult> {
    const { page, pageSize } = pagination
    const offset = (page - 1) * pageSize

    let query = db.selectFrom('vote_items').selectAll().where('is_delete', '=', 0)

    // Apply filters
    if (filters) {
      if (filters.title) {
        query = query.where('title', 'like', `%${filters.title}%`)
      }
      if (filters.vote_id !== undefined) {
        query = query.where('vote_id', '=', filters.vote_id)
      }
      if (filters.status !== undefined) {
        query = query.where('status', '=', filters.status)
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

    const [voteItems, total] = await Promise.all([
      query.limit(pageSize).offset(offset).execute(),
      query.select((eb) => [eb.fn.count('id').as('count')]).executeTakeFirst()
    ])

    return {
      data: voteItems as unknown as VoteItem[],
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
   */
  async createVoteItem(data: CreateVoteItemData): Promise<VoteItem> {
    // Verify that the vote exists
    const vote = await db
      .selectFrom('votes')
      .select('id')
      .where('id', '=', data.vote_id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (!vote) {
      throw new Error('Vote not found')
    }

    const now = Date.now()
    const newVoteItem = {
      ...data,
      create_time: now,
      update_time: now,
      is_delete: 0
    }

    const result = await db.insertInto('vote_items').values(newVoteItem).executeTakeFirst()

    return {
      id: Number(result.insertId),
      ...newVoteItem
    }
  }

  /**
   * Update vote item by ID
   */
  async updateVoteItem(id: number, data: UpdateVoteItemData): Promise<boolean> {
    // If vote_id is being updated, verify that the new vote exists
    if (data.vote_id !== undefined) {
      const vote = await db
        .selectFrom('votes')
        .select('id')
        .where('id', '=', data.vote_id)
        .where('is_delete', '=', 0)
        .executeTakeFirst()

      if (!vote) {
        throw new Error('Vote not found')
      }
    }

    const updateData = {
      ...data,
      update_time: Date.now()
    }

    const result = await db
      .updateTable('vote_items')
      .set(updateData)
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    return result.numUpdatedRows > 0n
  }

  /**
   * Delete vote item (logical delete)
   */
  async deleteVoteItem(id: number): Promise<boolean> {
    const result = await db
      .updateTable('vote_items')
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
   * Get vote items by vote ID
   */
  async getVoteItemsByVoteId(voteId: number): Promise<VoteItem[]> {
    const result = await db
      .selectFrom('vote_items')
      .selectAll()
      .where('vote_id', '=', voteId)
      .where('is_delete', '=', 0)
      .orderBy('create_time', 'desc')
      .execute()

    return result as unknown as VoteItem[]
  }

  /**
   * Get vote items by status
   */
  async getVoteItemsByStatus(status: number): Promise<VoteItem[]> {
    const result = await db
      .selectFrom('vote_items')
      .selectAll()
      .where('status', '=', status)
      .where('is_delete', '=', 0)
      .orderBy('create_time', 'desc')
      .execute()

    return result as unknown as VoteItem[]
  }

  /**
   * Search vote items by title
   */
  async searchVoteItems(searchTerm: string): Promise<VoteItem[]> {
    const result = await db
      .selectFrom('vote_items')
      .selectAll()
      .where('is_delete', '=', 0)
      .where('title', 'like', `%${searchTerm}%`)
      .orderBy('create_time', 'desc')
      .execute()

    return result as unknown as VoteItem[]
  }

  /**
   * Get vote items count by vote ID
   */
  async getVoteItemsCountByVoteId(voteId: number): Promise<number> {
    const result = await db
      .selectFrom('vote_items')
      .select((eb) => [eb.fn.count('id').as('count')])
      .where('vote_id', '=', voteId)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    return Number(result?.count) || 0
  }

  /**
   * Get vote items count by status
   */
  async getVoteItemsCountByStatus(): Promise<{ status: number; count: number }[]> {
    return await db
      .selectFrom('vote_items')
      .select(['status', sql<number>`count(*)`.as('count')])
      .where('is_delete', '=', 0)
      .groupBy('status')
      .execute()
  }

  /**
   * Check if vote item exists by title in a specific vote
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
      .where('is_delete', '=', 0)

    if (excludeId) {
      query = query.where('id', '!=', excludeId)
    }

    const result = await query.executeTakeFirst()
    return !!result
  }

  /**
   * Get vote items statistics
   */
  async getVoteItemsStats(): Promise<{
    total: number
    active: number
    inactive: number
    deleted: number
  }> {
    const stats = await db
      .selectFrom('vote_items')
      .select([
        sql<number>`count(*)`.as('total'),
        sql<number>`sum(case when status = 10 then 1 else 0 end)`.as('active'),
        sql<number>`sum(case when status = 0 then 1 else 0 end)`.as('inactive'),
        sql<number>`sum(case when is_delete = 10 then 1 else 0 end)`.as('deleted')
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

// Export singleton instance
export const voteItemService = new VoteItemService()
