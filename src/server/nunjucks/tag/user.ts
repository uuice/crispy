import nunjucks from 'nunjucks'
import { userService } from '@src/server/services/userService'

// Users 标签 - 获取用户列表
export function Users(): void {
  this.tags = ['Users']
  this.parse = function (parser: any, nodes: any) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)
    if (!args.children.length) {
      args.addChild(new nodes.Literal(0, 0, ''))
    }
    parser.advanceAfterBlockEnd(tok.value)
    const body = parser.parseUntilBlocks('endUsers')
    parser.advanceAfterBlockEnd()

    return new nodes.CallExtensionAsync(this, 'run', args, [body])
  }
  this.run = async function (context: any, args: any, body: any, callback: any) {
    const status = args.status || 10 // 默认获取激活状态的用户
    const roleId = args.role_id
    const isAdmin = args.is_admin
    const limit = args.limit || 10

    const options: any = { page: 1, pageSize: limit }
    if (status !== undefined) options.status = status
    if (roleId) options.role_id = roleId
    if (isAdmin !== undefined) options.isAdmin = isAdmin

    const result = await userService.getUsers(options)
    const users = result.dataList

    context.ctx.users = users
    const result2 = new nunjucks.runtime.SafeString(body())
    return callback(null, result2)
  }
}

// UserItem 标签 - 获取单个用户
export function UserItem(): void {
  this.tags = ['UserItem']
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
    const userName = args.user_name

    let user
    if (id) {
      user = await userService.getUserById(id)
    } else if (userName) {
      user = await userService.getUserByUserName(userName)
    }

    const result = new nunjucks.runtime.SafeString(user ? JSON.stringify(user) : '')
    return callback(null, result)
  }
}
