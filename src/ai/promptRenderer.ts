import type { AiContext } from '@/ai/types'

const VARIABLE_PATTERN = /\{\{(\w+)\}\}/g

function joinList(items?: string[]): string {
  if (!items?.length) return '（无）'
  return items.join('、')
}

export function renderPromptTemplate(
  template: string,
  variables: {
    field?: string
    selection?: string
    instruction?: string
    context?: AiContext
  },
): string {
  const ctx = variables.context ?? {}

  const map: Record<string, string> = {
    field: variables.field ?? '',
    selection: variables.selection ?? variables.field ?? '',
    instruction: variables.instruction ?? '',
    title: ctx.title ?? '',
    content_plain: ctx.contentPlain ?? '',
    siteName: ctx.siteName ?? 'Crispy',
    existing_categories: joinList(ctx.existingCategories),
    existing_tags: joinList(ctx.existingTags),
    locale: ctx.locale ?? 'zh-CN',
  }

  return template.replace(VARIABLE_PATTERN, (_, key: string) => map[key] ?? '')
}
