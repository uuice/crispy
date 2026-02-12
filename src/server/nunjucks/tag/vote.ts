import nunjucks from 'nunjucks'
import { voteService } from '@src/server/services/voteService'

// Votes 标签 - 获取投票列表
export function Votes(): void {
  this.tags = ['Votes']
  this.parse = function (parser: any, nodes: any) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)
    if (!args.children.length) {
      args.addChild(new nodes.Literal(0, 0, ''))
    }
    parser.advanceAfterBlockEnd(tok.value)
    const body = parser.parseUntilBlocks('endVotes')
    parser.advanceAfterBlockEnd()

    return new nodes.CallExtensionAsync(this, 'run', args, [body])
  }
  this.run = async function (context: any, args: any, body: any, callback: any) {
    const limit = args.limit || 10
    const page = args.page || 1
    const pageSize = args.page_size || limit

    const result = await voteService.getVotes({ ...args, page, pageSize })

    context.ctx.votes = result.dataList
    context.ctx.votes_pagination = result.pagination

    const resultHtml = new nunjucks.runtime.SafeString(body())
    return callback(null, resultHtml)
  }
}

// VoteItem 标签 - 获取单个投票
export function VoteItem(): void {
  this.tags = ['VoteItem']
  this.parse = function (parser: any, nodes: any) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)
    if (!args.children.length) {
      args.addChild(new nodes.Literal(0, 0, ''))
    }
    parser.advanceAfterBlockEnd(tok.value)
    const body = parser.parseUntilBlocks('endVoteItem')
    parser.advanceAfterBlockEnd()
    return new nodes.CallExtensionAsync(this, 'run', args, [body])
  }
  this.run = async function (context: any, args: any, body: any, callback: any) {
    const id = args.id
    if (!id) {
      return callback(null, new nunjucks.runtime.SafeString(''))
    }

    const vote = await voteService.getById(id)
    context.ctx.vote = vote
    const result = new nunjucks.runtime.SafeString(body())
    return callback(null, result)
  }
}
