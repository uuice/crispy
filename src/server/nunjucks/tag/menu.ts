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
    const tree = args.tree === 'true' || args.tree === true
    const limit = args.limit || 100

    let menus
    if (tree) {
      menus = await menuService.getMenuTree()
    } else {
      const result = await menuService.getMenus({ page: 1, pageSize: limit }, {})
      menus = result.dataList
    }

    context.ctx.menus = menus
    const result = new nunjucks.runtime.SafeString(body())
    return callback(null, result)
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
    return new nodes.CallExtensionAsync(this, 'run', args)
  }
  this.run = async function (_context: any, args: any, callback: any) {
    const id = args.id
    if (!id) {
      return callback(null, new nunjucks.runtime.SafeString(''))
    }

    const menu = await menuService.getMenuById(id)
    const result = new nunjucks.runtime.SafeString(menu ? JSON.stringify(menu) : '')
    return callback(null, result)
  }
}
