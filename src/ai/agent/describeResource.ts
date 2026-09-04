import type { Field, PayloadRequest } from 'payload'

import { isAgentCollection, isAgentGlobal } from '@/ai/agent/resources'

export type DescribedField = {
  name: string
  type: string
  required?: boolean
  relationTo?: string | string[]
  hasMany?: boolean
  options?: string[]
  note?: string
}

function fieldLabel(field: Field): string {
  if ('name' in field && field.name) return field.name
  if ('type' in field) return field.type
  return 'unknown'
}

function describeField(field: Field, prefix = ''): DescribedField[] {
  const path = prefix
    ? 'name' in field && field.name
      ? `${prefix}.${field.name}`
      : prefix
    : 'name' in field && field.name
      ? field.name
      : ''

  if (field.type === 'tabs') {
    const tabs = 'tabs' in field ? field.tabs : []
    return tabs.flatMap((tab) => {
      const tabPrefix =
        path && 'name' in tab && tab.name ? `${path}.${tab.name}` : path
      return ('fields' in tab ? tab.fields : []).flatMap((f) => describeField(f, tabPrefix))
    })
  }

  if (field.type === 'group' || field.type === 'collapsible' || field.type === 'row') {
    const groupPrefix =
      path && 'name' in field && field.name ? path : prefix
    return ('fields' in field ? field.fields : []).flatMap((f) =>
      describeField(f, groupPrefix),
    )
  }

  if (field.type === 'array') {
    const arrayName = 'name' in field ? field.name : 'array'
    const fullPath = prefix ? `${prefix}.${arrayName}` : arrayName
    const itemFields = ('fields' in field ? field.fields : []).flatMap((f) =>
      describeField(f, `${fullPath}[]`),
    )
    return [
      {
        name: fullPath,
        type: 'array',
        required: 'required' in field ? Boolean(field.required) : false,
        note: itemFields.length > 0 ? `items: ${itemFields.map((f) => f.name).join(', ')}` : undefined,
      },
      ...itemFields,
    ]
  }

  if (field.type === 'blocks') {
    const blockName = 'name' in field ? field.name : 'blocks'
    const fullPath = prefix ? `${prefix}.${blockName}` : blockName
    const blockSlugs =
      'blocks' in field
        ? field.blocks.map((b) => (typeof b === 'string' ? b : b.slug)).filter(Boolean)
        : []
    return [
      {
        name: fullPath,
        type: 'blocks',
        note: blockSlugs.length ? `block types: ${blockSlugs.join(', ')}` : 'Lexical/block JSON',
      },
    ]
  }

  if (field.type === 'richText') {
    return [
      {
        name: path,
        type: 'richText',
        required: 'required' in field ? Boolean(field.required) : false,
        note: 'Lexical JSON（可先 describe_resource 再 create/update）',
      },
    ]
  }

  const described: DescribedField = {
    name: path,
    type: field.type,
    required: 'required' in field ? Boolean(field.required) : false,
  }

  if (field.type === 'relationship' || field.type === 'upload') {
    described.relationTo =
      'relationTo' in field ? (field.relationTo as string | string[]) : undefined
    described.hasMany = 'hasMany' in field ? Boolean(field.hasMany) : false
  }

  if (field.type === 'select' && 'options' in field && Array.isArray(field.options)) {
    described.options = field.options.map((o) =>
      typeof o === 'string' ? o : 'value' in o ? String(o.value) : String(o),
    )
  }

  if (!path) return []

  return [described]
}

const COLLECTION_HINTS: Record<string, string[]> = {
  galleries: [
    '图库主实体；前台列表 /galleries，详情 /galleries/{slug}',
    '图片在 gallery-items；Admin 可用 bulkImages 批量选 media 后保存自动建条目',
    'Agent 批量加图用 bulk_add_gallery_images(galleryId, mediaIds)',
  ],
  'gallery-items': [
    'gallery 字段必填（relationship → galleries）',
    'image 必填（upload → media）；title 可空（自动用 media alt/文件名）',
    '仅 enabled 的条目出现在所属图库详情页；find 时用 where.gallery 过滤',
  ],
  posts: ['发布草稿：_status 设为 published'],
  pages: ['发布草稿：_status 设为 published'],
  comments: ['审核：status 为 pending/approved/rejected/spam'],
  'prompt-templates': [
    '按 action 匹配启用模板（同 action 多条时取 sort 最小）',
    '必填：title、action、systemPrompt、userPrompt；slug 可自动生成',
    'action：polish | expand | shorten | custom | seo_title | seo_description | rewrite | suggest_taxonomy',
    'provider / model / temperature / maxTokens 可空 = 跟 AI 设置全局默认',
    'userPrompt 变量：{{field}} {{title}} {{selection}} {{instruction}} {{content_plain}} {{siteName}} {{existing_categories}} {{existing_tags}} 等',
    'find 列表不含 systemPrompt/userPrompt；改文案前先 get_document 读全文',
    '增删改需 catalog:prompts:write；find/get 需 catalog:prompts:read',
  ],
}

function resolveCollectionHints(slug: string): string[] {
  return [
    'relationship/upload 字段传 ID 或 ID 数组',
    'richText 为 Lexical JSON',
    '查回收站：find_documents(trash: true)；恢复：restore_document',
    ...(COLLECTION_HINTS[slug] ?? []),
  ]
}

export function describeCollectionSchema(req: PayloadRequest, slug: string): unknown {
  if (!isAgentCollection(slug)) {
    throw new Error(`不支持的内容类型：${slug}`)
  }

  const collection = req.payload.config.collections.find((c) => c.slug === slug)
  if (!collection) {
    throw new Error(`未找到 collection：${slug}`)
  }

  const fields = collection.fields.flatMap((f) => describeField(f))
  const labels = collection.labels as { singular?: string; plural?: string } | undefined

  return {
    kind: 'collection',
    slug,
    label: labels?.singular ?? slug,
    fields: fields.filter((f) => f.name && !f.name.includes('[]')),
    hints: resolveCollectionHints(slug),
  }
}

export function describeGlobalSchema(req: PayloadRequest, slug: string): unknown {
  if (!isAgentGlobal(slug)) {
    throw new Error(`不支持的全局配置：${slug}`)
  }

  const global = req.payload.config.globals.find((g) => g.slug === slug)
  if (!global) {
    throw new Error(`未找到 global：${slug}`)
  }

  const fields = global.fields.flatMap((f) => describeField(f))
  const label = global.label as string | undefined

  return {
    kind: 'global',
    slug,
    label: label ?? slug,
    fields: fields.filter((f) => f.name && !f.name.includes('[]')),
  }
}
