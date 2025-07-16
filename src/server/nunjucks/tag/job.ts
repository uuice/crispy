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
    const limit = args.limit || 10
    const page = args.page || 1
    const pageSize = args.page_size || limit

    // Build filters object from args
    const filters: any = {}

    // Search filters - 字符串，空字符串通常不是有效值
    if (args.title) filters.title = args.title
    if (args.type_name) filters.typeName = args.type_name
    if (args.nature) filters.nature = args.nature
    if (args.branch) filters.branch = args.branch
    if (args.address) filters.address = args.address
    if (args.email) filters.email = args.email

    // Range filters - 需要 !== undefined 因为可能包含 0
    if (args.num_min !== undefined) filters.num_min = args.num_min
    if (args.num_max !== undefined) filters.num_max = args.num_max
    if (args.sort_min !== undefined) filters.sort_min = args.sort_min
    if (args.sort_max !== undefined) filters.sort_max = args.sort_max

    // Date filters - 时间戳，0 是有效值
    if (args.start_time !== undefined) filters.start_time = args.start_time
    if (args.end_time !== undefined) filters.end_time = args.end_time

    // Boolean filters - 需要 !== undefined 因为 false 是有效值
    if (args.has_email !== undefined)
      filters.has_email = args.has_email === 'true' || args.has_email === true
    if (args.has_address !== undefined)
      filters.has_address = args.has_address === 'true' || args.has_address === true

    // Use the enhanced getJobs method with filters
    const result = await jobService.getJobs(filters, { page, pageSize })

    context.ctx.jobs = result.dataList
    context.ctx.jobs_pagination = result.pagination

    const resultHtml = new nunjucks.runtime.SafeString(body())
    return callback(null, resultHtml)
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
    const body = parser.parseUntilBlocks('endJobItem')
    parser.advanceAfterBlockEnd()
    return new nodes.CallExtensionAsync(this, 'run', args, [body])
  }
  this.run = async function (context: any, args: any, body: any, callback: any) {
    const id = args.id
    if (!id) {
      return callback(null, new nunjucks.runtime.SafeString(''))
    }

    const job = await jobService.getJobById(id)
    context.ctx.job = job
    const result = new nunjucks.runtime.SafeString(body())
    return callback(null, result)
  }
}
