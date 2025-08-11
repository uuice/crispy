import jwt from 'jsonwebtoken'

// Environment variables with type definitions
export const env = {
  ['BASE_URL']: process.env['BASE_URL'] || '',
  ['SWAGGER_BASE_URL']: process.env['SWAGGER_BASE_URL'] || process.env['BASE_URL'] || '',
  // Server
  ['PORT']: process.env['PORT'] || '4000',
  ['NODE_ENV']: process.env['NODE_ENV'] || 'development',
  ['PAGE_CACHE_TTL']: process.env['PAGE_CACHE_TTL'] || '60',

  // Static Generation
  ['STATIC_GENERATION_BASE_URL']:
    process.env['STATIC_GENERATION_BASE_URL'] || process.env['BASE_URL'] || 'http://localhost:4000',

  // SSR API Configuration - 优化SSR环境下的API访问
  ['SSR_API_BASE_URL']:
    process.env['SSR_API_BASE_URL'] ||
    process.env['STATIC_GENERATION_BASE_URL'] ||
    process.env['BASE_URL'] ||
    'http://localhost:4000',

  ['SSR_MAX_CONCURRENT']: process.env['SSR_MAX_CONCURRENT']
    ? parseInt(process.env['SSR_MAX_CONCURRENT'], 10)
    : 3,

  // JWT
  ['JWT_SECRET']: process.env['JWT_SECRET'] || 'your-super-secret-key-change-in-production',
  // JWT expiration time in seconds (e.g., '7d' = 7 days)
  ['JWT_EXPIRES_IN']: (process.env['JWT_EXPIRES_IN'] || '7d') as jwt.SignOptions['expiresIn'],

  // Database
  ['DB_HOST']: process.env['DB_HOST'] || 'localhost',
  ['DB_PORT']: parseInt(process.env['DB_PORT'] || '3306', 10),
  ['DB_NAME']: process.env['DB_NAME'] || 'crispy',
  ['DB_USER']: process.env['DB_USER'] || '',
  ['DB_PASSWORD']: process.env['DB_PASSWORD'] || '',

  // API
  ['API_PREFIX']: process.env['API_PREFIX'] || '/api',
  ['API_VERSION']: process.env['API_VERSION'] || 'v1',

  // Logging
  ['LOG_LEVEL']: process.env['LOG_LEVEL'] || 'debug',
  ['LOG_FORMAT']: process.env['LOG_FORMAT'] || 'dev',

  // JavaScript Article Generation
  ['ENABLE_JS_ARTICLE_GENERATION']: process.env['ENABLE_JS_ARTICLE_GENERATION'] || 'false',
  ['JS_ARTICLE_GENERATION_INTERVAL']: process.env['JS_ARTICLE_GENERATION_INTERVAL'] || '7200000', // 默认2小时 (毫秒)

  ['TEMPLATE_ENGINE_ENABLE']: process.env['TEMPLATE_ENGINE_ENABLE'] || 'false',

  // Helper functions
  isDevelopment: () => env['NODE_ENV'] === 'development',
  isProduction: () => env['NODE_ENV'] === 'production',
  isTest: () => env['NODE_ENV'] === 'test'
} as const

// Type for environment variables
export type Env = typeof env
