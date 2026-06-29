import type { Field } from 'payload'

import { AiRewriteFeature } from '@/components/AdminAi/lexical/AiRewriteFeature/server'
import type { AiFieldCustomConfig } from '@/components/AdminAi/useAiFieldContext'

export const AI_COMPONENTS = {
  textField: '@/components/AdminAi/AiTextField',
  textareaField: '@/components/AdminAi/AiTextareaField',
  codeField: '@/components/AdminAi/AiCodeField',
  seoPanel: '@/components/AdminAi/AiSeoPanel',
  suggestPanel: '@/components/AdminAi/AiSuggestPanel',
} as const

function mergeAiCustom(field: Field, config?: AiFieldCustomConfig): Record<string, unknown> {
  const existing =
    field.admin?.custom && typeof field.admin.custom === 'object' ? field.admin.custom : {}
  return { ...existing, ...config }
}

/** Attach AI assist to a text field (title, alt, etc.). */
export function withAiTextField<T extends Field>(field: T, config?: AiFieldCustomConfig): T {
  if (field.type !== 'text') return field
  return {
    ...field,
    admin: {
      ...(field.admin ?? {}),
      components: {
        ...(field.admin?.components ?? {}),
        Field: AI_COMPONENTS.textField,
      },
      custom: mergeAiCustom(field, config),
    },
  } as T
}

/** Attach AI assist to a textarea field (description, etc.). */
export function withAiTextareaField<T extends Field>(field: T, config?: AiFieldCustomConfig): T {
  if (field.type !== 'textarea') return field
  return {
    ...field,
    admin: {
      ...(field.admin ?? {}),
      components: {
        ...(field.admin?.components ?? {}),
        Field: AI_COMPONENTS.textareaField,
      },
      custom: mergeAiCustom(field, config),
    },
  } as T
}

/** Attach AI assist to a code field (Code block, etc.). */
export function withAiCodeField<T extends Field>(field: T, config?: AiFieldCustomConfig): T {
  if (field.type !== 'code') return field
  return {
    ...field,
    admin: {
      ...(field.admin ?? {}),
      components: {
        ...(field.admin?.components ?? {}),
        Field: AI_COMPONENTS.codeField,
      },
      custom: mergeAiCustom(field, config),
    },
  } as T
}

/** Append Lexical inline selection AI to an editor feature list. */
export function withAiRewriteFeatures<F>(features: F[]): F[] {
  return [...features, AiRewriteFeature() as F]
}

/** UI field: AI SEO panel (requires meta tab + profile.seo). */
export function aiSeoAssistField(config?: AiFieldCustomConfig): Field {
  return {
    name: 'aiSeoAssist',
    type: 'ui',
    admin: {
      components: {
        Field: AI_COMPONENTS.seoPanel,
      },
      custom: config ?? {},
    },
  }
}

/** UI field: AI smart fill (title / description / SEO / taxonomy per profile). */
export function aiSuggestAssistField(config?: AiFieldCustomConfig): Field {
  return {
    name: 'aiSuggestAssist',
    type: 'ui',
    admin: {
      components: {
        Field: AI_COMPONENTS.suggestPanel,
      },
      custom: config ?? {},
    },
  }
}
