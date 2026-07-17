import type { TextField } from 'payload'

import {
  decryptSecret,
  encryptSecret,
  isSecretMask,
  SECRET_MASK,
} from '@/utilities/secretCrypto'

type EncryptedTextArgs = Omit<TextField, 'type'> & {
  name: string
}

function isCiphertext(value: unknown): value is string {
  return typeof value === 'string' && value.startsWith('enc:v1:')
}

/**
 * Text field that stores AES-GCM ciphertext.
 * Admin/API reads see a mask unless `req.context.returnSecrets === true`.
 * Submitting the mask or empty keeps the previous ciphertext.
 *
 * Note: Payload may pass an afterRead-masked `originalDoc` into beforeChange on
 * Local API updates. When that happens we re-load with `preserveEncrypted`.
 */
export function encryptedTextField(args: EncryptedTextArgs): TextField {
  const { name, hooks: userHooks, admin, ...rest } = args

  return {
    type: 'text',
    name,
    hasMany: false,
    ...rest,
    admin: {
      ...admin,
    },
    hooks: {
      ...userHooks,
      beforeChange: [
        ...(userHooks?.beforeChange ?? []),
        async ({ value, originalDoc, req, operation, collection }) => {
          if (value != null && value !== '' && !isSecretMask(String(value))) {
            if (isCiphertext(value)) return value
            return encryptSecret(String(value))
          }

          const previous = originalDoc?.[name as keyof typeof originalDoc]
          if (isCiphertext(previous)) return previous

          // originalDoc.apiKey is often SECRET_MASK after afterRead — recover ciphertext.
          if (
            operation === 'update' &&
            originalDoc &&
            typeof originalDoc === 'object' &&
            'id' in originalDoc &&
            originalDoc.id != null &&
            collection?.slug &&
            req?.payload
          ) {
            try {
              const fresh = await req.payload.findByID({
                collection: collection.slug,
                id: originalDoc.id as string | number,
                depth: 0,
                overrideAccess: true,
                context: { preserveEncrypted: true },
              })
              const raw = fresh?.[name as keyof typeof fresh]
              if (isCiphertext(raw)) return raw
            } catch {
              // fall through
            }
          }

          return typeof previous === 'string' ? previous : value
        },
      ],
      afterRead: [
        ...(userHooks?.afterRead ?? []),
        ({ value, req }) => {
          if (value == null || value === '') return value
          if (req?.context?.preserveEncrypted === true) {
            return value
          }
          if (req?.context?.returnSecrets === true) {
            try {
              return decryptSecret(String(value))
            } catch {
              return value
            }
          }
          return SECRET_MASK
        },
      ],
    },
  } as TextField
}
