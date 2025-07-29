import { env } from './env'

export interface StaticGenerationConfig {
  maxConcurrent: number
  requestTimeout: number
  batchSize: number
  retryAttempts: number
  retryDelay: number
  enableCompression: boolean
  enableCaching: boolean
  cacheDuration: number
}

export const staticGenerationConfig: StaticGenerationConfig = {
  // Maximum concurrent HTTP requests
  maxConcurrent: env['SSR_MAX_CONCURRENT'] || 3,

  // Request timeout in milliseconds
  requestTimeout: 30000,

  // Batch size for processing items
  batchSize: 10,

  // Number of retry attempts for failed requests
  retryAttempts: 3,

  // Delay between retries in milliseconds
  retryDelay: 1000,

  // Enable gzip compression for requests
  enableCompression: true,

  // Enable response caching
  enableCaching: false,

  // Cache duration in milliseconds
  cacheDuration: 60000
}

// Performance optimization tips
export const performanceTips = {
  increaseConcurrency:
    'Increase maxConcurrent for faster generation (requires more server resources)',
  reduceTimeout: 'Reduce requestTimeout if pages load quickly',
  enableCompression: 'Enable compression to reduce network overhead',
  useCaching: 'Enable caching for repeated requests',
  optimizeBatchSize: 'Adjust batchSize based on server performance'
}
