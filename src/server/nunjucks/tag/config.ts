import nunjucks from 'nunjucks'
import { configService } from '@src/server/services/configService'

export function Config(): void {
  this.tags = ['Config']
  this.parse = function (parser: any, nodes: any) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)
    // !nunjucks has a bug, when args.children is empty
    // add an empty node to args.children
    if (!args.children.length) {
      // Handle empty arguments
      args.addChild(new nodes.Literal(0, 0, ''))
    }
    parser.advanceAfterBlockEnd(tok.value)
    const body = parser.parseUntilBlocks('endConfig') // eng tag
    parser.advanceAfterBlockEnd()

    return new nodes.CallExtensionAsync(this, 'run', args, [body]) // async
  }
  this.run = async function (context: any, args: any, body: any, callback: any) {
    const limit = args.limit || 1000
    const page = args.page || 1
    const pageSize = args.page_size || limit

    // Build filters object from args
    const filters: any = {}

    // Basic filters - 字符串，空字符串通常不是有效值
    if (args.title) filters.title = args.title
    if (args.alias) filters.alias = args.alias
    // 需要 !== undefined 因为可能包含 0 等 falsy 值
    if (args.type_id !== undefined) filters.type_id = args.type_id
    if (args.status !== undefined) filters.status = args.status

    // Date filters - 时间戳，0 是有效值
    if (args.start_time !== undefined) filters.start_time = args.start_time
    if (args.end_time !== undefined) filters.end_time = args.end_time

    const result = await configService.getConfigs(filters, { page, pageSize })

    context.ctx.configs = result.dataList
    context.ctx.configs_pagination = result.pagination

    const resultHtml = new nunjucks.runtime.SafeString(body())
    return callback(null, resultHtml)
  }
}

export function ConfigItem(): void {
  this.tags = ['ConfigItem']
  this.parse = function (parser: any, nodes: any) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)
    // !nunjucks has a bug, when args.children is empty
    // add an empty node to args.children
    if (!args.children.length) {
      // Handle empty arguments
      args.addChild(new nodes.Literal(0, 0, ''))
    }
    parser.advanceAfterBlockEnd(tok.value)
    // const body = parser.parseUntilBlocks('endSysConfigItem') // eng tag
    // parser.advanceAfterBlockEnd()
    return new nodes.CallExtensionAsync(this, 'run', args) // async
  }
  this.run = async function (_context: any, args: any, callback: any) {
    const id = args.id
    const alias = args.alias

    if (!id && !alias) {
      return callback(null, new nunjucks.runtime.SafeString(''))
    }

    let config
    if (id) {
      config = await configService.getConfigById(id)
    } else if (alias) {
      config = await configService.getConfigByAlias(alias)
    }

    const result = new nunjucks.runtime.SafeString(config?.value || '')
    return callback(null, result)
  }
}
