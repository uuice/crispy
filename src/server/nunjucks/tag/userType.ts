import nunjucks from 'nunjucks'
import { userTypeService } from '@src/server/services/userTypeService'

// UserTypes 标签 - 获取用户类型列表
export function UserTypes(): void {
  this.tags = ['UserTypes']
  this.parse = function (parser: any, nodes: any) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)
    if (!args.children.length) {
      args.addChild(new nodes.Literal(0, 0, ''))
    }
    parser.advanceAfterBlockEnd(tok.value)
    const body = parser.parseUntilBlocks('endUserTypes')
    parser.advanceAfterBlockEnd()

    return new nodes.CallExtensionAsync(this, 'run', args, [body])
  }
  this.run = async function (context: any, args: any, body: any, callback: any) {
    const limit = args.limit || 10
    const page = args.page || 1
    const pageSize = args.page_size || limit

    const result = await userTypeService.getUserTypes({ ...args, page, pageSize })

    context.ctx.user_types = result.dataList
    context.ctx.user_types_pagination = result.pagination

    const resultHtml = new nunjucks.runtime.SafeString(body())
    return callback(null, resultHtml)
  }
}

// UserTypeItem 标签 - 获取单个用户类型
export function UserTypeItem(): void {
  this.tags = ['UserTypeItem']
  this.parse = function (parser: any, nodes: any) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)
    if (!args.children.length) {
      args.addChild(new nodes.Literal(0, 0, ''))
    }
    parser.advanceAfterBlockEnd(tok.value)
    const body = parser.parseUntilBlocks('endUserTypeItem')
    parser.advanceAfterBlockEnd()
    return new nodes.CallExtensionAsync(this, 'run', args, [body])
  }
  this.run = async function (context: any, args: any, body: any, callback: any) {
    const id = args.id
    if (!id) {
      return callback(null, new nunjucks.runtime.SafeString(''))
    }

    const userType = await userTypeService.getById(id)
    context.ctx.userType = userType
    const result = new nunjucks.runtime.SafeString(body())
    return callback(null, result)
  }
}
