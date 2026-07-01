import config from '@payload-config'
import { getPayload } from 'payload'

import { DEFAULT_APP_CONFIGS } from '@/config/defaults'
import { parseAppConfigValue } from '@/config/parseValue'
import type {
  AppConfigCategory,
  AppConfigValueType,
  ParsedAppConfigValue,
  ResolvedAppConfig,
} from '@/config/types'

type AppConfigDoc = {
  key: string
  label?: string | null
  category?: AppConfigCategory | null
  valueType?: AppConfigValueType | null
  enabled?: boolean | null
  valueString?: string | null
  valueNumber?: number | null
  valueBoolean?: boolean | null
  valueJson?: string | null
}

function toResolvedConfig(doc: AppConfigDoc): ResolvedAppConfig {
  const fallback = DEFAULT_APP_CONFIGS[doc.key]

  return {
    key: doc.key,
    label: doc.label ?? fallback?.label ?? doc.key,
    category: doc.category ?? fallback?.category ?? 'other',
    valueType: doc.valueType ?? fallback?.valueType ?? 'string',
    value: parseAppConfigValue(doc),
    enabled: doc.enabled !== false,
  }
}

function defaultResolvedConfig(key: string): ResolvedAppConfig | null {
  const fallback = DEFAULT_APP_CONFIGS[key]
  if (!fallback) return null

  return {
    key,
    label: fallback.label,
    category: fallback.category,
    valueType: fallback.valueType,
    value: fallback.value,
    enabled: true,
  }
}

export async function getAppConfig(key: string): Promise<ResolvedAppConfig | null> {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'app-configs',
    where: {
      key: { equals: key },
      enabled: { equals: true },
    },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  const doc = result.docs[0] as AppConfigDoc | undefined
  if (doc) return toResolvedConfig(doc)

  return defaultResolvedConfig(key)
}

export async function getAppConfigValue<T extends ParsedAppConfigValue = ParsedAppConfigValue>(
  key: string,
): Promise<T | null> {
  const configEntry = await getAppConfig(key)
  if (!configEntry?.enabled) return null
  return configEntry.value as T
}

export async function getAppConfigsByCategory(
  category: AppConfigCategory,
): Promise<ResolvedAppConfig[]> {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'app-configs',
    where: {
      category: { equals: category },
      enabled: { equals: true },
    },
    limit: 200,
    depth: 0,
    overrideAccess: true,
  })

  const fromDb = (result.docs as AppConfigDoc[]).map(toResolvedConfig)
  const keysInDb = new Set(fromDb.map((item) => item.key))

  const fromDefaults = Object.entries(DEFAULT_APP_CONFIGS)
    .filter(([key, item]) => item.category === category && !keysInDb.has(key))
    .map(([key]) => defaultResolvedConfig(key))
    .filter((item): item is ResolvedAppConfig => item !== null)

  return [...fromDb, ...fromDefaults]
}

export async function getAppConfigsMap(): Promise<Record<string, ParsedAppConfigValue>> {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'app-configs',
    where: {
      enabled: { equals: true },
    },
    limit: 500,
    depth: 0,
    overrideAccess: true,
  })

  const map: Record<string, ParsedAppConfigValue> = {}

  for (const [key, fallback] of Object.entries(DEFAULT_APP_CONFIGS)) {
    map[key] = fallback.value
  }

  for (const doc of result.docs as AppConfigDoc[]) {
    const resolved = toResolvedConfig(doc)
    if (resolved.enabled) {
      map[resolved.key] = resolved.value
    }
  }

  return map
}
