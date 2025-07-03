import { db, filterUndefined } from '@src/libs/db'
import { sql } from 'kysely'

// Data interfaces
export interface CreateVoteData {
  title: string
  is_multiple: number
  start_time: number
  end_time: number
  status: number
  vote_items?: string[]
}

export type UpdateVoteData = Partial<CreateVoteData>

export interface VoteFilters {
  title?: string
  is_multiple?: number
  status?: number
  startTime?: number
  endTime?: number
}

export interface VotePaginationParams {
  page: number
  pageSize: number
}

export interface Vote {
  id: number
  title: string
  is_multiple: number
  start_time: number
  end_time: number
  status: number
  count: number
  create_time: number
  update_time: number
  is_delete: number
}

export interface VoteWithItems extends Vote {
  items: VoteItem[]
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

export interface PaginatedVotesResult {
  dataList: VoteWithItems[]
  pagination: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

export class VoteService {
  /**
   * Get single vote by ID with items
   */
  async getVoteById(id: number): Promise<VoteWithItems | null> {
    const vote = await db
      .selectFrom('votes')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    if (!vote) {
      return null
    }

    // Get vote items
    const voteItems = await db
      .selectFrom('vote_items')
      .selectAll()
      .where('vote_id', '=', id)
      .where('is_delete', '=', 0)
      .execute()

    return {
      ...vote,
      items: voteItems as unknown as VoteItem[]
    } as VoteWithItems
  }

