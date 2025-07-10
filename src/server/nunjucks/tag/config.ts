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
  this.run = async function (context: any, _args: any, body: any, callback: any) {
    context.ctx.configs = await configService.getConfigs({}, { page: 1, pageSize: 1000 })
    const result = new nunjucks.runtime.SafeString(body())
    return callback(null, result)
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
    const config = await configService.getConfigByAlias(args.alias)
    const result = new nunjucks.runtime.SafeString(config?.value || '')
    return callback(null, result)
  }
}
