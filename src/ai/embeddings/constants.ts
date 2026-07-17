/**
 * Default embedding vector size when a provider omits embeddingDimensions.
 * Must match content_embeddings.embedding (see migration …_content_embeddings_1024).
 * Changing the column requires a DB migration — do not rely on .env.
 */
export const DEFAULT_EMBEDDING_DIMENSIONS = 1024

/** @deprecated Use DEFAULT_EMBEDDING_DIMENSIONS */
export const EMBEDDING_DIMENSIONS = DEFAULT_EMBEDDING_DIMENSIONS

export const EMBEDDING_COLLECTIONS = ['posts', 'pages', 'novels', 'novel-chapters'] as const

export type EmbeddableCollection = (typeof EMBEDDING_COLLECTIONS)[number]

export const CONTENT_EMBEDDINGS_TABLE = 'content_embeddings'
