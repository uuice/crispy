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
    const tree = args.tree === 'true' || args.tree === true
    const limit = args.limit || 100

    let categories
    if (tree) {
      categories = await categoryService.getCategoryTree()
    } else {
      const result = await categoryService.getCategories({}, { page: 1, pageSize: limit })
      categories = result.dataList
    }

    context.ctx.categories = categories
    const result = new nunjucks.runtime.SafeString(body())
    return callback(null, result)
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
  this.run = async function (context: any, args: any, callback: any) {
    const id = args.id
    if (!id) {
      return callback(null, new nunjucks.runtime.SafeString(''))
    }

    const category = await categoryService.getCategoryById(id)
    const result = new nunjucks.runtime.SafeString(category ? JSON.stringify(category) : '')
    return callback(null, result)
  }
}
