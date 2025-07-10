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
    const status = args.status || 10 // 默认获取激活状态的用户类型
    const search = args.search
    const limit = args.limit || 10

    const filters: any = {}
    if (status !== undefined) filters.status = status
    if (search) filters.type_name = search

    const result = await userTypeService.getUserTypes({ page: 1, pageSize: limit }, filters)
    const userTypes = result.dataList

    context.ctx.userTypes = userTypes
    const result2 = new nunjucks.runtime.SafeString(body())
    return callback(null, result2)
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
    return new nodes.CallExtensionAsync(this, 'run', args)
  }
  this.run = async function (context: any, args: any, callback: any) {
    const id = args.id
    if (!id) {
      return callback(null, new nunjucks.runtime.SafeString(''))
    }

    const userType = await userTypeService.getUserTypeById(id)
    const result = new nunjucks.runtime.SafeString(userType ? JSON.stringify(userType) : '')
    return callback(null, result)
  }
}
