import crypto from 'crypto'

/**
 * Generate random 32-character token using crypto
 */
export const generateToken = (): string => {
  return crypto.randomBytes(16).toString('hex')
}

/**
 * Generate random token with custom length
 */
export const generateRandomToken = (length: number = 32): string => {
  const bytes = Math.ceil(length / 2)
  return crypto.randomBytes(bytes).toString('hex').slice(0, length)
}

/**
 * Generate secure random string with specified characters
 */
export const generateSecureToken = (
  length: number = 32,
  charset: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
): string => {
  let result = ''
  const randomBytes = crypto.randomBytes(length)

  for (let i = 0; i < length; i++) {
    result += charset[randomBytes[i] % charset.length]
  }

  return result
}

/**
 * Generate UUID v4
 */
export const generateUUID = (): string => {
  return crypto.randomUUID()
}

/**
 * Generate numeric token
 */
export const generateNumericToken = (length: number = 6): string => {
  const min = Math.pow(10, length - 1)
  const max = Math.pow(10, length) - 1
  const randomBytes = crypto.randomBytes(4)
  const randomNumber = randomBytes.readUInt32BE(0)
  const result = min + (randomNumber % (max - min + 1))
  return result.toString()
}

/**
 * Generate alphanumeric token (uppercase and numbers)
 */
export const generateAlphanumericToken = (length: number = 32): string => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  return generateSecureToken(length, charset)
}

/**
 * Generate lowercase alphanumeric token
 */
export const generateLowercaseToken = (length: number = 32): string => {
  const charset = 'abcdefghijklmnopqrstuvwxyz0123456789'
  return generateSecureToken(length, charset)
}
