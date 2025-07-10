import nunjucks from 'nunjucks'
import { jobService } from '@src/server/services/jobService'

// Jobs 标签 - 获取职位列表
export function Jobs(): void {
  this.tags = ['Jobs']
  this.parse = function (parser: any, nodes: any) {
    const tok = parser.nextToken()
    const args = parser.parseSignature(null, true)
    if (!args.children.length) {
      args.addChild(new nodes.Literal(0, 0, ''))
    }
    parser.advanceAfterBlockEnd(tok.value)
    const body = parser.parseUntilBlocks('endJobs')
    parser.advanceAfterBlockEnd()

    return new nodes.CallExtensionAsync(this, 'run', args, [body])
  }
  this.run = async function (context: any, args: any, body: any, callback: any) {
    const typeName = args.type_name
    const search = args.search
    const active = args.active === 'true' || args.active === true
    const limit = args.limit || 10

    let jobs
    if (typeName) {
      jobs = await jobService.getJobsByType(typeName, limit)
    } else if (search) {
      jobs = await jobService.searchJobsByTitle(search, limit)
    } else if (active) {
      jobs = await jobService.getAllActiveJobs()
      jobs = jobs.slice(0, limit)
    } else {
      const result = await jobService.getJobs({}, { page: 1, pageSize: limit })
      jobs = result.dataList
    }

    context.ctx.jobs = jobs
    const result = new nunjucks.runtime.SafeString(body())
    return callback(null, result)
  }
}

// JobItem 标签 - 获取单个职位
export function JobItem(): void {
  this.tags = ['JobItem']
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

    const job = await jobService.getJobById(id)
    const result = new nunjucks.runtime.SafeString(job ? JSON.stringify(job) : '')
    return callback(null, result)
  }
}
