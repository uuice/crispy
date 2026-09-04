export type AiProvider = 'deepseek' | 'openai' | 'custom'

export type AiProviderPreset = {
  label: string
  baseUrl: string
  model: string
  modelHint: string
}

/** UI labels / catalog hints only — runtime keys live in llm-providers Catalog. */
export const AI_PROVIDER_PRESETS: Record<AiProvider, AiProviderPreset> = {
  deepseek: {
    label: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com',
    model: 'deepseek-chat',
    modelHint: '如 deepseek-chat、deepseek-reasoner',
  },
  openai: {
    label: 'OpenAI',
    baseUrl: 'https://api.openai.com',
    model: 'gpt-4o-mini',
    modelHint: '如 gpt-4o-mini、gpt-4o',
  },
  custom: {
    label: '自定义（OpenAI 兼容）',
    baseUrl: '',
    model: '',
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

export function aiDisabledMessage(_provider: AiProvider = 'deepseek'): string {
  return 'AI 未启用：请在「LLM 提供商」配置端点，并在「AI 设置」选择默认提供商且保持启用'
}
