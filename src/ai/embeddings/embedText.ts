import { normalizeOpenAiBaseUrl } from '@/ai/providers/openaiCompatible'

import { resolveEmbeddingConfig } from './config'

type EmbeddingResponse = {
  data?: { embedding?: number[] }[]
  error?: { message?: string }
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
  const config = resolveEmbeddingConfig()

  if (!config.enabled) {
    throw new Error('向量搜索未启用：需要 PostgreSQL + pgvector 及 Embedding API Key')
  }

  const inputs = texts.map((t) => t.trim()).filter(Boolean)
  if (inputs.length === 0) {
    throw new Error('embedding 输入不能为空')
  }

  const url = `${normalizeOpenAiBaseUrl(config.baseUrl)}/v1/embeddings`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      input: inputs.length === 1 ? inputs[0] : inputs,
    }),
  })

  const data = (await response.json()) as EmbeddingResponse

  if (!response.ok) {
    throw new Error(data.error?.message ?? `Embedding API error (${response.status})`)
  }

  const vectors = (data.data ?? [])
    .map((item) => item.embedding)
    .filter((v): v is number[] => Array.isArray(v) && v.length > 0)

  if (vectors.length !== inputs.length) {
    throw new Error('Embedding API 返回向量数量不匹配')
  }

  return vectors
}

export async function embedText(text: string): Promise<number[]> {
  const [vector] = await embedTexts([text])
  return vector
}
