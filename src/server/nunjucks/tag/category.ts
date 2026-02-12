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

    const result = await categoryService.getCategories({ ...args, page, pageSize })

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
    const body = parser.parseUntilBlocks('endCategoryItem')
    parser.advanceAfterBlockEnd()
    return new nodes.CallExtensionAsync(this, 'run', args, [body])
  }
  this.run = async function (context: any, args: any, body: any, callback: any) {
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

    context.ctx.category = category
    const result = new nunjucks.runtime.SafeString(body())
    return callback(null, result)
  }
}
