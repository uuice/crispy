import nunjucks from 'nunjucks'
import { attrService } from '@src/server/services/attrService'

// Attrs 标签 - 获取属性列表
export function Attrs(): void {
  this.tags = ['Attrs']
  this.parse = function (parser: any, nodes: any) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)
    if (!args.children.length) {
      args.addChild(new nodes.Literal(0, 0, ''))
    }
    parser.advanceAfterBlockEnd(tok.value)
    const body = parser.parseUntilBlocks('endAttrs')
    parser.advanceAfterBlockEnd()

    return new nodes.CallExtensionAsync(this, 'run', args, [body])
  }
  this.run = async function (context: any, args: any, body: any, callback: any) {
    const status = args.status || 10 // 默认获取激活状态的属性
    const limit = args.limit || 10

    let attrs
    if (status) {
      attrs = await attrService.getAttrsByStatus(status, limit)
    } else {
      attrs = await attrService.getAllActiveAttrs()
      attrs = attrs.slice(0, limit)
    }

    context.ctx.attrs = attrs
    const result = new nunjucks.runtime.SafeString(body())
    return callback(null, result)
  }
}

// AttrItem 标签 - 获取单个属性
export function AttrItem(): void {
  this.tags = ['AttrItem']
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
    const alias = args.alias

    let attr
    if (id) {
      attr = await attrService.getAttrById(id)
    } else if (alias) {
      attr = await attrService.getAttrByAlias(alias)
    }

    const result = new nunjucks.runtime.SafeString(attr ? JSON.stringify(attr) : '')
    return callback(null, result)
  }
}
