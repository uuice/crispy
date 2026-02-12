import nunjucks from 'nunjucks'
import { menuService } from '@src/server/services/menuService'

// Menus 标签 - 获取菜单列表
export function Menus(): void {
  this.tags = ['Menus']
  this.parse = function (parser: any, nodes: any) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)
    if (!args.children.length) {
      args.addChild(new nodes.Literal(0, 0, ''))
    }
    parser.advanceAfterBlockEnd(tok.value)
    const body = parser.parseUntilBlocks('endMenus')
    parser.advanceAfterBlockEnd()

    return new nodes.CallExtensionAsync(this, 'run', args, [body])
  }
  this.run = async function (context: any, args: any, body: any, callback: any) {
    const limit = args.limit || 10
    const page = args.page || 1
    const pageSize = args.page_size || limit

    const result = await menuService.getMenus({ ...args, page, pageSize })

    context.ctx.menus = result.dataList
    context.ctx.menus_pagination = result.pagination

    const resultHtml = new nunjucks.runtime.SafeString(body())
    return callback(null, resultHtml)
  }
}

// MenuItem 标签 - 获取单个菜单
export function MenuItem(): void {
  this.tags = ['MenuItem']
  this.parse = function (parser: any, nodes: any) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)
    if (!args.children.length) {
      args.addChild(new nodes.Literal(0, 0, ''))
    }
    parser.advanceAfterBlockEnd(tok.value)
    const body = parser.parseUntilBlocks('endMenuItem')
    parser.advanceAfterBlockEnd()
    return new nodes.CallExtensionAsync(this, 'run', args, [body])
  }
  this.run = async function (context: any, args: any, body: any, callback: any) {
    const id = args.id
    if (!id) {
      return callback(null, new nunjucks.runtime.SafeString(''))
    }

    const menu = await menuService.getById(id)
    context.ctx.menu = menu
    const result = new nunjucks.runtime.SafeString(body())
    return callback(null, result)
  }
}
