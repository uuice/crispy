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

import type { AiProvider } from '@/ai/providers/presets'

export type ResolvedAiSettings = {
  enabled: boolean
  provider: AiProvider
  providerLabel: string
  baseUrl: string
  apiKey: string
  model: string
  temperature: number
  maxTokens: number
  templates: AiPromptTemplate[]
}
