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
    const status = args.status || 10 // 默认获取已审核的评论
    const userId = args.user_id
    const parentId = args.parent_id
    const limit = args.limit || 10

    const filters: any = {}
    if (status) filters.status = status
    if (userId) filters.user_id = userId
    if (parentId) filters.parent_id = parentId

    const result = await commentService.getComments({ page: 1, pageSize: limit }, filters)
    const comments = result.dataList

    context.ctx.comments = comments
    const result2 = new nunjucks.runtime.SafeString(body())
    return callback(null, result2)
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
    return new nodes.CallExtensionAsync(this, 'run', args)
  }
  this.run = async function (context: any, args: any, callback: any) {
    const id = args.id
    if (!id) {
      return callback(null, new nunjucks.runtime.SafeString(''))
    }

    const comment = await commentService.getCommentById(id)
    const result = new nunjucks.runtime.SafeString(comment ? JSON.stringify(comment) : '')
    return callback(null, result)
  }
}
