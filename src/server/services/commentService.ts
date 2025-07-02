import { db } from '@src/libs/db'
import { sql } from 'kysely'

export class CommentService {
  // 统计评论总数
  async countComments(): Promise<number> {
    const result = await db
      .selectFrom('comments')
      .select((eb: any) => [eb.fn.count('id').as('count')])
      .where('is_delete', '=', 0)
      .executeTakeFirst()
    return Number(result?.['count']) || 0
  }
}

export const commentService = new CommentService()
