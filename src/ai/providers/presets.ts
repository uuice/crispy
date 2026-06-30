export type AiProvider = 'deepseek' | 'openai' | 'custom'

export type AiProviderPreset = {
  label: string
  baseUrl: string
  model: string
  /** Primary env var for API key; LLM_API_KEY always overrides when set. */
  apiKeyEnv: string
  modelHint: string
}

export const AI_PROVIDER_PRESETS: Record<AiProvider, AiProviderPreset> = {
  deepseek: {
    label: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com',
    model: 'deepseek-chat',
    apiKeyEnv: 'DEEPSEEK_API_KEY',
    modelHint: '如 deepseek-chat、deepseek-reasoner',
  },
  openai: {
    label: 'OpenAI',
    baseUrl: 'https://api.openai.com',
    model: 'gpt-4o-mini',
    apiKeyEnv: 'OPENAI_API_KEY',
    modelHint: '如 gpt-4o-mini、gpt-4o',
  },
  custom: {
    label: '自定义（OpenAI 兼容）',
    baseUrl: '',
    model: '',
    apiKeyEnv: 'LLM_API_KEY',
    modelHint: '填写兼容网关支持的模型名',
  },
}

export const AI_PROVIDER_OPTIONS = (Object.keys(AI_PROVIDER_PRESETS) as AiProvider[]).map(
  (value) => ({
    label: AI_PROVIDER_PRESETS[value].label,
    value,
  }),
)

export function parseAiProvider(value: unknown): AiProvider {
  if (value === 'openai' || value === 'custom' || value === 'deepseek') {
    return value
  }
  return 'deepseek'
}

export function resolveApiKeyForProvider(provider: AiProvider): string {
  const universal = process.env.LLM_API_KEY?.trim()
  if (universal) return universal

  const preset = AI_PROVIDER_PRESETS[provider]
  const primary = process.env[preset.apiKeyEnv]?.trim()
  if (primary) return primary

  // Backward compatibility when provider was not configured yet.
  if (provider === 'deepseek') {
    return process.env.DEEPSEEK_API_KEY?.trim() ?? ''
  }

  return ''
}

export function apiKeyEnvHint(provider: AiProvider): string {
  const preset = AI_PROVIDER_PRESETS[provider]
  return `LLM_API_KEY 或 ${preset.apiKeyEnv}`
}

export function aiDisabledMessage(provider: AiProvider): string {
  return `AI 未启用：请在 .env 配置 ${apiKeyEnvHint(provider)}，并在后台 AI 设置中启用`
}
