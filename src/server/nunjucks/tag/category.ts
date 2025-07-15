import nunjucks from 'nunjucks'
import { categoryService } from '@src/server/services/categoryService'

// Categories 标签 - 获取分类列表
export function Categories(): void {
  this.tags = ['Categories']
  this.parse = function (parser: any, nodes: any) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)
    if (!args.children.length) {
      args.addChild(new nodes.Literal(0, 0, ''))
    }
    parser.advanceAfterBlockEnd(tok.value)
    const body = parser.parseUntilBlocks('endCategories')
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
    if (args.parent_id !== undefined) filters.parent_id = args.parent_id
    if (args.status !== undefined) filters.status = args.status

    // Range filters - 需要 !== undefined 因为可能包含 0
    if (args.sort_min !== undefined) filters.sort_min = args.sort_min
    if (args.sort_max !== undefined) filters.sort_max = args.sort_max

    // Date filters - 时间戳，0 是有效值
    if (args.start_time !== undefined) filters.start_time = args.start_time
    if (args.end_time !== undefined) filters.end_time = args.end_time

    // Use the enhanced getCategories method with filters
    const result = await categoryService.getCategories(filters, { page, pageSize })

    context.ctx.categories = result.dataList
    context.ctx.categories_pagination = result.pagination

    const resultHtml = new nunjucks.runtime.SafeString(body())
    return callback(null, resultHtml)
  }
}

// CategoryItem 标签 - 获取单个分类
export function CategoryItem(): void {
  this.tags = ['CategoryItem']
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
    const alias = args.alias

    if (!id && !alias) {
      return callback(null, new nunjucks.runtime.SafeString(''))
    }

    let category
    if (id) {
      category = await categoryService.getCategoryById(id)
    } else if (alias) {
      category = await categoryService.getCategoryByAlias(alias)
    }

    const result = new nunjucks.runtime.SafeString(category ? JSON.stringify(category) : '')
    return callback(null, result)
  }
}
