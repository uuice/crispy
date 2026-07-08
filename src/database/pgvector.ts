/** Whether to enable PostgreSQL pgvector extension and semantic search. Set PGVECTOR_ENABLED=false when the DB has no vector extension. */
export function isPgvectorEnabled(): boolean {
  return process.env.PGVECTOR_ENABLED !== 'false'
}
