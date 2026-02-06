import nunjucks from 'nunjucks'
import { commentService } from '@src/server/services/commentService'

// Comments 标签 - 获取评论列表
export function Comments(): void {
  this.tags = ['Comments']
  this.parse = function (parser: any, nodes: any) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)
    if (!args.children.length) {
      args.addChild(new nodes.Literal(0, 0, ''))
    }
    parser.advanceAfterBlockEnd(tok.value)
    const body = parser.parseUntilBlocks('endComments')
    parser.advanceAfterBlockEnd()

    return new nodes.CallExtensionAsync(this, 'run', args, [body])
  }
  this.run = async function (context: any, args: any, body: any, callback: any) {
    const limit = args.limit || 10
    const page = args.page || 1
    const pageSize = args.page_size || limit

    // Build filters object from args
    const filters: any = {}

    // Search filters - 字符串，空字符串通常不是有效值
    if (args.content) filters.content = args.content
    if (args.title) filters.title = args.title
    // 需要 !== undefined 因为可能包含 0 等 falsy 值
    if (args.user_id !== undefined) filters.user_id = args.user_id
    if (args.parent_id !== undefined) filters.parent_id = args.parent_id
    if (args.status !== undefined) filters.status = args.status

    // Range filters - 需要 !== undefined 因为可能包含 0
    if (args.good_article_min !== undefined) filters.good_article_min = args.good_article_min
    if (args.good_article_max !== undefined) filters.good_article_max = args.good_article_max
    if (args.bad_article_min !== undefined) filters.bad_article_min = args.bad_article_min
    if (args.bad_article_max !== undefined) filters.bad_article_max = args.bad_article_max
    if (args.not_article_min !== undefined) filters.not_article_min = args.not_article_min
    if (args.not_article_max !== undefined) filters.not_article_max = args.not_article_max

    // Date filters - 时间戳，0 是有效值
    if (args.start_time !== undefined) filters.start_time = args.start_time
    if (args.end_time !== undefined) filters.end_time = args.end_time

    // Boolean filters - 需要 !== undefined 因为 false 是有效值
    if (args.has_parent !== undefined)
      filters.has_parent = args.has_parent === 'true' || args.has_parent === true

    // Use the enhanced getComments method with filters
    const result = await commentService.getComments({ ...filters, page, pageSize })

    context.ctx.comments = result.dataList
    context.ctx.comments_pagination = result.pagination

    const resultHtml = new nunjucks.runtime.SafeString(body())
    return callback(null, resultHtml)
  }
}

// CommentItem 标签 - 获取单个评论
export function CommentItem(): void {
  this.tags = ['CommentItem']
  this.parse = function (parser: any, nodes: any) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)
    if (!args.children.length) {
      args.addChild(new nodes.Literal(0, 0, ''))
    }
    parser.advanceAfterBlockEnd(tok.value)
    const body = parser.parseUntilBlocks('endCommentItem')
    parser.advanceAfterBlockEnd()
    return new nodes.CallExtensionAsync(this, 'run', args, [body])
  }
  this.run = async function (context: any, args: any, body: any, callback: any) {
    const id = args.id
    if (!id) {
      return callback(null, new nunjucks.runtime.SafeString(''))
    }

    const comment = await commentService.getById(id)
    context.ctx.comment = comment
    const result = new nunjucks.runtime.SafeString(body())
    return callback(null, result)
  }
}
