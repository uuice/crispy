export type AppConfigValueType = 'string' | 'number' | 'boolean' | 'json'

export type AppConfigCategory = 'general' | 'comments' | 'features' | 'integrations' | 'other'

export type ParsedAppConfigValue =
  | string
  | number
  | boolean
  | Record<string, unknown>
  | unknown[]
  | null

export type ResolvedAppConfig = {
  key: string
  label: string
  category: AppConfigCategory
  valueType: AppConfigValueType
  value: ParsedAppConfigValue
  enabled: boolean
}

export type AppConfigDefaults = Record<
  string,
  {
    label: string
    category: AppConfigCategory
    valueType: AppConfigValueType
    value: ParsedAppConfigValue
    description?: string
  }
>
