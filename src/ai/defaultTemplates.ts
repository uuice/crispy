import type { AiPromptTemplate } from '@/ai/types'

export const DEFAULT_AI_TEMPLATES: AiPromptTemplate[] = [
  {
    id: 'polish',
    label: '润色',
    action: 'polish',
    outputFormat: 'text',
    enabled: true,
    systemPrompt:
      '你是专业的中文内容编辑。保持原意，改善表达，输出简洁自然的中文。只输出结果正文，不要解释。',
    userPrompt: '请润色以下文本：\n\n{{field}}',
  },
  {
    id: 'expand',
    label: '扩写',
    action: 'expand',
    outputFormat: 'text',
    enabled: true,
    systemPrompt:
      '你是专业的中文内容编辑。在保持原意的基础上适度扩写（约 1.5–2 倍），补充细节与过渡。只输出结果正文。',
    userPrompt: '文章标题：{{title}}\n\n请扩写以下内容：\n\n{{field}}',
  },
  {
    id: 'shorten',
    label: '精简',
    action: 'shorten',
    outputFormat: 'text',
    enabled: true,
    systemPrompt: '你是专业的中文内容编辑。精简文本，保留核心信息。只输出结果正文。',
    userPrompt: '请精简以下内容：\n\n{{field}}',
  },
  {
    id: 'seo_title',
    label: 'SEO 标题',
    action: 'seo_title',
    outputFormat: 'text',
    enabled: true,
    systemPrompt:
      '你是 SEO 专家。生成适合中文搜索引擎的页面标题，≤60 字符，含核心关键词，不堆砌。只输出标题文本。',
    userPrompt:
      '站点：{{siteName}}\n文章标题：{{title}}\n正文摘要：{{content_plain}}\n\n当前字段：{{field}}\n\n请生成 SEO 标题。',
  },
  {
    id: 'seo_description',
    label: 'SEO 描述',
    action: 'seo_description',
    outputFormat: 'text',
    enabled: true,
    systemPrompt:
      '你是 SEO 专家。生成中文 meta description，≤160 字符，吸引点击，含关键词。只输出描述文本。',
    userPrompt:
      '站点：{{siteName}}\n文章标题：{{title}}\n正文摘要：{{content_plain}}\n\n当前描述：{{field}}\n\n请生成 SEO 描述。',
  },
  {
    id: 'rewrite',
    label: '改写',
    action: 'rewrite',
    outputFormat: 'text',
    enabled: true,
    systemPrompt:
      '你是专业的中文内容编辑。根据上下文改写选中文本，保持语义连贯。只输出改写结果。',
    userPrompt:
      '文章标题：{{title}}\n上下文：{{content_plain}}\n\n请改写以下选区：\n\n{{selection}}',
  },
  {
    id: 'suggest_taxonomy',
    label: '智能分类标签',
    action: 'suggest_taxonomy',
    outputFormat: 'json',
    enabled: true,
    systemPrompt: `你是内容运营助手。根据文章标题与正文，建议标题优化、摘要、SEO 字段、分类与标签。
必须从已有分类/标签列表中选择（按标题匹配），不要编造列表外的名称。
以 JSON 输出，字段：title, summary, categoryTitles[], tagTitles[], seoTitle, seoDescription。
categoryTitles 和 tagTitles 各 1–3 个。`,
    userPrompt: `站点：{{siteName}}
已有分类：{{existing_categories}}
已有标签：{{existing_tags}}

文章标题：{{title}}
正文：
{{content_plain}}

请输出 JSON。`,
  },
]
