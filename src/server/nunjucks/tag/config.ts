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

    const result = await configService.getConfigs({ ...args, page, pageSize })

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
    const body = parser.parseUntilBlocks('endConfigItem')
    parser.advanceAfterBlockEnd()
    return new nodes.CallExtensionAsync(this, 'run', args, [body]) // async
  }
  this.run = async function (context: any, args: any, body: any, callback: any) {
    const id = args.id
    const alias = args.alias

    if (!id && !alias) {
      return callback(null, new nunjucks.runtime.SafeString(''))
    }

    let config
    if (id) {
      config = await configService.getById(id)
    } else if (alias) {
      config = await configService.getConfigByAlias(alias)
    }

    context.ctx.config = config
    const result = new nunjucks.runtime.SafeString(body())
    return callback(null, result)
  }
}
