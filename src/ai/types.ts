export type AiAction =
  | 'polish'
  | 'expand'
  | 'shorten'
  | 'custom'
  | 'seo_title'
  | 'seo_description'
  | 'rewrite'
  | 'suggest_taxonomy'

export type AiOutputFormat = 'text' | 'json'

export type AiPromptTemplate = {
  id: string
  label: string
  action: AiAction
  systemPrompt: string
  userPrompt: string
  outputFormat: AiOutputFormat
  enabled?: boolean | null
}

export type AiContext = {
  title?: string
  contentPlain?: string
  selection?: string
  siteName?: string
  existingCategories?: string[]
  existingTags?: string[]
  locale?: string
}

export type AiCompleteRequest = {
  action: AiAction
  templateId?: string
  /** Required when action is `custom` */
  customPrompt?: string
  collection: string
  docId?: string | number
  fieldPath: string
  input: string
  context?: AiContext
}

export type AiStructuredRequest = {
  action: 'suggest_taxonomy'
  collection: string
  docId?: string | number
  context: AiContext
}

export type AiSuggestTaxonomyResult = {
  title?: string
  summary?: string
  categoryTitles?: string[]
  tagTitles?: string[]
  seoTitle?: string
  seoDescription?: string
}

export type ResolvedAiSettings = {
  enabled: boolean
  baseUrl: string
  apiKey: string
  model: string
  temperature: number
  maxTokens: number
  templates: AiPromptTemplate[]
}
