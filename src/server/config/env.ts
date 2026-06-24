import jwt from 'jsonwebtoken'

// Environment variables with type definitions
export const env = {
  ['BASE_URL']: process.env['BASE_URL'] || '',
  ['SWAGGER_BASE_URL']: process.env['SWAGGER_BASE_URL'] || process.env['BASE_URL'] || '',
  // Server
  ['PORT']: process.env['PORT'] || '4000',
  ['NODE_ENV']: process.env['NODE_ENV'] || 'development',
  ['PAGE_CACHE_TTL']: process.env['PAGE_CACHE_TTL'] || '60',

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

  // Helper functions
  isDevelopment: () => env['NODE_ENV'] === 'development',
  isProduction: () => env['NODE_ENV'] === 'production',
  isTest: () => env['NODE_ENV'] === 'test'
} as const

// Type for environment variables
export type Env = typeof env

// Production safety checks
if (env['NODE_ENV'] === 'production') {
  if (
    !process.env['JWT_SECRET'] ||
    process.env['JWT_SECRET'] === 'your-super-secret-key-change-in-production'
  ) {
    throw new Error('JWT_SECRET must be set to a secure value in production')
  }
}
