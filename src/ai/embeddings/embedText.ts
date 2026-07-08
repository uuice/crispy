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

  const body: Record<string, unknown> = {
    model: config.model,
    input: inputs.length === 1 ? inputs[0] : inputs,
  }

  if (config.supportsDimensions) {
    body.dimensions = config.dimensions
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify(body),
  })

  const raw = await response.text()
  let parsed: unknown = {}

  if (raw) {
    try {
      parsed = JSON.parse(raw)
    } catch {
      throw new Error(
        `Embedding API 返回非 JSON（${response.status}）: ${raw.slice(0, 200)}`,
      )
    }
  }

  const data = (typeof parsed === 'object' && parsed !== null ? parsed : {}) as EmbeddingResponse

  if (!response.ok) {
    const message =
      data.error?.message ??
      (typeof parsed === 'string' ? parsed : null) ??
      (raw.trim() || `Embedding API error (${response.status})`)
    throw new Error(message)
  }

  const vectors = (data.data ?? [])
    .map((item) => item.embedding)
    .filter((v): v is number[] => Array.isArray(v) && v.length > 0)

  if (vectors.length !== inputs.length) {
    throw new Error('Embedding API 返回向量数量不匹配')
  }

  for (const vector of vectors) {
    if (vector.length !== config.dimensions) {
      throw new Error(
        `Embedding 维度为 ${vector.length}，与 LLM_EMBEDDING_DIMENSIONS=${config.dimensions} 不一致`,
      )
    }
  }

  return vectors
}

export async function embedText(text: string): Promise<number[]> {
  const [vector] = await embedTexts([text])
  return vector
}
