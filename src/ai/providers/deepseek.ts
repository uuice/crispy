type ChatMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

type ChatCompletionOptions = {
  baseUrl: string
  apiKey: string
  model: string
  messages: ChatMessage[]
  temperature?: number
  maxTokens?: number
  jsonMode?: boolean
}

type ChatCompletionResponse = {
  content: string
  usage?: {
    prompt_tokens?: number
    completion_tokens?: number
    total_tokens?: number
  }
}

/** Accept both https://api.deepseek.com and https://api.deepseek.com/v1 */
export function normalizeDeepseekBaseUrl(baseUrl: string): string {
  return baseUrl.trim().replace(/\/$/, '').replace(/\/v1$/, '')
}

export async function deepseekChatCompletion(
  options: ChatCompletionOptions,
): Promise<ChatCompletionResponse> {
  const url = `${normalizeDeepseekBaseUrl(options.baseUrl)}/v1/chat/completions`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${options.apiKey}`,
    },
    body: JSON.stringify({
      model: options.model,
      messages: options.messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 1024,
      ...(options.jsonMode ? { response_format: { type: 'json_object' } } : {}),
    }),
  })

  const data = (await response.json()) as {
    error?: { message?: string }
    choices?: { message?: { content?: string } }[]
    usage?: ChatCompletionResponse['usage']
  }

  if (!response.ok) {
    throw new Error(data.error?.message ?? `DeepSeek API error (${response.status})`)
  }

  const content = data.choices?.[0]?.message?.content?.trim()
  if (!content) {
    throw new Error('DeepSeek returned empty content')
  }

  return { content, usage: data.usage }
}
