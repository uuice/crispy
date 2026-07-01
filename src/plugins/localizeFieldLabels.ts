import type { Field, GlobalConfig, Payload, Plugin, Tab } from 'payload'

import { adminLabels } from '@/i18n/admin-labels'

const FIELD_LABELS: Record<string, string> = {
  folder: adminLabels.folder,
  slug: adminLabels.slug,
  url: adminLabels.url,
}

const ENGLISH_DEFAULT_LABELS = new Set(['Folder', 'Slug', 'URL', 'Url'])

function shouldLocalizeLabel(field: Field): boolean {
  if (!('name' in field) || !field.name) return false
  if (!(field.name in FIELD_LABELS)) return false
  if (!field.label) return true
  return typeof field.label === 'string' && ENGLISH_DEFAULT_LABELS.has(field.label)
}

function localizeField(field: Field): Field {
  if ('fields' in field && Array.isArray(field.fields)) {
    return { ...field, fields: localizeFields(field.fields) }
  }

  if ('tabs' in field && Array.isArray(field.tabs)) {
    return {
      ...field,
      tabs: field.tabs.map((tab: Tab) => ({
        ...tab,
        fields: localizeFields(tab.fields),
      })),
    }
  }

  if ('blocks' in field && Array.isArray(field.blocks)) {
    return {
      ...field,
      blocks: field.blocks.map((block) => ({
        ...block,
        fields: localizeFields(block.fields),
      })),
    }
  }

  if (!shouldLocalizeLabel(field)) return field

  const name = 'name' in field ? field.name : undefined
  const label = name ? FIELD_LABELS[name] : undefined
  if (!label) return field

  return { ...field, label } as Field
}

function localizeFields(fields: Field[]): Field[] {
  return fields.map(localizeField)
}

function patchFieldsInPlace(fields: Field[]): void {
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i]
    if ('fields' in field && Array.isArray(field.fields)) {
      patchFieldsInPlace(field.fields)
    }
    if ('tabs' in field && Array.isArray(field.tabs)) {
      for (const tab of field.tabs) {
        patchFieldsInPlace(tab.fields)
      }
    }
    if ('blocks' in field && Array.isArray(field.blocks)) {
      for (const block of field.blocks) {
        patchFieldsInPlace(block.fields)
      }
    }
    if (shouldLocalizeLabel(field)) {
      const name = 'name' in field ? field.name : undefined
      const label = name ? FIELD_LABELS[name] : undefined
      if (label) {
        fields[i] = { ...field, label } as Field
      }
    }
  }
}

function patchRuntimeFieldLabels(payload: Payload): void {
  for (const collection of payload.config.collections) {
    patchFieldsInPlace(collection.fields)
    if ('flattenedFields' in collection && Array.isArray(collection.flattenedFields)) {
      patchFieldsInPlace(collection.flattenedFields as Field[])
    }
  }

  for (const global of payload.config.globals) {
    patchFieldsInPlace(global.fields)
    if ('flattenedFields' in global && Array.isArray(global.flattenedFields)) {
      patchFieldsInPlace(global.flattenedFields as Field[])
    }
  }
}

export function localizeFieldLabelsPlugin(): Plugin {
  return (config) => ({
    ...config,
    collections: (config.collections ?? []).map((collection) => ({
      ...collection,
      fields: localizeFields(collection.fields),
    })),
    globals: (config.globals ?? []).map((global: GlobalConfig) => ({
      ...global,
      fields: localizeFields(global.fields),
    })),
    onInit: async (payload) => {
      await config.onInit?.(payload)
      patchRuntimeFieldLabels(payload)
    },
  })
}
