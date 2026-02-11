import { db } from '@src/libs/db'
import { DELETE_STATUS } from '../config/const'
import {
  CreateJob,
  createJobSchema,
  CreateSuccess,
  JobEntity,
  JobFilters,
  PaginatedResult,
  UpdateJob,
  updateJobSchema,
  UpdateSuccess
} from '@src/types'

export class JobService {
  /**
   * Get a single job by ID
   * @param id Job id
   * @returns Job or null if not found
   */
  async getById(id: number): Promise<JobEntity | null> {
    const job = await db
      .selectFrom('jobs')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()
    return job || null
  }

  /**
   * Get jobs with pagination and filters
   * @param filters Filter options
   * @param options Pagination options
   * @returns List of jobs and pagination info
   */
  async getJobs(filters: JobFilters): Promise<PaginatedResult<JobEntity>> {
    const page = Number(filters.page) || 1
    const pageSize = Number(filters.pageSize) || 10
    const { title, typeName, nature, branch, address, email } = filters
    const offset = (page - 1) * pageSize

    let query = db.selectFrom('jobs').selectAll()

    // Apply filters
    if (title) {
      query = query.where('title', 'like', `%${title}%`)
    }

    if (typeName) {
      query = query.where('typeName', 'like', `%${typeName}%`)
    }

    if (nature) {
      query = query.where('nature', 'like', `%${nature}%`)
    }

    if (branch) {
      query = query.where('branch', 'like', `%${branch}%`)
    }

    if (address) {
      query = query.where('address', 'like', `%${address}%`)
    }

    if (email) {
      query = query.where('email', 'like', `%${email}%`)
    }

    // Default to only non-deleted jobs
    query = query.where('is_delete', '=', DELETE_STATUS.UN_DELETE)

    const [jobs, total] = await Promise.all([
      query.orderBy('create_time', 'desc').limit(pageSize).offset(offset).execute(),
      db
        .selectFrom('jobs')
        .select((eb) => [eb.fn.count('id').as('count')])
        .$call((qb) => {
          // Apply same filters to count query
          if (title) {
            qb = qb.where('title', 'like', `%${title}%`)
          }
          if (typeName) {
            qb = qb.where('typeName', 'like', `%${typeName}%`)
          }
          if (nature) {
            qb = qb.where('nature', 'like', `%${nature}%`)
          }
          if (branch) {
            qb = qb.where('branch', 'like', `%${branch}%`)
          }
          if (address) {
            qb = qb.where('address', 'like', `%${address}%`)
          }
          if (email) {
            qb = qb.where('email', 'like', `%${email}%`)
          }
          qb = qb.where('is_delete', '=', DELETE_STATUS.UN_DELETE)
          return qb
        })
        .executeTakeFirst()
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
   * @param createData Job data without id
   * @returns Created job id
   */
  async create(createData: CreateJob): Promise<CreateSuccess> {
    // 验证
    const validatedData = createJobSchema.parse(createData)
    const now = Date.now()
    const newJob = {
      ...validatedData,
      create_time: now,
      update_time: now,
      is_delete: DELETE_STATUS.UN_DELETE
    }

    const result = await db.insertInto('jobs').values(newJob).executeTakeFirst()
    if (!result) throw new Error('创建职位失败')
    return { id: Number(result.insertId) }
  }

  /**
   * Update a job
   * @param id Job id
   * @param updateData Data to update
   * @returns Updated job id
   */
  async update(id: number, updateData: UpdateJob): Promise<UpdateSuccess> {
    const validatedData = updateJobSchema.parse(updateData)
    const result = await db
      .updateTable('jobs')
      .set({
        ...validatedData,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    if (!result) throw new Error('更新职位失败')
    return { id }
  }

  /**
   * Soft delete job
   * @param id Job id
   * @returns true if deleted successfully
   */
  async delete(id: number): Promise<boolean> {
    const result = await db
      .updateTable('jobs')
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
   * Get jobs by type name
   * @param typeName Job type name
   * @param limit Max number of results
   * @returns List of jobs
   */
  async getJobsByType(typeName: string, limit = 10): Promise<JobEntity[]> {
    return await db
      .selectFrom('jobs')
      .selectAll()
      .where('typeName', '=', typeName)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .limit(limit)
      .execute()
  }

  /**
   * Get jobs by nature
   * @param nature Job nature
   * @param limit Max number of results
   * @returns List of jobs
   */
  async getJobsByNature(nature: string, limit = 10): Promise<JobEntity[]> {
    return await db
      .selectFrom('jobs')
      .selectAll()
      .where('nature', '=', nature)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .limit(limit)
      .execute()
  }

  /**
   * Get jobs by branch
   * @param branch Job branch
   * @param limit Max number of results
   * @returns List of jobs
   */
  async getJobsByBranch(branch: string, limit = 10): Promise<JobEntity[]> {
    return await db
      .selectFrom('jobs')
      .selectAll()
      .where('branch', '=', branch)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .limit(limit)
      .execute()
  }

  /**
   * Search jobs by title
   * @param title Search keyword
   * @param limit Max number of results
   * @returns List of jobs
   */
  async searchJobsByTitle(title: string, limit = 10): Promise<JobEntity[]> {
    return await db
      .selectFrom('jobs')
      .selectAll()
      .where('title', 'like', `%${title}%`)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .limit(limit)
      .execute()
  }

  /**
   * Get all active jobs
   * @returns List of all jobs
   */
  async getAllActiveJobs(): Promise<JobEntity[]> {
    return await db
      .selectFrom('jobs')
      .selectAll()
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .orderBy('sort', 'asc')
      .orderBy('create_time', 'desc')
      .execute()
  }

  /**
   * Check if job title already exists
   * @param title Job title
   * @param excludeId Job id to exclude from check
   * @returns true if exists
   */
  async checkTitleExists(title: string, excludeId?: number): Promise<boolean> {
    let query = db
      .selectFrom('jobs')
      .select('id')
      .where('title', '=', title)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)

    if (excludeId) {
      query = query.where('id', '!=', excludeId)
    }

    const result = await query.executeTakeFirst()
    return !!result
  }
}

export const jobService = new JobService()
