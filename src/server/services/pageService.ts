import { db } from '@src/libs/db'
import { DELETE_STATUS } from '../config/const'
import { tagService } from './tagService'
import { titleToUrl } from '../utils/titleToUrl'
import { flexsearchService } from './flexsearch-index.service'
import {
  CreatePage,
  createPageSchema,
  CreateSuccess,
  PageEntity,
  PageFilters,
  PaginatedResult,
  UpdatePage,
  updatePageSchema,
  UpdateSuccess
} from '@src/types'

// Helper function to get tagRef object from tags string
async function getTagRef(tags: string): Promise<{ [key: string]: string }> {
  if (!tags) return {}

  const tagNames = tags
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)

  if (tagNames.length === 0) return {}

  const tagRef: { [key: string]: string } = {}

  for (const tagName of tagNames) {
    const tagValue = titleToUrl(tagName)
    tagRef[tagName] = tagValue
  }

  return tagRef
}

export class PageService {
  /**
   * Get single page by ID
   */
  async getById(id: number): Promise<PageEntity | null> {
    const page = await db
      .selectFrom('pages')
      .selectAll()
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    if (!page) {
      return null
    }

    const tagRef = await getTagRef(page.tags || '')
    return {
      ...page,
      tagRef
    } as PageEntity & { tagRef: { [key: string]: string } }
  }

  // get page by url
  async getPageByUrl(url: string): Promise<PageEntity | null> {
    const page = await db
      .selectFrom('pages')
      .selectAll()
      .where('url', '=', url)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    if (!page) {
      return null
    }

    const tagRef = await getTagRef(page.tags || '')
    return {
      ...page,
      tagRef
    } as PageEntity & { tagRef: { [key: string]: string } }
  }

  /**
   * Get page by alias
   */
  async getPageByAlias(alias: string): Promise<PageEntity | null> {
    const page = await db
      .selectFrom('pages')
      .selectAll()
      .where('alias', '=', alias)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    if (!page) {
      return null
    }

    const tagRef = await getTagRef(page.tags || '')
    return {
      ...page,
      tagRef
    } as PageEntity & { tagRef: { [key: string]: string } }
  }

  /**
   * Get pages list with pagination and filters
   */
  async getPages(filters: PageFilters): Promise<PaginatedResult<PageEntity>> {
    const page = Number(filters.page) || 1
    const pageSize = Number(filters.pageSize) || 10
    const offset = (page - 1) * pageSize

    let query = db.selectFrom('pages').selectAll()

    // Apply filters
    if (filters.title) {
      query = query.where('title', 'like', `%${filters.title}%`)
    }
    if (filters.alias) {
      query = query.where('alias', 'like', `%${filters.alias}%`)
    }
    if (filters.sub_title) {
      query = query.where('sub_title', 'like', `%${filters.sub_title}%`)
    }
    if (filters.abstract) {
      query = query.where('abstract', 'like', `%${filters.abstract}%`)
    }
    if (filters.url) {
      query = query.where('url', 'like', `%${filters.url}%`)
    }
    if (filters.status !== undefined) {
      query = query.where('status', '=', filters.status)
    }
    if (filters.type_id !== undefined) {
      query = query.where('type_id', '=', filters.type_id)
    }
    if (filters.author_id !== undefined) {
      query = query.where('author_id', '=', filters.author_id)
    }
    if (filters.user_id !== undefined) {
      query = query.where('user_id', '=', filters.user_id)
    }
    if (filters.click !== undefined) {
      query = query.where('click', '=', filters.click)
    }

    query = query.where('is_delete', '=', DELETE_STATUS.UN_DELETE)

    const [pages, total] = await Promise.all([
      query.orderBy('create_time', 'desc').limit(pageSize).offset(offset).execute(),
      db
        .selectFrom('pages')
        .select((eb) => [eb.fn.count('id').as('count')])
        .$call((qb) => {
          if (filters.title) {
            qb = qb.where('title', 'like', `%${filters.title}%`)
          }
          if (filters.alias) {
            qb = qb.where('alias', 'like', `%${filters.alias}%`)
          }
          if (filters.sub_title) {
            qb = qb.where('sub_title', 'like', `%${filters.sub_title}%`)
          }
          if (filters.abstract) {
            qb = qb.where('abstract', 'like', `%${filters.abstract}%`)
          }
          if (filters.url) {
            qb = qb.where('url', 'like', `%${filters.url}%`)
          }
          if (filters.status !== undefined) {
            qb = qb.where('status', '=', filters.status)
          }
          if (filters.type_id !== undefined) {
            qb = qb.where('type_id', '=', filters.type_id)
          }
          if (filters.author_id !== undefined) {
            qb = qb.where('author_id', '=', filters.author_id)
          }
          if (filters.user_id !== undefined) {
            qb = qb.where('user_id', '=', filters.user_id)
          }
          if (filters.click !== undefined) {
            qb = qb.where('click', '=', filters.click)
          }
          qb = qb.where('is_delete', '=', DELETE_STATUS.UN_DELETE)
          return qb
        })
        .executeTakeFirst()
    ])

    // Add tagRef for each page
    const pagesWithTagRef = await Promise.all(
      pages.map(async (page) => {
        const tagRef = await getTagRef(page.tags || '')
        return {
          ...page,
          tagRef
        }
      })
    )

    return {
      dataList: pagesWithTagRef,
      pagination: {
        total: Number(total?.count) || 0,
        page,
        pageSize,
        totalPages: Math.ceil((Number(total?.count) || 0) / pageSize)
      }
    }
  }

