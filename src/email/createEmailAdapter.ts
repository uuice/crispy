import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { resendAdapter } from '@payloadcms/email-resend'
import type { EmailAdapter } from 'payload'

import { resolveEmailConfigSync } from '@/email/resolveEmailConfig'

/**
 * Build Payload email adapter from Admin Active transport (.data/email-runtime.json).
 * Returns undefined when no transport is configured (form submissions still persist).
 * Changing Active transport requires a process restart.
 */
export function createEmailAdapter(): EmailAdapter | Promise<EmailAdapter> | undefined {
  const config = resolveEmailConfigSync()
  if (!config.enabled || !config.type) return undefined

  if (config.type === 'resend' && config.apiKey) {
    return resendAdapter({
      apiKey: config.apiKey,
      defaultFromAddress: config.fromAddress,
      defaultFromName: config.fromName,
      overrideRecipientAddress: config.overrideRecipient,
    })
  }

  if (config.type === 'smtp' && config.smtpHost) {
    return nodemailerAdapter({
      defaultFromAddress: config.fromAddress,
      defaultFromName: config.fromName,
      overrideRecipientAddress: config.overrideRecipient,
      transportOptions: {
        host: config.smtpHost,
        port: config.smtpPort,
        secure: config.smtpSecure,
        auth:
          config.smtpUser && config.smtpPass
            ? {
                user: config.smtpUser,
                pass: config.smtpPass,
              }
            : undefined,
      },
    })
  }

  return undefined
}
