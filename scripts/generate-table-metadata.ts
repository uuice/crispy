#!/usr/bin/env bun

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const TABLE_COMMENTS: Record<string, string> = {
  access_token: 'Content API 访问令牌',
  ad_items: '广告位单条记录',
  ads: '广告位',
  api_logs: 'API 请求日志',
  articles: '文章/新闻动态',
  attrs: '文章特殊标签（置顶、推荐等）',
  caches: '页面缓存（遗留表，已不再写入）',
  categories: '内容分类',
  configs: '系统配置项',
  jobs: '招聘职位',
  links: '友情链接',
  menus: '导航菜单',
  operate_logs: '后台操作审计日志',
  pages: '单页（关于我们、产品页等）',
  roles: '后台角色',
  rules: '后台权限规则/菜单',
  tags: '内容标签',
  users: '用户账号'
}

const INTERFACE_TO_TABLE: Record<string, string> = {
  AccessToken: 'access_token',
  AdItems: 'ad_items',
  ApiLogs: 'api_logs',
  OperateLogs: 'operate_logs'
}

interface DocTableColumn {
  name: string
  type: string
  nullable: boolean
  default: string | null
  comment: string
}

interface DocTable {
  name: string
  comment: string
  columns: DocTableColumn[]
}

function interfaceNameToTableName(iface: string): string {
  if (INTERFACE_TO_TABLE[iface]) {
    return INTERFACE_TO_TABLE[iface]
  }
  return iface
    .replace(/([A-Z])/g, (match, char, index) => (index ? '_' : '') + char.toLowerCase())
    .replace(/^_/, '')
}

function parseTablesFromDbTypes(content: string): DocTable[] {
  const tables: DocTable[] = []
  const blocks = content.split(/^export interface /m).slice(1)

  for (const block of blocks) {
    if (block.startsWith('DB ')) {
      break
    }

    const nameMatch = block.match(/^(\w+) \{/)
    if (!nameMatch) {
      continue
    }

    const iface = nameMatch[1]
    const tableName = interfaceNameToTableName(iface)
    const columns: DocTableColumn[] = []
    const fieldRegex = /\/\*\*\s*\n([\s\S]*?)\*\/\s*\n\s*(\w+):/g
    let match: RegExpExecArray | null

    while ((match = fieldRegex.exec(block)) !== null) {
      const comment = match[1].replace(/\s*\*\s?/g, ' ').trim()
      columns.push({
        name: match[2],
        type: '—',
        nullable: true,
        default: null,
        comment
      })
    }

    tables.push({
      name: tableName,
      comment: TABLE_COMMENTS[tableName] || iface,
      columns
    })
  }

  return tables
}

function generateTableMetadataSource(tables: DocTable[]): string {
  return `// Auto-aligned with src/db/db.d.ts (${tables.length} tables).
// Regenerate: bun run doc:tables (after db:generate).

export interface DocTableColumn {
  name: string
  type: string
  nullable: boolean
  default: string | null
  comment: string
}

export interface DocTable {
  name: string
  comment: string
  columns: DocTableColumn[]
}

export const DOC_TABLES: DocTable[] = ${JSON.stringify(tables, null, 2)}
`
}

function main() {
  const projectRoot = process.cwd()
  const dbTypesPath = join(projectRoot, 'src/db/db.d.ts')
  const outputPath = join(projectRoot, 'src/app/web-pc/pages/doc/table-metadata.ts')

  console.log('Generating doc table metadata from db.d.ts...')
  const content = readFileSync(dbTypesPath, 'utf8')
  const tables = parseTablesFromDbTypes(content)
  const source = generateTableMetadataSource(tables)

  writeFileSync(outputPath, source)
  console.log(`Done: ${tables.length} tables -> ${outputPath}`)
}

main()