  /**
   * Create new page
   */
  async create(createData: CreatePage): Promise<CreateSuccess> {
    const validatedData = createPageSchema.parse(createData)

    // 处理 tags
    if (validatedData.tags) {
      const tagsArr = validatedData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
      await tagService.upsertTags(tagsArr)
    }

    if (!validatedData.url && validatedData.title) {
      validatedData.url = titleToUrl(validatedData.title)
    }

    const now = Date.now()
    const newPage = {
      ...validatedData,
      create_time: now,
      update_time: now,
      is_delete: DELETE_STATUS.UN_DELETE
    }

    const result = await db.insertInto('pages').values(newPage).executeTakeFirst()
    if (!result) throw new Error('创建页面失败')

    const pageId = Number(result.insertId)

    // Sync with flexsearch index
    try {
      const createdPage = await this.getById(pageId)
      if (createdPage) {
        await flexsearchService.addPage({
          ...createdPage,
          id: pageId,
          title: createdPage.title || '',
          sub_title: createdPage.sub_title || '',
          abstract: createdPage.abstract || '',
          content: createdPage.content || ''
        })
      }
    } catch (error) {
      console.error('Failed to sync page to flexsearch index:', error)
    }

    return { id: pageId }
  }

  /**
   * Update page by ID
   */
  async update(id: number, updateData: UpdatePage): Promise<UpdateSuccess> {
    const validatedData = updatePageSchema.parse(updateData)

    if (validatedData.tags) {
      const tagsArr = validatedData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
      await tagService.upsertTags(tagsArr)
    }

    if (!validatedData.url && validatedData.title) {
      validatedData.url = titleToUrl(validatedData.title)
    }

    const result = await db
      .updateTable('pages')
      .set({ ...validatedData, update_time: Date.now() })
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    // Sync with flexsearch index
    if (result.numUpdatedRows > 0) {
      try {
        const updatedPage = await this.getById(id)
        if (updatedPage) {
          await flexsearchService.updatePage({
            ...updatedPage,
            id: id,
            title: updatedPage.title || '',
            sub_title: updatedPage.sub_title || '',
            abstract: updatedPage.abstract || '',
            content: updatedPage.content || ''
          })
        }
      } catch (error) {
        console.error('Failed to sync updated page to flexsearch index:', error)
      }
    }

    if (!result) throw new Error('更新页面失败')
    return { id }
  }

  /**
   * Delete page (logical delete)
   */
  async delete(id: number): Promise<boolean> {
    const result = await db
      .updateTable('pages')
      .set({
        is_delete: DELETE_STATUS.DELETE,
        update_time: Date.now()
      })
      .where('id', '=', id)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .executeTakeFirst()

    // Sync with flexsearch index
    if (result.numUpdatedRows > 0) {
      try {
        await flexsearchService.removePage(id.toString())
      } catch (error) {
        console.error('Failed to remove page from flexsearch index:', error)
      }
    }

    return Number(result.numUpdatedRows) > 0
  }

  /**
   * Get pages by status
   */
  async getPagesByStatus(status: number): Promise<PageEntity[]> {
    const pages = await db
      .selectFrom('pages')
      .selectAll()
      .where('status', '=', status)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .orderBy('create_time', 'desc')
      .execute()

    // Add tagRef for each page
    const pagesWithTagRef = await Promise.all(
      pages.map(async (page) => {
        const tagRef = await getTagRef(page.tags || '')
        return {
          ...page,
          tagRef
        }
      })
    )

    return pagesWithTagRef
  }

  /**
   * Search pages by title, alias, content or seo_keywords
   */
  async searchPages(searchTerm: string): Promise<PageEntity[]> {
    const pages = await db
      .selectFrom('pages')
      .selectAll()
      .where((eb) =>
        eb.or([
          eb('title', 'like', `%${searchTerm}%`),
          eb('alias', 'like', `%${searchTerm}%`),
          eb('content', 'like', `%${searchTerm}%`),
          eb('seo_keywords', 'like', `%${searchTerm}%`)
        ])
      )
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .orderBy('create_time', 'desc')
      .execute()

    // Add tagRef for each page
    const pagesWithTagRef = await Promise.all(
      pages.map(async (page) => {
        const tagRef = await getTagRef(page.tags || '')
        return {
          ...page,
          tagRef
        }
      })
    )

    return pagesWithTagRef
  }

  /**
   * Get pages count by status
   */
  async getPagesCountByStatus(): Promise<{ status: number; count: number }[]> {
    const results = await db
      .selectFrom('pages')
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
   * Check if page exists by alias
   */
  async checkPageExistsByAlias(alias: string, excludeId?: number): Promise<boolean> {
    let query = db
      .selectFrom('pages')
      .select('id')
      .where('alias', '=', alias)
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)

    if (excludeId) {
      query = query.where('id', '!=', excludeId)
    }

    const result = await query.executeTakeFirst()
    return !!result
  }

  /**
   * Get pages statistics
   */
  async getPagesStats(): Promise<{
    total: number
    active: number
    inactive: number
    deleted: number
  }> {
    const stats = await db
      .selectFrom('pages')
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

  /**
   * Get recent pages
   */
  async getRecentPages(limit: number = 10): Promise<PageEntity[]> {
    const pages = await db
      .selectFrom('pages')
      .selectAll()
      .where('is_delete', '=', DELETE_STATUS.UN_DELETE)
      .orderBy('create_time', 'desc')
      .limit(limit)
      .execute()

    // Add tagRef for each page
    const pagesWithTagRef = await Promise.all(
      pages.map(async (page) => {
        const tagRef = await getTagRef(page.tags || '')
        return {
          ...page,
          tagRef
        }
      })
    )

    return pagesWithTagRef
  }
}

// Export singleton instance
export const pageService = new PageService()
