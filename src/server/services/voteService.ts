import { db } from '@src/libs/db'
import { DELETE_STATUS } from '../config/const'
import {
  VoteEntity,
  VoteFilters,
  CreateVote,
  createVoteSchema,
  CreateSuccess,
  UpdateVote,
  updateVoteSchema,
  UpdateSuccess,
  PaginatedResult,
  PaginationOptions,
  VoteItemEntity
} from '@src/types'

export interface VoteWithItems extends VoteEntity {
  items: VoteItemEntity[]
}

export class VoteService {
  /**
   * Get single vote by ID with items
   */
  async getById(id: number): Promise<VoteWithItems | null> {
    const vote = await db
      .selectFrom('votes')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    if (!vote) {
      return null
    }

    // Get vote items
    const voteItems = await db
      .selectFrom('vote_items')
      .selectAll()
      .where('vote_id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .execute()

    return {
      ...vote,
      items: voteItems
    } as VoteWithItems
  }

  /**
   * Get votes list with pagination and filters
   */
  async getVotes(filters: VoteFilters): Promise<PaginatedResult<VoteWithItems>> {
    const { page = 1, pageSize = 10 } = filters
    const offset = (page - 1) * pageSize

    let query = db.selectFrom('votes').selectAll()

    // Apply filters
    if (filters.title) {
      query = query.where('title', 'like', `%${filters.title}%`)
    }
    if (filters.is_multiple !== undefined) {
      query = query.where('is_multiple', '=', filters.is_multiple)
    }
    if (filters.status !== undefined) {
      query = query.where('status', '=', filters.status)
    }

    query = query.where('is_delete', '=', DELETE_STATUS.UN_DELETE)

    const [votes, total] = await Promise.all([
      query.orderBy('create_time', 'desc').limit(pageSize).offset(offset).execute(),
      db
        .selectFrom('votes')
        .select((eb) => [eb.fn.count('id').as('count')])
        .$call((qb) => {
          if (filters.title) {
            qb = qb.where('title', 'like', `%${filters.title}%`)
          }
          if (filters.is_multiple !== undefined) {
            qb = qb.where('is_multiple', '=', filters.is_multiple)
          }
          if (filters.status !== undefined) {
            qb = qb.where('status', '=', filters.status)
          }
          qb = qb.where('is_delete', '=', DELETE_STATUS.UN_DELETE)
          return qb
        })
        .executeTakeFirst()
    ])

    // Get vote items for each vote
    const votesWithItems = await Promise.all(
      votes.map(async (vote) => {
        const items = await db
          .selectFrom('vote_items')
          .selectAll()
          .where('vote_id', '=', vote.id)
          .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
          .execute()
        return { ...vote, items }
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
  async create(createData: CreateVote & { vote_items?: string[] }): Promise<CreateSuccess> {
    const { vote_items, ...voteData } = createData
    const validated = createVoteSchema.parse({ ...voteData, vote_items })
    const { vote_items: _, ...validatedData } = validated

    // Validate time range
    if (validatedData.start_time && validatedData.end_time) {
      if (validatedData.start_time >= validatedData.end_time) {
        throw new Error('Start time must be before end time')
      }
    }

    const now = Date.now()
    const newVote = {
      ...validatedData,
      count: 0,
      create_time: now,
      update_time: now,
      is_delete: DELETE_STATUS.UN_DELETE
    }

    // Start a transaction
    const result = await db.transaction().execute(async (trx) => {
      // Insert vote
      const voteResult = await trx.insertInto('votes').values(newVote).executeTakeFirst()
      const voteId = Number(voteResult.insertId)

      // Insert vote items if provided
      if (vote_items && vote_items.length > 0) {
        const voteItems = vote_items.map((title) => ({
          title,
          vote_id: voteId,
          status: 10,
          create_time: now,
          update_time: now,
          is_delete: DELETE_STATUS.UN_DELETE
        }))
        await trx.insertInto('vote_items').values(voteItems).execute()
      }

      return voteResult
    })

    return { id: Number(result.insertId) }
  }

  /**
   * Update vote by ID with optional items
   */
  async update(
    id: number,
    updateData: UpdateVote & { vote_items?: string[] }
  ): Promise<UpdateSuccess> {
    const { vote_items, ...voteUpdateData } = updateData
    const validated = updateVoteSchema.parse({ ...voteUpdateData, vote_items })
    const { vote_items: _, ...validatedData } = validated

    // Validate time range if both times are provided
    if (validatedData.start_time && validatedData.end_time) {
      if (validatedData.start_time >= validatedData.end_time) {
        throw new Error('Start time must be before end time')
      }
    }

    // Start a transaction
    const result = await db.transaction().execute(async (trx) => {
      // Update vote
      const voteResult = await trx
        .updateTable('votes')
        .set({ ...validatedData, update_time: Date.now() })
        .where('id', '=', id)
        .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
        .executeTakeFirst()

      if (voteResult.numUpdatedRows === 0n) {
        throw new Error('Vote not found')
      }

      // Update vote items if provided
      if (vote_items) {
        // Delete existing vote items
        await trx
          .updateTable('vote_items')
          .set({
            is_delete: DELETE_STATUS.DELETE,
            update_time: Date.now()
          })
          .where('vote_id', '=', id)
          .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
          .execute()

        // Insert new vote items
        if (vote_items.length > 0) {
          const voteItems = vote_items.map((title) => ({
            title,
            vote_id: id,
            status: 10,
            create_time: Date.now(),
            update_time: Date.now(),
            is_delete: DELETE_STATUS.UN_DELETE
          }))
          await trx.insertInto('vote_items').values(voteItems).execute()
        }
      }

      return voteResult
    })

    return { id }
  }

  /**
   * Delete vote (logical delete) with associated items
   */
  async delete(id: number): Promise<boolean> {
    // Start a transaction
    const result = await db.transaction().execute(async (trx) => {
      // Delete vote
      const voteResult = await trx
        .updateTable('votes')
        .set({
          is_delete: DELETE_STATUS.DELETE,
          update_time: Date.now()
        })
        .where('id', '=', id)
        .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
        .executeTakeFirst()

      if (voteResult.numUpdatedRows === 0n) {
        throw new Error('Vote not found')
      }

      // Delete associated vote items
      await trx
        .updateTable('vote_items')
        .set({
          is_delete: DELETE_STATUS.DELETE,
          update_time: Date.now()
        })
        .where('vote_id', '=', id)
        .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
        .execute()

      return voteResult
    })

    return result.numUpdatedRows > 0n
  }

  /**
   * Get votes by status
   */
  async getVotesByStatus(status: number): Promise<VoteEntity[]> {
    const votes = await db
      .selectFrom('votes')
      .selectAll()
      .where('status', '=', status)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .orderBy('create_time', 'desc')
      .execute()

    return votes
  }

  /**
   * Get active votes (current time is between start_time and end_time)
   */
  async getActiveVotes(): Promise<VoteEntity[]> {
    const now = Date.now()
    const votes = await db
      .selectFrom('votes')
      .selectAll()
      .where('status', '=', 10)
      .where('start_time', '<=', now)
      .where('end_time', '>=', now)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .orderBy('create_time', 'desc')
      .execute()

    return votes
  }

  /**
   * Search votes by title
   */
  async searchVotes(searchTerm: string): Promise<VoteEntity[]> {
    const votes = await db
      .selectFrom('votes')
      .selectAll()
      .where('title', 'like', `%${searchTerm}%`)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .orderBy('create_time', 'desc')
      .execute()

    return votes
  }

  /**
   * Get votes count by status
   */
  async getVotesCountByStatus(): Promise<{ status: number; count: number }[]> {
    const results = await db
      .selectFrom('votes')
      .select((eb) => ['status', eb.fn.count('id').as('count')])
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .groupBy('status')
      .execute()

    return results.map((r) => ({
      status: r.status,
      count: Number(r.count)
    }))
  }

  /**
   * Check if vote exists by title
   */
  async checkVoteExistsByTitle(title: string, excludeId?: number): Promise<boolean> {
    let query = db
      .selectFrom('votes')
      .select('id')
      .where('title', '=', title)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)

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
      .select((eb) => [
        eb.fn.count('id').as('total'),
        eb.fn.sum<number>(eb.case().when('status', '=', 10).then(1).else(0).end()).as('active'),
        eb.fn.sum<number>(eb.case().when('status', '=', 0).then(1).else(0).end()).as('inactive'),
        eb.fn
          .sum<number>(eb.case().when('is_delete', '=', DELETE_STATUS.DELETE).then(1).else(0).end())
          .as('deleted'),
        eb.fn
          .sum<number>(eb.case().when('is_multiple', '=', 10).then(1).else(0).end())
          .as('multiple'),
        eb.fn
          .sum<number>(eb.case().when('is_multiple', '=', -10).then(1).else(0).end())
          .as('single')
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
