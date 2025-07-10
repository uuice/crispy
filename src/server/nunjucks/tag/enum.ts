import nunjucks from 'nunjucks'
import { enumService } from '@src/server/services/enumService'

// Enums 标签 - 获取枚举列表
export function Enums(): void {
  this.tags = ['Enums']
  this.parse = function (parser: any, nodes: any) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)
    if (!args.children.length) {
      args.addChild(new nodes.Literal(0, 0, ''))
    }
    parser.advanceAfterBlockEnd(tok.value)
    const body = parser.parseUntilBlocks('endEnums')
    parser.advanceAfterBlockEnd()

    return new nodes.CallExtensionAsync(this, 'run', args, [body])
  }
  this.run = async function (context: any, args: any, body: any, callback: any) {
    const code = args.code
    const status = args.status || 10 // 默认获取激活状态的枚举
    const limit = args.limit || 10

    let enums
    if (code) {
      enums = await enumService.getEnumsByCode(code, limit)
    } else if (status) {
      enums = await enumService.getEnumsByStatus(status, limit)
    } else {
      enums = await enumService.getAllActiveEnums()
      enums = enums.slice(0, limit)
    }

    context.ctx.enums = enums
    const result = new nunjucks.runtime.SafeString(body())
    return callback(null, result)
  }
}

// EnumItem 标签 - 获取单个枚举
export function EnumItem(): void {
  this.tags = ['EnumItem']
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

    let enumItem
    if (id) {
      enumItem = await enumService.getEnumById(id)
    } else if (alias) {
      enumItem = await enumService.getEnumByAlias(alias)
    }

    const result = new nunjucks.runtime.SafeString(enumItem ? JSON.stringify(enumItem) : '')
    return callback(null, result)
  }
}
