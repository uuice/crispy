/** OpenAI text-embedding-3-small default dimensions. */
export const EMBEDDING_DIMENSIONS = Number(process.env.LLM_EMBEDDING_DIMENSIONS) || 1536

export const EMBEDDING_COLLECTIONS = ['posts', 'pages', 'novels', 'novel-chapters'] as const

export type EmbeddableCollection = (typeof EMBEDDING_COLLECTIONS)[number]

export const CONTENT_EMBEDDINGS_TABLE = 'content_embeddings'
