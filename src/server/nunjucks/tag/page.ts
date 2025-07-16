import nunjucks from 'nunjucks'
import { pageService } from '@src/server/services/pageService'

// Pages 标签 - 获取页面列表
export function Pages(): void {
  this.tags = ['Pages']
  this.parse = function (parser: any, nodes: any) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)
    if (!args.children.length) {
      args.addChild(new nodes.Literal(0, 0, ''))
    }
    parser.advanceAfterBlockEnd(tok.value)
    const body = parser.parseUntilBlocks('endPages')
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
    if (args.sub_title) filters.sub_title = args.sub_title
    if (args.abstract) filters.abstract = args.abstract
    if (args.url) filters.url = args.url
    // 需要 !== undefined 因为可能包含 0 等 falsy 值
    if (args.status !== undefined) filters.status = args.status
    if (args.type_id !== undefined) filters.type_id = args.type_id
    if (args.author_id !== undefined) filters.author_id = args.author_id
    if (args.user_id !== undefined) filters.user_id = args.user_id

    // Range filters - 需要 !== undefined 因为可能包含 0
    if (args.sort_min !== undefined) filters.sort_min = args.sort_min
    if (args.sort_max !== undefined) filters.sort_max = args.sort_max
    if (args.click_min !== undefined) filters.click_min = args.click_min
    if (args.click_max !== undefined) filters.click_max = args.click_max

    // Date filters - 时间戳，0 是有效值
    if (args.start_time !== undefined) filters.startTime = args.start_time
    if (args.end_time !== undefined) filters.endTime = args.end_time

    // Boolean filters - 需要 !== undefined 因为 false 是有效值
    if (args.has_image !== undefined)
      filters.has_image = args.has_image === 'true' || args.has_image === true
    if (args.has_tags !== undefined)
      filters.has_tags = args.has_tags === 'true' || args.has_tags === true

    // Use the enhanced getPages method with filters
    const result = await pageService.getPages({ page, pageSize }, filters)

    context.ctx.pages = result.dataList
    context.ctx.pages_pagination = result.pagination

    const resultHtml = new nunjucks.runtime.SafeString(body())
    return callback(null, resultHtml)
  }
}

// PageItem 标签 - 获取单个页面
export function PageItem(): void {
  this.tags = ['PageItem']
  this.parse = function (parser: any, nodes: any) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)
    if (!args.children.length) {
      args.addChild(new nodes.Literal(0, 0, ''))
    }
    parser.advanceAfterBlockEnd(tok.value)
    const body = parser.parseUntilBlocks('endPageItem')
    parser.advanceAfterBlockEnd()
    return new nodes.CallExtensionAsync(this, 'run', args, [body])
  }
  this.run = async function (context: any, args: any, body: any, callback: any) {
    const id = args.id
    const alias = args.alias

    if (!id && !alias) {
      return callback(null, new nunjucks.runtime.SafeString(''))
    }

    let page
    if (id) {
      page = await pageService.getPageById(id)
    } else if (alias) {
      page = await pageService.getPageByAlias(alias)
    }

    context.ctx.page = page
    const result = new nunjucks.runtime.SafeString(body())
    return callback(null, result)
  }
}
