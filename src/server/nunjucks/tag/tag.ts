import nunjucks from 'nunjucks'
import { tagService } from '@src/server/services/tagService'

// Tags 标签 - 获取标签列表
export function Tags(): void {
  this.tags = ['Tags']
  this.parse = function (parser: any, nodes: any) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)
    if (!args.children.length) {
      args.addChild(new nodes.Literal(0, 0, ''))
    }
    parser.advanceAfterBlockEnd(tok.value)
    const body = parser.parseUntilBlocks('endTags')
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
    if (args.title) filters.title = args.title
    if (args.alias) filters.alias = args.alias
    if (args.des) filters.des = args.des
    // 需要 !== undefined 因为可能包含 0 等 falsy 值
    if (args.type_id !== undefined) filters.type_id = args.type_id
    if (args.status !== undefined) filters.status = args.status

    // Range filters - 需要 !== undefined 因为可能包含 0
    if (args.sort_min !== undefined) filters.sort_min = args.sort_min
    if (args.sort_max !== undefined) filters.sort_max = args.sort_max

    // Date filters - 时间戳，0 是有效值
    if (args.start_time !== undefined) filters.start_time = args.start_time
    if (args.end_time !== undefined) filters.end_time = args.end_time

    // Use the enhanced getTags method with filters
    const result = await tagService.getTags({ page, pageSize }, filters)

    context.ctx.tags = result.dataList
    context.ctx.tags_pagination = result.pagination

    const resultHtml = new nunjucks.runtime.SafeString(body())
    return callback(null, resultHtml)
  }
}

// TagItem 标签 - 获取单个标签
export function TagItem(): void {
  this.tags = ['TagItem']
  this.parse = function (parser: any, nodes: any) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)
    if (!args.children.length) {
      args.addChild(new nodes.Literal(0, 0, ''))
    }
    parser.advanceAfterBlockEnd(tok.value)
    return new nodes.CallExtensionAsync(this, 'run', args)
  }
  this.run = async function (_context: any, args: any, callback: any) {
    const id = args.id
    // const alias = args.alias

    if (!id) {
      return callback(null, new nunjucks.runtime.SafeString(''))
    }

    let tag
    if (id) {
      tag = await tagService.getTagById(id)
    }
    // else if (alias) {
    //   tag = await tagService.getTagByAlias(alias)
    // }

    const result = new nunjucks.runtime.SafeString(tag ? JSON.stringify(tag) : '')
    return callback(null, result)
  }
}
