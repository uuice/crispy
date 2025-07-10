import nunjucks from 'nunjucks'
import { roleService } from '@src/server/services/roleService'

// Roles 标签 - 获取角色列表
export function Roles(): void {
  this.tags = ['Roles']
  this.parse = function (parser: any, nodes: any) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)
    if (!args.children.length) {
      args.addChild(new nodes.Literal(0, 0, ''))
    }
    parser.advanceAfterBlockEnd(tok.value)
    const body = parser.parseUntilBlocks('endRoles')
    parser.advanceAfterBlockEnd()

    return new nodes.CallExtensionAsync(this, 'run', args, [body])
  }
  this.run = async function (context: any, args: any, body: any, callback: any) {
    const status = args.status || 10 // 默认获取激活状态的角色
    const search = args.search
    const moduleId = args.module_id
    const typeId = args.type_id
    const limit = args.limit || 10

    let roles
    if (search) {
      roles = await roleService.searchRoles(search)
      roles = roles.slice(0, limit)
    } else if (status) {
      roles = await roleService.getRolesByStatus(status)
      roles = roles.slice(0, limit)
    } else {
      const filters: any = {}
      if (status !== undefined) filters.status = status
      if (moduleId) filters.module_id = moduleId
      if (typeId) filters.type_id = typeId

      const result = await roleService.getRoles({ page: 1, pageSize: limit }, filters)
      roles = result.dataList
    }

    context.ctx.roles = roles
    const result = new nunjucks.runtime.SafeString(body())
    return callback(null, result)
  }
}

// RoleItem 标签 - 获取单个角色
export function RoleItem(): void {
  this.tags = ['RoleItem']
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

    const role = await roleService.getRoleById(id)
    const result = new nunjucks.runtime.SafeString(role ? JSON.stringify(role) : '')
    return callback(null, result)
  }
}
