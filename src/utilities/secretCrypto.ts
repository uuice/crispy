import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto'

const PREFIX = 'enc:v1:'
export const SECRET_MASK = '••••••••'

function deriveKey(): Buffer {
  const secret = process.env.PAYLOAD_SECRET
  if (!secret) {
    throw new Error('PAYLOAD_SECRET is required to encrypt configuration secrets')
  }
  return createHash('sha256').update(secret).digest()
}

export function isEncryptedSecret(value: string): boolean {
  return value.startsWith(PREFIX)
}

export function isSecretMask(value: unknown): boolean {
  return typeof value === 'string' && (value === SECRET_MASK || /^•+$/.test(value))
}

/** Encrypt plaintext for storage. Idempotent if value is already encrypted. */
export function encryptSecret(plaintext: string): string {
  const trimmed = plaintext.trim()
  if (!trimmed) return trimmed
  if (isEncryptedSecret(trimmed)) return trimmed

  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', deriveKey(), iv)
  const encrypted = Buffer.concat([cipher.update(trimmed, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return `${PREFIX}${iv.toString('base64url')}.${tag.toString('base64url')}.${encrypted.toString('base64url')}`
}

/** Decrypt storage value. Plaintext passthrough for migration-era rows. */
export function decryptSecret(stored: string): string {
  const trimmed = stored.trim()
  if (!trimmed || !isEncryptedSecret(trimmed)) return trimmed

  const payload = trimmed.slice(PREFIX.length)
  const [ivB64, tagB64, dataB64] = payload.split('.')
  if (!ivB64 || !tagB64 || !dataB64) {
    throw new Error('Invalid encrypted secret format')
  }

  const decipher = createDecipheriv('aes-256-gcm', deriveKey(), Buffer.from(ivB64, 'base64url'))
  decipher.setAuthTag(Buffer.from(tagB64, 'base64url'))
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(dataB64, 'base64url')),
    decipher.final(),
  ])
  return decrypted.toString('utf8')
}
