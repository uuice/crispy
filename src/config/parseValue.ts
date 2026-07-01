import type { AppConfigValueType, ParsedAppConfigValue } from '@/config/types'

type RawAppConfigDoc = {
  valueType?: AppConfigValueType | null
  valueString?: string | null
  valueNumber?: number | null
  valueBoolean?: boolean | null
  valueJson?: string | null
}

export function parseAppConfigValue(doc: RawAppConfigDoc): ParsedAppConfigValue {
  const valueType = doc.valueType ?? 'string'

  switch (valueType) {
    case 'number':
      return doc.valueNumber ?? null
    case 'boolean':
      return doc.valueBoolean ?? false
    case 'json': {
      const raw = doc.valueJson?.trim()
      if (!raw) return null
      try {
        return JSON.parse(raw) as ParsedAppConfigValue
      } catch {
        return null
      }
    }
    default:
      return doc.valueString ?? ''
  }
}