  /**
   * Get votes list with pagination and filters
   */
  async getVotes(
    pagination: VotePaginationParams,
    filters?: VoteFilters
  ): Promise<PaginatedVotesResult> {
    const { page, pageSize } = pagination
    const offset = (page - 1) * pageSize

    let query = db.selectFrom('votes').selectAll().where('is_delete', '=', 0)

    // Apply filters
    if (filters) {
      if (filters.title) {
        query = query.where('title', 'like', `%${filters.title}%`)
      }
      if (filters.is_multiple !== undefined) {
        query = query.where('is_multiple', '=', filters.is_multiple)
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

    const [votes, total] = await Promise.all([
      query.limit(pageSize).offset(offset).execute(),
      query.select((eb) => [eb.fn.count('id').as('count')]).executeTakeFirst()
    ])

    // Get vote items for each vote
    const votesWithItems = await Promise.all(
      votes.map(async (vote) => {
        const items = await db
          .selectFrom('vote_items')
          .selectAll()
          .where('vote_id', '=', vote.id)
          .where('is_delete', '=', 0)
          .execute()
        return { ...vote, items: items as unknown as VoteItem[] }
      })
    )

    return {
      dataList: votesWithItems as VoteWithItems[],
      pagination: {
        total: Number(total?.count) || 0,
        page,
        pageSize,
        totalPages: Math.ceil((Number(total?.count) || 0) / pageSize)
      }
    }
  }

  /**
   * Create new vote with optional items
   */
  async createVote(data: CreateVoteData): Promise<Vote> {
    // Validate time range
    if (data.start_time >= data.end_time) {
      throw new Error('Start time must be before end time')
    }

    const now = Date.now()
    const { vote_items, ...voteData } = data
    const newVote = {
      ...voteData,
      count: 0,
      create_time: now,
      update_time: now,
      is_delete: 0
    }

    // Start a transaction
    const result = await db.transaction().execute(async (trx) => {
      // Insert vote
      const voteResult = await trx
        .insertInto('votes')
        .values(filterUndefined(newVote))
        .executeTakeFirst()
      const voteId = Number(voteResult.insertId)

      // Insert vote items if provided
      if (vote_items && vote_items.length > 0) {
        const voteItems = vote_items.map((title) => ({
          title,
          vote_id: voteId,
          status: 10,
          create_time: now,
          update_time: now,
          is_delete: 0
        }))
        await trx.insertInto('vote_items').values(voteItems).execute()
      }

      return voteResult
    })

    return {
      id: Number(result.insertId),
      ...newVote
    }
  }

  /**
   * Update vote by ID with optional items
   */
  async updateVote(id: number, data: UpdateVoteData): Promise<boolean> {
    // Validate time range if both times are provided
    if (data.start_time !== undefined && data.end_time !== undefined) {
      if (data.start_time >= data.end_time) {
        throw new Error('Start time must be before end time')
      }
    }

    const updateData = {
      ...data,
      update_time: Date.now()
    }

    // Remove vote_items from updateData as it's handled separately
    const { vote_items, ...voteUpdateData } = updateData

    // Start a transaction
    const result = await db.transaction().execute(async (trx) => {
      // Update vote
      const voteResult = await trx
        .updateTable('votes')
        .set(filterUndefined(voteUpdateData))
        .where('id', '=', id)
        .where('is_delete', '=', 0)
        .executeTakeFirst()

      if (voteResult.numUpdatedRows === 0n) {
        throw new Error('Vote not found')
      }

      // Update vote items if provided
      if (vote_items !== undefined) {
        // Delete existing vote items
        await trx
          .updateTable('vote_items')
          .set({
            is_delete: 10,
            update_time: Date.now()
          })
          .where('vote_id', '=', id)
          .where('is_delete', '=', 0)
          .execute()

        // Insert new vote items
        if (vote_items.length > 0) {
          const voteItems = vote_items.map((title) => ({
            title,
            vote_id: id,
            status: 10,
            create_time: Date.now(),
            update_time: Date.now(),
            is_delete: 0
          }))
          await trx.insertInto('vote_items').values(voteItems).execute()
        }
      }

      return voteResult
    })

    return result.numUpdatedRows > 0n
  }

  /**
   * Delete vote (logical delete) with associated items
   */
  async deleteVote(id: number): Promise<boolean> {
    // Start a transaction
    const result = await db.transaction().execute(async (trx) => {
      // Delete vote
      const voteResult = await trx
        .updateTable('votes')
        .set({
          is_delete: 10,
          update_time: Date.now()
        })
        .where('id', '=', id)
        .where('is_delete', '=', 0)
        .executeTakeFirst()

      if (voteResult.numUpdatedRows === 0n) {
        throw new Error('Vote not found')
      }

      // Delete associated vote items
      await trx
        .updateTable('vote_items')
        .set({
          is_delete: 10,
          update_time: Date.now()
        })
        .where('vote_id', '=', id)
        .where('is_delete', '=', 0)
        .execute()

      return voteResult
    })

    return result.numUpdatedRows > 0n
  }

  /**
   * Get votes by status
   */
  async getVotesByStatus(status: number): Promise<Vote[]> {
    const result = await db
      .selectFrom('votes')
      .selectAll()
      .where('status', '=', status)
      .where('is_delete', '=', 0)
      .orderBy('create_time', 'desc')
      .execute()

    return result as unknown as Vote[]
  }

  /**
   * Get active votes (current time is between start_time and end_time)
   */
  async getActiveVotes(): Promise<Vote[]> {
    const now = Date.now()
    const result = await db
      .selectFrom('votes')
      .selectAll()
      .where('status', '=', 10)
      .where('is_delete', '=', 0)
      .where('start_time', '<=', now)
      .where('end_time', '>=', now)
      .orderBy('create_time', 'desc')
      .execute()

    return result as unknown as Vote[]
  }

  /**
   * Search votes by title
   */
  async searchVotes(searchTerm: string): Promise<Vote[]> {
    const result = await db
      .selectFrom('votes')
      .selectAll()
      .where('is_delete', '=', 0)
      .where('title', 'like', `%${searchTerm}%`)
      .orderBy('create_time', 'desc')
      .execute()

    return result as unknown as Vote[]
  }

  /**
   * Get votes count by status
   */
  async getVotesCountByStatus(): Promise<{ status: number; count: number }[]> {
    return await db
      .selectFrom('votes')
      .select(['status', sql<number>`count(*)`.as('count')])
      .where('is_delete', '=', 0)
      .groupBy('status')
      .execute()
  }

  /**
   * Check if vote exists by title
   */
  async checkVoteExistsByTitle(title: string, excludeId?: number): Promise<boolean> {
    let query = db
      .selectFrom('votes')
      .select('id')
      .where('title', '=', title)
      .where('is_delete', '=', 0)

    if (excludeId) {
      query = query.where('id', '!=', excludeId)
    }

    const result = await query.executeTakeFirst()
    return !!result
  }

  /**
   * Get votes statistics
   */
  async getVotesStats(): Promise<{
    total: number
    active: number
    inactive: number
    deleted: number
    multiple: number
    single: number
  }> {
    const stats = await db
      .selectFrom('votes')
      .select([
        sql<number>`count(*)`.as('total'),
        sql<number>`sum(case when status = 10 then 1 else 0 end)`.as('active'),
        sql<number>`sum(case when status = 0 then 1 else 0 end)`.as('inactive'),
        sql<number>`sum(case when is_delete = 10 then 1 else 0 end)`.as('deleted'),
        sql<number>`sum(case when is_multiple = 10 then 1 else 0 end)`.as('multiple'),
        sql<number>`sum(case when is_multiple = -10 then 1 else 0 end)`.as('single')
      ])
      .executeTakeFirst()

    return {
      total: Number(stats?.total) || 0,
      active: Number(stats?.active) || 0,
      inactive: Number(stats?.inactive) || 0,
      deleted: Number(stats?.deleted) || 0,
      multiple: Number(stats?.multiple) || 0,
      single: Number(stats?.single) || 0
    }
  }
}

// Export singleton instance
export const voteService = new VoteService()
