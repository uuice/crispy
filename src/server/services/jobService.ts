import { db } from '@src/libs/db'

export interface CreateJobData {
  title: string
  content: string
  address?: string
  branch?: string
  email?: string
  nature?: string
  num: number
  typeName?: string
  sort?: number
}

export type UpdateJobData = Partial<CreateJobData>

export interface JobFilters {
  title?: string
  typeName?: string
  nature?: string
  branch?: string
  start_time?: number
  end_time?: number
}

export interface PaginationParams {
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

export class JobService {
  /**
   * Get a single job by ID
   */
  async getJobById(id: number) {
    return await db
      .selectFrom('jobs')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()
  }

  /**
   * Get jobs with pagination and filters
   */
  async getJobs(filters: JobFilters, pagination: PaginationParams): Promise<PaginatedResult<any>> {
    const { page, pageSize } = pagination
    const offset = (page - 1) * pageSize

    let query = db.selectFrom('jobs').selectAll().where('is_delete', '=', 0)

    // Add filters if provided
    if (filters.title) {
      query = query.where('title', 'like', `%${filters.title}%`)
    }
    if (filters.typeName) {
      query = query.where('typeName', 'like', `%${filters.typeName}%`)
    }
    if (filters.nature) {
      query = query.where('nature', 'like', `%${filters.nature}%`)
    }
    if (filters.branch) {
      query = query.where('branch', 'like', `%${filters.branch}%`)
    }
    if (filters.start_time) {
      query = query.where('create_time', '>=', filters.start_time)
    }
    if (filters.end_time) {
      query = query.where('create_time', '<=', filters.end_time)
    }

    // Order by create_time desc by default
    query = query.orderBy('create_time', 'desc')

    const [jobs, total] = await Promise.all([
      query.limit(pageSize).offset(offset).execute(),
      query.select((eb) => [eb.fn.count('id').as('count')]).executeTakeFirst()
    ])

    return {
      dataList: jobs,
      pagination: {
        total: Number(total?.count) || 0,
        page,
        pageSize,
        totalPages: Math.ceil((Number(total?.count) || 0) / pageSize)
      }
    }
  }

  /**
   * Create a new job
   */
  async createJob(data: CreateJobData) {
    const now = Date.now()
    const newJob = {
      ...data,
      create_time: now,
      update_time: now,
      is_delete: 0
    }

    const result = await db.safeInsertInto('jobs').values(newJob).executeTakeFirst()

    return {
      id: Number(result.insertId),
      ...newJob
    }
  }

  /**
   * Update a job
   */
  async updateJob(id: number, data: UpdateJobData) {
    const updateData = {
      ...data,
      update_time: Date.now()
    }

    const result = await db
      .safeUpdateTable('jobs')
      .set(updateData)
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    return {
      success: result.numUpdatedRows > 0,
      numUpdatedRows: result.numUpdatedRows
    }
  }

  /**
   * Delete a job (logical delete)
   */
  async deleteJob(id: number) {
    const result = await db
      .safeUpdateTable('jobs')
      .set({
        is_delete: 10,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', 0)
      .executeTakeFirst()

    return {
      success: result.numUpdatedRows > 0,
      numUpdatedRows: result.numUpdatedRows
    }
  }

  /**
   * Get jobs by type name
   */
  async getJobsByType(typeName: string, limit = 10) {
    return await db
      .selectFrom('jobs')
      .selectAll()
      .where('typeName', '=', typeName)
      .where('is_delete', '=', 0)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .limit(limit)
      .execute()
  }

  /**
   * Get jobs by nature
   */
  async getJobsByNature(nature: string, limit = 10) {
    return await db
      .selectFrom('jobs')
      .selectAll()
      .where('nature', '=', nature)
      .where('is_delete', '=', 0)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .limit(limit)
      .execute()
  }

  /**
   * Get jobs by branch
   */
  async getJobsByBranch(branch: string, limit = 10) {
    return await db
      .selectFrom('jobs')
      .selectAll()
      .where('branch', '=', branch)
      .where('is_delete', '=', 0)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .limit(limit)
      .execute()
  }

  /**
   * Get jobs by title (search)
   */
  async searchJobsByTitle(title: string, limit = 10) {
    return await db
      .selectFrom('jobs')
      .selectAll()
      .where('title', 'like', `%${title}%`)
      .where('is_delete', '=', 0)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .limit(limit)
      .execute()
  }

  /**
   * Get all active jobs
   */
  async getAllActiveJobs() {
    return await db
      .selectFrom('jobs')
      .selectAll()
      .where('is_delete', '=', 0)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .execute()
  }

  /**
   * Check if job title already exists
   */
  async checkTitleExists(title: string, excludeId?: number) {
    let query = db
      .selectFrom('jobs')
      .select('id')
      .where('title', '=', title)
      .where('is_delete', '=', 0)

    if (excludeId) {
      query = query.where('id', '!=', excludeId)
    }

    return await query.executeTakeFirst()
  }

  /**
   * Get job statistics
   */
  async getJobStats() {
    const [total, byType, byNature, byBranch] = await Promise.all([
      db
        .selectFrom('jobs')
        .select((eb) => [eb.fn.count('id').as('count')])
        .where('is_delete', '=', 0)
        .executeTakeFirst(),
      db
        .selectFrom('jobs')
        .select((eb) => [eb.fn.count('id').as('count')])
        .where('typeName', 'is not', null)
        .where('is_delete', '=', 0)
        .executeTakeFirst(),
      db
        .selectFrom('jobs')
        .select((eb) => [eb.fn.count('id').as('count')])
        .where('nature', 'is not', null)
        .where('is_delete', '=', 0)
        .executeTakeFirst(),
      db
        .selectFrom('jobs')
        .select((eb) => [eb.fn.count('id').as('count')])
        .where('branch', 'is not', null)
        .where('is_delete', '=', 0)
        .executeTakeFirst()
    ])

    return {
      total: Number(total?.count) || 0,
      withType: Number(byType?.count) || 0,
      withNature: Number(byNature?.count) || 0,
      withBranch: Number(byBranch?.count) || 0
    }
  }
}

export const jobService = new JobService()
